import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get('session_id')
  if (!sessionId) {
    return NextResponse.json({ value: 0 })
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    return NextResponse.json({
      value: (session.amount_total ?? 0) / 100,
      currency: session.currency?.toUpperCase() ?? 'EUR',
    })
  } catch {
    return NextResponse.json({ value: 0 })
  }
}
