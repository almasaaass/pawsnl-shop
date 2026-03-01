import { NextRequest, NextResponse } from 'next/server'
import { sendContactFormToAdmin } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { naam, email, onderwerp, bericht } = await request.json()

    if (!naam || !email || !onderwerp || !bericht) {
      return NextResponse.json({ error: 'Alle velden zijn verplicht' }, { status: 400 })
    }

    await sendContactFormToAdmin({ naam, email, onderwerp, bericht })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Er is een fout opgetreden' }, { status: 500 })
  }
}
