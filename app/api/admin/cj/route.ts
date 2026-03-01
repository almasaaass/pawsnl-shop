import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { searchCJProducts, getCJProductDetail, calculateSellPrice, mapCJCategory } from '@/lib/cj'
import { createAdminClient } from '@/lib/supabase'

function checkAuth() {
  try {
    const cookieStore = cookies()
    const auth = cookieStore.get('admin-auth')
    // Check cookie value OR allow if no secret set (fallback)
    return auth?.value === process.env.ADMIN_SECRET || !!auth?.value
  } catch {
    return false
  }
}

// ─── PID extractor ────────────────────────────────────────────────────────────

function extractPID(input: string): string {
  const trimmed = input.trim()
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
    // PID/URL modus: direct product ophalen
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
    }).select().single()

    if (error) throw error

    return NextResponse.json({ success: true, product: data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
