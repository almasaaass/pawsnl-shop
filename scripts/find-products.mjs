// Script om producten te zoeken op CJ en te importeren
const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0'
const CJ_API_KEY = 'CJ5198246@api@dfff508709394ed5a6078a3534e23dad'

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function getToken() {
  const res = await fetch(`${CJ_BASE}/v1/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: CJ_API_KEY })
  })
  const data = await res.json()
  if (!data.result) {
    console.error('Auth failed:', data.message)
    process.exit(1)
  }
  console.log('Token OK')
  return data.data.accessToken
}

async function getProduct(pid, token) {
  const res = await fetch(`${CJ_BASE}/v1/product/query?pid=${pid}`, {
    headers: { 'CJ-Access-Token': token }
  })
  const data = await res.json()
  if (!data.result || !data.data) return null
  const p = data.data
  return {
    pid: p.pid,
    name: p.productNameEn || p.productName,
    cost: parseFloat(p.sellPrice || '0'),
    category: p.categoryName,
    images: (p.productImageSet || []).slice(0, 4),
    mainImage: p.productImage,
    variants: (p.variants || []).map(v => ({
      vid: v.vid,
      sku: v.variantSku,
      price: parseFloat(v.variantSellPrice || p.sellPrice || '0'),
      property: v.variantProperty,
      image: v.variantImage
    }))
  }
}

async function searchProducts(keyword, token) {
  const res = await fetch(`${CJ_BASE}/v1/product/list?productNameEn=${encodeURIComponent(keyword)}&pageNum=1&pageSize=20`, {
    headers: { 'CJ-Access-Token': token }
  })
  const data = await res.json()
  if (!data.result || !data.data?.list) return []
  return data.data.list.map(p => ({
    pid: p.pid,
    name: p.productNameEn || p.productName,
    cost: parseFloat(p.sellPrice || '0'),
    category: p.categoryName,
    image: p.productImage
  }))
}

async function main() {
  const token = await getToken()

  // 1. Paw Cleaner
  console.log('\n=== PAW CLEANER ===')
  await sleep(2000)
  const paw = await getProduct('1661977359978860544', token)
  if (paw) {
    console.log('Name:', paw.name)
    console.log('Cost USD:', paw.cost)
    console.log('Images:', paw.images.length)
    console.log('Variants:', paw.variants.length)
    if (paw.variants[0]) console.log('First VID:', paw.variants[0].vid, '|', paw.variants[0].property)
  } else {
    console.log('Niet gevonden')
  }

  // 2. LED Collar
  console.log('\n=== LED COLLAR ===')
  await sleep(2000)
  const led = await getProduct('7BFA65D8-41B6-4316-A7F4-2EB2A34CA257', token)
  if (led) {
    console.log('Name:', led.name)
    console.log('Cost USD:', led.cost)
    console.log('Images:', led.images.length)
    console.log('Variants:', led.variants.length)
    if (led.variants[0]) console.log('First VID:', led.variants[0].vid, '|', led.variants[0].property)
  } else {
    console.log('Niet gevonden')
  }

  // 3. Zoek naar lick mat, snuffle mat, en meer
  const searches = ['lick mat', 'snuffle mat', 'pet slow feeder', 'dog grooming glove']
  for (const kw of searches) {
    console.log(`\n=== SEARCH: ${kw} ===`)
    await sleep(2000)
    const results = await searchProducts(kw, token)
    const relevant = results.filter(r => {
      const n = r.name.toLowerCase()
      return n.includes('pet') || n.includes('dog') || n.includes('cat') || n.includes('lick') || n.includes('mat') || n.includes('snuffle') || n.includes('slow') || n.includes('grooming') || n.includes('glove')
    })
    if (relevant.length > 0) {
      relevant.slice(0, 5).forEach(r => console.log(`  PID: ${r.pid} | USD ${r.cost} | ${r.name}`))
    } else {
      console.log('  Geen relevante resultaten')
      // Toon eerste 3 resultaten voor debug
      results.slice(0, 3).forEach(r => console.log(`  (irrelevant) PID: ${r.pid} | ${r.name}`))
    }
  }
}

main().catch(console.error)
