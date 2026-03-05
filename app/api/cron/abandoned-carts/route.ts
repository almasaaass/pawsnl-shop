import { NextRequest, NextResponse } from 'next/server'
import { verifyCron } from '@/lib/auth'
import { sendAbandonedCartEmail } from '@/lib/email'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

/**
 * Abandoned cart recovery — dagelijkse cron.
 * Vindt verlopen Stripe Checkout Sessions en stuurt recovery emails.
 */
export async function GET(request: NextRequest) {
  if (!verifyCron(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Zoek verlopen checkout sessions van de afgelopen 48 uur
    const twoDaysAgo = Math.floor(Date.now() / 1000) - 172800

    const sessions = await stripe.checkout.sessions.list({
      limit: 100,
      created: { gte: twoDaysAgo },
    })

    const abandoned = sessions.data
      .filter(s => s.status === 'expired' && s.customer_details?.email)
      .map(s => ({
        session_id: s.id,
        email: s.customer_details!.email!,
        name: s.customer_details?.name || '',
        amount: s.amount_total ? s.amount_total / 100 : 0,
        created: s.created,
        items: s.metadata?.items ? JSON.parse(s.metadata.items) : [],
      }))

    let emailsSent = 0

    for (const cart of abandoned) {
      if (cart.items.length === 0 || !cart.email) continue

      // Bepaal welke email te sturen op basis van tijd
      const hoursSinceCreated = (Date.now() / 1000 - cart.created) / 3600

      let emailNumber: 1 | 2 | 3 | null = null
      if (hoursSinceCreated >= 1 && hoursSinceCreated < 6) {
        emailNumber = 1 // 1 uur na verlaten
      } else if (hoursSinceCreated >= 24 && hoursSinceCreated < 30) {
        emailNumber = 2 // 24 uur na verlaten
      } else if (hoursSinceCreated >= 48 && hoursSinceCreated < 54) {
        emailNumber = 3 // 48 uur na verlaten (met korting)
      }

      if (!emailNumber) continue

      try {
        await sendAbandonedCartEmail({
          customerEmail: cart.email,
          customerName: cart.name,
          items: cart.items,
          total: cart.amount,
          emailNumber,
        })
        emailsSent++
      } catch (err) {
        console.error(`Failed to send abandoned cart email to ${cart.email}:`, err)
      }
    }

    return NextResponse.json({
      success: true,
      abandoned_count: abandoned.length,
      emails_sent: emailsSent,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
