import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(2).max(40),
  tag: z.string().min(2).max(5).regex(/^[A-Z0-9]+$/),
  description: z.string().max(300).optional(),
  focus: z.string().max(50).optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  try {
    const body = await req.json()
    const parsed = schema.safeParse({ ...body, tag: body.tag?.toUpperCase() })
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

    const { name, tag, description, focus } = parsed.data
    const userId = (session.user.id ?? '').replace(/'/g, "''")
    const safeName = name.replace(/'/g, "''")
    const safeDesc = (description ?? '').replace(/'/g, "''")
    const safeFocus = (focus ?? '').replace(/'/g, "''")

    const exists = await db.execute(`SELECT id FROM clans WHERE tag = '${tag}'`)
    if (exists.rows.length > 0) return NextResponse.json({ error: 'Essa tag já está em uso' }, { status: 409 })

    await db.execute(
      `INSERT INTO clans (name, tag, description, focus, owner_id) VALUES ('${safeName}', '${tag}', '${safeDesc}', '${safeFocus}', '${userId}')`
    )

    const clanRes = await db.execute(`SELECT id FROM clans WHERE tag = '${tag}'`)
    const clanId = clanRes.rows[0].id

    await db.execute(
      `INSERT INTO clan_members (clan_id, user_id, role) VALUES ('${clanId}', '${userId}', 'owner')`
    )

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
