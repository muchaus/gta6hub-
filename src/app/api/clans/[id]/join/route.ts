import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import db from '@/lib/db'

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const clanId = params.id.replace(/'/g, "''")
  const userId = (session.user.id ?? '').replace(/'/g, "''")

  try {
    const existing = await db.execute(
      `SELECT id, role FROM clan_members WHERE clan_id = '${clanId}' AND user_id = '${userId}'`
    )

    if (existing.rows.length > 0) {
      if (existing.rows[0].role === 'owner') {
        return NextResponse.json({ error: 'O dono não pode sair do clã' }, { status: 400 })
      }
      await db.execute(
        `DELETE FROM clan_members WHERE clan_id = '${clanId}' AND user_id = '${userId}'`
      )
    } else {
      await db.execute(
        `INSERT INTO clan_members (clan_id, user_id, role) VALUES ('${clanId}', '${userId}', 'member')`
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
