// Blotato API client — Post naar TikTok & views ophalen
// Docs: https://blotato.com/docs

const BLOTATO_BASE = 'https://api.blotato.com/v1'

function getHeaders(): HeadersInit {
  const apiKey = process.env.BLOTATO_API_KEY
  if (!apiKey) {
    throw new Error('BLOTATO_API_KEY is niet ingesteld')
  }
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }
}

export function isBlotatoConfigured(): boolean {
  return !!process.env.BLOTATO_API_KEY
}

// ─── Video posten naar TikTok ───────────────────────────────────────────────

interface PostVideoParams {
  videoUrl: string
  caption: string
  hashtags?: string[]
  scheduledAt?: string // ISO date string
}

interface BlotatoPostResponse {
  id: string
  status: string
  tiktok_url?: string
}

export async function postVideoToTikTok(params: PostVideoParams): Promise<BlotatoPostResponse> {
  const caption = params.hashtags?.length
    ? `${params.caption}\n\n${params.hashtags.map((h) => (h.startsWith('#') ? h : `#${h}`)).join(' ')}`
    : params.caption

  const res = await fetch(`${BLOTATO_BASE}/posts`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      platform: 'tiktok',
      media_url: params.videoUrl,
      caption,
      scheduled_at: params.scheduledAt || undefined,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Blotato post fout (${res.status}): ${text}`)
  }

  return res.json()
}

// ─── Post analytics ophalen ─────────────────────────────────────────────────

interface BlotatoAnalytics {
  id: string
  views: number
  likes: number
  comments: number
  shares: number
}

export async function getPostAnalytics(postId: string): Promise<BlotatoAnalytics> {
  const res = await fetch(`${BLOTATO_BASE}/posts/${postId}/analytics`, {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Blotato analytics fout (${res.status}): ${text}`)
  }

  return res.json()
}
