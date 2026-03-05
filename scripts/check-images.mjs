import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)

// Fix all product images: remove social.png placeholders and corrupt stringified arrays
const { data: products } = await sb.from('products').select('id, name, images')

let fixed = 0
for (const p of products) {
  const cleanImages = []

  for (const img of p.images) {
    // Skip social.png placeholders (AI-generated, often wrong)
    if (img.includes('supabase.co/storage')) continue

    // Parse stringified JSON arrays (corrupt data from import)
    if (img.startsWith('[')) {
      try {
        const urls = JSON.parse(img)
        for (const url of urls) {
          if (url.startsWith('http') && !url.includes('supabase.co/storage') && !cleanImages.includes(url)) {
            cleanImages.push(url)
          }
        }
      } catch (e) {}
      continue
    }

    // Keep valid CJ image URLs (deduplicated)
    if (img.startsWith('http') && !cleanImages.includes(img)) {
      cleanImages.push(img)
    }
  }

  // Max 6 images per product
  const finalImages = cleanImages.slice(0, 6)

  if (JSON.stringify(finalImages) !== JSON.stringify(p.images)) {
    const { error } = await sb.from('products').update({ images: finalImages }).eq('id', p.id)
    if (error) {
      console.log(`FOUT ${p.name}:`, error.message)
    } else {
      console.log(`✓ ${p.name}: ${p.images.length} → ${finalImages.length} afbeeldingen`)
      fixed++
    }
  } else {
    console.log(`  ${p.name}: geen wijziging`)
  }
}

console.log(`\nKlaar! ${fixed} producten bijgewerkt.`)
