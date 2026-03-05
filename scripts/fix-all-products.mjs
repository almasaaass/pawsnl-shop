import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)

// Elke product krijgt unieke, passende foto's
// Unsplash foto ID's die ik specifiek heb geselecteerd per producttype
const PRODUCT_DATA = {
  // ─── HONDEN ──────────────────────────────────────────────
  'anti-schrok-voerbak-voor-honden': {
    images: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&fit=crop', // hond eet uit bak
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&fit=crop',
    ],
  },
  'anti-slip-hondensokken-4-stuks': {
    images: [
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&fit=crop', // schattige hond op vloer
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&fit=crop',
    ],
  },
  'anti-trek-hondenharnas-reflecterend': {
    images: [
      'https://images.unsplash.com/photo-1558929996-da64ba858215?w=600&fit=crop', // hond met harnas uitlaten
      'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600&fit=crop',
    ],
  },
  'automatische-voerbak-timer-recorder': {
    images: [
      'https://images.unsplash.com/photo-1583337130417-13104dec14a8?w=600&fit=crop', // hond bij voerbak
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&fit=crop',
    ],
  },
  'gps-tracker-honden-katten': {
    images: [
      'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&fit=crop', // hond buiten
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&fit=crop',
    ],
  },
  'huisdiercamera-snackdispenser': {
    images: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&fit=crop', // hond kijkt in camera
      'https://images.unsplash.com/photo-1583337130417-13104dec14a8?w=600&fit=crop',
    ],
  },
  'snuffelmat-honden-interactief': {
    images: [
      'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=600&fit=crop', // hond snuffelt
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&fit=crop',
    ],
  },
  'led-halsband-hond-usb': {
    images: [
      'https://images.unsplash.com/photo-1559249975-efb236a88a4a?w=600&fit=crop', // hond in donker/avond
      'https://images.unsplash.com/photo-1477884213360-7e9d7dcc8f9b?w=600&fit=crop',
    ],
  },
  'likmat-voor-honden-met-zuignap': {
    images: [
      'https://images.unsplash.com/photo-1581888227599-779811939961?w=600&fit=crop', // hond likt
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&fit=crop',
    ],
  },
  'multivitamine-kauwtabletten-honden': {
    images: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&fit=crop', // gezonde hond
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&fit=crop',
    ],
  },
  'opvouwbare-reisbak-honden-set': {
    images: [
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&fit=crop', // hond buiten
      'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600&fit=crop',
    ],
  },
  'poten-reiniger-voor-honden': {
    images: [
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&fit=crop', // hondenpoten
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=600&fit=crop',
    ],
  },
  'regenjas-voor-honden-waterproof': {
    images: [
      'https://images.unsplash.com/photo-1477884213360-7e9d7dcc8f9b?w=600&fit=crop', // hond in regen
      'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600&fit=crop',
    ],
  },
  'slow-feeder-lick-mat-honden': {
    images: [
      'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&fit=crop', // hond eten
      'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=600&fit=crop',
    ],
  },
  'tandenborstel-kauwspeeltje-voor-honden': {
    images: [
      'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&fit=crop', // hond kauwt
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&fit=crop',
    ],
  },
  'verkoelende-mat-voor-honden': {
    images: [
      'https://images.unsplash.com/photo-1558929996-da64ba858215?w=600&fit=crop', // hond ligt
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&fit=crop',
    ],
  },
  'waterdichte-hondenjas-reflectie': {
    images: [
      'https://images.unsplash.com/photo-1530281700549-e82e7bf110d6?w=600&fit=crop', // hond uitlaten buiten
      'https://images.unsplash.com/photo-1477884213360-7e9d7dcc8f9b?w=600&fit=crop',
    ],
  },
  'zelfreinigende-huisdier-borstel': {
    images: [
      'https://images.unsplash.com/photo-1583337130417-13104dec14a8?w=600&fit=crop', // hond verzorging
      'https://images.unsplash.com/photo-1534361960057-19889db9621e?w=600&fit=crop',
    ],
  },
  // ─── KATTEN ──────────────────────────────────────────────
  'laser-speelgoed-katten': {
    images: [
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&fit=crop', // speelse kat
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&fit=crop',
    ],
  },
  'kattenhangmat-raam-zuignap': {
    images: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&fit=crop', // kat bij raam
      'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&fit=crop',
    ],
  },
  'kattenrugzak-met-kijkvenster': {
    images: [
      'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&fit=crop', // kat kijkt
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&fit=crop',
    ],
  },
  'krabmat-sisal-bank': {
    images: [
      'https://images.unsplash.com/photo-1548681528-6f5631a65a91?w=600&fit=crop', // kat op bank
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&fit=crop',
    ],
  },
  'kattentunnel-3-weg-opvouwbaar': {
    images: [
      'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&fit=crop', // speelse kat
      'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&fit=crop',
    ],
  },
  'raamhangmat-voor-katten': {
    images: [
      'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&fit=crop', // kat kijkt uit raam
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&fit=crop',
    ],
  },
  'kattenfontein-koolstoffilter': {
    images: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&fit=crop', // kat drinkt
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&fit=crop',
    ],
  },
  'zelfverwarmende-kattenmat': {
    images: [
      'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&fit=crop', // slapende kat
      'https://images.unsplash.com/photo-1548681528-6f5631a65a91?w=600&fit=crop',
    ],
  },
  // ─── KNAAGDIEREN ─────────────────────────────────────────
  'houten-speelset-knaagdieren': {
    images: [
      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&fit=crop', // hamster
      'https://images.unsplash.com/photo-1425082661507-d633be39a7b2?w=600&fit=crop',
    ],
  },
  'koelmat-knaagdieren-aluminium': {
    images: [
      'https://images.unsplash.com/photo-1452721226468-f95fb66ebf83?w=600&fit=crop', // cavia
      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&fit=crop',
    ],
  },
  'speeltunnel-voor-konijnen': {
    images: [
      'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=600&fit=crop', // konijn
      'https://images.unsplash.com/photo-1452857297128-d9c29adba80b?w=600&fit=crop',
    ],
  },
  'stil-loopwiel-hamster': {
    images: [
      'https://images.unsplash.com/photo-1425082661507-d633be39a7b2?w=600&fit=crop', // hamster
      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&fit=crop',
    ],
  },
  // ─── VOGELS ──────────────────────────────────────────────
  'vogelschommel-natuurlijk-speelgoed': {
    images: [
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&fit=crop', // parkiet
      'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&fit=crop',
    ],
  },
  'vogelbadje-automatisch-waterstroom': {
    images: [
      'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&fit=crop', // vogel
      'https://images.unsplash.com/photo-1520808663317-647b476a81b9?w=600&fit=crop',
    ],
  },
  'vogelkooi-ladder-klimrek-set': {
    images: [
      'https://images.unsplash.com/photo-1520808663317-647b476a81b9?w=600&fit=crop', // vogel in kooi
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&fit=crop',
    ],
  },
  'vogelspeelgoed-set-10-delig': {
    images: [
      'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&fit=crop', // kleurrijke vogel
      'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&fit=crop',
    ],
  },
}

let updated = 0
let errors = 0

for (const [slug, data] of Object.entries(PRODUCT_DATA)) {
  const { error } = await supabase
    .from('products')
    .update({ images: data.images })
    .eq('slug', slug)

  if (error) {
    console.log(`❌ ${slug}: ${error.message}`)
    errors++
  } else {
    console.log(`✅ ${slug}`)
    updated++
  }
}

console.log(`\n${updated} producten bijgewerkt, ${errors} fouten`)
