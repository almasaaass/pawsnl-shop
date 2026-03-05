import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase'
import { sendOrderConfirmation, sendAdminNewOrder } from '@/lib/email'
import { placeCJOrder } from '@/lib/cj'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    try {
      await handleSuccessfulPayment(session)
    } catch (error) {
      console.error('Error processing payment:', error)
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const supabaseAdmin = createAdminClient()

  const items = session.metadata?.items ? JSON.parse(session.metadata.items) : []

  // Build shipping address
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

  // Read locale from Stripe metadata
  const locale = session.metadata?.locale || 'nl'
  const currency = session.metadata?.currency || 'eur'

  // Save the order
  const { data: orderData, error: orderError } = await supabaseAdmin.from('orders').insert({
    customer_email: customerEmail,
    customer_name: customerName,
    shipping_address: shippingAddress,
    items,
    total,
    status: 'paid',
    stripe_session_id: session.id,
    tracking_number: null,
    locale,
    currency,
  }).select().single()

  if (orderError) {
    console.error('Error saving order:', orderError)
    throw orderError
  }

  // Decrease stock
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

  // Upsert customer
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

  // Send emails (non-blocking — errors don't stop processing)
  const emailData = {
    customerName,
    customerEmail,
    orderId: session.id,
    items,
    total,
    shippingAddress,
    locale,
  }

  await Promise.allSettled([
    sendOrderConfirmation(emailData),
    sendAdminNewOrder(emailData),
  ])

  // ── Place CJ Dropshipping order ──────────────────────────────────────
  // Non-blocking: CJ failure must NOT crash the webhook
  try {
    // Fetch cj_pid and cj_vid for each ordered product
    const productIds = items.map((i: any) => i.product_id).filter(Boolean)
    if (productIds.length > 0) {
      const { data: products } = await supabaseAdmin
        .from('products')
        .select('id, cj_pid, cj_vid')
        .in('id', productIds)

      // Build CJ order products array
      // Priority: item.cj_vid (variant) > product.cj_vid (fallback)
      const cjProducts: { vid: string; quantity: number }[] = []
      for (const item of items) {
        const prod = products?.find((p: any) => p.id === item.product_id)
        const vid = item.cj_vid || prod?.cj_vid
        if (vid) {
          cjProducts.push({ vid, quantity: item.quantity })
        }
      }

      if (cjProducts.length > 0) {
        const cjResult = await placeCJOrder({
          orderNumber: orderData.id,
          shippingCountryCode: shippingAddress.country || 'NL',
          shippingProvince: shippingAddress.city,
          shippingCity: shippingAddress.city,
          shippingAddress: shippingAddress.street,
          shippingZip: shippingAddress.postal_code,
          shippingCustomerName: customerName,
          products: cjProducts,
        })

        // Save CJ order ID
        await supabaseAdmin
          .from('orders')
          .update({ cj_order_id: cjResult.orderId })
          .eq('id', orderData.id)

        // CJ order placed successfully
      } else {
        console.error(`⚠️ No CJ products found for order ${orderData.id} — handle manually`)
      }
    }
  } catch (cjError) {
    // CJ failure must NOT break the webhook — customer has already paid
    console.error('⚠️ CJ order placement failed (order will be handled manually):', cjError)
  }
}
