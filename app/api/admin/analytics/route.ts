import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase'

export async function GET() {
  const cookieStore = cookies()
  const authCookie = cookieStore.get('admin-auth')
  if (authCookie?.value !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  const [{ data: orders }, { data: products }, { data: customers }] = await Promise.all([
    supabase
      .from('orders')
      .select('id, total, items, created_at, status, customer_name')
      .eq('status', 'paid')
      .order('created_at', { ascending: true }),
    supabase.from('products').select('id, name, category, price'),
    supabase.from('customers').select('id, created_at, total_spent'),
  ])

  const allOrders = orders ?? []

  // ─── Omzet & bestellingen per dag (laatste 30 dagen) ─────────────────────
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 29)
  thirtyDaysAgo.setHours(0, 0, 0, 0)

  const dailyMap: Record<string, { date: string; omzet: number; bestellingen: number }> = {}

  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo)
    d.setDate(thirtyDaysAgo.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
    dailyMap[key] = { date: label, omzet: 0, bestellingen: 0 }
  }

  for (const order of allOrders) {
    const key = order.created_at.slice(0, 10)
    if (dailyMap[key]) {
      dailyMap[key].omzet += Number(order.total)
      dailyMap[key].bestellingen += 1
    }
  }

  const dagelijks = Object.values(dailyMap)

  // ─── Top producten op basis van verkochte items ───────────────────────────
  const productStats: Record<string, { name: string; category: string; verkocht: number; omzet: number }> = {}

  for (const order of allOrders) {
    const items: { product_id: string; name: string; quantity: number; price: number }[] =
      Array.isArray(order.items) ? order.items : []

    for (const item of items) {
      if (!productStats[item.product_id]) {
        const product = products?.find((p) => p.id === item.product_id)
        productStats[item.product_id] = {
          name: item.name ?? product?.name ?? 'Onbekend',
          category: product?.category ?? '',
          verkocht: 0,
          omzet: 0,
        }
      }
      productStats[item.product_id].verkocht += item.quantity
      productStats[item.product_id].omzet += item.price * item.quantity
    }
  }

  const topProducten = Object.values(productStats)
    .sort((a, b) => b.omzet - a.omzet)
    .slice(0, 8)

  // ─── Omzet per categorie ──────────────────────────────────────────────────
  const categoryMap: Record<string, number> = {}
  for (const p of topProducten) {
    if (!categoryMap[p.category]) categoryMap[p.category] = 0
    categoryMap[p.category] += p.omzet
  }
  const perCategorie = Object.entries(categoryMap)
    .map(([name, omzet]) => ({ name, omzet }))
    .sort((a, b) => b.omzet - a.omzet)

  // ─── Totalen ──────────────────────────────────────────────────────────────
  const now = new Date()
  const startVandaag = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const startWeek = new Date(now)
  startWeek.setDate(now.getDate() - 7)
  const startMaand = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const omzetTotaal = allOrders.reduce((s, o) => s + Number(o.total), 0)
  const omzetVandaag = allOrders.filter((o) => o.created_at >= startVandaag).reduce((s, o) => s + Number(o.total), 0)
  const omzetWeek = allOrders.filter((o) => o.created_at >= startWeek.toISOString()).reduce((s, o) => s + Number(o.total), 0)
  const omzetMaand = allOrders.filter((o) => o.created_at >= startMaand).reduce((s, o) => s + Number(o.total), 0)

  const gemiddeldeOrderwaarde = allOrders.length > 0 ? omzetTotaal / allOrders.length : 0

  return NextResponse.json({
    totalen: {
      omzetTotaal,
      omzetVandaag,
      omzetWeek,
      omzetMaand,
      bestellingenTotaal: allOrders.length,
      klantenTotaal: customers?.length ?? 0,
      gemiddeldeOrderwaarde,
      productTotaal: products?.length ?? 0,
    },
    dagelijks,
    topProducten,
    perCategorie,
  })
}
