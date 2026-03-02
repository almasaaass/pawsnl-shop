import { NextRequest, NextResponse } from 'next/server'

/**
 * Image proxy voor CJ Dropshipping afbeeldingen.
 * CJ CDN blokkeert hotlinking vanaf externe domeinen.
 * Deze route downloadt de afbeelding server-side en stuurt die door,
 * waardoor de browser geen directe verbinding maakt met CJ CDN.
 *
 * Gebruik: /api/image-proxy?url=https://cc-west-usa.oss-us-west-1.aliyuncs.com/...
 */

const ALLOWED_HOSTS = [
  'cc-west-usa.oss-us-west-1.aliyuncs.com',
  'cbu01.alicdn.com',
  'cf.cjdropshipping.com',
  'img.cjdropshipping.com',
  'www.cjdropshipping.com',
  'cjdropshipping.com',
  'cc-west-usa.oss-accelerate.aliyuncs.com',
  'oss-cf.cjdropshipping.com',
]

// In-memory cache voor 1 uur
const cache = new Map<string, { data: Uint8Array; contentType: string; expires: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 1 uur

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url')

  if (!url) {
    return NextResponse.json({ error: 'URL parameter verplicht' }, { status: 400 })
  }

  // Valideer URL
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    return NextResponse.json({ error: 'Ongeldige URL' }, { status: 400 })
  }

  // Alleen toegestane hosts (CJ CDN domeinen)
  if (!ALLOWED_HOSTS.some(host => parsed.hostname.endsWith(host) || parsed.hostname === host)) {
    return NextResponse.json({ error: 'Domein niet toegestaan' }, { status: 403 })
  }

  // Alleen HTTPS
  if (parsed.protocol !== 'https:') {
    return NextResponse.json({ error: 'Alleen HTTPS URLs toegestaan' }, { status: 400 })
  }

  // Check cache
  const cached = cache.get(url)
  if (cached && Date.now() < cached.expires) {
    return new NextResponse(cached.data as unknown as BodyInit, {
      headers: {
        'Content-Type': cached.contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'X-Cache': 'HIT',
      },
    })
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PawsNL/1.0)',
        'Accept': 'image/*',
        'Referer': 'https://www.cjdropshipping.com/',
      },
      signal: AbortSignal.timeout(10000),
    })

    if (!response.ok) {
      return NextResponse.json(
        { error: `Afbeelding kon niet geladen worden (${response.status})` },
        { status: 502 }
      )
    }

    const contentType = response.headers.get('Content-Type') || 'image/jpeg'

    // Controleer dat het daadwerkelijk een afbeelding is
    if (!contentType.startsWith('image/')) {
      return NextResponse.json({ error: 'URL is geen afbeelding' }, { status: 400 })
    }

    const arrayBuffer = await response.arrayBuffer()
    const data = new Uint8Array(arrayBuffer)

    // Max 5MB
    if (data.byteLength > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Afbeelding te groot' }, { status: 413 })
    }

    // Sla op in cache
    cache.set(url, {
      data,
      contentType,
      expires: Date.now() + CACHE_TTL,
    })

    // Ruim oude cache entries op (max 500)
    if (cache.size > 500) {
      const now = Date.now()
      const keys = Array.from(cache.keys())
      for (const key of keys) {
        const val = cache.get(key)
        if (val && now > val.expires) cache.delete(key)
      }
    }

    return new NextResponse(data as unknown as BodyInit, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
        'X-Cache': 'MISS',
      },
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: `Proxy fout: ${err.message}` },
      { status: 502 }
    )
  }
}
