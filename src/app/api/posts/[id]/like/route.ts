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
    sql: `SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?`,
    args: [id, session.user.id],
  })

  if (existing.rows.length > 0) {
    await db.execute({
      sql: `DELETE FROM post_likes WHERE post_id = ? AND user_id = ?`,
      args: [id, session.user.id],
    })
  } else {
    await db.execute({
      sql: `INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)`,
      args: [id, session.user.id],
    })
  }

  return NextResponse.json({ ok: true })
}
