import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://mumuorbsfiklktwqtveb.supabase.co','eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ')

const { data: product } = await supabase.from('products').select('*').eq('slug', 'anti-trek-hondentuigje-ontspannen-wandelen').single()

const sourceImage = (product.images || []).find(img => !img.includes('product-images')) || ''
console.log('Source image:', sourceImage)

const params = new URLSearchParams({
  template: 'infographic',
  name: product.name,
  price: '€16,95',
  image: sourceImage,
  category: product.category,
  features: 'Anti-trek design|Reflecterend materiaal|Verstelbaar|Geschikt voor alle rassen',
  badge: 'Bestseller',
  comparePrice: '€24,95',
  discount: '26',
})

const url = 'http://localhost:3000/api/admin/generate-image?' + params.toString()
console.log('URL length:', url.length)
console.log('URL preview:', url.substring(0, 300))

try {
  const res = await fetch(url, { signal: AbortSignal.timeout(30000) })
  console.log('Status:', res.status)
  if (res.ok) {
    const buf = await res.arrayBuffer()
    console.log('Size:', buf.byteLength, 'bytes')
  } else {
    const text = await res.text()
    console.log('Error body:', text.substring(0, 200))
  }
} catch (err) {
  console.log('Error name:', err.name)
  console.log('Error message:', err.message)
  if (err.cause) console.log('Error cause:', err.cause.message || err.cause)
}
