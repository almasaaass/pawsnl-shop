import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)

const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0'
const CJ_API_KEY = 'CJ5198246@api@dfff508709394ed5a6078a3534e23dad'

let token = null

async function getToken() {
  if (token) return token
  const res = await fetch(`${CJ_BASE}/v1/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: CJ_API_KEY }),
  })
  const data = await res.json()
  if (!data.data?.accessToken) throw new Error(`Auth failed: ${data.message}`)
  token = data.data.accessToken
  return token
}

async function searchCJ(keyword) {
  const t = await getToken()
  const res = await fetch(
    `${CJ_BASE}/v1/product/list?productNameEn=${encodeURIComponent(keyword)}&pageNum=1&pageSize=20`,
    { headers: { 'CJ-Access-Token': t } }
  )
  const data = await res.json()
  return data.data?.list ?? []
}

async function getCJDetail(pid) {
  const t = await getToken()
  const res = await fetch(`${CJ_BASE}/v1/product/query?pid=${pid}`, {
    headers: { 'CJ-Access-Token': t },
  })
  const data = await res.json()
  return data.data
}

// Eerste stap: haal alle bestaande slugs op
const { data: existing } = await supabase.from('products').select('slug,name')
const existingSlugs = new Set(existing.map(p => p.slug))
const existingNames = existing.map(p => p.name.toLowerCase())
console.log(`Bestaande producten: ${existing.length}`)
console.log(existing.map(p => `  - ${p.name}`).join('\n'))

// Winnende producten om te zoeken
const PRODUCTS_TO_IMPORT = [
  {
    search: 'no pull dog harness reflective',
    name: 'Anti-Trek Hondentuig (Reflecterend)',
    description: 'Stop het trekken aan de riem! Dit comfortabele anti-trek tuig verdeelt de druk gelijkmatig over de borst van je hond. Reflecterende strepen voor zichtbaarheid in het donker. Verstelbare banden voor een perfecte pasvorm. Zachte vulling voorkomt schuren. Geschikt voor alle hondenrassen.',
    category: 'honden',
    price: 24.95,
    comparePrice: 34.95,
  },
  {
    search: 'slow feeder dog bowl puzzle',
    name: 'Anti-Schrok Voerbak voor Honden',
    description: 'Voorkom dat je hond te snel eet! Deze slimme anti-schrok voerbak vertraagt het eten tot wel 10x. Voorkomt maagproblemen, overgeven en overgewicht. Antislip bodem zodat de bak niet verschuift. Vaatwasmachinebestendig. Geschikt voor nat en droog voer.',
    category: 'honden',
    price: 14.95,
    comparePrice: 22.95,
  },
  {
    search: 'cat water fountain automatic',
    name: 'Automatische Drinkfontein voor Katten',
    description: 'Katten drinken tot 3x meer met stromend water! Deze stille drinkfontein filtert het water continu en houdt het fris. Drielaags filtersysteem verwijdert haren en onzuiverheden. Ultra-stille pomp (< 30dB). 2L capaciteit. LED-indicatie wanneer water bijgevuld moet worden.',
    category: 'katten',
    price: 29.95,
    comparePrice: 44.95,
  },
  {
    search: 'automatic cat laser toy interactive',
    name: 'Automatisch Laserspeeltje voor Katten',
    description: 'Hou je kat urenlang bezig — ook als je niet thuis bent! Deze automatische laser beweegt in willekeurige patronen die je kat niet kan voorspellen. Instelbare snelheid en timer (15/30/60 min). USB oplaadbaar. Veilige klasse 1 laser. Stimuleert natuurlijk jachtinstinct en houdt je kat fit.',
    category: 'katten',
    price: 19.95,
    comparePrice: 29.95,
  },
  {
    search: 'dog cooling mat gel',
    name: 'Verkoelende Mat voor Honden',
    description: 'Houd je hond koel tijdens warme dagen! Deze gel-koelmat activeert door lichaamsdruk — geen stroom of water nodig. Koelt tot 7°C onder kamertemperatuur. Krasbestendig materiaal. Opvouwbaar en makkelijk mee te nemen. Geschikt voor in de bench, mand of auto.',
    category: 'honden',
    price: 24.95,
    comparePrice: 37.95,
  },
  {
    search: 'lick mat dog silicone suction',
    name: 'Likmat voor Honden met Zuignap',
    description: 'Maak badtijd stressvrij! Smeer pindakaas of natvoer op deze likmat en plak hem op de muur of badrand. Houdt je hond kalm tijdens het wassen, nagels knippen of bij onweer. Voedselveilig siliconen. Vaatwasmachinebestendig. Vertraagt het eten en stimuleert speekselproductie voor gezonde tanden.',
    category: 'honden',
    price: 12.95,
    comparePrice: 19.95,
  },
  {
    search: 'cat window hammock perch',
    name: 'Raamhangmat voor Katten',
    description: 'Geef je kat de beste plek in huis! Deze stevige raamhangmat bevestig je met zuignappen — draagt tot 15kg. Je kat kan urenlang naar buiten kijken, zonnen en dutjes doen. Ademend mesh-materiaal voor comfort in de zomer. Geen gereedschap nodig voor montage.',
    category: 'katten',
    price: 19.95,
    comparePrice: 29.95,
  },
  {
    search: 'dog led collar rechargeable',
    name: 'LED Halsband voor Honden (USB Oplaadbaar)',
    description: 'Nooit meer je hond kwijtraken in het donker! Deze LED halsband is tot 500 meter zichtbaar en heeft 3 lichtstanden: constant, snel knipperend en langzaam knipperend. USB oplaadbaar — 2 uur laden voor 5 uur licht. Waterbestendig en verstelbaar. Beschikbaar in meerdere maten.',
    category: 'honden',
    price: 14.95,
    comparePrice: 22.95,
  },
  {
    search: 'cat backpack bubble window carrier',
    name: 'Kattenrugzak met Kijkvenster',
    description: 'Neem je kat veilig mee op avontuur! Deze rugzak heeft een transparant bubbel-venster zodat je kat naar buiten kan kijken. Ventilatieopeningen aan alle kanten. Draagt katten tot 6kg. Comfortabele schouderbanden met borstriem. Geschikt voor wandelingen, fietstochtjes en dierenarts bezoeken.',
    category: 'katten',
    price: 34.95,
    comparePrice: 49.95,
  },
  {
    search: 'snuffle mat dog nose work',
    name: 'Snuffelmat voor Honden',
    description: 'Laat je hond werken voor zijn eten! Verstop snoepjes in de fleece-slierten en kijk hoe je hond zoekt met zijn neus. Stimuleert het natuurlijke zoekgedrag, vermindert stress en vermoeit mentaal. Wasbaar in de wasmachine. Perfect voor regenachtige dagen of als je hond alleen thuis is.',
    category: 'honden',
    price: 17.95,
    comparePrice: 26.95,
  },
  {
    search: 'dog toothbrush chew toy dental',
    name: 'Tandenborstel Kauwspeeltje voor Honden',
    description: 'Tanden poetsen zonder gedoe! Dit kauwspeeltje reinigt de tanden terwijl je hond speelt. De noppen en groeven verwijderen tandplak en masseren het tandvlees. Voedselveilig rubber. Smeer tandpasta of pindakaas in de groeven voor extra motivatie. Geschikt voor kleine tot middelgrote honden.',
    category: 'honden',
    price: 12.95,
    comparePrice: 18.95,
  },
  {
    search: 'silent hamster wheel running',
    name: 'Stille Loopwiel voor Hamsters (Upgrade)',
    description: 'De stilste loopwiel op de markt! Dubbele kogellagers zorgen voor een fluisterstille draaiing — zelfs midden in de nacht. 21cm diameter, geschikt voor dwerg- en Syrische hamsters. Antislip loopvlak beschermt kleine pootjes. Stevig kunststof, makkelijk schoon te maken met warm water.',
    category: 'knaagdieren',
    price: 14.95,
    comparePrice: 21.95,
  },
  {
    search: 'dog raincoat waterproof reflective',
    name: 'Regenjas voor Honden (Waterproof)',
    description: 'Droog thuiskomen na elke wandeling! Deze waterdichte hondenregenjas houdt je hond 100% droog. Reflecterende strepen voor veiligheid in het donker. Verstelbare buikriem en elastische pootopeningen. Lichtgewicht en opvouwbaar — past in elke jaszak. Met capuchon en riemopening op de rug.',
    category: 'honden',
    price: 19.95,
    comparePrice: 29.95,
  },
  {
    search: 'dog paw cleaner cup',
    name: 'Poten Reiniger voor Honden',
    description: 'Nooit meer modderige pootafdrukken in huis! Dip de poot in deze reinigingsbeker, draai een paar keer en klaar. Zachte siliconen borstels reinigen tussen de tenen zonder irritatie. Compact formaat voor onderweg. Afneembare binnenkant voor makkelijk schoonmaken. Werkt bij alle hondenrassen.',
    category: 'honden',
    price: 14.95,
    comparePrice: 21.95,
  },
  {
    search: 'bird toys set parrot cage',
    name: 'Vogelspeelgoed Set (10-delig)',
    description: 'Maak van je vogelkooi een speelparadijs! Set van 10 kleurrijke speeltjes: schommels, bellen, ladders, knaagringen en meer. Gemaakt van natuurlijk hout en voedselveilige kleurstoffen. Geschikt voor parkieten, valkparkieten en kleine papegaaien. Voorkomt verveling en stimuleert beweging.',
    category: 'vogels',
    price: 16.95,
    comparePrice: 24.95,
  },
  {
    search: 'rabbit tunnel play toy',
    name: 'Speeltunnel voor Konijnen',
    description: 'Konijnen zijn dol op tunnels! Deze opvouwbare speeltunnel met 3 uitgangen zorgt voor urenlang speelplezier. Stevig materiaal dat tegen een stootje kan. Ruiselt bij beweging voor extra stimulatie. Compact op te vouwen voor opslag. Geschikt voor konijnen, cavia\'s en fretten.',
    category: 'knaagdieren',
    price: 17.95,
    comparePrice: 26.95,
  },
  {
    search: 'self cleaning pet brush deshedding',
    name: 'Zelfreinigende Huisdier Borstel',
    description: 'Geen gedoe meer met het schoonmaken van de borstel! Eén druk op de knop en alle haren vallen eruit. Roestvrijstalen pinnen verwijderen losse ondervacht zonder de bovenvacht te beschadigen. Ergonomische grip voor comfortabel borstelen. Geschikt voor honden en katten van alle rassen.',
    category: 'honden',
    price: 14.95,
    comparePrice: 22.95,
  },
  {
    search: 'dog socks anti slip indoor',
    name: 'Anti-Slip Hondensokken (4 stuks)',
    description: 'Bescherm je hond op gladde vloeren! Deze schattige sokken met anti-slip noppen voorkomen uitglijden op laminaat, tegels en parket. Perfect voor oudere honden of honden die herstellende zijn van een operatie. Zachte katoenmix voor comfort. Set van 4 stuks. Wasbaar op 30°C.',
    category: 'honden',
    price: 9.95,
    comparePrice: 15.95,
  },
]

function makeSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80)
}

let imported = 0
let skipped = 0
let failed = 0

for (const product of PRODUCTS_TO_IMPORT) {
  const slug = makeSlug(product.name)

  // Check of al bestaat
  if (existingSlugs.has(slug) || existingNames.some(n => n.includes(product.name.toLowerCase().split(' ')[0]))) {
    console.log(`⏭️  SKIP: ${product.name} (bestaat al)`)
    skipped++
    continue
  }

  // Zoek op CJ
  console.log(`\n🔍 Zoeken: "${product.search}"...`)
  let cjProducts
  try {
    cjProducts = await searchCJ(product.search)
  } catch (e) {
    console.log(`❌ FOUT bij zoeken: ${e.message}`)
    failed++
    continue
  }

  if (cjProducts.length === 0) {
    console.log(`❌ Geen resultaten voor "${product.search}"`)
    failed++
    continue
  }

  // Pak het eerste product met een redelijke prijs
  const cj = cjProducts.find(p => parseFloat(p.sellPrice) > 0.5 && parseFloat(p.sellPrice) < 50) || cjProducts[0]
  const pid = cj.pid

  console.log(`   CJ: ${cj.productNameEn} — €${cj.sellPrice}`)

  // Haal details op
  let detail
  try {
    detail = await getCJDetail(pid)
  } catch (e) {
    console.log(`❌ Detail ophalen mislukt: ${e.message}`)
    failed++
    continue
  }

  const images = (detail.productImageSet ?? [detail.productImage]).filter(Boolean).slice(0, 4)

  // Importeer naar Supabase
  const { data, error } = await supabase.from('products').insert({
    name: product.name,
    slug,
    description: product.description,
    price: product.price,
    compare_price: product.comparePrice,
    images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400'],
    category: product.category,
    stock: 999,
    featured: false,
  }).select().single()

  if (error) {
    console.log(`❌ Import mislukt: ${error.message}`)
    failed++
  } else {
    console.log(`✅ GEÏMPORTEERD: ${product.name} — €${product.price} (was €${product.comparePrice})`)
    console.log(`   Afbeeldingen: ${images.length}`)
    existingSlugs.add(slug)
    imported++
  }

  // Kleine pauze om rate limiting te voorkomen
  await new Promise(r => setTimeout(r, 500))
}

console.log(`\n${'='.repeat(50)}`)
console.log(`Klaar! ${imported} geïmporteerd, ${skipped} overgeslagen, ${failed} mislukt`)
console.log(`Totaal producten in shop: ${existing.length + imported}`)
