/**
 * Fix ALL product images v2 — Slimmer zoeken + validatie
 *
 * Verbeteringen t.o.v. v1:
 * 1. Meerdere zoektermen per product (kort → lang)
 * 2. Haalt 20 resultaten op i.p.v. 3
 * 3. Scoort resultaten op naam-overlap
 * 4. Update ALLEEN als er een goede match is
 * 5. Probeert ook product detail endpoint voor bestaande PIDs
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)

const CJ_API_KEY = 'CJ5198246@api@dfff508709394ed5a6078a3534e23dad'
const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0'

let cachedToken = null

async function getCJToken() {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.token

  console.log('⏳ Authenticatie bij CJ...')
  let attempts = 0
  while (attempts < 3) {
    const res = await fetch(`${CJ_BASE}/v1/authentication/getAccessToken`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: CJ_API_KEY }),
    })
    const data = await res.json()

    if (data.result && data.data?.accessToken) {
      cachedToken = { token: data.data.accessToken, expiresAt: Date.now() + 3600000 }
      console.log('🔑 CJ token OK\n')
      return cachedToken.token
    }

    if (data.message?.includes('Too Many Requests')) {
      attempts++
      console.log(`   Rate limit, wachten 60s... (poging ${attempts}/3)`)
      await sleep(60000)
    } else {
      throw new Error(`CJ auth mislukt: ${data.message}`)
    }
  }
  throw new Error('CJ auth rate limit na 3 pogingen')
}

async function searchCJ(keyword, pageSize = 20) {
  const token = await getCJToken()
  const res = await fetch(
    `${CJ_BASE}/v1/product/list?productNameEn=${encodeURIComponent(keyword)}&pageNum=1&pageSize=${pageSize}`,
    { headers: { 'CJ-Access-Token': token } }
  )
  const data = await res.json()
  if (!data.result || !data.data?.list?.length) return []
  return data.data.list
}

async function getProductDetail(pid) {
  const token = await getCJToken()
  const res = await fetch(`${CJ_BASE}/v1/product/query?pid=${pid}`, {
    headers: { 'CJ-Access-Token': token }
  })
  const data = await res.json()
  if (!data.result || !data.data) return null
  return data.data
}

function extractImages(product) {
  const images = [product.productImage, ...(product.productImageSet ?? [])].filter(Boolean)
  return [...new Set(images)].slice(0, 6)
}

/**
 * Score hoe goed een CJ product matcht met onze zoektermen.
 * Hoe hoger, hoe beter.
 */
function scoreMatch(cjProduct, mustHaveWords, niceToHaveWords, badWords) {
  const name = (cjProduct.productNameEn || cjProduct.productName || '').toLowerCase()
  let score = 0

  // Must-have words: +10 each
  for (const word of mustHaveWords) {
    if (name.includes(word.toLowerCase())) score += 10
    else score -= 5 // penalty for missing must-have
  }

  // Nice-to-have words: +3 each
  for (const word of niceToHaveWords) {
    if (name.includes(word.toLowerCase())) score += 3
  }

  // Bad words: -20 each (disqualify wrong products)
  for (const word of badWords) {
    if (name.includes(word.toLowerCase())) score -= 20
  }

  // Bonus for having multiple images
  const imgCount = extractImages(cjProduct).length
  score += Math.min(imgCount, 5)

  return score
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

// ─── Product zoekstrategieën ───────────────────────────────────────────────
// Elke product heeft:
// - searches: array van zoektermen (korter → breder)
// - mustHave: woorden die in het resultaat MOETEN staan
// - niceToHave: bonuswoorden
// - badWords: woorden die het resultaat diskwalificeren
const PRODUCT_CONFIGS = {
  'anti-trek-hondentuig': {
    searches: ['dog harness', 'no pull harness', 'pet harness adjustable'],
    mustHave: ['harness'],
    niceToHave: ['dog', 'pull', 'adjustable', 'vest'],
    badWords: ['vitamin', 'tablet', 'food', 'treat', 'shirt', 'dress', 'clothes'],
  },
  'draagbare-honden-waterfles': {
    searches: ['dog water bottle', 'pet water bottle portable', 'dog drinking bottle'],
    mustHave: ['water', 'bottle'],
    niceToHave: ['dog', 'pet', 'portable', 'outdoor', 'drinking'],
    badWords: ['vitamin', 'tablet', 'food', 'treat', 'shirt'],
  },
  'honden-badjas': {
    searches: ['dog bathrobe', 'pet bathrobe', 'dog towel robe', 'dog drying coat'],
    mustHave: ['dog'],
    niceToHave: ['bathrobe', 'robe', 'towel', 'dry', 'bath', 'microfiber'],
    badWords: ['vitamin', 'tablet', 'food', 'treat', 'shirt', 'dress'],
  },
  'koelvest-voor-honden': {
    searches: ['dog cooling vest', 'pet cooling jacket', 'dog cool coat'],
    mustHave: ['cool'],
    niceToHave: ['dog', 'vest', 'jacket', 'summer', 'pet'],
    badWords: ['vitamin', 'tablet', 'food', 'treat', 'shirt', 'dress'],
  },
  'led-halsband': {
    searches: ['LED dog collar', 'light up dog collar', 'glow dog collar USB'],
    mustHave: ['collar'],
    niceToHave: ['led', 'light', 'glow', 'dog', 'usb', 'rechargeable'],
    badWords: ['vitamin', 'tablet', 'food', 'treat', 'shirt'],
  },
  'waterdichte-hondenjas': {
    searches: ['dog raincoat', 'waterproof dog jacket', 'dog rain jacket'],
    mustHave: ['dog'],
    niceToHave: ['raincoat', 'waterproof', 'jacket', 'rain', 'coat'],
    badWords: ['vitamin', 'tablet', 'food', 'treat', 'dress', 'skirt'],
  },
  'automatische-kattenlaser': {
    searches: ['cat laser toy', 'automatic cat laser', 'cat laser pointer'],
    mustHave: ['laser'],
    niceToHave: ['cat', 'automatic', 'toy', 'rotating', 'interactive'],
    badWords: ['vitamin', 'food', 'treat', 'shirt', 'clothes', 'flutter'],
  },
  'elektrische-kattenmassage': {
    searches: ['cat massager', 'pet massager electric', 'cat massage roller'],
    mustHave: ['massag'],
    niceToHave: ['cat', 'pet', 'electric', 'roller'],
    badWords: ['vitamin', 'food', 'treat', 'shirt', 'clothes', 'flutter'],
  },
  'kattenrugzak-met-kijkvenster': {
    searches: ['cat backpack', 'cat carrier backpack', 'pet backpack bubble'],
    mustHave: ['backpack'],
    niceToHave: ['cat', 'carrier', 'bubble', 'window', 'pet', 'transparent'],
    badWords: ['vitamin', 'food', 'treat', 'shirt', 'clothes', 'flutter'],
  },
  'kattentunnel-3-weg': {
    searches: ['cat tunnel', 'cat play tunnel', 'pet tunnel collapsible'],
    mustHave: ['tunnel'],
    niceToHave: ['cat', '3', 'way', 'collapsible', 'play', 'foldable'],
    badWords: ['vitamin', 'food', 'treat', 'shirt', 'clothes', 'flutter'],
  },
  'rups-speeltje': {
    searches: ['caterpillar cat toy', 'worm cat toy', 'caterpillar pet toy'],
    mustHave: ['toy'],
    niceToHave: ['caterpillar', 'worm', 'cat', 'interactive', 'plush'],
    badWords: ['vitamin', 'food', 'treat', 'shirt', 'clothes', 'flutter', 'dog'],
  },
  'slangen-speeltje': {
    searches: ['snake cat toy', 'snake toy interactive', 'moving snake toy pet'],
    mustHave: ['snake'],
    niceToHave: ['cat', 'toy', 'interactive', 'automatic', 'moving', 'electric'],
    badWords: ['vitamin', 'food', 'treat', 'shirt', 'clothes', 'flutter'],
  },
  'stille-kattenfontein': {
    searches: ['cat water fountain', 'pet water fountain', 'cat drinking fountain'],
    mustHave: ['fountain'],
    niceToHave: ['cat', 'water', 'pet', 'quiet', 'filter', 'drinking', 'automatic'],
    badWords: ['vitamin', 'food', 'treat', 'shirt', 'clothes', 'flutter'],
  },
  'stoom-verzorgingsborstel': {
    searches: ['pet steam brush', 'steam grooming brush', 'cat steam brush'],
    mustHave: ['brush'],
    niceToHave: ['steam', 'pet', 'grooming', 'cat', 'dog', 'hair'],
    badWords: ['vitamin', 'food', 'treat', 'shirt', 'clothes', 'flutter', 'tooth'],
  },
  'zelfreinigende-kattenborstel': {
    searches: ['self cleaning cat brush', 'cat slicker brush', 'self clean pet brush'],
    mustHave: ['brush'],
    niceToHave: ['self', 'clean', 'cat', 'slicker', 'pet', 'hair', 'grooming'],
    badWords: ['vitamin', 'food', 'treat', 'shirt', 'clothes', 'flutter', 'tooth', 'steam'],
  },
  'tandenborstel-kauwspeeltje': {
    searches: ['dog toothbrush toy', 'dog dental chew toy', 'dog teeth cleaning toy'],
    mustHave: ['dog'],
    niceToHave: ['toothbrush', 'dental', 'teeth', 'chew', 'toy', 'cleaning', 'stick'],
    badWords: ['vitamin', 'food', 'treat', 'shirt', 'clothes', 'herbal', 'vitality'],
  },
}

async function findBestMatch(slug, config) {
  let bestProduct = null
  let bestScore = -999

  for (const term of config.searches) {
    console.log(`     Zoeken: "${term}"`)
    const results = await searchCJ(term, 20)

    if (results.length === 0) {
      console.log(`     → Geen resultaten`)
      await sleep(500)
      continue
    }

    console.log(`     → ${results.length} resultaten`)

    for (const p of results) {
      const score = scoreMatch(p, config.mustHave, config.niceToHave, config.badWords)
      const name = (p.productNameEn || p.productName || '').substring(0, 50)
      const imgCount = extractImages(p).length

      if (score > bestScore && imgCount >= 2) {
        bestScore = score
        bestProduct = p
        console.log(`     🏆 Beste match (score ${score}): "${name}" [${imgCount} fotos]`)
      }
    }

    await sleep(600)

    // Stop searching if we have a very good match
    if (bestScore >= 20) break
  }

  return bestScore >= 5 ? bestProduct : null
}

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🖼️  PawsNL — Slim product matching v2')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // Test auth first
  await getCJToken()

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, images, cj_pid, cj_vid, category')
    .order('name')

  if (error) { console.error('❌', error.message); process.exit(1) }
  console.log(`📦 ${products.length} producten\n`)

  // Detecteer dubbele PIDs
  const pidCount = {}
  for (const p of products) {
    if (p.cj_pid) pidCount[p.cj_pid] = (pidCount[p.cj_pid] || 0) + 1
  }
  const duplicatePids = Object.entries(pidCount).filter(([, c]) => c > 1).map(([pid]) => pid)

  // Also track products with only 1 image (might have been corrupted)
  const lowImageProducts = products.filter(p => (p.images?.length || 0) <= 1)

  console.log(`⚠️ ${duplicatePids.length} PIDs worden gedeeld door meerdere producten`)
  console.log(`⚠️ ${lowImageProducts.length} producten hebben ≤1 afbeelding\n`)

  // Products that need fixing: duplicate PIDs OR only 1 image
  const needsFix = products.filter(p =>
    duplicatePids.includes(p.cj_pid) || (p.images?.length || 0) <= 1
  )

  console.log(`🔧 ${needsFix.length} producten moeten gefixt worden\n`)

  let fixed = 0, failed = 0, skipped = 0

  for (const product of needsFix) {
    // Zoek config
    let config = null
    let matchedSlug = null
    for (const [slugPart, cfg] of Object.entries(PRODUCT_CONFIGS)) {
      if (product.slug.includes(slugPart)) {
        config = cfg
        matchedSlug = slugPart
        break
      }
    }

    if (!config) {
      console.log(`⏩ ${product.name} — geen zoekconfig, overslaan`)
      skipped++
      continue
    }

    console.log(`\n🔍 ${product.name}`)
    console.log(`   Slug: ${product.slug}`)
    console.log(`   Huidige images: ${product.images?.length || 0}`)

    try {
      const bestMatch = await findBestMatch(matchedSlug, config)

      if (!bestMatch) {
        console.log(`   ❌ Geen goede match gevonden\n`)
        failed++
        continue
      }

      const images = extractImages(bestMatch)
      const matchName = (bestMatch.productNameEn || bestMatch.productName || '').substring(0, 60)

      console.log(`   ✅ Match: "${matchName}"`)
      console.log(`   PID: ${bestMatch.pid} | ${images.length} foto's`)

      // Update database
      const updateData = {
        images: images,
        cj_pid: bestMatch.pid,
      }
      if (bestMatch.variants?.[0]?.vid) {
        updateData.cj_vid = bestMatch.variants[0].vid
      }

      const { error: updateError } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', product.id)

      if (updateError) {
        console.log(`   ❌ Update mislukt: ${updateError.message}`)
        failed++
      } else {
        console.log(`   ✅ Product geüpdatet!`)
        fixed++
      }

      await sleep(800)
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`)
      failed++
      await sleep(300)
    }
  }

  // Also check products with unique PIDs but ≤1 image — try to get more images
  const uniqueLowImg = products.filter(p =>
    !duplicatePids.includes(p.cj_pid) &&
    (p.images?.length || 0) <= 1 &&
    p.cj_pid
  )

  if (uniqueLowImg.length > 0) {
    console.log(`\n\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
    console.log(`📸 ${uniqueLowImg.length} producten met unieke PID maar weinig fotos`)
    console.log(`   Ophalen van extra fotos via product detail...\n`)

    for (const product of uniqueLowImg) {
      console.log(`🔍 ${product.name} (PID: ${product.cj_pid})`)
      try {
        const detail = await getProductDetail(product.cj_pid)
        if (detail) {
          const images = extractImages(detail)
          if (images.length > (product.images?.length || 0)) {
            const { error: updateError } = await supabase
              .from('products')
              .update({ images })
              .eq('id', product.id)
            if (!updateError) {
              console.log(`   ✅ ${images.length} fotos opgehaald`)
              fixed++
            } else {
              console.log(`   ❌ Update mislukt: ${updateError.message}`)
              failed++
            }
          } else {
            console.log(`   ℹ️ Niet meer fotos beschikbaar (${images.length})`)
            skipped++
          }
        } else {
          console.log(`   ❌ Product niet gevonden op CJ`)
          failed++
        }
        await sleep(500)
      } catch (err) {
        console.log(`   ❌ Error: ${err.message}`)
        failed++
      }
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅ Gefixt: ${fixed}`)
  console.log(`⏩ Overgeslagen: ${skipped}`)
  console.log(`❌ Mislukt: ${failed}`)
  console.log(`📦 Totaal verwerkt: ${needsFix.length + (uniqueLowImg?.length || 0)}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  if (fixed > 0) console.log('🎉 Refresh je website!')
  else console.log('💡 Geen producten geüpdatet')
}

main().catch(console.error)
