import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { naam, email, onderwerp, bericht } = await request.json()

    if (!naam || !email || !onderwerp || !bericht) {
      return NextResponse.json({ error: 'Alle velden zijn verplicht' }, { status: 400 })
    }

    // Hier kun je een e-mailservice koppelen zoals Resend of SendGrid
    // Voorbeeld met Resend:
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'PawsNL <noreply@pawsnl.nl>',
    //   to: 'info@pawsnl.nl',
    //   subject: `Nieuw bericht: ${onderwerp}`,
    //   html: `<p>Van: ${naam} (${email})</p><p>${bericht}</p>`,
    // })

    console.log('Contactformulier ontvangen:', { naam, email, onderwerp, bericht })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Er is een fout opgetreden' }, { status: 500 })
  }
}
