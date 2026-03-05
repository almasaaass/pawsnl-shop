#!/usr/bin/env node

/**
 * Fix CJ koppeling voor 10 nieuwe producten
 * Gebruikt V2 API (keyWord met hoofdletter W)
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

// V2 API — de werkende versie
async function searchV2(token, keyword) {
  const res = await fetch(
    `${CJ_BASE}/v1/product/listV2?keyWord=${encodeURIComponent(keyword)}&page=1&size=5`,
    { headers: { 'CJ-Access-Token': token } }
  )
  const data = await res.json()
  if (!data.result) {
    console.log(`    API error: ${data.message}`)
    return []
  }
  return data.data?.list ?? []
}

async function getDetail(token, pid) {
  const res = await fetch(`${CJ_BASE}/v1/product/query?pid=${pid}`, {
    headers: { 'CJ-Access-Token': token },
  })
  const data = await res.json()
  return data.result ? data.data : null
}

const PRODUCTS = [
  {
    slug: 'pootjesreiniger-beker--schone-poten-in-seconden',
    name: 'Pootjesreiniger',
    terms: ['dog paw cleaner cup', 'pet paw washer', 'paw cleaner'],
  },
  {
    slug: 'vachthandschoen--borstelen-terwijl-je-aait',
    name: 'Vachthandschoen',
    terms: ['pet grooming glove', 'deshedding glove', 'pet hair glove'],
  },
  {
    slug: 'herbruikbare-haarverwijder-roller--zonder-plakstrips',
    name: 'Haarverwijder Roller',
    terms: ['pet hair remover roller', 'reusable lint roller', 'fur remover roller'],
  },
  {
    slug: 'snuffelmat--mentale-stimulatie-voor-je-hond',
    name: 'Snuffelmat',
    terms: ['snuffle mat dog', 'dog snuffle mat', 'pet sniffing mat'],
  },
  {
    slug: 'siliconen-likmat-met-zuignap--anti-stress-voor-honden',
    name: 'Likmat',
    terms: ['lick mat dog', 'silicone lick mat', 'pet licking mat'],
  },
  {
    slug: 'bewegende-vis-kattenspeeltje--realistisch--oplaadbaar',
    name: 'Bewegende Vis',
    terms: ['flopping fish cat toy', 'electric fish cat', 'moving fish toy'],
  },
  {
    slug: 'raamhangmat-voor-katten--het-beste-uitzicht-in-huis',
    name: 'Raamhangmat',
    terms: ['cat window perch', 'cat window hammock', 'cat window bed suction'],
  },
  {
    slug: 'katten-vleermuisvleugels--grappig-kostuum',
    name: 'Vleermuisvleugels',
    terms: ['cat bat wings', 'pet bat costume', 'cat halloween costume bat'],
  },
  {
    slug: 'kalmerende-donut-hondenmand--anti-angst--superzacht',
    name: 'Donut Mand',
    terms: ['calming donut pet bed', 'round plush pet bed', 'donut dog bed'],
  },
  {
    slug: 'anti-mors-drinkbak--geen-waterplassen-meer-op-de-vloer',
    name: 'Anti-Mors Drinkbak',
    terms: ['no spill dog bowl', 'splash proof water bowl', 'floating disk dog bowl'],
  },
]

async function main() {
  console.log('\n🔧 CJ V2 Koppeling — 10 Nieuwe Producten\n')

  const token = await getToken()
  console.log('✓ CJ token OK\n')

  let linked = 0

  for (const product of PRODUCTS) {
    console.log(`\n── ${product.name} ──`)

    let bestMatch = null

    for (const term of product.terms) {
      process.stdout.write(`  🔍 "${term}"... `)
      const results = await searchV2(token, term)
      console.log(`${results.length} resultaten`)

      if (results.length > 0) {
        // Toon top 3 voor debugging
        for (const r of results.slice(0, 3)) {
          const name = (r.productNameEn || r.productName || '').slice(0, 70)
          console.log(`    → ${r.pid}: ${name} (€${r.sellPrice})`)
        }
        // Neem eerste resultaat (V2 is betrouwbaarder)
        bestMatch = results[0]
        break
      }

      await new Promise(r => setTimeout(r, 400))
    }

    if (!bestMatch) {
      console.log('  ❌ Niets gevonden op CJ')
      continue
    }

    // Detail ophalen
    const detail = await getDetail(token, bestMatch.pid)
    if (!detail) {
      console.log('  ❌ Detail mislukt')
      continue
    }

    const images = (detail.productImageSet ?? [detail.productImage]).filter(Boolean).slice(0, 6)
    const vid = detail.variants?.[0]?.vid ?? null

    console.log(`  📸 ${images.length} foto's`)

    // Update Supabase
    const update = { cj_pid: detail.pid, cj_vid: vid }
    if (images.length > 0) update.images = images

    const { error } = await supabase.from('products').update(update).eq('slug', product.slug)

    if (error) {
      console.log(`  ❌ DB fout: ${error.message}`)
    } else {
      console.log(`  ✅ Gekoppeld!`)
      linked++
    }

    await new Promise(r => setTimeout(r, 500))
  }

  console.log('\n' + '═'.repeat(50))
  console.log(`\n✅ ${linked}/10 producten gekoppeld via CJ V2 API`)

  // Tel totaal
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true })
  console.log(`📊 Totaal producten: ${count}`)

  if (linked < 10) {
    console.log('\n⚠️  Niet-gevonden producten handmatig koppelen via Admin.')
  }
  console.log('\n💡 Draai /product-audit om alle foto\'s te checken\n')
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
