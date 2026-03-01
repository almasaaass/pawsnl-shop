import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase'
import { sendOrderConfirmation, sendAdminNewOrder } from '@/lib/email'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    console.error('Webhook signature verificatie mislukt:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      await handleSuccessfulPayment(session)
    } catch (error) {
      console.error('Fout bij verwerken betaling:', error)
      return NextResponse.json({ error: 'Verwerking mislukt' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const supabaseAdmin = createAdminClient()

  const items = session.metadata?.items ? JSON.parse(session.metadata.items) : []

  // Bouw shipping address
  const shipping = session.shipping_details
  const shippingAddress = {
    street: `${shipping?.address?.line1 ?? ''} ${shipping?.address?.line2 ?? ''}`.trim(),
    city: shipping?.address?.city ?? '',
    postal_code: shipping?.address?.postal_code ?? '',
    country: shipping?.address?.country ?? 'NL',
  }

  const customerName = shipping?.name ?? session.customer_details?.name ?? ''
  const customerEmail = session.customer_details?.email ?? ''

  const total =
    (session.amount_total ?? 0) / 100

  // Sla de bestelling op
  const { error: orderError } = await supabaseAdmin.from('orders').insert({
    customer_email: customerEmail,
    customer_name: customerName,
    shipping_address: shippingAddress,
    items,
    total,
    status: 'paid',
    stripe_session_id: session.id,
    tracking_number: null,
  })

  if (orderError) {
    console.error('Fout bij opslaan bestelling:', orderError)
    throw orderError
  }

  // Verlaag de voorraad
  for (const item of items) {
    const { data: product } = await supabaseAdmin
      .from('products')
      .select('stock')
      .eq('id', item.product_id)
      .single()

    if (product) {
      await supabaseAdmin
        .from('products')
        .update({ stock: Math.max(0, product.stock - item.quantity) })
        .eq('id', item.product_id)
    }
  }

  // Upsert klant
  const { data: existingCustomer } = await supabaseAdmin
    .from('customers')
    .select('id, orders_count, total_spent')
    .eq('email', customerEmail)
    .single()

  if (existingCustomer) {
    await supabaseAdmin
      .from('customers')
      .update({
        orders_count: existingCustomer.orders_count + 1,
        total_spent: existingCustomer.total_spent + total,
        name: customerName,
      })
      .eq('id', existingCustomer.id)
  } else {
    await supabaseAdmin.from('customers').insert({
      email: customerEmail,
      name: customerName,
      orders_count: 1,
      total_spent: total,
    })
  }

  // Stuur emails (niet-blokkerend — fouten stoppen de verwerking niet)
  const emailData = {
    customerName,
    customerEmail,
    orderId: session.id,
    items,
    total,
    shippingAddress,
  }

  await Promise.allSettled([
    sendOrderConfirmation(emailData),
    sendAdminNewOrder(emailData),
  ])
}
