import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { getCJOrderDetail } from '@/lib/cj'
import { sendTrackingEmail } from '@/lib/email'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Haal alle betaalde orders op die een CJ order ID hebben maar nog geen tracking
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, customer_email, customer_name, items, cj_order_id')
    .eq('status', 'paid')
    .not('cj_order_id', 'is', null)

  if (error) {
    console.error('Tracking sync: fout bij ophalen orders:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!orders || orders.length === 0) {
    return NextResponse.json({ message: 'Geen orders om te synce', synced: 0 })
  }

  let synced = 0
  const errors: string[] = []

  for (const order of orders) {
    try {
      const detail = await getCJOrderDetail(order.cj_order_id!)

      if (detail.trackNumber) {
        // Update order met tracking nummer en status
        await supabase
          .from('orders')
          .update({
            tracking_number: detail.trackNumber,
            status: 'shipped',
          })
          .eq('id', order.id)

        // Stuur tracking email naar klant
        await sendTrackingEmail({
          customerName: order.customer_name,
          customerEmail: order.customer_email,
          trackingNumber: detail.trackNumber,
          items: order.items as any[],
        })

        console.log(`✅ Tracking synced voor order ${order.id}: ${detail.trackNumber}`)
        synced++
      }
    } catch (err: any) {
      console.error(`⚠️ Tracking sync mislukt voor order ${order.id}:`, err.message)
      errors.push(`${order.id}: ${err.message}`)
    }
  }

  return NextResponse.json({
    message: `Tracking sync klaar`,
    total: orders.length,
    synced,
    errors: errors.length > 0 ? errors : undefined,
  })
}
