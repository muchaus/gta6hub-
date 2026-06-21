import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import db from '@/lib/db'
import { z } from 'zod'

const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Mínimo 3 caracteres')
    .max(20, 'Máximo 20 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Apenas letras, números e _'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  psn_id: z.string().max(16).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0].message },
        { status: 400 }
      )
    }

    const { username, email, password, psn_id } = parsed.data

    const existing = await db.execute({
      sql: 'SELECT id FROM users WHERE email = ? OR username = ?',
      args: [email, username],
    })

    if (existing.rows.length > 0) {
      return NextResponse.json(
        { error: 'Email ou username já em uso' },
        { status: 409 }
      )
    }

    const hashed = await bcrypt.hash(password, 12)

    await db.execute({
      sql: 'INSERT INTO users (username, email, password, psn_id) VALUES (?, ?, ?, ?)',
      args: [username, email, hashed, psn_id ?? null],
    })

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err: any) {
    console.error('[REGISTER ERROR]', err)
    return NextResponse.json(
      { error: 'Erro interno: ' + (err?.message ?? 'desconhecido') },
      { status: 500 }
    )
  }
}
