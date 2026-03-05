/**
 * Update images for the 4 remaining products using images from other webshops.
 * These products had no valid CJ PID, so we use product images found online.
 *
 * Sources:
 * - Waterdichte Hondenjas: holypetz.com, dierenoppasamersfoort.nl
 * - Kattentunnel 3-weg: buddiespetshop.com
 * - Rups Speeltje: pawslovestore.com, happy-luna.com
 * - Elektrische Kattenmassage: pawslovestore.com
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)

// Product images found from other webshops
const PRODUCT_IMAGES = {
  'waterdichte-hondenjas-droog-bij-elk-weer': {
    name: 'Waterdichte Hondenjas',
    images: [
      'https://www.holypetz.com/cdn/shop/files/Dog_Fashion_Splicing_Golden_Retriever_Big_Dog_Raincoat_Medium_and_Large_Dog_Four-legged_All-inclusive_Waterproof_Pet_Poncho_green.jpg?v=1770335532',
      'https://www.holypetz.com/cdn/shop/files/Dog_Fashion_Splicing_Golden_Retriever_Big_Dog_Raincoat_Medium_and_Large_Dog_Four-legged_All-inclusive_Waterproof_Pet_Poncho_BLUE.jpg?v=1770335549',
      'https://www.dierenoppasamersfoort.nl/wp-content/uploads/2024/10/Waterdichte-hondenjas-honden-regenjas-winterjas-hond-met-ritssluiting-rits-tuigje-jas-action-lidl-action-aanbieding.jpg',
      'https://www.dierenoppasamersfoort.nl/wp-content/uploads/2024/10/Beste-regenjas-hond-herfst-winter-waterafstotend-softshell.jpg',
    ],
  },

  'kattentunnel-3-weg-verstoppen-rennen-spelen': {
    name: 'Kattentunnel 3-weg',
    images: [
      'https://buddiespetshop.com/cdn/shop/files/buddies-pet-shop-toys-3-way-collapsible-tunnel-cat-toy-40636728705263.png?v=1714164485',
      'https://buddiespetshop.com/cdn/shop/files/buddies-pet-shop-toys-3-way-collapsible-tunnel-cat-toy-39919906521327.jpg?v=1714164488',
      'https://buddiespetshop.com/cdn/shop/files/buddies-pet-shop-toys-3-way-collapsible-tunnel-cat-toy-39919906488559.jpg?v=1714164122',
      'https://buddiespetshop.com/cdn/shop/files/buddies-pet-shop-toys-3-way-collapsible-tunnel-cat-toy-39919906783471.jpg?v=1714164125',
    ],
  },

  'rups-speeltje-onvoorspelbaar-verslavend-voor-katten': {
    name: 'Rups Speeltje',
    images: [
      'https://pawslovestore.com/cdn/shop/files/IMG_1218.jpg?v=1744012540',
      'https://pawslovestore.com/cdn/shop/files/IMG_1219.jpg?v=1744012560',
      'https://pawslovestore.com/cdn/shop/files/IMG_1220.jpg?v=1744012566',
      'https://pawslovestore.com/cdn/shop/files/IMG_1221.jpg?v=1744012570',
      'https://pawslovestore.com/cdn/shop/files/IMG_1224.jpg?v=1744012576',
      'https://pawslovestore.com/cdn/shop/files/IMG_1223.jpg?v=1744012581',
      'https://happy-luna.com/cdn/shop/files/whirlie_main.png?v=1745480238',
    ],
  },

  'elektrische-kattenmassage-pure-ontspanning': {
    name: 'Elektrische Kattenmassage',
    images: [
      'https://pawslovestore.com/cdn/shop/files/Sd3253b65018f4c138c2b2f40c9117630T.jpg?v=1685532570',
      'https://pawslovestore.com/cdn/shop/files/S6b5e948004224f759c3bd9f4b3719a51g.jpg?v=1685532568',
      'https://pawslovestore.com/cdn/shop/files/S45181fa85f244862a98f6314306f30efa.jpg?v=1685532575',
      'https://pawslovestore.com/cdn/shop/files/S28f5a08976d54bb2a8bbcf40b4590d9bg.jpg?v=1685532579',
      'https://pawslovestore.com/cdn/shop/files/S864421bcabfd4e95878da31e0572b483B.jpg?v=1685532583',
    ],
  },
}

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🖼️  Update afbeeldingen voor 4 producten')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // First, verify all images are accessible
  console.log('🔍 Controleren of alle afbeeldingen bereikbaar zijn...\n')

  for (const [slug, data] of Object.entries(PRODUCT_IMAGES)) {
    console.log(`📦 ${data.name}:`)
    const validImages = []

    for (const url of data.images) {
      try {
        const res = await fetch(url, { method: 'HEAD', redirect: 'follow' })
        if (res.ok) {
          console.log(`   ✅ ${url.substring(0, 80)}...`)
          validImages.push(url)
        } else {
          console.log(`   ❌ ${res.status} — ${url.substring(0, 80)}...`)
        }
      } catch (err) {
        console.log(`   ❌ Error — ${url.substring(0, 80)}...`)
      }
    }

    data.validImages = validImages
    console.log(`   → ${validImages.length}/${data.images.length} bereikbaar\n`)
  }

  // Now update the database
  console.log('═══ Database updaten ═══\n')

  let updated = 0

  for (const [slug, data] of Object.entries(PRODUCT_IMAGES)) {
    if (data.validImages.length === 0) {
      console.log(`❌ ${data.name}: Geen bereikbare afbeeldingen, overslaan`)
      continue
    }

    // Get current product to preserve studio images
    const { data: product } = await supabase
      .from('products')
      .select('id, name, images')
      .eq('slug', slug)
      .single()

    if (!product) {
      console.log(`❌ ${data.name}: Product niet gevonden in DB`)
      continue
    }

    // Keep Foto Studio generated images
    const studioImages = (product.images || []).filter(i =>
      i.includes('product-images') || i.includes('supabase')
    )

    // Combine: new images first, then studio images
    const finalImages = [...data.validImages, ...studioImages]

    const { error } = await supabase
      .from('products')
      .update({ images: finalImages })
      .eq('id', product.id)

    if (error) {
      console.log(`❌ ${data.name}: DB Error — ${error.message}`)
    } else {
      console.log(`✅ ${data.name}: ${finalImages.length} afbeeldingen (${data.validImages.length} nieuw + ${studioImages.length} studio)`)
      updated++
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`📊 ${updated}/4 producten bijgewerkt`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main().catch(console.error)
