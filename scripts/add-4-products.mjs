/**
 * Re-add the 4 removed products with correct images from other webshops.
 * These products were removed because they had wrong CJ images.
 * Now we add them back with verified images from trusted sources.
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)

const products = [
  {
    name: 'Waterdichte Hondenjas — Droog bij Elk Weer',
    slug: 'waterdichte-hondenjas-droog-bij-elk-weer',
    description: 'Bescherm je hond tegen regen, wind en modder met deze waterdichte hondenjas. Gemaakt van hoogwaardig waterafstotend materiaal met reflecterende strepen voor extra zichtbaarheid in het donker. De verstelbare klittenbandsluiting zorgt voor een perfecte pasvorm. Lichtgewicht en comfortabel, ideaal voor dagelijkse wandelingen bij slecht weer.',
    price: 19.95,
    compare_price: 29.95,
    images: [
      'https://www.holypetz.com/cdn/shop/files/Dog_Fashion_Splicing_Golden_Retriever_Big_Dog_Raincoat_Medium_and_Large_Dog_Four-legged_All-inclusive_Waterproof_Pet_Poncho_green.jpg?v=1770335532',
      'https://www.holypetz.com/cdn/shop/files/Dog_Fashion_Splicing_Golden_Retriever_Big_Dog_Raincoat_Medium_and_Large_Dog_Four-legged_All-inclusive_Waterproof_Pet_Poncho_BLUE.jpg?v=1770335549',
      'https://www.dierenoppasamersfoort.nl/wp-content/uploads/2024/10/Waterdichte-hondenjas-honden-regenjas-winterjas-hond-met-ritssluiting-rits-tuigje-jas-action-lidl-action-aanbieding.jpg',
      'https://www.dierenoppasamersfoort.nl/wp-content/uploads/2024/10/Beste-regenjas-hond-herfst-winter-waterafstotend-softshell.jpg',
    ],
    category: 'honden',
    stock: 999,
    featured: false,
    cj_pid: null,
    cj_vid: null,
  },
  {
    name: 'Kattentunnel 3-weg — Verstoppen, Rennen & Spelen',
    slug: 'kattentunnel-3-weg-verstoppen-rennen-spelen',
    description: 'Deze opvouwbare 3-weg kattentunnel biedt eindeloos speelplezier voor je kat. Met drie ingangen, kraakgeluid en een hangend speelballetje. Gemaakt van duurzaam polyester met een stevig stalen frame dat zijn vorm behoudt. Klapt in seconden op voor makkelijke opslag. Perfect voor katten die graag rennen, verstoppen en op ontdekking gaan.',
    price: 14.95,
    compare_price: 22.95,
    images: [
      'https://buddiespetshop.com/cdn/shop/files/buddies-pet-shop-toys-3-way-collapsible-tunnel-cat-toy-40636728705263.png?v=1714164485',
      'https://buddiespetshop.com/cdn/shop/files/buddies-pet-shop-toys-3-way-collapsible-tunnel-cat-toy-39919906521327.jpg?v=1714164488',
      'https://buddiespetshop.com/cdn/shop/files/buddies-pet-shop-toys-3-way-collapsible-tunnel-cat-toy-39919906488559.jpg?v=1714164122',
      'https://buddiespetshop.com/cdn/shop/files/buddies-pet-shop-toys-3-way-collapsible-tunnel-cat-toy-39919906783471.jpg?v=1714164125',
    ],
    category: 'katten',
    stock: 999,
    featured: false,
    cj_pid: null,
    cj_vid: null,
  },
  {
    name: 'Rups Speeltje — Onvoorspelbaar & Verslavend voor Katten',
    slug: 'rups-speeltje-onvoorspelbaar-verslavend-voor-katten',
    description: 'Dit slimme interactieve kattenspeeltje met rupsvormige staart activeert automatisch via een bewegingssensor wanneer je kat dichtbij komt. De onvoorspelbare bewegingen van de pluizige staart imiteren echt prooi-gedrag en stimuleren het natuurlijke jachtinstinct. Stevige zuignap voor bevestiging op gladde oppervlakken. USB-oplaadbaar — 2,5 uur laden voor 2+ uur speelplezier.',
    price: 22.95,
    compare_price: 32.95,
    images: [
      'https://pawslovestore.com/cdn/shop/files/IMG_1218.jpg?v=1744012540',
      'https://pawslovestore.com/cdn/shop/files/IMG_1219.jpg?v=1744012560',
      'https://pawslovestore.com/cdn/shop/files/IMG_1220.jpg?v=1744012566',
      'https://pawslovestore.com/cdn/shop/files/IMG_1221.jpg?v=1744012570',
      'https://pawslovestore.com/cdn/shop/files/IMG_1224.jpg?v=1744012576',
      'https://pawslovestore.com/cdn/shop/files/IMG_1223.jpg?v=1744012581',
      'https://happy-luna.com/cdn/shop/files/whirlie_main.png?v=1745480238',
    ],
    category: 'katten',
    stock: 999,
    featured: false,
    cj_pid: null,
    cj_vid: null,
  },
  {
    name: 'Elektrische Kattenmassage — Pure Ontspanning',
    slug: 'elektrische-kattenmassage-pure-ontspanning',
    description: 'Geef je kat de ultieme verwennerij met deze elektrische kattenmassage. Met 4 roterende massagekoppen die zachtjes kneden voor diepe ontspanning. Vermindert stress en angst, verlicht stijve spieren en versterkt de band met je huisdier. Draadloos, oplaadbaar en stil. Geschikt voor katten én honden.',
    price: 19.95,
    compare_price: 29.95,
    images: [
      'https://pawslovestore.com/cdn/shop/files/Sd3253b65018f4c138c2b2f40c9117630T.jpg?v=1685532570',
      'https://pawslovestore.com/cdn/shop/files/S6b5e948004224f759c3bd9f4b3719a51g.jpg?v=1685532568',
      'https://pawslovestore.com/cdn/shop/files/S45181fa85f244862a98f6314306f30efa.jpg?v=1685532575',
      'https://pawslovestore.com/cdn/shop/files/S28f5a08976d54bb2a8bbcf40b4590d9bg.jpg?v=1685532579',
      'https://pawslovestore.com/cdn/shop/files/S864421bcabfd4e95878da31e0572b483B.jpg?v=1685532583',
    ],
    category: 'katten',
    stock: 999,
    featured: false,
    cj_pid: null,
    cj_vid: null,
  },
]

async function main() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('➕ 4 producten opnieuw toevoegen met juiste afbeeldingen')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // First verify images are accessible
  for (const product of products) {
    console.log(`🔍 ${product.name}`)
    const validImages = []
    for (const url of product.images) {
      try {
        const res = await fetch(url, { method: 'HEAD', redirect: 'follow' })
        if (res.ok) {
          validImages.push(url)
        } else {
          console.log(`   ⚠️  ${res.status}: ${url.substring(0, 70)}...`)
        }
      } catch (err) {
        console.log(`   ⚠️  Error: ${url.substring(0, 70)}...`)
      }
    }
    product.images = validImages
    console.log(`   ✅ ${validImages.length} afbeeldingen bereikbaar`)
  }

  console.log('\n═══ Toevoegen aan database ═══\n')

  let added = 0
  for (const product of products) {
    // Check if already exists
    const { data: existing } = await supabase
      .from('products')
      .select('id')
      .eq('slug', product.slug)

    if (existing && existing.length > 0) {
      console.log(`⏩ ${product.name} — bestaat al, overslaan`)
      continue
    }

    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select('id, name')
      .single()

    if (error) {
      console.log(`❌ ${product.name}: ${error.message}`)
    } else {
      console.log(`✅ ${product.name} — toegevoegd (${product.images.length} fotos)`)
      added++
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`📊 ${added}/4 producten toegevoegd`)

  // Final count
  const { count } = await supabase.from('products').select('*', { count: 'exact', head: true })
  console.log(`📦 Totaal producten in database: ${count}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main().catch(console.error)
