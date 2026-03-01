import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

const envFile = readFileSync('.env.local', 'utf8')
for (const line of envFile.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

function toSlug(text) {
  return text.toLowerCase()
    .replace(/[àáâã]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõ]/g, 'o').replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9\s]/g, '').trim().replace(/\s+/g, '-').slice(0, 60)
}

const NEW_PRODUCTS = [
  // === KATTEN (4 nieuwe) ===
  {
    name: 'Interactief Laserspeelgoed voor Katten',
    slug: 'laser-speelgoed-katten',
    description: 'Houd je kat uren bezig met dit slimme automatische laserspeelgoed! De laser draait in willekeurige patronen en prikkelt het natuurlijke jachtinstinct. 3 snelheidsinstellingen, automatische uitschakeling na 15 minuten. Veilige laserklasse. Werkt op USB — overal te gebruiken.',
    price: 19.95,
    compare_price: 29.95,
    category: 'katten',
    stock: 999,
    featured: true,
    images: ['https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&q=80'],
  },
  {
    name: 'Opvouwbare Kattentunnel 3-weg',
    slug: 'kattentunnel-3-weg-opvouwbaar',
    description: 'Drie tunnels in één — je kat kan kruipen, verstoppen en spelen! Met knisperend materiaal dat de nieuwsgierigheid prikkelt. Opvouwbaar voor makkelijke opslag. Geschikt voor katten én kleine honden. Diameter 25cm, lengte per tunnel 50cm. Stevig nylon met versterkte uiteinden.',
    price: 14.95,
    compare_price: 22.95,
    category: 'katten',
    stock: 999,
    featured: false,
    images: ['https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&q=80'],
  },
  {
    name: 'Zelfverwarmende Kattenmat',
    slug: 'zelfverwarmende-kattenmat',
    description: 'Geen stroom nodig! Deze slimme mat reflecteert de lichaamswarmte van je kat en houdt een constante, comfortabele temperatuur. Anti-slip onderkant, machinewasbaar, en lekker zacht. Ideaal voor oudere katten met gewrichtsklachten. 60x45cm — past in elke kattenmand.',
    price: 17.95,
    compare_price: 24.95,
    category: 'katten',
    stock: 999,
    featured: false,
    images: ['https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&q=80'],
  },
  {
    name: 'Krabmat Sisal voor Bank en Meubels',
    slug: 'krabmat-sisal-bank',
    description: 'Bescherm je bank en meubels tegen krabschade! Deze natuurlijke sisal krabmat hang je eenvoudig over de armleuning of bevestig je aan de muur. Je kat krabt eraan in plaats van aan je bank. Dubbelzijdig bruikbaar, extra duurzaam. Afmeting 40x30cm.',
    price: 12.95,
    compare_price: 19.95,
    category: 'katten',
    stock: 999,
    featured: false,
    images: ['https://images.unsplash.com/photo-1548681528-6f5631a65a91?w=600&q=80'],
  },

  // === HONDEN (3 nieuwe) ===
  {
    name: 'Interactieve Snuffelmat voor Honden',
    slug: 'snuffelmat-honden-interactief',
    description: 'Stimuleer het natuurlijke zoekgedrag van je hond! Verstop snoepjes in de pluizige stroken en kijk hoe je hond ze opsnuffelt. Vertraagt het eten, vermindert verveling en angst. Machinewasbaar. Anti-slip onderkant. Geschikt voor alle rassen. 45x45cm.',
    price: 16.95,
    compare_price: 24.95,
    category: 'honden',
    stock: 999,
    featured: true,
    images: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80'],
  },
  {
    name: 'Opvouwbare Honden Reisbak Set (2 stuks)',
    slug: 'opvouwbare-reisbak-honden-set',
    description: 'Altijd water en voer bij de hand onderweg! Deze set van 2 siliconen bakken vouw je in seconden plat — past in je jas of tas. BPA-vrij, vaatwasserbestendig. Met karabijnhaak voor aan de riem. Inhoud 350ml per bak. Onmisbaar voor wandelingen en reizen.',
    price: 9.95,
    compare_price: 14.95,
    category: 'honden',
    stock: 999,
    featured: false,
    images: ['https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&q=80'],
  },
  {
    name: 'Waterdichte Hondenjas met Reflectie',
    slug: 'waterdichte-hondenjas-reflectie',
    description: 'Bescherm je hond tegen regen en wind! Lichtgewicht waterdichte jas met fleece voering voor extra warmte. Reflecterende strepen voor zichtbaarheid in het donker. Verstelbaar bij borst en buik. Makkelijk aan en uit te doen. Maten S t/m XXL beschikbaar.',
    price: 24.95,
    compare_price: 34.95,
    category: 'honden',
    stock: 999,
    featured: true,
    images: ['https://images.unsplash.com/photo-1559249975-efb236a88a4a?w=600&q=80'],
  },

  // === VOGELS (3 nieuwe) ===
  {
    name: 'Natuurlijke Vogelschommel met Speelgoed',
    slug: 'vogelschommel-natuurlijk-speelgoed',
    description: 'Geef je vogel een natuurlijke speelomgeving! Handgemaakte schommel van echt hout met kleurrijke kralen en belletjes. Geschikt voor parkieten, kanaries en kleine papegaaien. Stimuleert beweging en voorkomt verveling. Eenvoudig op te hangen met RVS haak. Lengte 25cm.',
    price: 9.95,
    compare_price: 14.95,
    category: 'vogels',
    stock: 999,
    featured: true,
    images: ['https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&q=80'],
  },
  {
    name: 'Vogelbadje met Automatische Waterstroom',
    slug: 'vogelbadje-automatisch-waterstroom',
    description: 'Vogels houden van stromend water! Dit compacte vogelbadje met zachte waterstroom nodigt je vogel uit om te badderen. Bevordert de veergezondheid en vermaakt je vogel. USB-oplaadbaar, stil pompje. Geschikt voor in en buiten de kooi. Eenvoudig schoon te maken.',
    price: 14.95,
    compare_price: 21.95,
    category: 'vogels',
    stock: 999,
    featured: false,
    images: ['https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&q=80'],
  },
  {
    name: 'Vogelkooi Ladder en Klimrek Set',
    slug: 'vogelkooi-ladder-klimrek-set',
    description: 'Maak van je vogelkooi een speeltuin! Set van 3 houten ladders en klimrekken in verschillende vormen. Natuurlijk hout is veilig om op te knagen. Geschikt voor parkieten, valkparkieten en kleine papegaaien. Stimuleert beweging en houdt je vogel fit. Inclusief bevestigingsclips.',
    price: 11.95,
    compare_price: 17.95,
    category: 'vogels',
    stock: 999,
    featured: false,
    images: ['https://images.unsplash.com/photo-1520808663317-647b476a81b9?w=600&q=80'],
  },

  // === KNAAGDIEREN (3 nieuwe) ===
  {
    name: 'Stille Loopwiel voor Hamsters',
    slug: 'stil-loopwiel-hamster',
    description: 'Eindelijk een loopwiel dat je niet wakker houdt! Ultra-stille dubbele kogellagers zorgen voor een geluidsloze draaiing. Diameter 21cm — geschikt voor dwerghamsters en Syrische hamsters. Stevig kunststof, makkelijk schoon te maken. Antislip loopvlak voor veilig rennen.',
    price: 12.95,
    compare_price: 18.95,
    category: 'knaagdieren',
    stock: 999,
    featured: true,
    images: ['https://images.unsplash.com/photo-1425082661507-d633be39a7b2?w=600&q=80'],
  },
  {
    name: 'Houten Speelset voor Knaagdieren',
    slug: 'houten-speelset-knaagdieren',
    description: 'Natuurlijk speelplezier voor je hamster, gerbil of muis! Set van 8 stuks: tunnel, brug, wip, trap en meer. Onbehandeld beukenhout — veilig om op te knagen en goed voor de tanden. Eindeloos te combineren in de kooi. Stimuleert beweging en verkent gedrag.',
    price: 14.95,
    compare_price: 21.95,
    category: 'knaagdieren',
    stock: 999,
    featured: false,
    images: ['https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&q=80'],
  },
  {
    name: 'Koelmat voor Knaagdieren (Aluminium)',
    slug: 'koelmat-knaagdieren-aluminium',
    description: 'Houd je knaagdier koel in de zomer! Deze aluminium koelmat neemt lichaamswarmte op en voelt altijd fris aan. Geen stroom of water nodig. Knaagbestendig en hygiënisch. Geschikt voor hamsters, cavia\'s en konijnen. Afmeting 20x15cm. Eenvoudig schoon te vegen.',
    price: 8.95,
    compare_price: 13.95,
    category: 'knaagdieren',
    stock: 999,
    featured: false,
    images: ['https://images.unsplash.com/photo-1452721226468-f95fb66ebf83?w=600&q=80'],
  },
]

async function run() {
  console.log('\n🐾 PawsNL — Nieuwe producten toevoegen\n')

  let added = 0
  for (const p of NEW_PRODUCTS) {
    // Check of slug al bestaat
    const { data: existing } = await supabase.from('products').select('id').eq('slug', p.slug).single()
    if (existing) {
      console.log(`  ⏭️  ${p.name} (bestaat al)`)
      continue
    }

    const { error } = await supabase.from('products').insert(p)
    if (error) {
      console.log(`  ❌ ${p.name}: ${error.message}`)
    } else {
      console.log(`  ✅ ${p.name} — €${p.price}`)
      added++
    }
  }

  console.log(`\n✅ ${added} nieuwe producten toegevoegd!`)

  // Totaal overzicht
  const { data: all } = await supabase.from('products').select('category')
  const counts = {}
  for (const p of all) {
    counts[p.category] = (counts[p.category] || 0) + 1
  }
  console.log('\n📊 Totaal per categorie:')
  for (const [cat, count] of Object.entries(counts).sort()) {
    console.log(`  ${cat}: ${count} producten`)
  }
  console.log(`  TOTAAL: ${all.length} producten\n`)
}

run().catch(console.error)
