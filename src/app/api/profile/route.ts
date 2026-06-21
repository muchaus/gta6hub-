import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  psn_id: z.string().max(16).optional(),
  bio: z.string().max(200).optional(),
  avatar_url: z.string().url().optional(),
})

export async function PATCH(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })

    const userId = (session.user.id ?? '').replace(/'/g, "''")
    const psn = (parsed.data.psn_id ?? '').replace(/'/g, "''")
    const bio = (parsed.data.bio ?? '').replace(/'/g, "''")
    const avatar = (parsed.data.avatar_url ?? '').replace(/'/g, "''")
    const avatarClause = avatar ? `, avatar_url = '${avatar}'` : ''

    await db.execute(
      `UPDATE users SET psn_id = '${psn}', bio = '${bio}'${avatarClause} WHERE id = '${userId}'`
    )

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
