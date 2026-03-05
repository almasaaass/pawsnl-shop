/**
 * Retry infographic generation for products that failed.
 * Uses longer timeout (30s) for the larger 1080x1350 template.
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)

const BASE_URL = 'http://localhost:3000'
const BUCKET_NAME = 'product-images'
const sleep = ms => new Promise(r => setTimeout(r, ms))

const CJ_CDN_HOSTS = ['cc-west-usa.oss-us-west-1.aliyuncs.com', 'cbu01.alicdn.com', 'cf.cjdropshipping.com', 'img.cjdropshipping.com', 'oss-cf.cjdropshipping.com']

function getProxyUrl(imageUrl) {
  if (!imageUrl) return ''
  try {
    const parsed = new URL(imageUrl)
    if (CJ_CDN_HOSTS.some(h => parsed.hostname === h)) return `${BASE_URL}/api/image-proxy?url=${encodeURIComponent(imageUrl)}`
    return imageUrl
  } catch { return imageUrl }
}

function formatEur(n) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)
}

const PRODUCT_FEATURES = {
  'anti-trek-hondentuigje-ontspannen-wandelen': { features: 'Anti-trek design met borstclip|Reflecterend & ademend materiaal|Verstelbaar in 4 punten|Geschikt voor alle hondenrassen', badge: 'Bestseller' },
  'draagbare-honden-waterfles-drinken-onderweg': { features: '2-in-1: drinkfles + bakje|Lekvrij ontwerp|BPA-vrij materiaal|Ideaal voor wandelingen & reizen', badge: 'Populair' },
  'honden-badjas-snel-droog-na-het-bad': { features: 'Super absorberend microvezel|Droogt 3x sneller dan handdoek|Dubbelzijdige zakken|Ophanglus voor opslag', badge: 'NIEUW' },
  'koelvest-voor-honden-verkoeling-op-warme-dagen': { features: 'Koelt tot 3 uur lang|Ademend & lichtgewicht|Reflecterende strepen|Beschermt tegen oververhitting', badge: 'Zomer hit' },
  'led-halsband-usb-zichtbaar-tot-500m-in-het-donker': { features: 'Zichtbaar tot 500 meter|3 lichtmodi: continu & knipperend|USB oplaadbaar|Waterbestendig IP65', badge: 'Veiligheid #1' },
  'hands-free-hondenriem-perfect-voor-hardlopers': { features: 'Handen vrij wandelen & joggen|Schokdempend elastisch design|Verstelbare heupband|Reflecterende stiksels', badge: 'Bestseller' },
  'stille-nagelvijl-stressvrij-nagels-knippen': { features: 'Fluisterstil — geen stress|2 snelheden & 3 slijpkoppen|USB oplaadbaar|Veilig voor alle dieren', badge: 'Diervriendelijk' },
  'waterdichte-hondenjas-droog-bij-elk-weer': { features: 'Waterdicht buitenmateriaal|Reflecterende strepen|Verstelbaar met klittenband|Lichtgewicht & comfortabel', badge: 'Weer & wind' },
  'stoom-verzorgingsborstel-glanzende-vacht-in-minuten': { features: '3-in-1: stoom + borstel + massage|Vermindert haaruitval 90%|USB oplaadbaar|Geschikt voor hond & kat', badge: 'Top product' },
  'automatische-kattenlaser-eindeloos-speelplezier': { features: 'Automatisch draaiend laserpatroon|5 instelbare snelheden|Stimuleert jachtinstinct|USB oplaadbaar', badge: 'Kat favoriet' },
  'slangen-speeltje-interactief-automatisch': { features: 'Levensechte slangbewegingen|Smart sensor activatie|USB oplaadbaar|Stimuleert natuurlijk jachtinstinct', badge: 'Interactief' },
  'kattenrugzak-met-kijkvenster-veilig-comfortabel-op-pad': { features: 'Transparant kijkvenster|Ademende mesh ventilatie|Draagbaar tot 6kg|Airline goedgekeurd', badge: 'Avontuur' },
  'stille-kattenfontein-altijd-vers-gefilterd-water': { features: 'Fluisterstille waterpomp|3-laags koolstoffilter|2L capaciteit|Stimuleert meer drinken', badge: 'Gezondheid' },
  'zelfreinigende-kattenborstel-minder-haaruitval': { features: 'Zelfreinigende borstel — 1 klik|Vermindert haaruitval 95%|Zachte ronde pennen|Geschikt voor alle vachttypes', badge: 'Bestseller' },
  'kattentunnel-3-weg-verstoppen-rennen-spelen': { features: 'Opvouwbaar 3-weg ontwerp|Kraakgeluid & speelballetje|Scheurbestendig polyester|Compact op te bergen', badge: 'Speelplezier' },
  'rups-speeltje-onvoorspelbaar-verslavend-voor-katten': { features: 'Smart motion sensor activatie|Onvoorspelbare rups bewegingen|USB oplaadbaar — 2+ uur spelen|Sterke zuignap bevestiging', badge: 'NIEUW' },
  'elektrische-kattenmassage-pure-ontspanning': { features: '4 roterende massagekoppen|Vermindert stress & angst|Draadloos & oplaadbaar|Geschikt voor kat & hond', badge: 'Wellness' },
}

async function main() {
  console.log('🎨 Infographic templates genereren (1080x1350)...\n')

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('name')

  // Filter: only products that DON'T already have an infographic
  const needsInfographic = products.filter(p => {
    return !(p.images || []).some(img => img.includes('/infographic.png'))
  })

  console.log(`📦 ${needsInfographic.length} producten hebben nog geen infographic\n`)

  let success = 0

  for (const product of needsInfographic) {
    const config = PRODUCT_FEATURES[product.slug] || { features: 'Premium kwaliteit|Gratis verzending', badge: 'Bestseller' }

    // Find best source image (skip generated images)
    const sourceImage = (product.images || []).find(img => !img.includes(BUCKET_NAME)) || ''
    // Use direct CJ URL (not proxy) - edge runtime fetches it directly
    const proxyImage = sourceImage

    const params = new URLSearchParams({
      template: 'infographic',
      name: product.name,
      price: formatEur(product.price),
      image: proxyImage,
      category: product.category || 'honden',
      features: config.features,
      badge: config.badge,
    })

    if (product.compare_price) {
      params.set('comparePrice', formatEur(product.compare_price))
      if (product.compare_price > product.price) {
        params.set('discount', String(Math.round(((product.compare_price - product.price) / product.compare_price) * 100)))
      }
    }

    process.stdout.write(`📸 ${product.name.substring(0, 50)}... `)

    try {
      const res = await fetch(`${BASE_URL}/api/admin/generate-image?${params.toString()}`, {
        signal: AbortSignal.timeout(30000), // 30s timeout
      })

      if (!res.ok) {
        console.log(`❌ ${res.status}`)
        continue
      }

      const imageData = new Uint8Array(await res.arrayBuffer())

      // Upload to storage
      const filePath = `${product.slug}/infographic.png`
      await supabase.storage.from(BUCKET_NAME).upload(filePath, imageData, { contentType: 'image/png', upsert: true })

      const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)

      // Add infographic after feature template in images array
      const currentImages = product.images || []
      // Insert after existing generated images but before original images
      const generatedImages = currentImages.filter(img => img.includes(BUCKET_NAME))
      const originalImages = currentImages.filter(img => !img.includes(BUCKET_NAME))
      const newImages = [...generatedImages, publicUrl, ...originalImages]

      await supabase.from('products').update({ images: newImages }).eq('id', product.id)

      console.log(`✅ (${(imageData.length / 1024).toFixed(0)}KB)`)
      success++
    } catch (err) {
      console.log(`❌ ${err.message}`)
    }

    await sleep(3000) // Longer delay to let server recover
  }

  console.log(`\n✅ ${success}/${needsInfographic.length} infographics gegenereerd`)
}

main().catch(console.error)
