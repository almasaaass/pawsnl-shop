import { NextRequest, NextResponse } from 'next/server'
import { stripe, eurosToCents } from '@/lib/stripe'
import { OrderItem } from '@/lib/types'
import { LOCALE_CONFIGS, convertPrice, type AppLocale } from '@/lib/locale-config'

export async function POST(request: NextRequest) {
  try {
    const { items, locale: reqLocale }: { items: OrderItem[]; locale?: string } = await request.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const locale = (reqLocale === 'en' ? 'en' : 'nl') as AppLocale
    const config = LOCALE_CONFIGS[locale]
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

    // Convert prices to locale currency
    const lineItems = items.map((item) => ({
      price_data: {
        currency: config.currencyCode.toLowerCase(),
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          metadata: {
            product_id: item.product_id,
            ...(item.variant_id && { variant_id: item.variant_id }),
            ...(item.cj_vid && { cj_vid: item.cj_vid }),
          },
        },
        unit_amount: Math.round(convertPrice(item.price, config.currency) * 100),
      },
      quantity: item.quantity,
    }))

    // Calculate shipping cost in locale currency
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const localSubtotal = convertPrice(subtotal, config.currency)
    const shippingCost = localSubtotal >= config.freeShippingThreshold
      ? 0
      : Math.round(config.shippingCost * 100)

    // Success/cancel URLs locale-aware
    const successPath = locale === 'en' ? '/en/confirmation' : '/bevestiging'
    const cancelPath = locale === 'en' ? '/en/cart' : '/winkelwagen'

    const shippingLabel = locale === 'en'
      ? (shippingCost === 0 ? 'Free shipping' : 'Standard shipping')
      : (shippingCost === 0 ? 'Gratis verzending' : 'Standaard verzending')

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: [...config.paymentMethods] as any[],
      allow_promotion_codes: true,
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: [...config.allowedCountries] as any[],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            display_name: shippingLabel,
            fixed_amount: {
              amount: shippingCost,
              currency: config.currencyCode.toLowerCase(),
            },
            delivery_estimate: {
              minimum: { unit: 'business_day', value: config.deliveryDays.min },
              maximum: { unit: 'business_day', value: config.deliveryDays.max },
            },
          },
        },
      ],
      metadata: {
        locale,
        currency: config.currencyCode.toLowerCase(),
        items: JSON.stringify(items.map((i) => ({
          product_id: i.product_id,
          name: i.name.substring(0, 60),
          price: i.price,
          quantity: i.quantity,
          image: i.image,
          ...(i.variant_id && { variant_id: i.variant_id }),
          ...(i.variant_label && { variant_label: i.variant_label }),
          ...(i.cj_vid && { cj_vid: i.cj_vid }),
        }))).substring(0, 500),
      },
      success_url: `${appUrl}${successPath}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}${cancelPath}`,
      locale: config.stripeLocale,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('Checkout error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
