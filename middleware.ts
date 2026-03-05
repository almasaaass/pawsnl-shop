import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

function addSecurityHeaders(response: NextResponse) {
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  return response
}

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''

  // Redirect old domain + www → pawsnlshop.com (keep path + query)
  if (host.includes('pawsshop.nl') || host === 'www.pawsnlshop.com') {
    const url = new URL(request.url)
    url.host = 'pawsnlshop.com'
    url.protocol = 'https'
    return NextResponse.redirect(url, 301)
  }

  const { pathname } = request.nextUrl

  // Admin routes: skip i18n, apply auth check
  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return addSecurityHeaders(NextResponse.next())
    }

    const adminAuth = request.cookies.get('admin-auth')?.value
    const adminSecret = process.env.ADMIN_SECRET

    if (!adminAuth || !adminSecret || adminAuth !== adminSecret) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    return addSecurityHeaders(NextResponse.next())
  }

  // API routes: skip i18n
  if (pathname.startsWith('/api')) {
    return addSecurityHeaders(NextResponse.next())
  }

  // All other routes: apply next-intl middleware
  // Domain-based routing handles locale detection automatically:
  // - pawsshop.nl → Dutch (default)
  // - pawsnlshop.com → English (default)
  // - Users can still switch: pawsshop.nl/en or pawsnlshop.com/nl
  const response = intlMiddleware(request)
  return addSecurityHeaders(response)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
