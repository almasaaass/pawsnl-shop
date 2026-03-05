import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

const STATUS_MAP: Record<string, { label: string; description: string; step: number }> = {
  paid: {
    label: 'Bestelling ontvangen',
    description: 'We hebben je bestelling ontvangen en verwerken deze zo snel mogelijk.',
    step: 1,
  },
  shipped: {
    label: 'Onderweg',
    description: 'Je pakket is verzonden en is onderweg naar jou. Verwachte levertijd: 7-14 werkdagen.',
    step: 2,
  },
  delivered: {
    label: 'Afgeleverd',
    description: 'Je pakket is afgeleverd. Veel plezier met je bestelling!',
    step: 3,
  },
  cancelled: {
    label: 'Geannuleerd',
    description: 'Deze bestelling is geannuleerd.',
    step: 0,
  },
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email')?.trim().toLowerCase()

  if (!email) {
    return NextResponse.json({ error: 'E-mailadres is verplicht' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, items, total, status, created_at, shipping_address')
    .eq('customer_email', email)
    .order('created_at', { ascending: false })
    .limit(10)

  if (error || !orders || orders.length === 0) {
    return NextResponse.json({ error: 'Geen bestellingen gevonden voor dit e-mailadres' }, { status: 404 })
  }

  // Return orders WITHOUT tracking numbers — only show status
  const safeOrders = orders.map((order) => {
    const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.paid

    return {
      id: order.id.slice(0, 8).toUpperCase(),
      items: (order.items as { name: string; quantity: number }[]).map((i) => ({
        name: i.name,
        quantity: i.quantity,
      })),
      total: order.total,
      status: order.status,
      statusLabel: statusInfo.label,
      statusDescription: statusInfo.description,
      step: statusInfo.step,
      date: order.created_at,
      city: (order.shipping_address as { city?: string })?.city || '',
    }
  })

  return NextResponse.json({ orders: safeOrders })
}
