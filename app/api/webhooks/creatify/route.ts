import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

// Creatify stuurt een POST webhook als een video klaar is
export async function POST(request: NextRequest) {
  const body = await request.json()

  // Creatify webhook payload bevat task id, status, en output URL
  const taskId = body.id as string | undefined
  const status = body.status as string | undefined
  const videoUrl = body.output as string | undefined
  const thumbnailUrl = body.thumbnail as string | undefined

  if (!taskId) {
    return NextResponse.json({ error: 'Missing task id' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Zoek de video met dit creatify_task_id
  const { data: video } = await supabase
    .from('tiktok_videos')
    .select('id')
    .eq('creatify_task_id', taskId)
    .single()

  if (!video) {
    return NextResponse.json({ error: 'Video niet gevonden' }, { status: 404 })
  }

  if (status === 'done' && videoUrl) {
    // Video is klaar
    await supabase
      .from('tiktok_videos')
      .update({
        video_url: videoUrl,
        thumbnail_url: thumbnailUrl || null,
        status: 'ready',
      })
      .eq('id', video.id)
  } else if (status === 'failed') {
    // Video generatie mislukt
    await supabase
      .from('tiktok_videos')
      .update({
        status: 'failed',
        failed_reason: body.error || 'Creatify generatie mislukt',
      })
      .eq('id', video.id)
  }

  return NextResponse.json({ ok: true })
}
