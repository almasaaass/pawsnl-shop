// Import winnende producten direct in Supabase
// Producten gevonden via CJ API met bevestigde PIDs en VIDs

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)

// CJ API om afbeeldingen op te halen
const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0'

async function getCJToken() {
  const res = await fetch(`${CJ_BASE}/v1/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: 'CJ5198246@api@dfff508709394ed5a6078a3534e23dad' })
  })
  const data = await res.json()
  if (!data.result) throw new Error('CJ auth failed: ' + data.message)
  return data.data.accessToken
}

async function getCJImages(pid, token) {
  const res = await fetch(`${CJ_BASE}/v1/product/query?pid=${pid}`, {
    headers: { 'CJ-Access-Token': token }
  })
  const data = await res.json()
  if (data.data?.productImageSet) {
    return data.data.productImageSet.slice(0, 4)
  }
  if (data.data?.productImage) {
    return [data.data.productImage]
  }
  return []
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

const products = [
  {
    name: 'Honden Pootjesreiniger 2-in-1',
    slug: 'honden-pootjesreiniger-2-in-1',
    description: 'Nooit meer modderige pootafdrukken in huis! Deze 2-in-1 pootjesreiniger heeft zachte siliconen borstels die vuil, modder en zand snel en voorzichtig verwijderen. Draai de borstel om en gebruik hem als washandschoen tijdens het badderen. Compact, lichtgewicht en met handig haakje om mee te nemen op wandelingen. Geschikt voor alle honden- en kattenrassen.',
    price: 14.95,
    compare_price: 24.95,
    category: 'honden',
    stock: 999,
    featured: true,
    cj_pid: '1661977359978860544',
    cj_vid: '1661977360045969408',
  },
  {
    name: 'LED Veiligheidshalsband Hond',
    slug: 'led-veiligheidshalsband-hond',
    description: 'Wordt je hond slecht gezien tijdens avondwandelingen? Deze LED halsband maakt je hond zichtbaar tot 500 meter afstand. Kies uit 3 verlichtingsmodi: constant aan, snel knipperend en langzaam knipperend. USB-oplaadbaar (geen batterijen nodig), waterdicht en verstelbaar. Verkrijgbaar in meerdere kleuren. Ideaal voor de donkere herfst- en wintermaanden in Nederland.',
    price: 12.95,
    compare_price: 19.95,
    category: 'honden',
    stock: 999,
    featured: true,
    cj_pid: '7BFA65D8-41B6-4316-A7F4-2EB2A34CA257',
    cj_vid: '01276391-DE7D-4950-BC8B-5C07FD4F734D',
  },
]

async function main() {
  console.log('CJ token ophalen...')
  let token
  try {
    token = await getCJToken()
    console.log('Token OK')
  } catch (e) {
    console.log('CJ auth mislukt (rate limit?), ga door zonder afbeeldingen')
    token = null
  }

  for (const product of products) {
    console.log(`\nImporteren: ${product.name}`)

    // Check of product al bestaat
    const { data: existing } = await supabase
      .from('products')
      .select('id, name')
      .eq('cj_pid', product.cj_pid)
      .single()

    if (existing) {
      console.log(`  Al aanwezig als: ${existing.name} (${existing.id})`)
      continue
    }

    // Afbeeldingen ophalen van CJ
    let images = []
    if (token) {
      try {
        await sleep(2000)
        images = await getCJImages(product.cj_pid, token)
        console.log(`  ${images.length} afbeeldingen opgehaald`)
      } catch (e) {
        console.log(`  Afbeeldingen ophalen mislukt: ${e.message}`)
      }
    }

    // Fallback: gebruik placeholder
    if (images.length === 0) {
      images = [`https://placehold.co/600x600/f3f4f6/9ca3af?text=${encodeURIComponent(product.name)}`]
      console.log('  Placeholder afbeelding gebruikt')
    }

    // Insert in Supabase
    const { data, error } = await supabase
      .from('products')
      .insert({
        ...product,
        images,
      })
      .select()
      .single()

    if (error) {
      console.error(`  FOUT: ${error.message}`)
    } else {
      console.log(`  OK! ID: ${data.id}`)
      console.log(`  Prijs: €${data.price} (was €${data.compare_price})`)
      console.log(`  Afbeeldingen: ${data.images.length}`)
    }
  }

  // Toon alle producten
  console.log('\n=== ALLE PRODUCTEN IN SHOP ===')
  const { data: all } = await supabase
    .from('products')
    .select('name, price, category, featured, cj_pid')
    .order('created_at', { ascending: false })

  if (all) {
    all.forEach(p => {
      const cj = p.cj_pid ? ' [CJ]' : ''
      const feat = p.featured ? ' ★' : ''
      console.log(`  €${p.price} | ${p.category} | ${p.name}${cj}${feat}`)
    })
    console.log(`\nTotaal: ${all.length} producten`)
  }
}

main().catch(console.error)
