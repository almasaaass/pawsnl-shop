#!/usr/bin/env node

/**
 * Zoek de juiste CJ producten voor de 10 nieuw toegevoegde producten
 * en koppel de juiste foto's + PID/VID
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

for (const line of readFileSync(new URL('../.env.local', import.meta.url).pathname, 'utf8').split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/)
  if (m) process.env[m[1].trim()] = m[2].trim()
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0'

async function getToken() {
  const res = await fetch(`${CJ_BASE}/v1/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: process.env.CJ_API_KEY }),
  })
  const data = await res.json()
  if (!data.result) throw new Error(`CJ auth: ${data.message}`)
  return data.data.accessToken
}

async function search(token, keyword) {
  const res = await fetch(
    `${CJ_BASE}/v1/product/list?keyword=${encodeURIComponent(keyword)}&pageNum=1&pageSize=3`,
    { headers: { 'CJ-Access-Token': token } }
  )
  const data = await res.json()
  return data.data?.list ?? []
}

async function getDetail(token, pid) {
  const res = await fetch(`${CJ_BASE}/v1/product/query?pid=${pid}`, {
    headers: { 'CJ-Access-Token': token },
  })
  const data = await res.json()
  return data.result ? data.data : null
}

// Product zoektermen — meerdere per product voor betere match
const PRODUCT_SEARCHES = [
  {
    slug: 'pootjesreiniger-beker--schone-poten-in-seconden',
    terms: ['paw cleaner cup dog', 'muddy paw washer', 'dog paw cleaner'],
    validate: (name) => /paw|clean|wash/i.test(name) && /dog|pet/i.test(name),
  },
  {
    slug: 'vachthandschoen--borstelen-terwijl-je-aait',
    terms: ['pet grooming glove', 'deshedding glove pet', 'hair removal glove dog cat'],
    validate: (name) => /glove|grooming/i.test(name),
  },
  {
    slug: 'herbruikbare-haarverwijder-roller--zonder-plakstrips',
    terms: ['pet hair remover roller reusable', 'fur remover roller', 'lint roller pet hair'],
    validate: (name) => /roller|remover|lint/i.test(name) && /hair|fur|pet/i.test(name),
  },
  {
    slug: 'snuffelmat--mentale-stimulatie-voor-je-hond',
    terms: ['snuffle mat dog', 'dog nose work mat', 'dog sniffing training mat'],
    validate: (name) => /snuffle|sniff|nose.*work|forag/i.test(name),
  },
  {
    slug: 'siliconen-likmat-met-zuignap--anti-stress-voor-honden',
    terms: ['lick mat dog silicone', 'pet licking pad suction', 'slow feeder lick mat dog'],
    validate: (name) => /lick|slow.*feed/i.test(name),
  },
  {
    slug: 'bewegende-vis-kattenspeeltje--realistisch--oplaadbaar',
    terms: ['flopping fish cat toy', 'electric moving fish cat', 'USB fish cat toy'],
    validate: (name) => /fish/i.test(name) && /cat|pet|toy/i.test(name),
  },
  {
    slug: 'raamhangmat-voor-katten--het-beste-uitzicht-in-huis',
    terms: ['cat window perch', 'cat hammock window suction cup', 'window mounted cat bed'],
    validate: (name) => /window|hammock|perch/i.test(name) && /cat/i.test(name),
  },
  {
    slug: 'katten-vleermuisvleugels--grappig-kostuum',
    terms: ['cat bat wings costume', 'pet bat costume halloween', 'cat bat wing'],
    validate: (name) => /bat/i.test(name) && /cat|pet|wing|costume/i.test(name),
  },
  {
    slug: 'kalmerende-donut-hondenmand--anti-angst--superzacht',
    terms: ['calming donut pet bed', 'round plush dog bed anxiety', 'donut dog bed soft'],
    validate: (name) => /donut|calming|round/i.test(name) && /bed|cushion/i.test(name),
  },
  {
    slug: 'anti-mors-drinkbak--geen-waterplassen-meer-op-de-vloer',
    terms: ['no spill dog water bowl', 'splash proof dog bowl', 'floating disk water bowl pet'],
    validate: (name) => /bowl|water/i.test(name) && /dog|pet|spill|splash|float/i.test(name),
  },
]

async function main() {
  console.log('\n🔧 CJ Koppeling Fixen voor 10 Nieuwe Producten\n')

  console.log('⏳ Even wachten op CJ rate limit (5 min)...')
  await new Promise(r => setTimeout(r, 310_000)) // 5 min + 10 sec

  const token = await getToken()
  console.log('✓ CJ token verkregen\n')

  let linked = 0
  let withImages = 0

  for (const product of PRODUCT_SEARCHES) {
    console.log(`\n── ${product.slug.split('--')[0]} ──`)

    let bestMatch = null

    for (const term of product.terms) {
      process.stdout.write(`  🔍 "${term}"... `)
      const results = await search(token, term)
      console.log(`${results.length} resultaten`)

      for (const r of results) {
        const name = r.productNameEn || r.productName || ''
        if (product.validate(name)) {
          console.log(`  ✓ Match: "${name.slice(0, 60)}" (PID: ${r.pid})`)
          bestMatch = r
          break
        } else {
          console.log(`    Skip: "${name.slice(0, 60)}" (past niet)`)
        }
      }

      if (bestMatch) break
      await new Promise(r => setTimeout(r, 400))
    }

    if (!bestMatch) {
      console.log('  ❌ Geen passend CJ product gevonden')
      continue
    }

    // Haal detail op voor foto's en variant
    const detail = await getDetail(token, bestMatch.pid)
    if (!detail) {
      console.log('  ❌ Detail ophalen mislukt')
      continue
    }

    const images = (detail.productImageSet ?? [detail.productImage]).filter(Boolean).slice(0, 6)
    const vid = detail.variants?.[0]?.vid ?? null

    console.log(`  📸 ${images.length} foto's, VID: ${vid ?? 'geen'}`)

    // Update in Supabase
    const update = {
      cj_pid: detail.pid,
      cj_vid: vid,
    }
    if (images.length > 0) {
      update.images = images
      withImages++
    }

    const { error } = await supabase
      .from('products')
      .update(update)
      .eq('slug', product.slug)

    if (error) {
      console.log(`  ❌ Update fout: ${error.message}`)
    } else {
      console.log(`  ✅ Gekoppeld!`)
      linked++
    }

    await new Promise(r => setTimeout(r, 500))
  }

  console.log('\n' + '═'.repeat(50))
  console.log(`\n✅ ${linked}/10 producten aan CJ gekoppeld`)
  console.log(`📸 ${withImages}/10 met foto's`)

  if (linked < 10) {
    console.log('\n⚠️  Niet-gekoppelde producten moeten handmatig')
    console.log('   via Admin → Producten → Koppelen worden gelinkt.')
  }

  console.log('\n💡 Tip: Draai /product-audit om foto\'s visueel te controleren\n')
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
