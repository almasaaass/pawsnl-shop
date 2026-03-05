export function formatPrice(price: number, locale: string = 'nl'): string {
  if (locale === 'en') {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(price)
  }
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export function formatDate(dateString: string, locale: string = 'nl'): string {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-GB' : 'nl-NL', {
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
 * Check if an image URL comes from the CJ Dropshipping CDN.
 * CJ CDN blocks hotlinking — these must be loaded through our proxy.
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

/** Deterministic pseudo-rating from product id (for UI display) */
export function getProductRating(id: string): { rating: number; count: number } {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = ((hash << 5) - hash) + id.charCodeAt(i)
    hash |= 0
  }
  const rating = 3.8 + (Math.abs(hash) % 13) / 10
  const count = 4 + (Math.abs(hash >> 4) % 28)
  return { rating: Math.min(rating, 5), count }
}

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
