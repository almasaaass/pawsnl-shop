import { NextRequest, NextResponse } from 'next/server'
import { stripe, eurosToCents } from '@/lib/stripe'
import { OrderItem } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { items }: { items: OrderItem[] } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Winkelwagen is leeg' }, { status: 400 })
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    const lineItems = items.map((item) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          metadata: { product_id: item.product_id },
        },
        unit_amount: eurosToCents(item.price),
      },
      quantity: item.quantity,
    }))

    // Bereken verzendkosten
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingCost = subtotal >= 35 ? 0 : 495 // in centen

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ['NL', 'BE', 'DE'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: shippingCost === 0 ? 'Gratis verzending' : 'Standaard verzending',
            fixed_amount: {
              amount: shippingCost,
              currency: 'eur',
            },
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 3 },
            },
          },
        },
      ],
      metadata: {
        items: JSON.stringify(items),
      },
      success_url: `${appUrl}/bevestiging?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/winkelwagen`,
      locale: 'nl',
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Checkout aanmaken mislukt' }, { status: 500 })
  }
}
