import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { referralCode, action } = body

    if (!referralCode) {
      return NextResponse.json({ error: 'Missing referral code' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Log the referral action
    const { error: insertError } = await supabase
      .from('referral_clicks')
      .insert({
        referrer_email: referralCode,
        ip_address: action || 'share',
      })

    if (insertError) {
      console.error('Referral tracking error:', insertError)
      // Don't fail the request — tracking is best-effort
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Er ging iets mis.' }, { status: 500 })
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 })
  }

  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('referral_clicks')
    .select('id, clicked_at')
    .eq('referrer_email', code)
    .order('clicked_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Ophalen mislukt' }, { status: 500 })
  }

  return NextResponse.json({
    code,
    totalShares: data?.length ?? 0,
    shares: data ?? [],
  })
}
