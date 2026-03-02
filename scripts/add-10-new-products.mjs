#!/usr/bin/env node

/**
 * PawsNL — 10 nieuwe producten toevoegen (maart 2026)
 * Zoekt op CJ, koppelt PID/VID, voegt toe aan Supabase
 * Verwijdert GEEN bestaande producten!
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'node:fs'

// Load env
const envPath = new URL('../.env.local', import.meta.url).pathname
for (const line of readFileSync(envPath, 'utf8').split('\n')) {
  const m = line.match(/^([^#=]+)=(.*)$/)
  if (m) process.env[m[1].trim()] = m[2].trim()
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0'
const CJ_API_KEY = process.env.CJ_API_KEY

async function getToken() {
  const res = await fetch(`${CJ_BASE}/v1/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: CJ_API_KEY }),
  })
  const data = await res.json()
  if (!data.result) throw new Error(`CJ auth mislukt: ${data.message}`)
  return data.data.accessToken
}

async function search(token, keyword) {
  const res = await fetch(
    `${CJ_BASE}/v1/product/list?keyword=${encodeURIComponent(keyword)}&pageNum=1&pageSize=5`,
    { headers: { 'CJ-Access-Token': token } }
  )
  const data = await res.json()
  if (!data.result) return []
  return data.data?.list ?? []
}

async function getDetail(token, pid) {
  const res = await fetch(`${CJ_BASE}/v1/product/query?pid=${pid}`, {
    headers: { 'CJ-Access-Token': token },
  })
  const data = await res.json()
  if (!data.result) return null
  return data.data
}

function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/[àáâã]/g, 'a').replace(/[èéêë]/g, 'e')
    .replace(/[ìíîï]/g, 'i').replace(/[òóôõ]/g, 'o').replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 60)
}

// ─── De 10 nieuwe producten ───────────────────────────────────────────────────

const NEW_PRODUCTS = [
  {
    search: 'dog paw cleaner cup',
    name: 'Pootjesreiniger Beker — Schone Poten in Seconden',
    description: 'Geen vieze pootafdrukken meer in huis! Deze handige pootjesreiniger heeft zachte siliconen borstelharen die modder, zand en vuil verwijderen zonder de gevoelige pootkussentjes te beschadigen. Poot erin, draaien, klaar. Perfect voor na een regenachtige wandeling. Compact en makkelijk mee te nemen. Verkrijgbaar in meerdere maten voor kleine en grote honden.',
    category: 'honden',
    featured: true,
    fallback_price: 19.95,
    fallback_compare: 29.95,
  },
  {
    search: 'pet grooming glove deshedding',
    name: 'Vachthandschoen — Borstelen Terwijl Je Aait',
    description: 'Je huisdier denkt dat je hem aait, maar je borstelt tegelijkertijd alle losse haren eruit! De siliconen nopjes op deze vachthandschoen masseren de huid en stimuleren de bloedsomloop, terwijl losse haren in de handschoen blijven plakken. Geschikt voor honden én katten. Vermindert haaruitval op je bank en kleding drastisch. Eén maat, past op elke hand.',
    category: 'honden',
    featured: false,
    fallback_price: 14.95,
    fallback_compare: 22.95,
  },
  {
    search: 'reusable pet hair remover roller lint',
    name: 'Herbruikbare Haarverwijder Roller — Zonder Plakstrips',
    description: 'Zeg vaarwel tegen eindeloze plakrollers! Deze herbruikbare roller verwijdert honden- en kattenhaar van je bank, kleding en auto in één veeg. Geen navullingen nodig — gewoon het opvangbakje legen en opnieuw gebruiken. Milieuvriendelijk en kostenbesparend. Werkt op alle stoffen. Het resultaat is zó bevredigend dat je alles in huis wilt rollen.',
    category: 'honden',
    featured: false,
    fallback_price: 17.95,
    fallback_compare: 26.95,
  },
  {
    search: 'dog snuffle mat feeding',
    name: 'Snuffelmat — Mentale Stimulatie voor Je Hond',
    description: 'Wist je dat 10 minuten snuffelen net zo vermoeiend is als een uur wandelen? Verstop brokjes of snoepjes in de pluche flappen van deze snuffelmat en kijk hoe je hond zijn neus gebruikt om ze te vinden. Vermindert stress, verveling en destructief gedrag. Machinewasbaar. Antislip onderkant zodat de mat niet verschuift. Ideaal voor alle rassen en leeftijden.',
    category: 'honden',
    featured: true,
    fallback_price: 24.95,
    fallback_compare: 34.95,
  },
  {
    search: 'silicone dog lick mat suction',
    name: 'Siliconen Likmat met Zuignap — Anti-Stress voor Honden',
    description: 'Smeer pindakaas, yoghurt of natvoer op deze likmat en geef je hond 20 minuten pure ontspanning. Het likken stimuleert de aanmaak van endorfine en verlaagt stress. Ideaal tijdens onweer, vuurwerk of een bezoek aan de dierenarts. Sterke zuignap houdt de mat op elke gladde ondergrond. Vaatwasserbestendig en geschikt voor de vriezer.',
    category: 'honden',
    featured: true,
    fallback_price: 14.95,
    fallback_compare: 22.95,
  },
  {
    search: 'electric flopping fish cat toy USB',
    name: 'Bewegende Vis Kattenspeeltje — Realistisch & Oplaadbaar',
    description: 'Deze levensechte vis flopt en wiebelt als een echte vis op het droge — je kat kan het niet weerstaan! Ingebouwde bewegingssensor die activeert zodra je kat de vis aanraakt. USB-oplaadbaar, geen batterijen nodig. Inclusief zakje catnip voor extra aantrekkingskracht. Stimuleert het jachtinstinct en houdt je kat actief en gezond.',
    category: 'katten',
    featured: true,
    fallback_price: 17.95,
    fallback_compare: 26.95,
  },
  {
    search: 'cat window hammock perch suction cup',
    name: 'Raamhangmat voor Katten — Het Beste Uitzicht in Huis',
    description: 'Geef je kat de ultieme uitkijkplek! Deze stevige raamhangmat bevestig je in seconden met industriële zuignappen die tot 15 kg dragen. Je kat kan urenlang naar buiten kijken, vogels observeren en zonnen. Comfortabel fleece kussen, afneembaar en wasbaar. Geen boren of schroeven nodig. Perfect voor binnenkatten die meer stimulatie verdienen.',
    category: 'katten',
    featured: false,
    fallback_price: 24.95,
    fallback_compare: 34.95,
  },
  {
    search: 'cat bat wing costume halloween',
    name: 'Katten Vleermuisvleugels — Grappig Kostuum',
    description: 'Maak van je kat de schattigste vleermuis ooit! Dit lichtgewicht kostuumpje met vleermuisvleugels zit comfortabel en is in seconden om te doen via een klittenbandsluiting. Je kat kan er vrij mee bewegen, springen en spelen. Perfect voor grappige foto\'s en video\'s. Een hit op social media — je volgers worden gek! Universele maat, past op de meeste katten.',
    category: 'katten',
    featured: false,
    fallback_price: 12.95,
    fallback_compare: 19.95,
  },
  {
    search: 'calming donut pet bed plush round',
    name: 'Kalmerende Donut Hondenmand — Anti-Angst & Superzacht',
    description: 'De opstaande randen van deze donutvormige mand geven je hond een veilig, omsloten gevoel — net als dicht tegen mama aan liggen. Het superzachte pluche materiaal vermindert angst en stress merkbaar. Ideaal voor honden die last hebben van verlatingsangst of onrust bij harde geluiden. Antislip onderkant, machinewasbaar. Beschikbaar in meerdere maten en kleuren.',
    category: 'honden',
    featured: true,
    fallback_price: 34.95,
    fallback_compare: 49.95,
  },
  {
    search: 'dog no spill water bowl floating disk',
    name: 'Anti-Mors Drinkbak — Geen Waterplassen Meer op de Vloer',
    description: 'Is jouw hond een rommelig drinker? Deze slimme drinkbak heeft een zwevende schijf die het waterniveau reguleert en spetteren voorkomt. Je hond kan gewoon drinken, maar het water blijft in de bak — niet op je vloer. Ook ideaal voor in de auto. Groot genoeg voor alle rassen. BPA-vrij en vaatwasserbestendig. Bespaar jezelf het dagelijks dweilen!',
    category: 'honden',
    featured: true,
    fallback_price: 24.95,
    fallback_compare: 34.95,
  },
]

// ─── Hoofdscript ──────────────────────────────────────────────────────────────

async function main() {
  console.log('\n🐾 PawsNL — 10 Nieuwe Producten Toevoegen\n')

  let token
  try {
    token = await getToken()
    console.log('✓ Ingelogd bij CJ\n')
  } catch (e) {
    console.error('❌ CJ auth mislukt:', e.message)
    process.exit(1)
  }

  const results = []

  for (const product of NEW_PRODUCTS) {
    process.stdout.write(`🔍 "${product.search}"... `)

    let cj_pid = null
    let cj_vid = null
    let images = []
    let price = product.fallback_price
    let compare_price = product.fallback_compare

    try {
      const searchResults = await search(token, product.search)

      if (searchResults.length > 0) {
        const best = searchResults[0]
        const detail = await getDetail(token, best.pid)

        if (detail) {
          cj_pid = detail.pid
          images = (detail.productImageSet ?? [detail.productImage]).filter(Boolean).slice(0, 6)

          // Gebruik eerste variant indien beschikbaar
          if (detail.variants?.length > 0) {
            cj_vid = detail.variants[0].vid
            const cost = parseFloat(detail.variants[0].variantSellPrice ?? detail.sellPrice ?? '0')
            if (cost > 0) {
              const markup = cost < 10 ? 3.0 : cost < 20 ? 2.5 : cost < 40 ? 2.2 : 2.0
              price = Math.max(Math.ceil(cost * markup) - 0.05, 12.95)
              compare_price = price >= 19.95 ? Math.ceil(price * 1.3) - 0.05 : product.fallback_compare
            }
          } else {
            const cost = parseFloat(detail.sellPrice ?? '0')
            if (cost > 0) {
              const markup = cost < 10 ? 3.0 : cost < 20 ? 2.5 : cost < 40 ? 2.2 : 2.0
              price = Math.max(Math.ceil(cost * markup) - 0.05, 12.95)
              compare_price = price >= 19.95 ? Math.ceil(price * 1.3) - 0.05 : product.fallback_compare
            }
          }

          console.log(`CJ gevonden! PID: ${cj_pid}, ${images.length} foto's, €${price}`)
        } else {
          console.log('detail ophalen mislukt, gebruik fallback prijs')
        }
      } else {
        console.log('geen CJ resultaten, gebruik fallback prijs')
      }
    } catch (e) {
      console.log(`CJ fout: ${e.message}, gebruik fallback prijs`)
    }

    // Maak slug
    const slug = toSlug(product.name)

    // Check of slug al bestaat
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      console.log(`  ⏭️  "${product.name}" bestaat al (slug: ${slug}), overgeslagen`)
      continue
    }

    const record = {
      name: product.name,
      slug,
      description: product.description,
      price,
      compare_price,
      images: images.length > 0 ? images : [],
      category: product.category,
      stock: 999,
      featured: product.featured,
      cj_pid,
      cj_vid,
    }

    const { error } = await supabase.from('products').insert(record)

    if (error) {
      console.log(`  ❌ Insert fout: ${error.message}`)
    } else {
      results.push(record)
      console.log(`  ✅ ${product.name} → €${price} (was €${compare_price})`)
    }

    // Rate limit pauze
    await new Promise(r => setTimeout(r, 600))
  }

  // Samenvatting
  console.log('\n' + '═'.repeat(60))
  console.log(`\n✅ ${results.length} nieuwe producten toegevoegd!\n`)

  const byCat = {}
  for (const r of results) {
    byCat[r.category] = (byCat[r.category] || 0) + 1
  }
  for (const [cat, count] of Object.entries(byCat)) {
    console.log(`  ${cat}: ${count} producten`)
  }

  const withCJ = results.filter(r => r.cj_pid).length
  const withImages = results.filter(r => r.images.length > 0).length
  console.log(`\n  CJ gekoppeld: ${withCJ}/${results.length}`)
  console.log(`  Met foto's: ${withImages}/${results.length}`)

  if (withImages < results.length) {
    console.log('\n⚠️  Sommige producten hebben geen foto\'s van CJ.')
    console.log('   Gebruik /product-audit om dit te controleren.')
  }

  // Tel totaal producten
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true })
  console.log(`\n📊 Totaal producten in shop: ${count}`)
  console.log('🌐 https://pawsshop.nl\n')
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
