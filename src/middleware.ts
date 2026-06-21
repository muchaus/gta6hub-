import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/register']
const AUTH_ROUTES = ['/auth/login', '/auth/register']

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  })

  const { pathname } = req.nextUrl
  const isLoggedIn = !!token
  const isAuthRoute = AUTH_ROUTES.some(r => pathname.startsWith(r))
  const isPublic = PUBLIC_ROUTES.some(r => pathname === r)

  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL('/feed', req.url))
  }

  if (!isLoggedIn && !isPublic && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
