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

  // ─── Revenue & orders per day (last 30 days) ─────────────────────
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  const thirtyDaysAgo = new Date(today)
  thirtyDaysAgo.setDate(today.getDate() - 29)
  thirtyDaysAgo.setHours(0, 0, 0, 0)

  const dailyMap: Record<string, { date: string; revenue: number; orders: number }> = {}

  for (let i = 0; i < 30; i++) {
    const d = new Date(thirtyDaysAgo)
    d.setDate(thirtyDaysAgo.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    const label = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
    dailyMap[key] = { date: label, revenue: 0, orders: 0 }
  }

  for (const order of allOrders) {
    const key = order.created_at.slice(0, 10)
    if (dailyMap[key]) {
      dailyMap[key].revenue += Number(order.total)
      dailyMap[key].orders += 1
    }
  }

  const daily = Object.values(dailyMap)

  // ─── Top products based on sold items ───────────────────────────
  const productStats: Record<string, { name: string; category: string; sold: number; revenue: number }> = {}

  for (const order of allOrders) {
    const items: { product_id: string; name: string; quantity: number; price: number }[] =
      Array.isArray(order.items) ? order.items : []

    for (const item of items) {
      if (!productStats[item.product_id]) {
        const product = products?.find((p) => p.id === item.product_id)
        productStats[item.product_id] = {
          name: item.name ?? product?.name ?? 'Unknown',
          category: product?.category ?? '',
          sold: 0,
          revenue: 0,
        }
      }
      productStats[item.product_id].sold += item.quantity
      productStats[item.product_id].revenue += item.price * item.quantity
    }
  }

  const topProducts = Object.values(productStats)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8)

  // ─── Revenue per category ──────────────────────────────────────────────────
  const categoryMap: Record<string, number> = {}
  for (const p of topProducts) {
    if (!categoryMap[p.category]) categoryMap[p.category] = 0
    categoryMap[p.category] += p.revenue
  }
  const perCategory = Object.entries(categoryMap)
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)

  // ─── Totals ──────────────────────────────────────────────────────────────
  const now = new Date()
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const startWeek = new Date(now)
  startWeek.setDate(now.getDate() - 7)
  const startMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const revenueTotal = allOrders.reduce((s, o) => s + Number(o.total), 0)
  const revenueToday = allOrders.filter((o) => o.created_at >= startToday).reduce((s, o) => s + Number(o.total), 0)
  const revenueWeek = allOrders.filter((o) => o.created_at >= startWeek.toISOString()).reduce((s, o) => s + Number(o.total), 0)
  const revenueMonth = allOrders.filter((o) => o.created_at >= startMonth).reduce((s, o) => s + Number(o.total), 0)

  const averageOrderValue = allOrders.length > 0 ? revenueTotal / allOrders.length : 0

  return NextResponse.json({
    totals: {
      revenueTotal,
      revenueToday,
      revenueWeek,
      revenueMonth,
      ordersTotal: allOrders.length,
      customersTotal: customers?.length ?? 0,
      averageOrderValue,
      productsTotal: products?.length ?? 0,
    },
    daily,
    topProducts,
    perCategory,
  })
}
