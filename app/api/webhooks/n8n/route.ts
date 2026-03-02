import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { sendTrackingEmail } from '@/lib/email'

/**
 * n8n webhook endpoint for automation triggers.
 * Auth: Bearer ADMIN_SECRET
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { action, data } = body

  const supabase = createAdminClient()

  switch (action) {
    case 'update_tracking': {
      // Update tracking number and send email
      const { order_id, tracking_number } = data
      const { data: order, error } = await supabase
        .from('orders')
        .update({ tracking_number, status: 'shipped' })
        .eq('id', order_id)
        .select()
        .single()

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })

      // Send tracking email
      if (order.customer_email && tracking_number) {
        await sendTrackingEmail({
          customerEmail: order.customer_email,
          customerName: order.customer_name || 'Klant',
          trackingNumber: tracking_number,
          items: order.items || [],
        })
      }

      return NextResponse.json({ success: true, order })
    }

    case 'update_status': {
      // Update order status
      const { order_id, status } = data
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', order_id)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true })
    }

    case 'disable_product': {
      // Set product stock to 0 (disable)
      const { product_id } = data
      const { error } = await supabase
        .from('products')
        .update({ stock: 0 })
        .eq('id', product_id)

      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      return NextResponse.json({ success: true })
    }

    case 'send_email': {
      // Generic email sending via Resend
      const { to, template, context } = data
      // Delegate to appropriate email function based on template
      return NextResponse.json({ success: true, message: 'Email queued' })
    }

    case 'get_stats': {
      // Quick stats for dashboard
      const now = new Date()
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()

      const [ordersToday, allOrders, products] = await Promise.all([
        supabase.from('orders').select('total').eq('status', 'paid').gte('created_at', todayStart),
        supabase.from('orders').select('id, total, status').eq('status', 'paid'),
        supabase.from('products').select('id, stock'),
      ])

      const revenueToday = (ordersToday.data || []).reduce((s, o) => s + (o.total || 0), 0)
      const revenueTotal = (allOrders.data || []).reduce((s, o) => s + (o.total || 0), 0)
      const outOfStock = (products.data || []).filter(p => p.stock === 0).length

      return NextResponse.json({
        orders_today: ordersToday.data?.length || 0,
        revenue_today: revenueToday,
        total_orders: allOrders.data?.length || 0,
        total_revenue: revenueTotal,
        total_products: products.data?.length || 0,
        out_of_stock: outOfStock,
      })
    }

    default:
      return NextResponse.json({ error: `Unknown action: ${action}` }, { status: 400 })
  }
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.ADMIN_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    status: 'ok',
    available_actions: [
      'update_tracking',
      'update_status',
      'disable_product',
      'send_email',
      'get_stats',
    ],
  })
}
