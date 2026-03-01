// CJdropshipping API client
// Docs: https://developers.cjdropshipping.com

const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0'

let cachedToken: { token: string; expiresAt: number } | null = null

// ─── Auth ─────────────────────────────────────────────────────────────────────

export async function getCJToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

  const res = await fetch(`${CJ_BASE}/v1/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      apiKey: process.env.CJ_API_KEY,
    }),
  })

  const data = await res.json()

  if (!data.result || !data.data?.accessToken) {
    throw new Error(`CJ auth mislukt: ${data.message ?? JSON.stringify(data)}`)
  }

  cachedToken = {
    token: data.data.accessToken,
    expiresAt: Date.now() + (data.data.accessTokenExpiryDate ? new Date(data.data.accessTokenExpiryDate).getTime() - Date.now() : 3600 * 1000),
  }

  return cachedToken.token
}

// ─── Product zoeken ───────────────────────────────────────────────────────────

export interface CJProduct {
  pid: string
  productName: string
  productNameEn: string
  productSku: string
  sellPrice: number
  categoryName: string
  productImage: string
  productImageSet: string[]
  description?: string
  variants?: CJVariant[]
}

export interface CJVariant {
  vid: string
  variantSku: string
  variantSellPrice: number
  variantImage: string
  variantProperty: string
}

export async function searchCJProducts(keyword: string, page = 1, pageSize = 20): Promise<{
  list: CJProduct[]
  total: number
}> {
  const token = await getCJToken()

  const res = await fetch(
    `${CJ_BASE}/v1/product/listV2?keyWord=${encodeURIComponent(keyword)}&page=${page}&size=${pageSize}`,
    { headers: { 'CJ-Access-Token': token } }
  )

  const data = await res.json()

  if (!data.result) {
    throw new Error(`CJ zoeken mislukt: ${data.message}`)
  }

  return {
    list: (data.data?.list ?? []).map((p: any) => ({
      pid: p.pid,
      productName: p.productNameEn ?? p.productName,
      productNameEn: p.productNameEn,
      productSku: p.productSku,
      sellPrice: parseFloat(p.sellPrice ?? '0'),
      categoryName: p.categoryName ?? '',
      productImage: p.productImage ?? '',
      productImageSet: p.productImageSet ?? [p.productImage].filter(Boolean),
    })),
    total: data.data?.total ?? 0,
  }
}

// ─── Product details ──────────────────────────────────────────────────────────

export async function getCJProductDetail(pid: string): Promise<CJProduct> {
  const token = await getCJToken()

  const res = await fetch(`${CJ_BASE}/v1/product/query?pid=${pid}`, {
    headers: { 'CJ-Access-Token': token },
  })

  const data = await res.json()

  if (!data.result) {
    throw new Error(`CJ product detail mislukt: ${data.message}`)
  }

  const p = data.data
  return {
    pid: p.pid,
    productName: p.productNameEn ?? p.productName,
    productNameEn: p.productNameEn,
    productSku: p.productSku,
    sellPrice: parseFloat(p.sellPrice ?? '0'),
    categoryName: p.categoryName ?? '',
    productImage: p.productImage ?? '',
    productImageSet: (p.productImageSet ?? [p.productImage]).filter(Boolean),
    description: p.description ?? '',
    variants: (p.variants ?? []).map((v: any) => ({
      vid: v.vid,
      variantSku: v.variantSku,
      variantSellPrice: parseFloat(v.variantSellPrice ?? p.sellPrice ?? '0'),
      variantImage: v.variantImage ?? p.productImage,
      variantProperty: v.variantProperty ?? '',
    })),
  }
}

// ─── Prijs berekening ─────────────────────────────────────────────────────────

// Bereken verkoopprijs op basis van inkoopprijs
// Standaard: 2.5x markup (60% marge), minimum €12.95
export function calculateSellPrice(costPrice: number): { price: number; comparePrice: number | null } {
  const markup = costPrice < 10 ? 3.0 : costPrice < 20 ? 2.5 : costPrice < 40 ? 2.2 : 2.0
  const raw = costPrice * markup
  // Rond af naar .95 pricing
  const price = Math.ceil(raw) - 0.05
  const comparePrice = price < 19.95 ? null : Math.ceil(price * 1.3) - 0.05

  return {
    price: Math.max(price, 12.95),
    comparePrice,
  }
}

// ─── Categorie mapping ────────────────────────────────────────────────────────

export function mapCJCategory(categoryName: string): string {
  const name = categoryName.toLowerCase()
  if (name.includes('dog') || name.includes('puppy') || name.includes('hond')) return 'honden'
  if (name.includes('cat') || name.includes('kitten') || name.includes('kat')) return 'katten'
  if (name.includes('bird') || name.includes('vogel')) return 'vogels'
  if (name.includes('fish') || name.includes('aquar') || name.includes('vis')) return 'vissen'
  if (name.includes('hamster') || name.includes('rabbit') || name.includes('rodent')) return 'knaagdieren'
  return 'honden' // standaard
}
