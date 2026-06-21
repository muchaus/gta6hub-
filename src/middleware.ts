import { NextRequest, NextResponse } from 'next/server'

const PUBLIC_PATHS = ['/', '/auth/login', '/auth/register']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Deixa passar rotas públicas e API
  if (
    PUBLIC_PATHS.includes(pathname) ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')
  ) {
    return NextResponse.next()
  }

  // Verifica se tem cookie de sessão do NextAuth v5
  const sessionToken =
    req.cookies.get('authjs.session-token')?.value ||
    req.cookies.get('__Secure-authjs.session-token')?.value ||
    req.cookies.get('next-auth.session-token')?.value ||
    req.cookies.get('__Secure-next-auth.session-token')?.value

  if (!sessionToken) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
