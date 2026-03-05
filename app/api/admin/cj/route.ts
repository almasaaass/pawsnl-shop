import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { searchCJProducts, getCJProductDetail, calculateSellPrice, mapCJCategory } from '@/lib/cj'
import { createAdminClient } from '@/lib/supabase'

function checkAuth() {
  try {
    const cookieStore = cookies()
    const auth = cookieStore.get('admin-auth')
    const adminSecret = process.env.ADMIN_SECRET
    if (!adminSecret) return false
    return auth?.value === adminSecret
  } catch {
    return false
  }
}

// ─── PID extractor ────────────────────────────────────────────────────────────

function extractPID(input: string): string {
  const trimmed = input.trim()
  // URL: https://www.cjdropshipping.com/slug-name-p-1711605389739315200
  const slugMatch = trimmed.match(/-p-(\d+)/)
  if (slugMatch) return slugMatch[1]
  // URL: https://cjdropshipping.com/product/detail/XXXXXX.html
  const detailMatch = trimmed.match(/cjdropshipping\.com\/product\/detail\/([A-Za-z0-9-]+)\.html/)
  if (detailMatch) return detailMatch[1]
  // URL: https://cjdropshipping.com/product/XXXXXX
  const productMatch = trimmed.match(/cjdropshipping\.com\/product\/([A-Za-z0-9-]+)/)
  if (productMatch) return productMatch[1]
  // Kale PID string
  return trimmed
}

// ─── Enrich helper ────────────────────────────────────────────────────────────

function enrichProduct(p: any) {
  const pricing = calculateSellPrice(p.sellPrice)
  return {
    ...p,
    suggestedPrice: pricing.price,
    suggestedComparePrice: pricing.comparePrice,
    suggestedCategory: mapCJCategory(p.categoryName),
    margin: p.sellPrice > 0
      ? Math.round(((pricing.price - p.sellPrice) / pricing.price) * 100)
      : 0,
  }
}

// ─── Zoeken / PID ophalen ─────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const pidParam = searchParams.get('pid')
  const keyword = searchParams.get('q') ?? ''
  const page = parseInt(searchParams.get('page') ?? '1')

  if (!pidParam && !keyword) return NextResponse.json({ error: 'Zoekterm of PID verplicht' }, { status: 400 })

  if (!process.env.CJ_API_KEY) {
    return NextResponse.json({
      error: 'CJ_API_KEY is nog niet ingesteld in de omgevingsvariabelen.',
    }, { status: 503 })
  }

  try {
    // URL/PID modus: direct product ophalen
    if (pidParam) {
      const pid = extractPID(pidParam)
      const product = await getCJProductDetail(pid)
      return NextResponse.json({ products: [enrichProduct(product)], total: 1 })
    }

    // Keyword zoeken
    const results = await searchCJProducts(keyword, page)
    const enriched = results.list.map(enrichProduct)
    return NextResponse.json({ products: enriched, total: results.total })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// ─── Importeren ───────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { pid, nameNL, descriptionNL, category, price, comparePrice } = await request.json()

  if (!pid) return NextResponse.json({ error: 'pid verplicht' }, { status: 400 })

  try {
    // Haal volledige productdetails op van CJ
    const product = await getCJProductDetail(pid)

    const supabase = createAdminClient()

    // Bouw slug
    const slug = nameNL
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .slice(0, 80)

    // Check of slug al bestaat
    const { data: existing } = await supabase.from('products').select('id').eq('slug', slug).single()
    const finalSlug = existing ? `${slug}-${Date.now()}` : slug

    // Gebruik de mooiste afbeeldingen (max 4)
    const images = product.productImageSet.slice(0, 4)

    // Eerste variant ID ophalen voor CJ order koppeling
    const firstVid = product.variants?.[0]?.vid ?? null

    // Build variants JSONB if product has multiple CJ variants
    let variants = null
    let optionTypes = null
    if (product.variants && product.variants.length > 1) {
      variants = product.variants.map((v: any, i: number) => {
        const options: Record<string, string> = {}
        if (v.variantProperty) {
          const parts = v.variantProperty.split(';').filter(Boolean)
          for (const part of parts) {
            const [key, ...valParts] = part.split(':')
            if (key && valParts.length > 0) {
              const translations: Record<string, string> = {
                Color: 'Kleur', color: 'Kleur', Colour: 'Kleur',
                Size: 'Maat', size: 'Maat',
                Style: 'Stijl', style: 'Stijl',
                Material: 'Materiaal', material: 'Materiaal',
              }
              options[translations[key.trim()] || key.trim()] = valParts.join(':').trim()
            }
          }
        }
        return {
          id: `new-v${i}`,
          cj_vid: v.vid,
          sku: v.variantSku,
          options,
          image: v.variantImage || undefined,
          stock: 999,
        }
      })
      optionTypes = Object.keys(variants[0]?.options ?? {})
      if (optionTypes.length === 0) optionTypes = null
    }

    const { data, error } = await supabase.from('products').insert({
      name: nameNL,
      slug: finalSlug,
      description: descriptionNL ?? product.description ?? '',
      price: price ?? calculateSellPrice(product.sellPrice).price,
      compare_price: comparePrice ?? calculateSellPrice(product.sellPrice).comparePrice,
      images,
      category: category ?? mapCJCategory(product.categoryName),
      stock: 999, // Dropshipping = onbeperkte voorraad
      featured: false,
      cj_pid: product.pid,
      cj_vid: firstVid,
      variants,
      option_types: optionTypes,
    }).select().single()

    if (error) throw error

    return NextResponse.json({ success: true, product: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
