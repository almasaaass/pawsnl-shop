export function formatPrice(price: number): string {
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(dateString))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

/**
 * Controleer of een afbeelding URL van CJ Dropshipping CDN komt.
 * CJ CDN blokkeert hotlinking — deze moeten via onze proxy geladen worden.
 */
const CJ_CDN_HOSTS = [
  'cc-west-usa.oss-us-west-1.aliyuncs.com',
  'cbu01.alicdn.com',
  'cf.cjdropshipping.com',
  'img.cjdropshipping.com',
  'www.cjdropshipping.com',
  'cjdropshipping.com',
  'cc-west-usa.oss-accelerate.aliyuncs.com',
  'oss-cf.cjdropshipping.com',
]

export function getImageSrc(url: string): string {
  if (!url || typeof url !== 'string') return ''
  try {
    const parsed = new URL(url)
    const isCJ = CJ_CDN_HOSTS.some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`)
    )
    if (isCJ) {
      return `/api/image-proxy?url=${encodeURIComponent(url)}`
    }
    return url
  } catch {
    return url
  }
}
