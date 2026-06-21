import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

const PUBLIC_ROUTES = ['/', '/auth/login', '/auth/register']
const AUTH_ROUTES = ['/auth/login', '/auth/register']

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session

  const isPublic = PUBLIC_ROUTES.includes(nextUrl.pathname)
  const isAuthRoute = AUTH_ROUTES.includes(nextUrl.pathname)

  // Usuário logado tentando acessar login/register → redireciona pro feed
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL('/feed', nextUrl))
  }

  // Rota privada sem sessão → redireciona pro login
  if (!isLoggedIn && !isPublic) {
    return NextResponse.redirect(new URL('/auth/login', nextUrl))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
