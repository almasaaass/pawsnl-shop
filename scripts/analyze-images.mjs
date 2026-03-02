/**
 * Analyse: welke producten hebben juiste/verkeerde foto's?
 */
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)

async function main() {
  const { data } = await supabase
    .from('products')
    .select('id, name, slug, images, cj_pid, category')
    .order('name')

  // Count PIDs
  const pidMap = {}
  for (const p of data) {
    if (!p.cj_pid) continue
    if (!pidMap[p.cj_pid]) pidMap[p.cj_pid] = []
    pidMap[p.cj_pid].push(p)
  }

  const uniqueProducts = []
  const duplicateProducts = []

  for (const p of data) {
    const count = pidMap[p.cj_pid]?.length || 0
    if (count > 1) {
      duplicateProducts.push(p)
    } else {
      uniqueProducts.push(p)
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📊 PawsNL — Product Image Analyse')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  console.log(`✅ JUISTE FOTOS (unieke PID) — ${uniqueProducts.length} producten:`)
  for (const p of uniqueProducts) {
    const cjImgs = (p.images || []).filter(i => !i.includes('product-images'))
    console.log(`   ${p.name}`)
    console.log(`      PID: ${p.cj_pid} | ${cjImgs.length} CJ foto's | cat: ${p.category}`)
  }

  console.log('')
  console.log(`❌ VERKEERDE FOTOS (gedeelde PID) — ${duplicateProducts.length} producten:`)

  // Group by PID
  const dupPids = Object.entries(pidMap).filter(([, list]) => list.length > 1)
  for (const [pid, products] of dupPids) {
    console.log(`\n   PID ${pid} (${products.length} producten delen dit):`)
    for (const p of products) {
      console.log(`      ❌ ${p.name} (${p.category})`)
      console.log(`         slug: ${p.slug}`)
    }
  }

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`Totaal: ${data.length} producten`)
  console.log(`✅ Correcte foto's: ${uniqueProducts.length}`)
  console.log(`❌ Verkeerde foto's: ${duplicateProducts.length}`)
  console.log(`📦 Duplicate PIDs: ${dupPids.length}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  // Print products that need fixing as a clean list
  console.log('🔧 PRODUCTEN DIE GEFIXT MOETEN WORDEN:')
  console.log('   (deze producten hebben de foto van een ANDER product)\n')
  for (const p of duplicateProducts) {
    console.log(`   - ${p.name}`)
  }
}

main().catch(console.error)
