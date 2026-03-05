import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { sendLeadMagnetEmail, sendWelcomeEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, source } = body

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Ongeldig e-mailadres' }, { status: 400 })
    }

    const validSources = ['popup', 'footer', 'checkout', 'exit-intent', 'lead-magnet']
    const emailSource = validSources.includes(source) ? source : 'unknown'

    const supabase = createAdminClient()

    // Check for duplicate
    const { data: existing } = await supabase
      .from('email_signups')
      .select('id')
      .eq('email', email.toLowerCase().trim())
      .single()

    if (existing) {
      // Already signed up — still return success (don't reveal if email exists)
      return NextResponse.json({ success: true, message: 'Je ontvangt de gids per mail!' })
    }

    // Insert new signup
    const { error: insertError } = await supabase
      .from('email_signups')
      .insert({
        email: email.toLowerCase().trim(),
        source: emailSource,
      })

    if (insertError) {
      console.error('Newsletter signup error:', insertError)
      return NextResponse.json({ error: 'Aanmelding mislukt. Probeer het opnieuw.' }, { status: 500 })
    }

    // Send appropriate email based on source
    try {
      if (emailSource === 'exit-intent') {
        // Exit intent → welcome email with WELKOM10 coupon
        await sendWelcomeEmail({ email: email.toLowerCase().trim(), emailNumber: 1 })
      } else {
        // Default → lead magnet email
        await sendLeadMagnetEmail(email.toLowerCase().trim())
      }
    } catch (emailError) {
      console.error('Signup email error:', emailError)
      // Don't fail the signup if email fails
    }

    return NextResponse.json({ success: true, message: 'Je ontvangt de gids per mail!' })
  } catch {
    return NextResponse.json({ error: 'Er ging iets mis.' }, { status: 500 })
  }
}
