import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import db from '@/lib/db'

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const postId = params.id.replace(/'/g, "''")
  const userId = (session.user.id ?? '').replace(/'/g, "''")

  try {
    const existing = await db.execute(
      `SELECT id FROM post_likes WHERE post_id = '${postId}' AND user_id = '${userId}'`
    )

    if (existing.rows.length > 0) {
      await db.execute(`DELETE FROM post_likes WHERE post_id = '${postId}' AND user_id = '${userId}'`)
    } else {
      await db.execute(`INSERT INTO post_likes (post_id, user_id) VALUES ('${postId}', '${userId}')`)
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
