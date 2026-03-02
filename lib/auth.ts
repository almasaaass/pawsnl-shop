import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'

/**
 * Verify admin access for API routes.
 * Supports both cookie auth (browser) and Bearer token (n8n/API).
 */
export function verifyAdmin(request?: NextRequest): boolean {
  const adminSecret = process.env.ADMIN_SECRET
  if (!adminSecret) return false

  // Check Bearer token first (for n8n/API access)
  if (request) {
    const authHeader = request.headers.get('authorization')
    if (authHeader === `Bearer ${adminSecret}`) return true
  }

  // Check cookie (for browser admin panel)
  try {
    const cookieStore = cookies()
    const auth = cookieStore.get('admin-auth')
    return auth?.value === adminSecret
  } catch {
    return false
  }
}

/**
 * Verify cron job access (Vercel Cron).
 */
export function verifyCron(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization')
  return authHeader === `Bearer ${process.env.CRON_SECRET}`
}
