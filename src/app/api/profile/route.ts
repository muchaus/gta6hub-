import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  psn_id: z.string().max(16).optional(),
  bio: z.string().max(200).optional(),
})

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

  await db.execute({
    sql: `UPDATE users SET psn_id = ?, bio = ? WHERE id = ?`,
    args: [parsed.data.psn_id ?? null, parsed.data.bio ?? null, session.user.id],
  })

  return NextResponse.json({ ok: true })
}
