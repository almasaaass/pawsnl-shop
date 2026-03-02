import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)
const { data } = await supabase.from('products').select('name,slug,images,category').order('category').order('name')
for (const p of data) {
  console.log(`[${p.category}] ${p.name}`)
  for (const img of (p.images || [])) {
    console.log(`  ${img}`)
  }
  console.log()
}
