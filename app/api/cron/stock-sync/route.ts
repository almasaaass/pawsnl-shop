import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { getCJToken } from '@/lib/cj'

const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0'

// Haal voorraad op voor een specifiek product
async function getCJInventory(pid: string, token: string): Promise<number | null> {
  try {
    const res = await fetch(`${CJ_BASE}/v1/product/query?pid=${pid}`, {
      headers: { 'CJ-Access-Token': token },
    })
    const data = await res.json()
    if (!data.result || !data.data) return null

    // Tel totale voorraad van alle varianten
    const variants = data.data.variants ?? []
    if (variants.length > 0) {
      const total = variants.reduce((sum: number, v: any) => {
        return sum + (parseInt(v.variantInventory ?? '0') || 0)
      }, 0)
      return total
    }

    // Geen varianten — gebruik product-level inventory
    return parseInt(data.data.inventory ?? '0') || 0
  } catch {
    return null
  }
}

export async function GET(request: NextRequest) {
  // Alleen Vercel Cron mag dit aanroepen
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Haal alle producten op die een CJ pid hebben (slug bevat geen spaties = geïmporteerd)
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, stock, cj_pid')

  if (error || !products) {
    return NextResponse.json({ error: 'Database fout' }, { status: 500 })
  }

  let token: string
  try {
    token = await getCJToken()
  } catch (e: any) {
    return NextResponse.json({ error: `CJ auth mislukt: ${e.message}` }, { status: 503 })
  }

  const results: { name: string; oldStock: number; newStock: number }[] = []
  let outOfStock: string[] = []

  for (const product of products) {
    await new Promise(r => setTimeout(r, 300))

    // If product has a CJ pid, check real inventory
    if (product.cj_pid) {
      const cjStock = await getCJInventory(product.cj_pid, token)

      if (cjStock !== null) {
        let newStock = product.stock

        if (cjStock === 0) {
          // Out of stock at CJ
          newStock = 0
          outOfStock.push(product.name)
        } else if (cjStock < 10) {
          // Low stock warning
          newStock = cjStock
        } else {
          // In stock - set to dropshipping default
          newStock = 999
        }

        if (newStock !== product.stock) {
          await supabase.from('products').update({ stock: newStock }).eq('id', product.id)
          results.push({ name: product.name, oldStock: product.stock, newStock })
        }
      }
    } else {
      // No CJ pid - keep at dropshipping default
      if (product.stock !== 999) {
        await supabase.from('products').update({ stock: 999 }).eq('id', product.id)
        results.push({ name: product.name, oldStock: product.stock, newStock: 999 })
      }
    }
  }

  return NextResponse.json({
    success: true,
    checked: products.length,
    updated: results.length,
    updates: results,
    outOfStock,
    message: `${products.length} producten gecheckt, ${results.length} bijgewerkt`,
  })
}
