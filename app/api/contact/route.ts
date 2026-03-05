import { NextRequest, NextResponse } from 'next/server'
import { sendContactFormToAdmin } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }

    await sendContactFormToAdmin({ name, email, subject, message })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
