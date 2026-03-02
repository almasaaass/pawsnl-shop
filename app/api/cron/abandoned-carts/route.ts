import { NextRequest, NextResponse } from 'next/server'
import { verifyCron } from '@/lib/auth'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

/**
 * Check for abandoned Stripe Checkout Sessions and return them.
 * Can be called by Vercel Cron or n8n to trigger recovery emails.
 */
export async function GET(request: NextRequest) {
  if (!verifyCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Get expired checkout sessions from the last 24 hours
    const oneDayAgo = Math.floor(Date.now() / 1000) - 86400

    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      created: { gte: oneDayAgo },
    })

    const abandoned = sessions.data
      .filter(s => s.status === 'expired' && s.customer_details?.email)
      .map(s => ({
        session_id: s.id,
        email: s.customer_details?.email,
        name: s.customer_details?.name,
        amount: s.amount_total ? s.amount_total / 100 : 0,
        currency: s.currency,
        created: new Date(s.created * 1000).toISOString(),
        items: s.metadata?.items ? JSON.parse(s.metadata.items) : [],
      }))

    return NextResponse.json({
      success: true,
      abandoned_count: abandoned.length,
      carts: abandoned,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
