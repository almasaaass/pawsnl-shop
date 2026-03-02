import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { verifyAdmin } from '@/lib/auth'

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const supabase = createAdminClient()

  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay())).toISOString()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  const [
    { data: allOrders },
    { data: klanten },
    { data: producten },
    { data: resenteOrders },
  ] = await Promise.all([
    supabase.from('orders').select('total, created_at, status').eq('status', 'paid').neq('status', 'cancelled'),
    supabase.from('customers').select('id'),
    supabase.from('products').select('id'),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(10),
  ])

  const orders = allOrders ?? []

  const omzet_vandaag = orders
    .filter((o) => o.created_at >= startOfDay)
    .reduce((sum, o) => sum + (o.total ?? 0), 0)

  const omzet_week = orders
    .filter((o) => o.created_at >= startOfWeek)
    .reduce((sum, o) => sum + (o.total ?? 0), 0)

  const omzet_maand = orders
    .filter((o) => o.created_at >= startOfMonth)
    .reduce((sum, o) => sum + (o.total ?? 0), 0)

  const orders_vandaag = orders.filter((o) => o.created_at >= startOfDay).length

  return NextResponse.json({
    omzet_vandaag,
    omzet_week,
    omzet_maand,
    orders_vandaag,
    orders_totaal: orders.length,
    klanten_totaal: klanten?.length ?? 0,
    producten_totaal: producten?.length ?? 0,
    recente_orders: resenteOrders ?? [],
  })
}
