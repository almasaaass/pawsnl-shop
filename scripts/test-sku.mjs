const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0'
const API_KEY = 'CJ5198246@api@dfff508709394ed5a6078a3534e23dad'
const SKU = 'CJGY186687603CX'

async function main() {
  // Get token
  const res = await fetch(`${CJ_BASE}/v1/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: API_KEY }),
  })
  const auth = await res.json()
  console.log('Auth:', JSON.stringify(auth).slice(0, 200))
  if (!auth.data?.accessToken) { console.log('Auth failed'); return }
  const token = auth.data.accessToken
  console.log('Token OK')

  // Test 1: /v1/product/query?productSku=
  console.log('\n--- Test 1: /v1/product/query?productSku= ---')
  const r1 = await fetch(`${CJ_BASE}/v1/product/query?productSku=${SKU}`, {
    headers: { 'CJ-Access-Token': token },
  })
  const d1 = await r1.json()
  console.log(JSON.stringify(d1).slice(0, 300))

  // Test 2: /v1/product/list?productSku=
  console.log('\n--- Test 2: /v1/product/list?productSku= ---')
  const r2 = await fetch(`${CJ_BASE}/v1/product/list?productSku=${SKU}&pageNum=1&pageSize=5`, {
    headers: { 'CJ-Access-Token': token },
  })
  const d2 = await r2.json()
  console.log(JSON.stringify(d2).slice(0, 300))

  // Test 3: POST /v1/product/query with body
  console.log('\n--- Test 3: POST /v1/product/query ---')
  const r3 = await fetch(`${CJ_BASE}/v1/product/query`, {
    method: 'POST',
    headers: { 'CJ-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ productSku: SKU }),
  })
  const d3 = await r3.json()
  console.log(JSON.stringify(d3).slice(0, 300))

  // Test 4: /v2/product/query with SKU
  console.log('\n--- Test 4: /v2/product/query?productSku= ---')
  const r4 = await fetch(`${CJ_BASE}/v2/product/query?productSku=${SKU}`, {
    headers: { 'CJ-Access-Token': token },
  })
  const d4 = await r4.json()
  console.log(JSON.stringify(d4).slice(0, 300))

  // Test 5: search by SKU as keyword
  console.log('\n--- Test 5: /v1/product/list?productNameEn=SKU ---')
  const r5 = await fetch(`${CJ_BASE}/v1/product/list?productNameEn=${SKU}&pageNum=1&pageSize=5`, {
    headers: { 'CJ-Access-Token': token },
  })
  const d5 = await r5.json()
  console.log(JSON.stringify(d5).slice(0, 300))
}
main()
