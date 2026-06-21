import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import db from '@/lib/db'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: 'jwt' },
  pages: { signIn: '/auth/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = (user as any).username
        token.psnId = (user as any).psn_id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        ;(session.user as any).username = token.username
        ;(session.user as any).psnId = token.psnId
      }
      return session
    },
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Senha', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data
        const safeEmail = email.replace(/'/g, "''")

        const result = await db.execute(`SELECT * FROM users WHERE email = '${safeEmail}'`)
        const user = result.rows[0]
        if (!user) return null

        const valid = await bcrypt.compare(password, user.password as string)
        if (!valid) return null

        return {
          id: user.id as string,
          email: user.email as string,
          name: user.username as string,
          username: user.username,
          psn_id: user.psn_id,
        }
      },
    }),
  ],
})
