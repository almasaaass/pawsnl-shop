/**
 * Check CJ API - test products and search
 */

const CJ_API_KEY = 'CJ5198246@api@dfff508709394ed5a6078a3534e23dad'
const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0'

async function getToken() {
  const res = await fetch(`${CJ_BASE}/v1/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: CJ_API_KEY }),
  })
  const data = await res.json()
  console.log('Auth response code:', data.code, 'result:', data.result)
  if (!data.result || !data.data) {
    console.log('Full auth response:', JSON.stringify(data))
    throw new Error(`Auth failed: ${data.message}`)
  }
  return data.data.accessToken
}

async function getProductDetail(token, pid) {
  const res = await fetch(`${CJ_BASE}/v1/product/query?pid=${pid}`, {
    headers: { 'CJ-Access-Token': token }
  })
  return await res.json()
}

async function searchProducts(token, keyword, pageSize = 10) {
  const res = await fetch(
    `${CJ_BASE}/v1/product/list?productNameEn=${encodeURIComponent(keyword)}&pageNum=1&pageSize=${pageSize}`,
    { headers: { 'CJ-Access-Token': token } }
  )
  return await res.json()
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function main() {
  const token = await getToken()
  console.log('✅ Token OK\n')

  // Check duplicate PIDs
  console.log('=== DUPLICATE PID DETAILS ===\n')
  const pids = ['2603010653141600700', '2603010719001626700', '2603010737181637900']
  for (const pid of pids) {
    const detail = await getProductDetail(token, pid)
    if (detail.result && detail.data) {
      const p = detail.data
      const imgCount = (p.productImageSet?.length || 0) + (p.productImage ? 1 : 0)
      console.log(`PID ${pid}:`)
      console.log(`  Name: ${p.productNameEn || p.productName}`)
      console.log(`  Images: ${imgCount}`)
      console.log(`  Category: ${p.categoryName || 'unknown'}`)
    } else {
      console.log(`PID ${pid}: NOT FOUND - ${detail.message}`)
    }
    console.log('')
    await sleep(300)
  }

  // Search for each problematic product with better terms
  console.log('=== SEARCH RESULTS ===\n')
  const searches = [
    { name: 'Anti-Trek Hondentuig', term: 'no pull dog harness' },
    { name: 'Draagbare Waterfles', term: 'dog water bottle' },
    { name: 'Honden Badjas', term: 'dog bathrobe' },
    { name: 'Koelvest Honden', term: 'dog cooling vest' },
    { name: 'LED Halsband', term: 'LED dog collar' },
    { name: 'Waterdichte Hondenjas', term: 'waterproof dog jacket' },
    { name: 'Kattenlaser', term: 'cat laser toy' },
    { name: 'Kattenmassage', term: 'cat massage' },
    { name: 'Kattenrugzak', term: 'cat backpack' },
    { name: 'Kattentunnel', term: 'cat tunnel' },
    { name: 'Rups speeltje', term: 'caterpillar toy cat' },
    { name: 'Slangen speeltje', term: 'snake toy cat' },
    { name: 'Kattenfontein', term: 'cat water fountain' },
    { name: 'Tandenborstel', term: 'dog toothbrush toy' },
    { name: 'Verkoelende Mat', term: 'pet cooling mat' },
  ]

  for (const s of searches) {
    const result = await searchProducts(token, s.term, 5)
    if (result.result && result.data?.list?.length > 0) {
      console.log(`${s.name} ("${s.term}"):`)
      for (const p of result.data.list.slice(0, 3)) {
        const imgCount = (p.productImageSet?.length || 0) + (p.productImage ? 1 : 0)
        console.log(`  - ${(p.productNameEn || p.productName).substring(0, 65)} | PID: ${p.pid} | imgs: ${imgCount}`)
      }
    } else {
      console.log(`${s.name} ("${s.term}"): NO RESULTS`)
    }
    console.log('')
    await sleep(400)
  }
}

main().catch(console.error)
