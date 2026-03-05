/**
 * Fix Product PIDs & Images — PawsNL
 *
 * Updates the 15 broken products with correct CJ PIDs and fetches
 * their real product images from the CJ API.
 *
 * For 11 products we have confirmed PIDs from web research.
 * For 4 remaining products, we try the CJ API search as fallback.
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)

const CJ_API_KEY = 'CJ5198246@api@dfff508709394ed5a6078a3534e23dad'
const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0'
const sleep = ms => new Promise(r => setTimeout(r, ms))

let token = null
let tokenTime = 0

async function getToken() {
  // Cache token for 5 minutes to avoid rate limits
  if (token && Date.now() - tokenTime < 5 * 60 * 1000) return token

  console.log('⏳ Getting CJ API token...')
  const res = await fetch(`${CJ_BASE}/v1/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: CJ_API_KEY }),
  })
  const data = await res.json()
  if (!data.result) {
    if (data.message?.includes('Too Many Requests')) {
      console.log('   Rate limit, waiting 60s...')
      await sleep(60000)
      return getToken()
    }
    throw new Error(`Auth failed: ${data.message}`)
  }
  token = data.data.accessToken
  tokenTime = Date.now()
  console.log('✅ Token OK\n')
  return token
}

/**
 * Fetch product details from CJ API by PID
 * Returns { name, images } or null
 */
async function fetchCJProduct(pid) {
  const tk = await getToken()
  const res = await fetch(`${CJ_BASE}/v1/product/query?pid=${pid}`, {
    headers: { 'CJ-Access-Token': tk },
  })
  const data = await res.json()

  if (data.result && data.data) {
    const p = data.data
    const images = []

    // Main product image
    if (p.productImage) {
      images.push(p.productImage)
    }

    // Additional images from productImageSet
    if (p.productImageSet && Array.isArray(p.productImageSet)) {
      for (const img of p.productImageSet) {
        if (img && !images.includes(img)) {
          images.push(img)
        }
      }
    }

    return {
      name: p.productNameEn || p.productName || 'Unknown',
      images,
      category: p.categoryName || 'unknown',
    }
  }
  return null
}

/**
 * Search CJ API for a product by name
 * Returns best match { pid, name, images } or null
 */
async function searchCJProduct(searchTerm) {
  const tk = await getToken()
  const url = `${CJ_BASE}/v1/product/list?productNameEn=${encodeURIComponent(searchTerm)}&pageNum=1&pageSize=10`
  const res = await fetch(url, {
    headers: { 'CJ-Access-Token': tk },
  })
  const data = await res.json()

  if (data.result && data.data?.list?.length > 0) {
    return data.data.list.map(p => ({
      pid: p.pid,
      name: p.productNameEn || p.productName || 'Unknown',
      images: [
        p.productImage,
        ...(p.productImageSet || [])
      ].filter(Boolean),
    }))
  }
  return []
}

// ══════════════════════════════════════════════════════════════
// MAPPING: Product slug → Correct CJ PID (found via web research)
// ══════════════════════════════════════════════════════════════
const CONFIRMED_PIDS = {
  'anti-trek-hondentuigje-ontspannen-wandelen': '1395687229984215040',
  'draagbare-honden-waterfles-drinken-onderweg': '2504100230321610200',
  'automatische-kattenlaser-eindeloos-speelplezier': '1399609489891659776',
  'slangen-speeltje-interactief-automatisch': '1439049742062587904',
  'stoom-verzorgingsborstel-glanzende-vacht-in-minuten': '1734496117636734976',
  'led-halsband-usb-zichtbaar-tot-500m-in-het-donker': '7BFA65D8-41B6-4316-A7F4-2EB2A34CA257',
  'stille-kattenfontein-altijd-vers-gefilterd-water': '1651788214971146240',
  'zelfreinigende-kattenborstel-minder-haaruitval': '1561538210651066368',
  'honden-badjas-snel-droog-na-het-bad': '1463810602089713664',
  'koelvest-voor-honden-verkoeling-op-warme-dagen': '1539929588468559872',
  'kattenrugzak-met-kijkvenster-veilig-comfortabel-op-pad': '1477560173949227008',
}

// Products that need CJ API search (no confirmed PID found)
const NEEDS_SEARCH = {
  'waterdichte-hondenjas-droog-bij-elk-weer': [
    'waterproof dog raincoat',
    'dog rain jacket',
    'pet raincoat waterproof',
  ],
  'kattentunnel-3-weg-verstoppen-rennen-spelen': [
    'cat tunnel 3 way',
    'cat play tunnel collapsible',
    'pet tunnel tube',
  ],
  'rups-speeltje-onvoorspelbaar-verslavend-voor-katten': [
    'caterpillar cat toy',
    'worm cat toy interactive',
    'whack a worm cat toy',
  ],
  'elektrische-kattenmassage-pure-ontspanning': [
    'electric pet massager cat',
    'cat head massager electric',
    'pet massager handheld',
  ],
}

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔧 PawsNL — Fix Product PIDs & Images')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  await getToken()

  // Get all broken products from DB
  const { data: products } = await supabase
    .from('products')
    .select('id, name, slug, images, cj_pid, category')

  const brokenProducts = products.filter(p => {
    return Object.keys(CONFIRMED_PIDS).includes(p.slug) ||
           Object.keys(NEEDS_SEARCH).includes(p.slug)
  })

  console.log(`📦 ${brokenProducts.length} producten moeten gefixt worden\n`)

  let fixed = 0
  let failed = 0
  let searchFixed = 0

  // ════════════════════════════════════════════════════════
  // PHASE 1: Fix products with confirmed PIDs
  // ════════════════════════════════════════════════════════
  console.log('═══ FASE 1: Producten met bevestigde PIDs ═══\n')

  for (const product of brokenProducts) {
    const newPid = CONFIRMED_PIDS[product.slug]
    if (!newPid) continue

    console.log(`🔍 ${product.name}`)
    console.log(`   Oud PID: ${product.cj_pid}`)
    console.log(`   Nieuw PID: ${newPid}`)

    try {
      const cjProduct = await fetchCJProduct(newPid)
      await sleep(1200) // Rate limit

      if (!cjProduct) {
        console.log(`   ❌ CJ product niet gevonden voor PID ${newPid}`)
        failed++
        continue
      }

      console.log(`   CJ Product: "${cjProduct.name.substring(0, 60)}"`)
      console.log(`   📸 ${cjProduct.images.length} foto's gevonden`)

      if (cjProduct.images.length === 0) {
        console.log(`   ❌ Geen foto's beschikbaar`)
        failed++
        continue
      }

      // Keep any Supabase Storage generated images (from Foto Studio)
      const generatedImages = (product.images || []).filter(i =>
        i.includes('product-images') || i.includes('supabase')
      )

      // New images: CJ images first, then any generated ones
      const newImages = [...cjProduct.images, ...generatedImages]

      // Update database
      const { error } = await supabase
        .from('products')
        .update({
          cj_pid: newPid,
          images: newImages
        })
        .eq('id', product.id)

      if (error) {
        console.log(`   ❌ DB Error: ${error.message}`)
        failed++
      } else {
        console.log(`   ✅ GEFIXT! ${newImages.length} foto's (${cjProduct.images.length} CJ + ${generatedImages.length} studio)`)
        fixed++
      }
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`)
      failed++
    }

    console.log('')
  }

  // ════════════════════════════════════════════════════════
  // PHASE 2: Try CJ API search for remaining products
  // ════════════════════════════════════════════════════════
  console.log('\n═══ FASE 2: CJ API Zoeken voor overige producten ═══\n')

  for (const product of brokenProducts) {
    const searchTerms = NEEDS_SEARCH[product.slug]
    if (!searchTerms) continue

    console.log(`🔍 ${product.name}`)
    console.log(`   Zoektermen: ${searchTerms.join(', ')}`)

    let bestMatch = null

    for (const term of searchTerms) {
      try {
        const results = await searchCJProduct(term)
        await sleep(1200) // Rate limit

        if (results.length > 0) {
          console.log(`   Zoekresultaten voor "${term}":`)
          for (const r of results.slice(0, 3)) {
            console.log(`     → PID: ${r.pid} | "${r.name.substring(0, 50)}" | ${r.images.length} imgs`)
          }

          // Pick best match: product with images and reasonable name
          if (!bestMatch) {
            bestMatch = results[0]
          }
        } else {
          console.log(`   Geen resultaten voor "${term}"`)
        }
      } catch (err) {
        console.log(`   Error bij "${term}": ${err.message}`)
      }
    }

    if (bestMatch) {
      console.log(`\n   📌 Beste match: PID ${bestMatch.pid} | "${bestMatch.name.substring(0, 60)}"`)

      // Fetch full product details for more images
      try {
        const fullProduct = await fetchCJProduct(bestMatch.pid)
        await sleep(1200)

        if (fullProduct && fullProduct.images.length > 0) {
          const generatedImages = (product.images || []).filter(i =>
            i.includes('product-images') || i.includes('supabase')
          )

          const newImages = [...fullProduct.images, ...generatedImages]

          const { error } = await supabase
            .from('products')
            .update({
              cj_pid: bestMatch.pid,
              images: newImages
            })
            .eq('id', product.id)

          if (error) {
            console.log(`   ❌ DB Error: ${error.message}`)
            failed++
          } else {
            console.log(`   ✅ GEFIXT via zoeken! ${newImages.length} foto's`)
            searchFixed++
            fixed++
          }
        } else {
          console.log(`   ❌ Geen foto's voor deze match`)
          failed++
        }
      } catch (err) {
        console.log(`   ❌ Error: ${err.message}`)
        failed++
      }
    } else {
      console.log(`   ❌ Geen bruikbare match gevonden via CJ API`)
      console.log(`   💡 Dit product heeft de Foto Studio afbeeldingen als fallback`)
      failed++
    }

    console.log('')
  }

  // ════════════════════════════════════════════════════════
  // SUMMARY
  // ════════════════════════════════════════════════════════
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 SAMENVATTING')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅ Gefixt met bevestigde PID: ${fixed - searchFixed}`)
  console.log(`🔍 Gefixt via CJ zoeken: ${searchFixed}`)
  console.log(`❌ Niet gefixt: ${failed}`)
  console.log(`📦 Totaal verwerkt: ${fixed + failed}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main().catch(console.error)
