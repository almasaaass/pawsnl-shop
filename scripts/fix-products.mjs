import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)

// Echte producten met correcte afbeeldingen en marktconforme prijzen
const products = [
  {
    name: 'Anti-Trek Hondenharnas met Reflecterende Strepen',
    slug: 'anti-trek-hondenharnas-reflecterend',
    description: 'Stop het trekken aan de riem met dit ergonomische no-pull harnas. De trekkracht wordt gelijkmatig verdeeld over de borst, niet de nek. Reflecterende strepen voor veiligheid in het donker. Verstelbaar voor alle rassen. Eenvoudig aan te doen met snelle kliksluiting. Maten XS t/m XL beschikbaar.',
    price: 27.95,
    compare_price: 39.95,
    images: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
    ],
    category: 'honden',
    stock: 999,
    featured: true,
  },
  {
    name: 'Stille Kattenfontein met Koolstoffilter',
    slug: 'kattenfontein-koolstoffilter',
    description: 'Katten drinken liever stromend water — deze stijlvolle fontein filtert het water continu en houdt het vers en schoon. Superstille pomp (< 30dB). Inhoud 2,5 liter, ideaal voor meerdere katten. Beschermt de nierfunctie op de lange termijn. Inclusief 3 vervangende filters. Eenvoudig te reinigen.',
    price: 39.95,
    compare_price: 54.95,
    images: [
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&q=80',
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
    ],
    category: 'katten',
    stock: 999,
    featured: true,
  },
  {
    name: 'GPS Tracker voor Honden en Katten',
    slug: 'gps-tracker-honden-katten',
    description: 'Weet altijd waar je huisdier is. Compacte GPS tracker die je aan de halsband bevestigt. Real-time locatie via gratis app op je smartphone. Stel een veilige zone in en ontvang direct een melding als je huisdier die verlaat. Waterdicht (IP67), 7 dagen batterij. Werkt in heel Europa.',
    price: 44.95,
    compare_price: 64.95,
    images: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
    ],
    category: 'honden',
    stock: 999,
    featured: true,
  },
  {
    name: 'Slow Feeder Lick Mat voor Honden',
    slug: 'slow-feeder-lick-mat-honden',
    description: 'Vertraag het eten van je hond en stimuleer zijn hersenen! Deze siliconen lick mat met zuignap is ideaal voor natte voeding, pindakaas of yoghurt. Vermindert angst en verveling. Vaatwasserbestendig. Bevroren serveren voor extra verkoeling in de zomer. Dierenarts aanbevolen.',
    price: 18.95,
    compare_price: 26.95,
    images: [
      'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=600&q=80',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80',
    ],
    category: 'honden',
    stock: 999,
    featured: false,
  },
  {
    name: 'LED Halsband Hond USB Oplaadbaar',
    slug: 'led-halsband-hond-usb',
    description: 'Zichtbaar en veilig uitlaten in het donker! Deze LED halsband geeft heldere lichtimpulsen en is tot 500 meter zichtbaar. USB oplaadbaar — geen batterijen nodig. Waterdicht. Tot 8 uur brandtijd per lading. Verstelbaar voor alle rassen. Ideaal voor vroege ochtend of late avond wandelingen.',
    price: 22.95,
    compare_price: 32.95,
    images: [
      'https://images.unsplash.com/photo-1559249975-efb236a88a4a?w=600&q=80',
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&q=80',
    ],
    category: 'honden',
    stock: 999,
    featured: false,
  },
  {
    name: 'Huisdiercamera met Snackdispenser',
    slug: 'huisdiercamera-snackdispenser',
    description: 'Kijk en praat met je hond of kat terwijl je weg bent. HD camera met 130° kijkhoek, twee-weg audio en nachtzicht. Gooi snacks via de app — je huisdier hoort je stem en krijgt een traktatie. WiFi verbinding, werkt met Android en iOS. Vermindert scheidingsangst bij huisdieren.',
    price: 69.95,
    compare_price: 99.95,
    images: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80',
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80',
    ],
    category: 'honden',
    stock: 999,
    featured: true,
  },
  {
    name: 'Kattenhangmat Raam met Zuignap',
    slug: 'kattenhangmat-raam-zuignap',
    description: 'Geef je kat het beste uitzicht in huis! Deze raamhangmat bevestig je in seconden met sterke zuignappen op elk raam. Draagt tot 15 kg. Comfortabel fleece materiaal, machinewasbaar. Je kat kan urenlang buiten kijken — perfect voor appartementkatten. Geen boren of schroeven nodig.',
    price: 28.95,
    compare_price: 39.95,
    images: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
      'https://images.unsplash.com/photo-1548681528-6f5631a65a91?w=600&q=80',
    ],
    category: 'katten',
    stock: 999,
    featured: false,
  },
  {
    name: 'Automatische Voerbak met Timer en Recorder',
    slug: 'automatische-voerbak-timer-recorder',
    description: 'Nooit meer vergeten je huisdier te voeren! Programmeer tot 4 maaltijden per dag met exacte portiegroottes. Groot reservoir van 4 liter — genoeg voor meerdere dagen. Neem je eigen stem op als oproep. Werkt op stroom én batterijen als backup. Geschikt voor honden en katten.',
    price: 54.95,
    compare_price: 74.95,
    images: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80',
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80',
    ],
    category: 'honden',
    stock: 999,
    featured: true,
  },
]

async function run() {
  console.log('🔧 Producten fixen: afbeeldingen + prijzen\n')

  // Verwijder alles en herlaad
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  console.log('✓ Oude producten verwijderd')

  const { data, error } = await supabase.from('products').insert(products).select()

  if (error) {
    console.error('❌ Fout:', error.message)
    process.exit(1)
  }

  console.log(`\n✅ ${data.length} producten bijgewerkt:\n`)
  data.forEach(p => console.log(`  • ${p.name} — €${p.price}${p.compare_price ? ` (was €${p.compare_price})` : ''}`))
  console.log('\n🌐 https://pawsnl-shop.vercel.app\n')
}

run()
