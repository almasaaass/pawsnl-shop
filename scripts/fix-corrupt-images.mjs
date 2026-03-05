/**
 * Fix corrupted image arrays in database.
 * Some products have stringified JSON arrays as image entries instead of direct URLs.
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)

async function main() {
  const { data: products } = await supabase.from('products').select('id, name, images')
  let fixed = 0

  for (const p of products) {
    if (!p.images || p.images.length === 0) continue

    let needsFix = false
    const cleanImages = []

    for (const img of p.images) {
      if (typeof img === 'string' && img.startsWith('[')) {
        try {
          const parsed = JSON.parse(img)
          if (Array.isArray(parsed)) {
            cleanImages.push(...parsed)
            needsFix = true
          }
        } catch {
          cleanImages.push(img)
        }
      } else {
        cleanImages.push(img)
      }
    }

    if (needsFix) {
      const unique = [...new Set(cleanImages)]
      console.log(`Fixing: ${p.name}`)
      console.log(`  Before: ${p.images.length} entries`)
      console.log(`  After: ${unique.length} clean URLs`)

      const { error } = await supabase.from('products').update({ images: unique }).eq('id', p.id)
      if (error) {
        console.log(`  ❌ Error: ${error.message}`)
      } else {
        console.log(`  ✅ Fixed!`)
        fixed++
      }
    }
  }

  console.log(`\nTotal fixed: ${fixed}`)
}

main().catch(console.error)
