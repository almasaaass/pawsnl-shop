import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)

const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0'
const CJ_API_KEY = 'CJ5198246@api@dfff508709394ed5a6078a3534e23dad'

// ─── Auth ─────────────────────────────────────────────────────────────────────

async function getToken() {
  const res = await fetch(`${CJ_BASE}/v1/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: CJ_API_KEY }),
  })
  const data = await res.json()
  if (!data.result) throw new Error(`CJ auth mislukt: ${data.message}`)
  console.log('✓ Ingelogd bij CJdropshipping')
  return data.data.accessToken
}

// ─── Zoeken ───────────────────────────────────────────────────────────────────

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

// ─── Prijzen ──────────────────────────────────────────────────────────────────

function calcPrice(cost) {
  const markup = cost < 10 ? 3.0 : cost < 20 ? 2.5 : cost < 40 ? 2.2 : 2.0
  const price = Math.max(Math.ceil(cost * markup) - 0.05, 12.95)
  const comparePrice = price >= 19.95 ? Math.ceil(price * 1.3) - 0.05 : null
  return { price, comparePrice }
}

function mapCategory(name = '') {
  const n = name.toLowerCase()
  if (n.includes('dog') || n.includes('puppy')) return 'honden'
  if (n.includes('cat') || n.includes('kitten')) return 'katten'
  if (n.includes('bird')) return 'vogels'
  if (n.includes('fish') || n.includes('aquar')) return 'vissen'
  if (n.includes('hamster') || n.includes('rabbit')) return 'knaagdieren'
  return 'honden'
}

function toSlug(text) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-').slice(0, 60)
}

// ─── Nederlandse namen & omschrijvingen ───────────────────────────────────────

const DUTCH_OVERRIDES = {
  'dog harness no pull': {
    name: 'Anti-Trek Hondenharnas met Reflecterende Strepen',
    description: 'Stop het trekken aan de riem met dit ergonomische no-pull harnas. De trekkracht wordt gelijkmatig verdeeld over de borst, niet de nek. Reflecterende strepen voor veiligheid in het donker. Verstelbaar voor alle rassen. Eenvoudig aan te doen met snelle kliksluiting. Maten XS t/m XL beschikbaar.',
    category: 'honden',
    featured: true,
  },
  'cat water fountain': {
    name: 'Stille Kattenfontein met Koolstoffilter',
    description: 'Katten drinken liever stromend water — deze stijlvolle fontein filtert het water continu en houdt het vers en schoon. Superstille pomp (< 30dB). Inhoud 2,5 liter, ideaal voor meerdere katten. Beschermt de nierfunctie van je kat op de lange termijn. Inclusief 3 vervangende filters. Eenvoudig te reinigen.',
    category: 'katten',
    featured: true,
  },
  'automatic cat laser toy': {
    name: 'Automatisch Laserspeelgoed voor Katten',
    description: 'Houd je kat uren bezig met dit slimme automatische laserspeelgoed! De laser draait in willekeurige patronen en prikkelt het natuurlijke jachtinstinct. 3 snelheidsinstellingen, automatische uitschakeling na 15 minuten. Veilige laserklasse. Werkt op batterijen of USB — overal te gebruiken.',
    category: 'katten',
    featured: true,
  },
  'pet gps tracker': {
    name: 'GPS Tracker voor Honden en Katten',
    description: 'Weet altijd waar je huisdier is. Compacte GPS tracker die je aan de halsband bevestigt. Real-time locatie via gratis app. Stel een veilige zone in en ontvang direct een melding als je huisdier die verlaat. Waterdicht (IP67), 7 dagen batterij. Werkt in heel Europa.',
    category: 'honden',
    featured: true,
  },
  'slow feeder dog bowl': {
    name: 'Slow Feeder Lick Mat voor Honden',
    description: 'Vertraag het eten van je hond en stimuleer zijn hersenen! Deze siliconen lick mat met zuignap is ideaal voor natte voeding, pindakaas of yoghurt. Vermindert angst en verveling. Vaatwasserbestendig. Bevroren serveren voor extra verkoeling in de zomer. Dierenarts aanbevolen.',
    category: 'honden',
    featured: false,
  },
  'dog led collar': {
    name: 'LED Halsband Hond USB Oplaadbaar',
    description: 'Zichtbaar en veilig uitlaten in het donker! Deze LED halsband geeft heldere lichtimpulsen en is tot 500 meter zichtbaar. USB oplaadbaar — geen batterijen nodig. Waterdicht. Tot 8 uur brandtijd per lading. Verstelbaar voor alle rassen. Ideaal voor vroege ochtend of late avond.',
    category: 'honden',
    featured: false,
  },
  'self cleaning litter box': {
    name: 'Automatische Zelfreinigend Kattenbak',
    description: 'Nooit meer zelf scheppen! Deze automatische kattenbak reinigt zichzelf na elk bezoek van je kat. Met actieve koolstoffilter die geuren neutraliseert. Grote opvangbak voor minder leegmaken. Stil motorgeluid zodat je kat er niet van schrikt. Geschikt voor katten tot 7 kg.',
    category: 'katten',
    featured: true,
  },
  'pet camera treat dispenser': {
    name: 'Huisdiercamera met Snackdispenser',
    description: 'Kijk en praat met je hond of kat terwijl je weg bent. HD camera met 130° kijkhoek, twee-weg audio en nachtzicht. Gooi snacks via de app — je huisdier hoort je stem en krijgt een traktatie. WiFi verbinding, werkt met Android en iOS. Vermindert scheidingsangst bij huisdieren.',
    category: 'honden',
    featured: true,
  },
  'cat window perch': {
    name: 'Kattenhangmat Raam met Zuignap',
    description: 'Geef je kat het beste uitzicht in huis! Deze raamhangmat bevestig je in seconden met sterke zuignappen op elk raam. Draagt tot 15 kg. Comfortabel fleece materiaal, machinewasbaar. Je kat kan urenlang buiten kijken — perfect voor appartementkatten. Geen boren of schroeven nodig.',
    category: 'katten',
    featured: false,
  },
  'automatic pet feeder': {
    name: 'Automatische Voerbak met Timer en Recorder',
    description: 'Nooit meer vergeten je huisdier te voeren! Programmeer tot 4 maaltijden per dag met exacte portiegroottes. Groot reservoir van 4 liter. Neem je eigen stem op als oproep — je hond of kat hoort jou ook als je niet thuis bent. Werkt op stroom én batterijen als backup.',
    category: 'honden',
    featured: true,
  },
}

// ─── Hoofdscript ──────────────────────────────────────────────────────────────

async function run() {
  console.log('\n🐾 PawsNL — CJdropshipping Product Import\n')

  let token
  try {
    token = await getToken()
  } catch (e) {
    console.error('❌ Kan niet inloggen bij CJ:', e.message)
    console.log('\nControleer je CJ email en wachtwoord.')
    process.exit(1)
  }

  const keywords = Object.keys(DUTCH_OVERRIDES)
  const toImport = []

  console.log(`\n🔍 ${keywords.length} productcategorieën zoeken...\n`)

  for (const keyword of keywords) {
    process.stdout.write(`  Zoeken: "${keyword}"... `)
    try {
      const results = await search(token, keyword)
      if (!results.length) {
        console.log('geen resultaten')
        continue
      }

      // Kies het product met de beste verhouding (goede prijs, EU warehouse voorkeur)
      const best = results[0]
      const detail = await getDetail(token, best.pid)

      if (!detail) {
        console.log('detail ophalen mislukt')
        continue
      }

      const costPrice = parseFloat(detail.sellPrice ?? best.sellPrice ?? '0')
      const { price, comparePrice } = calcPrice(costPrice)
      const override = DUTCH_OVERRIDES[keyword]
      const images = (detail.productImageSet ?? [detail.productImage]).filter(Boolean).slice(0, 3)

      if (!images.length) {
        console.log('geen afbeeldingen')
        continue
      }

      toImport.push({
        keyword,
        name: override.name,
        slug: toSlug(override.name),
        description: override.description,
        price,
        compare_price: comparePrice,
        images,
        category: override.category,
        stock: 999,
        featured: override.featured,
        costPrice,
        pid: detail.pid,
      })

      console.log(`✓ (€${costPrice} inkoop → €${price} verkoop, ${Math.round(((price - costPrice) / price) * 100)}% marge)`)
    } catch (e) {
      console.log(`fout: ${e.message}`)
    }

    // Kleine pauze om rate limiting te vermijden
    await new Promise(r => setTimeout(r, 500))
  }

  if (!toImport.length) {
    console.log('\n❌ Geen producten gevonden om te importeren.')
    process.exit(1)
  }

  console.log(`\n📦 ${toImport.length} producten importeren naar Supabase...\n`)

  // Verwijder bestaande producten
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  console.log('  ✓ Oude producten verwijderd')

  let imported = 0
  for (const p of toImport) {
    // Controleer of slug al bestaat
    const { data: existing } = await supabase.from('products').select('id').eq('slug', p.slug).single()
    const slug = existing ? `${p.slug}-${Date.now()}` : p.slug

    const { error } = await supabase.from('products').insert({
      name: p.name,
      slug,
      description: p.description,
      price: p.price,
      compare_price: p.compare_price,
      images: p.images,
      category: p.category,
      stock: p.stock,
      featured: p.featured,
    })

    if (error) {
      console.log(`  ❌ ${p.name}: ${error.message}`)
    } else {
      console.log(`  ✓ ${p.name} (€${p.price})`)
      imported++
    }
  }

  console.log(`\n✅ ${imported} echte CJ producten geïmporteerd!\n`)
  console.log('🌐 Bekijk je shop: https://pawsnl-shop.vercel.app\n')
}

run().catch(console.error)
