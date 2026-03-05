/**
 * Generate Professional Product Images — PawsNL
 *
 * Based on ecommerce best practices research:
 * - Product-specific features (not generic)
 * - Multiple templates: social (hero), feature (dark with USPs), infographic (IG portrait)
 * - Smart badges: discount %, Bestseller, NIEUW
 * - Consistent branding across all products
 *
 * Requires dev server running on localhost:3000
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)

const BASE_URL = 'http://localhost:3000'
const BUCKET_NAME = 'product-images'
const sleep = ms => new Promise(r => setTimeout(r, ms))

// ══════════════════════════════════════════════════════════════
// PRODUCT-SPECIFIC FEATURES — Unique selling points per product
// Based on ecommerce best practices: specific > generic
// ══════════════════════════════════════════════════════════════
const PRODUCT_FEATURES = {
  // HONDEN
  'anti-trek-hondentuigje-ontspannen-wandelen': {
    features: 'Anti-trek design met borstclip|Reflecterend & ademend materiaal|Verstelbaar in 4 punten|Geschikt voor alle hondenrassen',
    badge: 'Bestseller',
  },
  'draagbare-honden-waterfles-drinken-onderweg': {
    features: '2-in-1: drinkfles + bakje|Lekvrij ontwerp|BPA-vrij materiaal|Ideaal voor wandelingen & reizen',
    badge: 'Populair',
  },
  'honden-badjas-snel-droog-na-het-bad': {
    features: 'Super absorberend microvezel|Droogt 3x sneller dan handdoek|Dubbelzijdige zakken|Ophanglus voor opslag',
    badge: 'NIEUW',
  },
  'koelvest-voor-honden-verkoeling-op-warme-dagen': {
    features: 'Koelt tot 3 uur lang|Ademend & lichtgewicht|Reflecterende strepen|Beschermt tegen oververhitting',
    badge: 'Zomer hit',
  },
  'led-halsband-usb-zichtbaar-tot-500m-in-het-donker': {
    features: 'Zichtbaar tot 500 meter|3 lichtmodi: continu & knipperend|USB oplaadbaar|Waterbestendig IP65',
    badge: 'Veiligheid #1',
  },
  'hands-free-hondenriem-perfect-voor-hardlopers': {
    features: 'Handen vrij wandelen & joggen|Schokdempend elastisch design|Verstelbare heupband|Reflecterende stiksels',
    badge: 'Bestseller',
  },
  'stille-nagelvijl-stressvrij-nagels-knippen': {
    features: 'Fluisterstil — geen stress|2 snelheden & 3 slijpkoppen|USB oplaadbaar|Veilig voor alle dieren',
    badge: 'Diervriendelijk',
  },
  'waterdichte-hondenjas-droog-bij-elk-weer': {
    features: 'Waterdicht buitenmateriaal|Reflecterende strepen|Verstelbaar met klittenband|Lichtgewicht & comfortabel',
    badge: 'Weer & wind',
  },
  'stoom-verzorgingsborstel-glanzende-vacht-in-minuten': {
    features: '3-in-1: stoom + borstel + massage|Vermindert haaruitval 90%|USB oplaadbaar|Geschikt voor hond & kat',
    badge: 'Top product',
  },

  // KATTEN
  'automatische-kattenlaser-eindeloos-speelplezier': {
    features: 'Automatisch draaiend laserpatroon|5 instelbare snelheden|Stimuleert jachtinstinct|USB oplaadbaar',
    badge: 'Kat favoriet',
  },
  'slangen-speeltje-interactief-automatisch': {
    features: 'Levensechte slangbewegingen|Smart sensor activatie|USB oplaadbaar|Stimuleert natuurlijk jachtinstinct',
    badge: 'Interactief',
  },
  'kattenrugzak-met-kijkvenster-veilig-comfortabel-op-pad': {
    features: 'Transparant kijkvenster|Ademende mesh ventilatie|Draagbaar tot 6kg|Airline goedgekeurd',
    badge: 'Avontuur',
  },
  'stille-kattenfontein-altijd-vers-gefilterd-water': {
    features: 'Fluisterstille waterpomp|3-laags koolstoffilter|2L capaciteit|Stimuleert meer drinken',
    badge: 'Gezondheid',
  },
  'zelfreinigende-kattenborstel-minder-haaruitval': {
    features: 'Zelfreinigende borstel — 1 klik|Vermindert haaruitval 95%|Zachte ronde pennen|Geschikt voor alle vachttypes',
    badge: 'Bestseller',
  },
  'kattentunnel-3-weg-verstoppen-rennen-spelen': {
    features: 'Opvouwbaar 3-weg ontwerp|Kraakgeluid & speelballetje|Scheurbestendig polyester|Compact op te bergen',
    badge: 'Speelplezier',
  },
  'rups-speeltje-onvoorspelbaar-verslavend-voor-katten': {
    features: 'Smart motion sensor activatie|Onvoorspelbare rups bewegingen|USB oplaadbaar — 2+ uur spelen|Sterke zuignap bevestiging',
    badge: 'NIEUW',
  },
  'elektrische-kattenmassage-pure-ontspanning': {
    features: '4 roterende massagekoppen|Vermindert stress & angst|Draadloos & oplaadbaar|Geschikt voor kat & hond',
    badge: 'Wellness',
  },
}

// CJ CDN hosts that need proxying
const CJ_CDN_HOSTS = [
  'cc-west-usa.oss-us-west-1.aliyuncs.com',
  'cbu01.alicdn.com',
  'cf.cjdropshipping.com',
  'img.cjdropshipping.com',
  'oss-cf.cjdropshipping.com',
]

function getProxyUrl(imageUrl) {
  if (!imageUrl) return ''
  try {
    const parsed = new URL(imageUrl)
    const isCJ = CJ_CDN_HOSTS.some(h => parsed.hostname === h || parsed.hostname.endsWith(`.${h}`))
    if (isCJ) {
      return `${BASE_URL}/api/image-proxy?url=${encodeURIComponent(imageUrl)}`
    }
    return imageUrl
  } catch {
    return imageUrl
  }
}

function formatEur(n) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)
}

async function generateImage(product, template, features, badge) {
  const params = new URLSearchParams({
    template,
    name: product.name,
    price: formatEur(product.price),
    image: product.images?.[0] ? getProxyUrl(product.images[0]) : '',
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

  const url = `${BASE_URL}/api/admin/generate-image?${params.toString()}`
  const res = await fetch(url, { signal: AbortSignal.timeout(15000) })

  if (!res.ok) throw new Error(`Image generatie mislukt: ${res.status}`)

  return new Uint8Array(await res.arrayBuffer())
}

async function uploadToStorage(supabase, slug, template, imageData) {
  const filePath = `${slug}/${template}.png`

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, imageData, {
      contentType: 'image/png',
      upsert: true,
    })

  if (error) throw new Error(`Upload mislukt: ${error.message}`)

  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)

  return publicUrl
}

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🎨 PawsNL — Professionele Productfoto Generator')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📋 Templates: social (1080x1080), feature (1080x1080), infographic (1080x1350)')
  console.log('✨ Product-specifieke features & badges')
  console.log('')

  // Check dev server
  try {
    const check = await fetch(`${BASE_URL}/api/admin/generate-image?name=test&template=social`, { signal: AbortSignal.timeout(5000) })
    if (!check.ok) throw new Error('Server niet bereikbaar')
    console.log('✅ Dev server draait op localhost:3000\n')
  } catch (err) {
    console.error('❌ Dev server niet bereikbaar op localhost:3000')
    console.error('   Start eerst: cd pawsnl-shop && npm run dev')
    process.exit(1)
  }

  // Get all products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('name')

  console.log(`📦 ${products.length} producten gevonden\n`)

  // Ensure bucket exists
  const { data: buckets } = await supabase.storage.listBuckets()
  if (!buckets?.some(b => b.name === BUCKET_NAME)) {
    await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
      fileSizeLimit: 10 * 1024 * 1024,
    })
    console.log('📁 Storage bucket aangemaakt\n')
  }

  const TEMPLATES = ['social', 'feature', 'infographic']
  let totalGenerated = 0
  let totalFailed = 0

  for (const product of products) {
    const config = PRODUCT_FEATURES[product.slug] || {
      features: 'Premium kwaliteit|Gratis verzending vanaf €35|30 dagen retour',
      badge: 'Bestseller',
    }

    console.log(`\n🔍 ${product.name}`)
    console.log(`   Badge: ${config.badge}`)
    console.log(`   Features: ${config.features.split('|').join(', ')}`)

    const generatedUrls = []

    for (const template of TEMPLATES) {
      try {
        process.stdout.write(`   📸 ${template}... `)

        const imageData = await generateImage(product, template, config.features, config.badge)
        const publicUrl = await uploadToStorage(supabase, product.slug, template, imageData)

        generatedUrls.push(publicUrl)
        totalGenerated++
        console.log(`✅ (${(imageData.length / 1024).toFixed(0)}KB)`)
      } catch (err) {
        totalFailed++
        console.log(`❌ ${err.message}`)
      }

      await sleep(500) // Small delay between templates
    }

    // Update product images: generated first, then originals (no old generated)
    if (generatedUrls.length > 0) {
      const originalImages = (product.images || []).filter(
        img => !img.includes(BUCKET_NAME)
      )

      // Order: social first (hero), then feature, then infographic, then original photos
      const newImages = [...generatedUrls, ...originalImages]

      const { error } = await supabase
        .from('products')
        .update({ images: newImages })
        .eq('id', product.id)

      if (error) {
        console.log(`   ❌ DB update mislukt: ${error.message}`)
      } else {
        console.log(`   💾 ${newImages.length} fotos opgeslagen (${generatedUrls.length} gegenereerd + ${originalImages.length} origineel)`)
      }
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 RESULTAAT')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅ Gegenereerd: ${totalGenerated} afbeeldingen`)
  console.log(`❌ Mislukt: ${totalFailed}`)
  console.log(`📦 Producten: ${products.length}`)
  console.log(`🎨 Templates per product: ${TEMPLATES.length} (${TEMPLATES.join(', ')})`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main().catch(console.error)
