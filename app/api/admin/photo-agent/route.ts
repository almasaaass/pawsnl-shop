import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase'

/**
 * Photo Agent — Genereert professionele productfoto's,
 * slaat ze op in Supabase Storage en publiceert naar de webshop.
 *
 * POST: Verwerk een enkel product of alle producten (batch)
 * Body: { productId?: string, mode: 'single' | 'batch', template?: string, features?: string, badge?: string }
 */

const BUCKET_NAME = 'product-images'

// Standaard features per categorie
const DEFAULT_FEATURES: Record<string, string> = {
  honden: 'Premium kwaliteit|Gratis verzending vanaf €35|30 dagen retour',
  katten: 'Premium kwaliteit|Gratis verzending vanaf €35|30 dagen retour',
  vogels: 'Premium kwaliteit|Gratis verzending vanaf €35|30 dagen retour',
  knaagdieren: 'Premium kwaliteit|Gratis verzending vanaf €35|30 dagen retour',
  vissen: 'Premium kwaliteit|Gratis verzending vanaf €35|30 dagen retour',
}

// Standaard badges per prijs/korting
function getDefaultBadge(product: any): string {
  if (product.compare_price && product.compare_price > product.price) {
    const discount = Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    if (discount >= 30) return 'Aanbieding'
    return 'Bestseller'
  }
  return 'Bestseller'
}

function formatEur(n: number): string {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)
}

// CJ CDN hosts die via proxy moeten
const CJ_CDN_HOSTS = [
  'cc-west-usa.oss-us-west-1.aliyuncs.com',
  'cbu01.alicdn.com',
  'cf.cjdropshipping.com',
  'img.cjdropshipping.com',
  'oss-cf.cjdropshipping.com',
  'www.cjdropshipping.com',
  'cc-west-usa.oss-accelerate.aliyuncs.com',
]

function getProxyUrl(baseUrl: string, imageUrl: string): string {
  if (!imageUrl) return ''
  try {
    const parsed = new URL(imageUrl)
    const isCJ = CJ_CDN_HOSTS.some(h => parsed.hostname === h || parsed.hostname.endsWith(`.${h}`))
    if (isCJ) {
      return `${baseUrl}/api/image-proxy?url=${encodeURIComponent(imageUrl)}`
    }
    return imageUrl
  } catch {
    return imageUrl
  }
}

async function ensureBucketExists(supabase: any) {
  // Check if bucket exists, create if not
  const { data: buckets } = await supabase.storage.listBuckets()
  const exists = buckets?.some((b: any) => b.name === BUCKET_NAME)

  if (!exists) {
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      fileSizeLimit: 10 * 1024 * 1024, // 10MB
    })
    if (error && !error.message.includes('already exists')) {
      throw new Error(`Bucket aanmaken mislukt: ${error.message}`)
    }
  }
  return true
}

type Template = 'infographic' | 'social' | 'feature' | 'banner'

async function generateAndUpload(
  supabase: any,
  baseUrl: string,
  product: any,
  template: Template,
  features: string,
  badge: string,
): Promise<string | null> {
  // 1. Build the generate-image URL
  const params = new URLSearchParams({
    template,
    name: product.name,
    price: formatEur(product.price),
    image: product.images?.[0] ? getProxyUrl(baseUrl, product.images[0]) : '',
    category: product.category || 'honden',
  })

  if (product.compare_price) {
    params.set('comparePrice', formatEur(product.compare_price))
  }
  if (features) params.set('features', features)
  if (badge) params.set('badge', badge)
  if (product.compare_price && product.compare_price > product.price) {
    params.set('discount', String(Math.round(
      ((product.compare_price - product.price) / product.compare_price) * 100
    )))
  }

  const generateUrl = `${baseUrl}/api/admin/generate-image?${params.toString()}`

  // 2. Fetch the generated image
  const imgResponse = await fetch(generateUrl, {
    signal: AbortSignal.timeout(15000),
  })

  if (!imgResponse.ok) {
    throw new Error(`Image generatie mislukt: ${imgResponse.status}`)
  }

  const imageBuffer = await imgResponse.arrayBuffer()
  const imageData = new Uint8Array(imageBuffer)

  // 3. Upload to Supabase Storage
  const slug = product.slug || product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
  const filePath = `${slug}/${template}.png`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, imageData, {
      contentType: 'image/png',
      upsert: true, // Overschrijf als bestand al bestaat
    })

  if (uploadError) {
    throw new Error(`Upload mislukt: ${uploadError.message}`)
  }

  // 4. Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)

  return publicUrl
}

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  try {
    const body = await request.json()
    const { productId, mode = 'single', template, features, badge } = body

    // Determine base URL from request
    const proto = request.headers.get('x-forwarded-proto') || 'http'
    const host = request.headers.get('host') || 'localhost:3000'
    const baseUrl = `${proto}://${host}`

    // Ensure Storage bucket exists
    await ensureBucketExists(supabase)

    if (mode === 'single' && productId) {
      // Process single product
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single()

      if (error || !product) {
        return NextResponse.json({ error: 'Product niet gevonden' }, { status: 404 })
      }

      const selectedTemplate = (template || 'social') as Template
      const selectedFeatures = features || DEFAULT_FEATURES[product.category] || DEFAULT_FEATURES.honden
      const selectedBadge = badge || getDefaultBadge(product)

      const publicUrl = await generateAndUpload(
        supabase, baseUrl, product,
        selectedTemplate, selectedFeatures, selectedBadge,
      )

      if (!publicUrl) {
        return NextResponse.json({ error: 'Generatie mislukt' }, { status: 500 })
      }

      // Update product images - prepend the new image
      const currentImages = product.images || []
      // Remove any existing generated images from this bucket
      const filteredImages = currentImages.filter(
        (img: string) => !img.includes(BUCKET_NAME)
      )
      const newImages = [publicUrl, ...filteredImages]

      await supabase
        .from('products')
        .update({ images: newImages })
        .eq('id', product.id)

      return NextResponse.json({
        success: true,
        url: publicUrl,
        product: product.name,
        template: selectedTemplate,
      })

    } else if (mode === 'batch') {
      // Batch process all products
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('name')

      if (error || !products) {
        return NextResponse.json({ error: 'Producten ophalen mislukt' }, { status: 500 })
      }

      const templates: Template[] = ['social'] // Use 'social' as the hero image
      const results: any[] = []
      let processed = 0
      let failed = 0

      for (const product of products) {
        try {
          const productFeatures = features || DEFAULT_FEATURES[product.category] || DEFAULT_FEATURES.honden
          const productBadge = badge || getDefaultBadge(product)

          const generatedUrls: string[] = []

          for (const t of templates) {
            const url = await generateAndUpload(
              supabase, baseUrl, product,
              t, productFeatures, productBadge,
            )
            if (url) generatedUrls.push(url)
          }

          if (generatedUrls.length > 0) {
            // Update product - prepend generated images
            const currentImages = product.images || []
            const filteredImages = currentImages.filter(
              (img: string) => !img.includes(BUCKET_NAME)
            )
            const newImages = [...generatedUrls, ...filteredImages]

            await supabase
              .from('products')
              .update({ images: newImages })
              .eq('id', product.id)

            processed++
            results.push({
              name: product.name,
              status: 'success',
              urls: generatedUrls,
            })
          } else {
            failed++
            results.push({
              name: product.name,
              status: 'failed',
              error: 'Geen images gegenereerd',
            })
          }
        } catch (err: any) {
          failed++
          results.push({
            name: product.name,
            status: 'failed',
            error: err.message,
          })
        }
      }

      return NextResponse.json({
        success: true,
        total: products.length,
        processed,
        failed,
        results,
      })
    }

    return NextResponse.json({ error: 'Ongeldige mode' }, { status: 400 })

  } catch (err: any) {
    console.error('Photo Agent error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// GET: Status check + bucket info
export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  try {
    const { data: buckets } = await supabase.storage.listBuckets()
    const bucket = buckets?.find((b: any) => b.name === BUCKET_NAME)

    const { data: products } = await supabase
      .from('products')
      .select('id, name, slug, images')
      .order('name')

    const stats = {
      bucketExists: !!bucket,
      totalProducts: products?.length || 0,
      productsWithGenerated: products?.filter(
        (p: any) => p.images?.some((img: string) => img.includes(BUCKET_NAME))
      ).length || 0,
      productsWithoutImages: products?.filter(
        (p: any) => !p.images || p.images.length === 0
      ).length || 0,
    }

    return NextResponse.json(stats)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
