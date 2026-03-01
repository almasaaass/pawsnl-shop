import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { sendDailyReport } from '@/lib/email'

// Beveiligd met een secret header zodat alleen Vercel Cron dit kan aanroepen
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const now = new Date()

  // Tijdgrenzen
  const startOfToday = new Date(now)
  startOfToday.setHours(0, 0, 0, 0)

  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  // Alle bestellingen ophalen
  const { data: orders } = await supabase
    .from('orders')
    .select('total, status, customer_name, created_at')
    .eq('status', 'paid')
    .order('created_at', { ascending: false })

  const { data: customers } = await supabase.from('customers').select('id')

  const allOrders = orders ?? []

  const revenueToday = allOrders
    .filter((o) => new Date(o.created_at) >= startOfToday)
    .reduce((sum, o) => sum + Number(o.total), 0)

  const ordersToday = allOrders.filter((o) => new Date(o.created_at) >= startOfToday).length

  const revenueWeek = allOrders
    .filter((o) => new Date(o.created_at) >= startOfWeek)
    .reduce((sum, o) => sum + Number(o.total), 0)

  const ordersWeek = allOrders.filter((o) => new Date(o.created_at) >= startOfWeek).length

  const revenueMonth = allOrders.reduce((sum, o) => sum + Number(o.total), 0)

  const date = now.toLocaleDateString('nl-NL', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  await sendDailyReport({
    date,
    revenueToday,
    ordersToday,
    revenueWeek,
    ordersWeek,
    revenueMonth,
    totalCustomers: customers?.length ?? 0,
    totalOrders: allOrders.length,
    recentOrders: allOrders.slice(0, 5),
  })

  return NextResponse.json({ ok: true, date })
}
