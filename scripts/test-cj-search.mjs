/**
 * Test verschillende CJ zoek-methodes om de juiste producten te vinden.
 * Probeert: POST method, keyword parameter, category filter, shorter terms
 */

const CJ_API_KEY = 'CJ5198246@api@dfff508709394ed5a6078a3534e23dad'
const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0'
const sleep = ms => new Promise(r => setTimeout(r, ms))

let token = null

async function getToken() {
  if (token) return token
  console.log('⏳ Getting token...')
  const res = await fetch(`${CJ_BASE}/v1/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: CJ_API_KEY }),
  })
  const data = await res.json()
  if (!data.result) {
    if (data.message?.includes('Too Many Requests')) {
      console.log('Rate limit, wachten 60s...')
      await sleep(60000)
      return getToken()
    }
    throw new Error(`Auth failed: ${data.message}`)
  }
  token = data.data.accessToken
  console.log('✅ Token OK\n')
  return token
}

async function testSearch(label, method, url, body) {
  const tk = await getToken()
  const opts = {
    method,
    headers: { 'CJ-Access-Token': tk, 'Content-Type': 'application/json' },
  }
  if (body) opts.body = JSON.stringify(body)

  try {
    const res = await fetch(url, opts)
    const data = await res.json()

    if (data.result && data.data?.list?.length > 0) {
      console.log(`  ✅ ${label}: ${data.data.list.length} resultaten`)
      for (const p of data.data.list.slice(0, 3)) {
        const name = (p.productNameEn || p.productName || '').substring(0, 60)
        const imgs = (p.productImageSet?.length || 0) + (p.productImage ? 1 : 0)
        console.log(`     → "${name}" | PID: ${p.pid} | ${imgs} imgs`)
      }
      return data.data.list
    } else {
      console.log(`  ❌ ${label}: geen resultaten (${data.message || 'empty'})`)
      return []
    }
  } catch (err) {
    console.log(`  ❌ ${label}: ERROR - ${err.message}`)
    return []
  }
}

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔬 CJ API Search Methods Test')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  await getToken()

  // Test met 3 producten: 1 hond, 1 kat, 1 anders
  const testProducts = [
    { name: 'LED dog collar', slug: 'led-halsband' },
    { name: 'cat water fountain', slug: 'kattenfontein' },
    { name: 'dog harness', slug: 'hondentuig' },
  ]

  for (const tp of testProducts) {
    console.log(`\n🔍 Zoeken: "${tp.name}" (${tp.slug})`)
    console.log('─────────────────────────────────────')

    // Method 1: GET met productNameEn (huidige methode)
    await testSearch(
      'GET productNameEn',
      'GET',
      `${CJ_BASE}/v1/product/list?productNameEn=${encodeURIComponent(tp.name)}&pageNum=1&pageSize=5`,
    )
    await sleep(300)

    // Method 2: POST body met productNameEn
    await testSearch(
      'POST productNameEn',
      'POST',
      `${CJ_BASE}/v1/product/list`,
      { productNameEn: tp.name, pageNum: 1, pageSize: 5 },
    )
    await sleep(300)

    // Method 3: GET met categoryKeyword parameter
    await testSearch(
      'GET categoryKeyword',
      'GET',
      `${CJ_BASE}/v1/product/list?categoryKeyword=${encodeURIComponent(tp.name)}&pageNum=1&pageSize=5`,
    )
    await sleep(300)

    // Method 4: POST met keyword
    await testSearch(
      'POST keyword',
      'POST',
      `${CJ_BASE}/v1/product/list`,
      { keyword: tp.name, pageNum: 1, pageSize: 5 },
    )
    await sleep(300)

    // Method 5: GET met 1-word search
    const shortTerm = tp.name.split(' ')[0]
    await testSearch(
      `GET kort "${shortTerm}"`,
      'GET',
      `${CJ_BASE}/v1/product/list?productNameEn=${encodeURIComponent(shortTerm)}&pageNum=1&pageSize=5`,
    )
    await sleep(500)
  }

  // Also try: variant list endpoint
  console.log('\n\n🔍 Test: Product variants & detail endpoints')
  console.log('─────────────────────────────────────')

  // Test product detail for the duplicate PIDs
  const dupPids = ['2603010653141600700', '2603010719001626700', '2603010737181637900']
  for (const pid of dupPids) {
    const tk = await getToken()
    try {
      const res = await fetch(`${CJ_BASE}/v1/product/query?pid=${pid}`, {
        headers: { 'CJ-Access-Token': tk },
      })
      const data = await res.json()
      if (data.result && data.data) {
        const p = data.data
        const name = (p.productNameEn || p.productName || '').substring(0, 60)
        const imgs = (p.productImageSet?.length || 0) + (p.productImage ? 1 : 0)
        console.log(`  PID ${pid}: "${name}" | ${imgs} imgs | cat: ${p.categoryName || 'unknown'}`)
      } else {
        console.log(`  PID ${pid}: NOT FOUND`)
      }
    } catch (err) {
      console.log(`  PID ${pid}: ERROR - ${err.message}`)
    }
    await sleep(300)
  }
}

main().catch(console.error)
