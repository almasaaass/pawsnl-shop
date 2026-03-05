import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { wachtwoord } = await request.json()
  const adminSecret = process.env.ADMIN_SECRET

  if (!adminSecret || wachtwoord !== adminSecret) {
    return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })

  response.cookies.set('admin-auth', adminSecret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  })

  return response
}
