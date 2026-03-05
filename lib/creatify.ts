// Creatify AI API client — URL-to-Video
// Docs: https://docs.creatify.ai

const CREATIFY_BASE = 'https://api.creatify.ai/api'

function getHeaders(): HeadersInit {
  const apiId = process.env.CREATIFY_API_ID
  const apiKey = process.env.CREATIFY_API_KEY
  if (!apiId || !apiKey) {
    throw new Error('CREATIFY_API_ID en CREATIFY_API_KEY zijn niet ingesteld')
  }
  return {
    'X-API-ID': apiId,
    'X-API-KEY': apiKey,
    'Content-Type': 'application/json',
  }
}

export function isCreatifyConfigured(): boolean {
  return !!(process.env.CREATIFY_API_ID && process.env.CREATIFY_API_KEY)
}

// ─── URL-to-Video aanmaken ──────────────────────────────────────────────────

interface CreateVideoParams {
  productUrl: string
  script?: string
  webhookUrl?: string
}

interface CreatifyTaskResponse {
  id: string
  status: string
  output?: string
  thumbnail?: string
}

export async function createVideoFromUrl(params: CreateVideoParams): Promise<CreatifyTaskResponse> {
  const res = await fetch(`${CREATIFY_BASE}/url_to_video/`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      url: params.productUrl,
      script: params.script || undefined,
      webhook_url: params.webhookUrl || undefined,
      aspect_ratio: '9:16', // TikTok formaat
      language: 'Dutch',
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Creatify fout (${res.status}): ${text}`)
  }

  return res.json()
}

// ─── Video status ophalen ───────────────────────────────────────────────────

export async function getVideoStatus(taskId: string): Promise<CreatifyTaskResponse> {
  const res = await fetch(`${CREATIFY_BASE}/url_to_video/${taskId}/`, {
    method: 'GET',
    headers: getHeaders(),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Creatify status fout (${res.status}): ${text}`)
  }

  return res.json()
}
