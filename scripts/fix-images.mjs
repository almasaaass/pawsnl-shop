/**
 * Fix ALL product images — zoekt het JUISTE CJ product per item
 * en update cj_pid + images.
 *
 * Het probleem: meerdere producten hadden dezelfde (verkeerde) CJ PID.
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
  const res = await fetch(`${CJ_BASE}/v1/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: CJ_API_KEY }),
  })
  const data = await res.json()
  if (!data.result) throw new Error(`CJ auth mislukt: ${data.message}`)
  cachedToken = { token: data.data.accessToken, expiresAt: Date.now() + 3600000 }
  console.log('🔑 CJ token OK\n')
  return cachedToken.token
}

async function searchCJ(keyword) {
  const token = await getCJToken()
  const res = await fetch(
    `${CJ_BASE}/v1/product/list?productNameEn=${encodeURIComponent(keyword)}&pageNum=1&pageSize=3`,
    { headers: { 'CJ-Access-Token': token } }
  )
  const data = await res.json()
  if (!data.result || !data.data?.list?.length) return null

  const p = data.data.list[0]
  const images = [p.productImage, ...(p.productImageSet ?? [])].filter(Boolean)
  const unique = [...new Set(images)]

  return {
    pid: p.pid,
    name: p.productNameEn ?? p.productName,
    images: unique.slice(0, 6),
    vid: p.variants?.[0]?.vid ?? null,
  }
}

// ─── Exacte zoektermen per product ──────────────────────────────────────────
// Elke key = product slug substring, value = CJ English search term
const PRODUCT_SEARCH_MAP = {
  'anti-schrok-voerbak': 'slow feeder dog bowl puzzle',
  'verkoelende-mat': 'pet cooling mat gel pad',
  'anti-trek-hondentuig': 'dog harness no pull adjustable',
  'automatische-kattenlaser': 'automatic rotating cat laser toy',
  'draagbare-honden-waterfles': 'portable dog water bottle outdoor',
  'elektrische-kattenmassage': 'electric cat massager roller',
  'hands-free-hondenriem': 'hands free dog leash running',
  'honden-badjas': 'dog bathrobe towel microfiber',
  'kattenrugzak-met-kijkvenster': 'cat carrier backpack bubble window',
  'kattentunnel-3-weg': 'cat tunnel 3 way collapsible',
  'koelvest-voor-honden': 'dog cooling vest summer',
  'led-halsband': 'LED dog collar USB rechargeable',
  'opvouwbare-reisbak': 'collapsible dog bowl travel silicone',
  'poten-reiniger': 'dog paw cleaner cup portable',
  'rups-speeltje': 'caterpillar cat toy interactive',
  'slangen-speeltje': 'snake cat toy automatic moving',
  'snuffelmat': 'dog snuffle mat nose work',
  'speeltunnel-voor-konijnen': 'rabbit tunnel toy hideout',
  'stille-kattenfontein': 'cat water fountain quiet filter',
  'stille-nagelvijl': 'pet nail grinder quiet electric',
  'stoom-verzorgingsborstel': 'pet steam brush grooming',
  'tandenborstel-kauwspeeltje': 'dog toothbrush chew toy stick',
  'vogel-trainingsset': 'bird training toy set parrot',
  'vogelbadje': 'bird bath bowl parrot',
  'vogelspeelgoed-set': 'bird toys set parrot cage 10pcs',
  'waterdichte-hondenjas': 'dog raincoat jacket waterproof',
  'zelfreinigende-kattenborstel': 'self cleaning cat brush slicker',
  'aluminium-koelmat': 'pet cooling plate aluminum hamster',
  'anti-krab-mat': 'anti scratch mat cat furniture protector',
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🖼️  PawsNL — Juiste CJ producten koppelen')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

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
  console.log(`⚠️ ${duplicatePids.length} PIDs worden gedeeld door meerdere producten:`)
  for (const pid of duplicatePids) {
    const names = products.filter(p => p.cj_pid === pid).map(p => p.name)
    console.log(`  PID ${pid}: ${names.join(', ')}`)
  }
  console.log('')

  let fixed = 0, failed = 0, skipped = 0

  for (const product of products) {
    const isDuplicate = duplicatePids.includes(product.cj_pid)

    // Zoek de juiste search term
    let searchTerm = null
    for (const [slugPart, term] of Object.entries(PRODUCT_SEARCH_MAP)) {
      if (product.slug.includes(slugPart)) {
        searchTerm = term
        break
      }
    }

    if (!searchTerm) {
      console.log(`⏩ ${product.name} — geen zoekterm gevonden, overslaan`)
      skipped++
      continue
    }

    // Sla over als PID uniek is (waarschijnlijk correct)
    if (!isDuplicate) {
      console.log(`✅ ${product.name} — unieke PID, waarschijnlijk correct`)
      skipped++
      continue
    }

    console.log(`🔍 ${product.name}`)
    console.log(`   Zoeken: "${searchTerm}"`)

    try {
      const result = await searchCJ(searchTerm)

      if (!result || result.images.length === 0) {
        console.log(`   ❌ Niets gevonden op CJ\n`)
        failed++
        await sleep(500)
        continue
      }

      console.log(`   ✅ Gevonden: "${result.name}" (${result.images.length} foto's)`)
      console.log(`   Nieuwe PID: ${result.pid}`)

      const updateData = {
        images: result.images,
        cj_pid: result.pid,
      }
      if (result.vid) updateData.cj_vid = result.vid

      const { error: updateError } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', product.id)

      if (updateError) {
        console.log(`   ❌ Update mislukt: ${updateError.message}\n`)
        failed++
      } else {
        console.log(`   ✅ Product geüpdatet!\n`)
        fixed++
      }

      await sleep(600)
    } catch (err) {
      console.log(`   ❌ Error: ${err.message}\n`)
      failed++
      await sleep(300)
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅ Gefixt: ${fixed}`)
  console.log(`⏩ Overgeslagen: ${skipped}`)
  console.log(`❌ Mislukt: ${failed}`)
  console.log(`📦 Totaal: ${products.length}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  if (fixed > 0) console.log('🎉 Refresh je website!')
}

main().catch(console.error)
