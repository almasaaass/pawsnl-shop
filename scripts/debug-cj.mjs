import { readFileSync } from 'fs'

const envFile = readFileSync('.env.local', 'utf8')
for (const line of envFile.split('\n')) {
  const match = line.match(/^([^#=]+)=(.*)$/)
  if (match) process.env[match[1].trim()] = match[2].trim()
}

const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0'

async function getToken() {
  const res = await fetch(`${CJ_BASE}/v1/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: process.env.CJ_API_KEY }),
  })
  const data = await res.json()
  console.log('Auth response:', JSON.stringify(data).slice(0, 200))
  if (data.result === false) return null
  return data.data.accessToken
}

async function main() {
  const token = await getToken()
  if (token === null) return

  // Test V2 endpoint
  console.log('\n=== Test V2 endpoint ===')
  const v2Res = await fetch(`${CJ_BASE}/v1/product/listV2?keyWord=dog&page=1&size=3`, {
    headers: { 'CJ-Access-Token': token },
  })
  const v2Data = await v2Res.json()
  console.log('V2 result:', v2Data.result, 'message:', v2Data.message)
  console.log('V2 data keys:', Object.keys(v2Data.data || {}))
  console.log('V2 total:', v2Data.data?.total)
  console.log('V2 list length:', v2Data.data?.list?.length)
  if (v2Data.data?.list?.length > 0) {
    const p = v2Data.data.list[0]
    console.log('First product:', p.productNameEn || p.productName)
    console.log('First product keys:', Object.keys(p))
  }
  console.log('V2 full response (first 500 chars):', JSON.stringify(v2Data).slice(0, 500))

  // Test legacy endpoint with productNameEn
  console.log('\n=== Test legacy endpoint with productNameEn ===')
  const legRes = await fetch(`${CJ_BASE}/v1/product/list?productNameEn=dog&pageNum=1&pageSize=3`, {
    headers: { 'CJ-Access-Token': token },
  })
  const legData = await legRes.json()
  console.log('Legacy result:', legData.result, 'message:', legData.message)
  console.log('Legacy list length:', legData.data?.list?.length)
  if (legData.data?.list?.length > 0) {
    const p = legData.data.list[0]
    console.log('First product:', p.productNameEn || p.productName)
  }
  console.log('Legacy full response (first 500 chars):', JSON.stringify(legData).slice(0, 500))

  // Test with POST instead of GET for V2
  console.log('\n=== Test V2 with POST ===')
  const v2PostRes = await fetch(`${CJ_BASE}/v1/product/listV2`, {
    method: 'POST',
    headers: {
      'CJ-Access-Token': token,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ keyWord: 'dog', page: 1, size: 3 }),
  })
  const v2PostData = await v2PostRes.json()
  console.log('V2 POST result:', v2PostData.result, 'message:', v2PostData.message)
  console.log('V2 POST list length:', v2PostData.data?.list?.length)
  if (v2PostData.data?.list?.length > 0) {
    const p = v2PostData.data.list[0]
    console.log('First product:', p.productNameEn || p.productName)
    console.log('Image:', p.productImage)
    console.log('Images:', (p.productImageSet || []).length)
  }
  console.log('V2 POST response (first 500 chars):', JSON.stringify(v2PostData).slice(0, 500))
}

main().catch(console.error)
