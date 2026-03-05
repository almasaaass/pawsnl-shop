import { createClient } from '@supabase/supabase-js'

const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0'

async function getCJToken() {
  const res = await fetch(`${CJ_BASE}/v1/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiKey: 'CJ5198246@api@dfff508709394ed5a6078a3534e23dad' })
  })
  const data = await res.json()
  if (data.result === false) {
    throw new Error(data.message)
  }
  return data.data.accessToken
}

const supabase = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)

async function main() {
  console.log('CJ token ophalen...')
  const token = await getCJToken()
  console.log('Token OK')

  // Paw cleaner images
  console.log('\nPootjesreiniger afbeeldingen ophalen...')
  const res = await fetch(`${CJ_BASE}/v1/product/query?pid=1661977359978860544`, {
    headers: { 'CJ-Access-Token': token }
  })
  const data = await res.json()

  if (data.data && data.data.productImageSet) {
    const images = data.data.productImageSet.slice(0, 4)
    console.log(`${images.length} afbeeldingen gevonden:`)
    images.forEach((img, i) => console.log(`  ${i + 1}: ${img}`))

    const { error } = await supabase
      .from('products')
      .update({ images })
      .eq('cj_pid', '1661977359978860544')

    if (error) {
      console.error('Update mislukt:', error.message)
    } else {
      console.log('Afbeeldingen succesvol bijgewerkt!')
    }
  } else {
    console.log('Geen afbeeldingen gevonden:', data.message || 'unknown error')
  }
}

main().catch(console.error)
