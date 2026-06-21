import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  content: z.string().min(1).max(500),
  image_url: z.string().url().optional().or(z.literal('')),
})

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ error: 'Inválido' }, { status: 400 })

    const postId = params.id.replace(/'/g, "''")
    const userId = (session.user.id ?? '').replace(/'/g, "''")
    const content = parsed.data.content.replace(/'/g, "''")
    const imageUrl = (parsed.data.image_url ?? '').replace(/'/g, "''")
    const imageClause = imageUrl ? `'${imageUrl}'` : 'NULL'

    await db.execute(
      `INSERT INTO comments (post_id, user_id, content, image_url) VALUES ('${postId}', '${userId}', '${content}', ${imageClause})`
    )

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
