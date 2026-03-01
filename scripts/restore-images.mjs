import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

const envFile = readFileSync('.env.local', 'utf8')
for (const line of envFile.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)

// Good quality Unsplash product-style photos per category
const IMAGES = {
  // Honden producten
  'automatische-voerbak-timer-recorder': [
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80',
  ],
  'huisdiercamera-snackdispenser': [
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80',
  ],
  'anti-trek-hondenharnas-reflecterend': [
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
  ],
  'gps-tracker-honden-katten': [
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
  ],
  'slow-feeder-lick-mat-honden': [
    'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=600&q=80',
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&q=80',
  ],
  'led-halsband-hond-usb': [
    'https://images.unsplash.com/photo-1559249975-efb236a88a4a?w=600&q=80',
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&q=80',
  ],
  'snuffelmat-honden-interactief': [
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
    'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=600&q=80',
  ],
  'opvouwbare-reisbak-honden-set': [
    'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600&q=80',
    'https://images.unsplash.com/photo-1559249975-efb236a88a4a?w=600&q=80',
  ],
  'waterdichte-hondenjas-reflectie': [
    'https://images.unsplash.com/photo-1559249975-efb236a88a4a?w=600&q=80',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=80',
  ],
  // Katten producten
  'kattenfontein-koolstoffilter': [
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&q=80',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
  ],
  'kattenhangmat-raam-zuignap': [
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
    'https://images.unsplash.com/photo-1548681528-6f5631a65a91?w=600&q=80',
  ],
  'laser-speelgoed-katten': [
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&q=80',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600&q=80',
  ],
  'kattentunnel-3-weg-opvouwbaar': [
    'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&q=80',
    'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=600&q=80',
  ],
  'zelfverwarmende-kattenmat': [
    'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?w=600&q=80',
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=80',
  ],
  'krabmat-sisal-bank': [
    'https://images.unsplash.com/photo-1548681528-6f5631a65a91?w=600&q=80',
    'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?w=600&q=80',
  ],
  // Vogels producten
  'vogelschommel-natuurlijk-speelgoed': [
    'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&q=80',
    'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&q=80',
  ],
  'vogelbadje-automatisch-waterstroom': [
    'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=600&q=80',
    'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&q=80',
  ],
  'vogelkooi-ladder-klimrek-set': [
    'https://images.unsplash.com/photo-1520808663317-647b476a81b9?w=600&q=80',
    'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600&q=80',
  ],
  // Knaagdieren producten
  'stil-loopwiel-hamster': [
    'https://images.unsplash.com/photo-1425082661507-d633be39a7b2?w=600&q=80',
    'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&q=80',
  ],
  'houten-speelset-knaagdieren': [
    'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&q=80',
    'https://images.unsplash.com/photo-1425082661507-d633be39a7b2?w=600&q=80',
  ],
  'koelmat-knaagdieren-aluminium': [
    'https://images.unsplash.com/photo-1452721226468-f95fb66ebf83?w=600&q=80',
    'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&q=80',
  ],
}

async function main() {
  console.log('Restoring product images...\n')
  let restored = 0

  for (const [slug, images] of Object.entries(IMAGES)) {
    const { error } = await supabase
      .from('products')
      .update({ images })
      .eq('slug', slug)

    if (error) {
      console.log(`  Error ${slug}: ${error.message}`)
    } else {
      console.log(`  Restored: ${slug}`)
      restored++
    }
  }

  console.log(`\nDone: ${restored} products restored`)
}

main().catch(console.error)
