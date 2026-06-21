import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { z } from 'zod'

const schema = z.object({ content: z.string().min(1).max(500) })

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Comentário inválido' }, { status: 400 })

  await db.execute({
    sql: `INSERT INTO comments (post_id, user_id, content) VALUES (?, ?, ?)`,
    args: [params.id, session.user.id, parsed.data.content],
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
