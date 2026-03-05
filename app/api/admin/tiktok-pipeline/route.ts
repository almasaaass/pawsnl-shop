import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { verifyAdmin } from '@/lib/auth'
import { isCreatifyConfigured, createVideoFromUrl } from '@/lib/creatify'
import { isBlotatoConfigured, postVideoToTikTok } from '@/lib/blotato'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pawsnlshop.com'

// ─── GET: Alle videos ophalen ───────────────────────────────────────────────

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('tiktok_videos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    videos: data ?? [],
    config: {
      creatify: isCreatifyConfigured(),
      blotato: isBlotatoConfigured(),
    },
  })
}

// ─── POST: Nieuwe video aanmaken / genereren ────────────────────────────────

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { action, ...data } = body

  const supabase = createAdminClient()

  // Actie: maak draft aan
  if (action === 'create') {
    const { product_id, product_name, product_url, script, caption, hashtags } = data

    const { data: video, error } = await supabase
      .from('tiktok_videos')
      .insert({
        product_id: product_id || null,
        product_name,
        product_url,
        script: script || null,
        caption: caption || null,
        hashtags: hashtags || [],
        status: 'draft',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ video })
  }

  // Actie: genereer video via Creatify
  if (action === 'generate') {
    const { video_id } = data

    if (!isCreatifyConfigured()) {
      return NextResponse.json(
        { error: 'Creatify API is niet geconfigureerd. Stel CREATIFY_API_ID en CREATIFY_API_KEY in.' },
        { status: 400 }
      )
    }

    // Haal video op
    const { data: video, error: fetchErr } = await supabase
      .from('tiktok_videos')
      .select('*')
      .eq('id', video_id)
      .single()

    if (fetchErr || !video) {
      return NextResponse.json({ error: 'Video niet gevonden' }, { status: 404 })
    }

    try {
      const webhookUrl = `${SITE_URL}/api/webhooks/creatify`
      const task = await createVideoFromUrl({
        productUrl: video.product_url,
        script: video.script || undefined,
        webhookUrl,
      })

      // Update status naar generating
      await supabase
        .from('tiktok_videos')
        .update({
          creatify_task_id: task.id,
          status: 'generating',
        })
        .eq('id', video_id)

      return NextResponse.json({ ok: true, taskId: task.id })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Onbekende fout'
      await supabase
        .from('tiktok_videos')
        .update({ status: 'failed', failed_reason: message })
        .eq('id', video_id)

      return NextResponse.json({ error: message }, { status: 500 })
    }
  }

  // Actie: post naar TikTok via Blotato
  if (action === 'post') {
    const { video_id } = data

    if (!isBlotatoConfigured()) {
      return NextResponse.json(
        { error: 'Blotato API is niet geconfigureerd. Stel BLOTATO_API_KEY in.' },
        { status: 400 }
      )
    }

    const { data: video, error: fetchErr } = await supabase
      .from('tiktok_videos')
      .select('*')
      .eq('id', video_id)
      .single()

    if (fetchErr || !video) {
      return NextResponse.json({ error: 'Video niet gevonden' }, { status: 404 })
    }

    if (!video.video_url) {
      return NextResponse.json({ error: 'Video heeft nog geen video URL' }, { status: 400 })
    }

    try {
      const result = await postVideoToTikTok({
        videoUrl: video.video_url,
        caption: video.caption || video.product_name,
        hashtags: video.hashtags || [],
      })

      await supabase
        .from('tiktok_videos')
        .update({
          blotato_post_id: result.id,
          tiktok_post_url: result.tiktok_url || null,
          status: 'posted',
          posted_at: new Date().toISOString(),
        })
        .eq('id', video_id)

      return NextResponse.json({ ok: true, postId: result.id })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Onbekende fout'
      await supabase
        .from('tiktok_videos')
        .update({ status: 'failed', failed_reason: message })
        .eq('id', video_id)

      return NextResponse.json({ error: message }, { status: 500 })
    }
  }

  return NextResponse.json({ error: 'Onbekende actie' }, { status: 400 })
}

// ─── PATCH: Video updaten ───────────────────────────────────────────────────

export async function PATCH(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, ...updates } = body

  if (!id) {
    return NextResponse.json({ error: 'Video ID ontbreekt' }, { status: 400 })
  }

  const supabase = createAdminClient()

  // Alleen toegestane velden updaten
  const allowed = ['script', 'caption', 'hashtags', 'status', 'scheduled_at', 'video_url', 'tiktok_post_url']
  const safeUpdates: Record<string, unknown> = {}
  for (const key of allowed) {
    if (key in updates) {
      safeUpdates[key] = updates[key]
    }
  }

  const { data, error } = await supabase
    .from('tiktok_videos')
    .update(safeUpdates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ video: data })
}

// ─── DELETE: Video verwijderen ───────────────────────────────────────────────

export async function DELETE(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'Video ID ontbreekt' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('tiktok_videos').delete().eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
