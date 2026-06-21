import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { z } from 'zod'

const postSchema = z.object({
  title: z.string().min(3).max(120),
  content: z.string().min(1).max(2000),
  type: z.enum(['general', 'news', 'clan', 'lfg']).default('general'),
  clan_id: z.string().optional(),
  image_url: z.string().url().optional().or(z.literal('')),
})

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  try {
    const body = await req.json()
    const parsed = postSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })

    const { title, content, type, clan_id, image_url } = parsed.data
    const userId = (session.user.id ?? '').replace(/'/g, "''")
    const safeTitle = title.replace(/'/g, "''")
    const safeContent = content.replace(/'/g, "''")
    const safeImage = (image_url ?? '').replace(/'/g, "''")
    const clanClause = clan_id ? `'${clan_id}'` : 'NULL'
    const imageClause = safeImage ? `'${safeImage}'` : 'NULL'

    await db.execute(
      `INSERT INTO posts (user_id, title, content, type, clan_id, image_url) VALUES ('${userId}', '${safeTitle}', '${safeContent}', '${type}', ${clanClause}, ${imageClause})`
    )

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
