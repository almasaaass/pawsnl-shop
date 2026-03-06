import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { sendViralAlert } from '@/lib/email'
import { isBlotatoConfigured, getPostAnalytics } from '@/lib/blotato'

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!isBlotatoConfigured()) {
    return NextResponse.json({ ok: true, skipped: true, reason: 'Blotato niet geconfigureerd' })
  }

  const supabase = createAdminClient()

  const { data: videos, error } = await supabase
    .from('tiktok_videos')
    .select('*')
    .in('status', ['posted', 'viral'])
    .not('blotato_post_id', 'is', null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let checked = 0
  let viralAlerts = 0
  const errors: string[] = []

  for (const video of videos ?? []) {
    try {
      const analytics = await getPostAnalytics(video.blotato_post_id)
      checked++

      await supabase
        .from('tiktok_videos')
        .update({ views: analytics.views })
        .eq('id', video.id)

      if (analytics.views >= 1000 && !video.viral_alert_sent) {
        await sendViralAlert({
          videoId: video.id,
          productName: video.product_name,
          tiktokUrl: video.tiktok_post_url,
          views: analytics.views,
        })

        await supabase
          .from('tiktok_videos')
          .update({ status: 'viral', viral_alert_sent: true })
          .eq('id', video.id)

        viralAlerts++
      }
    } catch (err) {
      errors.push(`Video ${video.id}: ${err instanceof Error ? err.message : 'onbekende fout'}`)
      continue
    }
  }

  return NextResponse.json({
    ok: true,
    checked,
    viralAlerts,
    totalVideos: videos?.length ?? 0,
    errors: errors.length > 0 ? errors : undefined,
  })
}
