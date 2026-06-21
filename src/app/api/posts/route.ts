import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { z } from 'zod'

const postSchema = z.object({
  title: z.string().min(3).max(120),
  content: z.string().min(10).max(2000),
  type: z.enum(['general', 'news', 'clan', 'lfg']).default('general'),
  clan_id: z.string().optional(),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  const body = await req.json()
  const parsed = postSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const { title, content, type, clan_id } = parsed.data

  await db.execute({
    sql: `INSERT INTO posts (user_id, title, content, type, clan_id) VALUES (?, ?, ?, ?, ?)`,
    args: [session.user.id, title, content, type, clan_id ?? null],
  })

  return NextResponse.json({ ok: true }, { status: 201 })
}
