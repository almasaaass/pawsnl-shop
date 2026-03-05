const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0'
const API_KEY = process.env.CJ_API_KEY || 'CJ5198246@api@dfff508709394ed5a6078a3534e23dad'

async function main() {
  const res = await fetch(`${CJ_BASE}/v1/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: API_KEY }),
  })
  const auth = await res.json()
  if (!auth.data?.accessToken) {
    console.log('Auth failed:', JSON.stringify(auth))
    return
  }
  const token = auth.data.accessToken

  const r = await fetch(`${CJ_BASE}/v1/product/list?productNameEn=${encodeURIComponent('cat water fountain')}&pageNum=1&pageSize=3`, {
    headers: { 'CJ-Access-Token': token }
  })
  const data = await r.json()
  if (data.data?.list) {
    data.data.list.forEach(p => {
      console.log(`PID: ${p.pid}`)
      console.log(`Naam: ${p.productNameEn}`)
      console.log(`Prijs: €${p.sellPrice}`)
      console.log(`URL: https://cjdropshipping.com/product/detail/${p.pid}.html`)
      console.log('---')
    })
  } else {
    console.log('Search result:', JSON.stringify(data).slice(0, 300))
  }
}
main()
