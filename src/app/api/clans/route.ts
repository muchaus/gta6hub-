import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).max(40),
  tag: z.string().min(2).max(5).regex(/^[A-Z0-9]+$/, 'Tag deve conter apenas letras e números'),
  description: z.string().max(300).optional(),
  focus: z.string().max(50).optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse({ ...body, tag: body.tag?.toUpperCase() })
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const { name, tag, description, focus } = parsed.data

  const exists = await db.execute({
    sql: `SELECT id FROM clans WHERE tag = ?`,
    args: [tag],
  })

  if (exists.rows.length > 0) {
    return NextResponse.json({ error: 'Essa tag já está em uso' }, { status: 409 })
  }

  const res = await db.execute({
    sql: `INSERT INTO clans (name, tag, description, focus, owner_id) VALUES (?, ?, ?, ?, ?)`,
    args: [name, tag, description ?? null, focus ?? null, session.user.id],
  })

  const clanId = res.lastInsertRowid?.toString() ?? ''

  // Adiciona o criador como membro owner
  const clanRes = await db.execute({
    sql: `SELECT id FROM clans WHERE tag = ?`,
    args: [tag],
  })
  const realId = clanRes.rows[0].id

  await db.execute({
    sql: `INSERT INTO clan_members (clan_id, user_id, role) VALUES (?, ?, 'owner')`,
    args: [realId, session.user.id],
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
