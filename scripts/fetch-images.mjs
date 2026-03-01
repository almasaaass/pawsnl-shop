import { readFileSync } from 'fs'
import { createClient } from '@supabase/supabase-js'

const envFile = readFileSync('.env.local', 'utf8')
for (const line of envFile.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
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
  if (data.result === false) {
    console.log('Auth error:', data.message)
    return null
  }
  return data.data.accessToken
}

async function search(token, keyword) {
  const res = await fetch(`${CJ_BASE}/v1/product/list?productNameEn=${encodeURIComponent(keyword)}&pageNum=1&pageSize=5`, {
    headers: { 'CJ-Access-Token': token },
  })
  const data = await res.json()
  if (data.result === false || (data.data?.list ?? []).length === 0) return []
  return data.data.list.map(p => ({
    pid: p.pid,
    name: p.productNameEn || p.productName,
    image: p.productImage,
    images: (p.productImageSet || [p.productImage]).filter(Boolean),
    category: p.categoryName || '',
  }))
}

async function getDetail(token, pid) {
  const res = await fetch(`${CJ_BASE}/v1/product/query?pid=${pid}`, {
    headers: { 'CJ-Access-Token': token },
  })
  const data = await res.json()
  if (data.result === false) return null
  const p = data.data
  return {
    pid: p.pid,
    name: p.productNameEn || p.productName,
    images: (p.productImageSet || [p.productImage]).filter(Boolean),
  }
}

const PRODUCT_SEARCHES = [
  { slug: 'automatische-voerbak-timer-recorder', queries: ['automatic pet feeder', 'pet feeder timer', 'auto feeder dog'] },
  { slug: 'huisdiercamera-snackdispenser', queries: ['pet camera treat', 'dog camera dispenser', 'pet camera wifi'] },
  { slug: 'anti-trek-hondenharnas-reflecterend', queries: ['dog harness no pull', 'reflective dog harness', 'dog vest harness'] },
  { slug: 'gps-tracker-honden-katten', queries: ['pet GPS tracker', 'mini GPS tracker', 'dog tracker'] },
  { slug: 'slow-feeder-lick-mat-honden', queries: ['lick mat dog', 'slow feeder mat', 'dog licking pad'] },
  { slug: 'led-halsband-hond-usb', queries: ['LED dog collar', 'light up collar', 'glow dog collar'] },
  { slug: 'kattenfontein-koolstoffilter', queries: ['cat water fountain', 'pet fountain', 'cat drinking fountain'] },
  { slug: 'kattenhangmat-raam-zuignap', queries: ['cat window hammock', 'cat window bed', 'cat perch window'] },
  { slug: 'laser-speelgoed-katten', queries: ['cat laser toy', 'automatic laser cat', 'interactive cat toy laser'] },
  { slug: 'kattentunnel-3-weg-opvouwbaar', queries: ['cat tunnel', 'pet tunnel 3 way', 'foldable cat tunnel'] },
  { slug: 'zelfverwarmende-kattenmat', queries: ['self heating pet mat', 'thermal cat mat', 'self warming cat bed'] },
  { slug: 'krabmat-sisal-bank', queries: ['cat scratch mat sisal', 'cat scratcher pad', 'sisal cat mat'] },
  { slug: 'snuffelmat-honden-interactief', queries: ['snuffle mat dog', 'dog nose work mat', 'sniffing mat pet'] },
  { slug: 'opvouwbare-reisbak-honden-set', queries: ['collapsible dog bowl', 'travel dog bowl', 'foldable pet bowl'] },
  { slug: 'waterdichte-hondenjas-reflectie', queries: ['waterproof dog jacket', 'dog raincoat', 'dog coat waterproof'] },
  { slug: 'vogelschommel-natuurlijk-speelgoed', queries: ['bird swing toy', 'parrot swing', 'bird cage swing wood'] },
  { slug: 'vogelbadje-automatisch-waterstroom', queries: ['bird bath', 'parrot bath', 'bird bathtub'] },
  { slug: 'vogelkooi-ladder-klimrek-set', queries: ['bird ladder toy', 'parrot climbing toy', 'bird cage ladder'] },
  { slug: 'stil-loopwiel-hamster', queries: ['hamster wheel silent', 'hamster running wheel', 'silent exercise wheel'] },
  { slug: 'houten-speelset-knaagdieren', queries: ['hamster toy wood', 'wooden hamster toy', 'small pet toy wood'] },
  { slug: 'koelmat-knaagdieren-aluminium', queries: ['hamster cooling plate', 'pet cooling mat small', 'cooling pad hamster'] },
]

async function main() {
  const token = await getToken()
  if (token === null) return

  console.log('Token OK\n')

  let updated = 0
  let failed = 0

  for (const product of PRODUCT_SEARCHES) {
    console.log(`--- ${product.slug} ---`)
    let found = false

    for (const q of product.queries) {
      if (found) break
      const results = await search(token, q)

      if (results.length > 0) {
        // Get detail for more images
        const detail = await getDetail(token, results[0].pid)
        const images = (detail ? detail.images : results[0].images).slice(0, 4)

        if (images.length > 0) {
          console.log(`  Found: ${results[0].name} (${images.length} images)`)

          const { error } = await supabase
            .from('products')
            .update({ images })
            .eq('slug', product.slug)

          if (error) {
            console.log(`  DB error: ${error.message}`)
            failed++
          } else {
            console.log(`  Updated in DB`)
            updated++
          }
          found = true
        }
      }

      // Small delay between requests
      await new Promise(r => setTimeout(r, 500))
    }

    if (found === false) {
      console.log(`  No results found`)
      failed++
    }
  }

  console.log(`\nDone: ${updated} updated, ${failed} failed`)
}

main().catch(console.error)
