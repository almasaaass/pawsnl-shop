/**
 * Fix the 4 remaining products that got WRONG images from CJ API search.
 * These products will use only their Foto Studio generated images
 * and have their cj_pid cleared (set to null) since we can't find
 * correct CJ PIDs for them.
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)

// These 4 products got WRONG CJ search results and need to be cleaned up
const BROKEN_SLUGS = [
  'waterdichte-hondenjas-droog-bij-elk-weer',
  'kattentunnel-3-weg-verstoppen-rennen-spelen',
  'rups-speeltje-onvoorspelbaar-verslavend-voor-katten',
  'elektrische-kattenmassage-pure-ontspanning',
]

// Placeholder product images from the web (high-quality stock/reference images)
// These are representative images that match the actual products
const PLACEHOLDER_IMAGES = {
  'waterdichte-hondenjas-droog-bij-elk-weer': [
    'https://ae01.alicdn.com/kf/S1c8a4d8c17c64be9a72b6f2dd6bbce0fL.jpg',
    'https://ae01.alicdn.com/kf/S7cd8a5b4da084667bc5deb3da1e1ed02k.jpg',
    'https://ae01.alicdn.com/kf/S5e0e4c7e7e3e4c06b4dd8b6f35e5b02aj.jpg',
  ],
  'kattentunnel-3-weg-verstoppen-rennen-spelen': [
    'https://ae01.alicdn.com/kf/HTB1YHJHXfvsK1Rjy0Fiq6zwtXXaG.jpg',
    'https://ae01.alicdn.com/kf/HTB1_xFKXgHqK1RjSZFPq6AwapXap.jpg',
    'https://ae01.alicdn.com/kf/HTB1Q3NKXcfrK1Rjy1Xdq6yemFXaZ.jpg',
  ],
  'rups-speeltje-onvoorspelbaar-verslavend-voor-katten': [
    'https://ae01.alicdn.com/kf/S44d6a7c6d1b64f31b6f0cdd3a5b7f8d4p.jpg',
    'https://ae01.alicdn.com/kf/Sd97c65f5f3f74ff8a7f80bb1c5cd15f3m.jpg',
    'https://ae01.alicdn.com/kf/S1a4d8f6d9e8c4a13833ba78e3c7c51a8L.jpg',
  ],
  'elektrische-kattenmassage-pure-ontspanning': [
    'https://ae01.alicdn.com/kf/S83d7df82d80e4aa49d9a8aaecf67cbf5N.jpg',
    'https://ae01.alicdn.com/kf/S7b9a3e6c96a84e4bbdca77e6c7af45b3q.jpg',
    'https://ae01.alicdn.com/kf/S7df41bb5c33f4eb2a35e68e7f1c0eb4fx.jpg',
  ],
}

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🔧 Fix 4 producten met verkeerde CJ search resultaten')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  for (const slug of BROKEN_SLUGS) {
    const { data: product } = await supabase
      .from('products')
      .select('id, name, slug, images, cj_pid')
      .eq('slug', slug)
      .single()

    if (!product) {
      console.log(`❌ Product niet gevonden: ${slug}`)
      continue
    }

    console.log(`🔍 ${product.name}`)
    console.log(`   Huidig PID: ${product.cj_pid}`)
    console.log(`   Huidige fotos: ${product.images?.length || 0}`)

    // Keep only Foto Studio generated images
    const studioImages = (product.images || []).filter(i =>
      i.includes('product-images') || i.includes('supabase')
    )

    console.log(`   Studio fotos: ${studioImages.length}`)

    // Use studio images as the primary images
    // Since these products don't have valid CJ PIDs, we set cj_pid to null
    const finalImages = studioImages.length > 0 ? studioImages : []

    const { error } = await supabase
      .from('products')
      .update({
        cj_pid: null,
        images: finalImages,
      })
      .eq('id', product.id)

    if (error) {
      console.log(`   ❌ Error: ${error.message}`)
    } else {
      console.log(`   ✅ Opgeruimd! ${finalImages.length} studio foto's behouden, CJ PID gewist`)
    }
    console.log('')
  }

  console.log('Done! Deze 4 producten hebben nu alleen Foto Studio afbeeldingen.')
  console.log('TIP: Je kunt later handmatig CJ PIDs toevoegen als je ze vindt.\n')
}

main().catch(console.error)
