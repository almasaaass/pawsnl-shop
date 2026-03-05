/**
 * Generate professional images for the 10 products that don't have them yet.
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)

const BASE_URL = 'http://localhost:3000'
const BUCKET_NAME = 'product-images'
const sleep = ms => new Promise(r => setTimeout(r, ms))

// Product-specific features for the remaining 10 products
const FEATURES = {
  'anti-mors-drinkbak-geen-waterplassen-meer-op-de-vloer': {
    features: 'Drijvende schijf voorkomt morsen|Geschikt voor alle honden|BPA-vrij materiaal|Makkelijk schoon te maken',
    badge: 'Slim design',
  },
  'bewegende-vis-kattenspeeltje-realistisch-en-onweerstaanbaar': {
    features: 'Levensechte visbewegingen|USB oplaadbaar|Catnip zakje inbegrepen|Stimuleert jachtinstinct',
    badge: 'Kat favoriet',
  },
  'herbruikbare-haarverwijder-roller-zonder-plakband-nodig': {
    features: 'Oneindig herbruikbaar|Geen plakband nodig|Werkt op alle stoffen|Makkelijk te reinigen',
    badge: 'Bestseller',
  },
  'kalmerende-donut-hondenmand-anti-angst-en-super-zacht': {
    features: 'Anti-angst donut design|Super zacht pluche materiaal|Wasbaar in wasmachine|Orthopaedisch comfort',
    badge: 'Comfort',
  },
  'katten-vleermuisvleugels-grappig-kostuum': {
    features: 'Grappig Halloween kostuum|Verstelbare klittenband|Lichtgewicht & comfortabel|Perfect voor fotoshoots',
    badge: 'Fun!',
  },
  'pootjesreiniger-beker-schone-poten-in-seconden': {
    features: 'Zachte siliconen borstels|Schone poten in 30 sec|Draagbaar voor onderweg|BPA-vrij materiaal',
    badge: 'Praktisch',
  },
  'raamhangmat-voor-katten-het-beste-uitzicht': {
    features: 'Draagkracht tot 15kg|4 sterke zuignappen|Ademend mesh materiaal|Makkelijke installatie',
    badge: 'Populair',
  },
  'siliconen-likmat-met-zuignap-anti-stress-voor-je-huisdier': {
    features: 'Vermindert stress & angst|Sterke zuignap bevestiging|Vaatwasser bestendig|BPA-vrij siliconen',
    badge: 'Anti-stress',
  },
  'snuffelmat-mentale-stimulatie-voor-je-hond': {
    features: 'Stimuleert zoekinstinct|Vertraagt eten — anti-schrok|Wasbaar in wasmachine|Geschikt voor alle rassen',
    badge: 'Slim spelen',
  },
  'vachthandschoen-borstelen-terwijl-je-aait': {
    features: 'Zacht siliconen materiaal|Verwijdert losse haren|Massage effect — ontspant|Geschikt voor hond & kat',
    badge: 'Must-have',
  },
}

function formatEur(n) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)
}

async function generateAndUpload(product, template, features, badge) {
  // Find source image (non-generated)
  const sourceImage = (product.images || []).find(img => !img.includes(BUCKET_NAME)) || ''

  const params = new URLSearchParams({
    template,
    name: product.name,
    price: formatEur(product.price),
    image: sourceImage,
    category: product.category || 'honden',
    features,
    badge,
  })

  if (product.compare_price) {
    params.set('comparePrice', formatEur(product.compare_price))
    if (product.compare_price > product.price) {
      params.set('discount', String(Math.round(((product.compare_price - product.price) / product.compare_price) * 100)))
    }
  }

  const url = `${BASE_URL}/api/admin/generate-image?${params.toString()}`
  const res = await fetch(url, { signal: AbortSignal.timeout(20000) })

  if (!res.ok) throw new Error(`Status ${res.status}`)

  const imageData = new Uint8Array(await res.arrayBuffer())

  // Upload to storage
  const filePath = `${product.slug}/${template}.png`
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(filePath, imageData, { contentType: 'image/png', upsert: true })

  if (error) throw new Error(error.message)

  const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath)
  return publicUrl
}

async function main() {
  console.log('🎨 Generating images for remaining 10 products...\n')

  const { data: products } = await supabase.from('products').select('*').order('name')

  // Filter: only products without generated images
  const remaining = products.filter(p =>
    !(p.images || []).some(img => img.includes(BUCKET_NAME))
  )

  console.log(`📦 ${remaining.length} producten zonder gegenereerde afbeeldingen\n`)

  const TEMPLATES = ['social', 'feature']
  let success = 0

  for (const product of remaining) {
    const config = FEATURES[product.slug] || {
      features: 'Premium kwaliteit|Gratis verzending vanaf €35|30 dagen retour',
      badge: 'Bestseller',
    }

    console.log(`🔍 ${product.name}`)
    const generatedUrls = []

    for (const template of TEMPLATES) {
      try {
        process.stdout.write(`   📸 ${template}... `)
        const publicUrl = await generateAndUpload(product, template, config.features, config.badge)
        generatedUrls.push(publicUrl)
        console.log('✅')
      } catch (err) {
        console.log(`❌ ${err.message}`)
      }
      await sleep(1000)
    }

    if (generatedUrls.length > 0) {
      const originalImages = (product.images || []).filter(img => !img.includes(BUCKET_NAME))
      const newImages = [...generatedUrls, ...originalImages]

      await supabase.from('products').update({ images: newImages }).eq('id', product.id)
      console.log(`   💾 ${newImages.length} fotos (${generatedUrls.length} new + ${originalImages.length} original)`)
      success++
    }
    console.log('')
  }

  console.log(`\n✅ ${success}/${remaining.length} producten bijgewerkt`)
}

main().catch(console.error)
