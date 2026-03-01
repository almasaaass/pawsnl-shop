import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createAdminClient()
  const { status, tracking_number } = await request.json()

  const updateData: Record<string, string> = {}
  if (status) updateData.status = status
  if (tracking_number !== undefined) updateData.tracking_number = tracking_number

  const { data, error } = await supabase
    .from('orders')
    .update(updateData)
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
