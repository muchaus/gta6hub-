import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import db from '@/lib/db'
import { z } from 'zod'

const registerSchema = z.object({
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
  email: z.string().email(),
  password: z.string().min(6),
  psn_id: z.string().max(16).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

    const { username, email, password, psn_id } = parsed.data
    const safeUser = username.replace(/'/g, "''")
    const safeEmail = email.replace(/'/g, "''")
    const safePsn = (psn_id ?? '').replace(/'/g, "''")

    const existing = await db.execute(
      `SELECT id FROM users WHERE email = '${safeEmail}' OR username = '${safeUser}'`
    )
    if (existing.rows.length > 0) return NextResponse.json({ error: 'Email ou username já em uso' }, { status: 409 })

    const hashed = await bcrypt.hash(password, 12)
    const safeHash = hashed.replace(/'/g, "''")

    await db.execute(
      `INSERT INTO users (username, email, password, psn_id) VALUES ('${safeUser}', '${safeEmail}', '${safeHash}', '${safePsn}')`
    )

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
