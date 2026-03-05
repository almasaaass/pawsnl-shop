import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { sendDailyReport, sendViralAlert } from '@/lib/email'
import { isBlotatoConfigured, getPostAnalytics } from '@/lib/blotato'

// Secured with a secret header so only Vercel Cron can call this
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const now = new Date()

  // Time boundaries
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)

  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  // Fetch all orders
  const { data: orders } = await supabase
    .from('orders')
    .select('total, status, customer_name, created_at')
    .eq('status', 'paid')
    .order('created_at', { ascending: false })

  const { data: customers } = await supabase.from('customers').select('id')

  const allOrders = orders ?? []

  const revenueToday = allOrders
    .filter((o) => new Date(o.created_at) >= startOfToday)
    .reduce((sum, o) => sum + Number(o.total), 0)

  const ordersToday = allOrders.filter((o) => new Date(o.created_at) >= startOfToday).length

  const revenueWeek = allOrders
    .filter((o) => new Date(o.created_at) >= startOfWeek)
    .reduce((sum, o) => sum + Number(o.total), 0)

  const ordersWeek = allOrders.filter((o) => new Date(o.created_at) >= startOfWeek).length

  const revenueMonth = allOrders.reduce((sum, o) => sum + Number(o.total), 0)

  const date = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  await sendDailyReport({
    date,
    revenueToday,
    ordersToday,
    revenueWeek,
    ordersWeek,
    revenueMonth,
    totalCustomers: customers?.length ?? 0,
    totalOrders: allOrders.length,
    recentOrders: allOrders.slice(0, 5),
  })

  // ─── TikTok views check ──────────────────────────────────────────────────
  // Check views van geposte video's en stuur viral alert bij ≥1.000 views

  let viralAlerts = 0

  if (isBlotatoConfigured()) {
    const { data: postedVideos } = await supabase
      .from('tiktok_videos')
      .select('*')
      .in('status', ['posted', 'viral'])
      .not('blotato_post_id', 'is', null)

    for (const video of postedVideos ?? []) {
      try {
        const analytics = await getPostAnalytics(video.blotato_post_id)
        const newViews = analytics.views

        // Update views
        await supabase
          .from('tiktok_videos')
          .update({ views: newViews })
          .eq('id', video.id)

        // Viral alert bij ≥1.000 views (eenmalig)
        if (newViews >= 1000 && !video.viral_alert_sent) {
          await sendViralAlert({
            videoId: video.id,
            productName: video.product_name,
            tiktokUrl: video.tiktok_post_url,
            views: newViews,
          })

          await supabase
            .from('tiktok_videos')
            .update({ status: 'viral', viral_alert_sent: true })
            .eq('id', video.id)

          viralAlerts++
        }
      } catch {
        // Analytics ophalen mislukt — skip deze video
        continue
      }
    }
  }

  return NextResponse.json({ ok: true, date, viralAlerts })
}
