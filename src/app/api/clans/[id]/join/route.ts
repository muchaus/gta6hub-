import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import db from '@/lib/db'

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const { id } = params

  const existing = await db.execute({
    sql: `SELECT id, role FROM clan_members WHERE clan_id = ? AND user_id = ?`,
    args: [id, session.user.id],
  })

  if (existing.rows.length > 0) {
    if (existing.rows[0].role === 'owner') {
      return NextResponse.json({ error: 'O dono não pode sair do clã' }, { status: 400 })
    }
    await db.execute({
      sql: `DELETE FROM clan_members WHERE clan_id = ? AND user_id = ?`,
      args: [id, session.user.id],
    })
  } else {
    await db.execute({
      sql: `INSERT INTO clan_members (clan_id, user_id, role) VALUES (?, ?, 'member')`,
      args: [id, session.user.id],
    })
  }

  return NextResponse.json({ ok: true })
}
