import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import db from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const newsId = searchParams.get('newsId')
    if (!newsId) {
      return NextResponse.json({ ok: false, error: 'newsId obrigatório' }, { status: 400 })
    }

    const safeNewsId = newsId.replace(/'/g, "''")

    const result = await db.execute(`
      SELECT nc.*, u.username, u.avatar_url
      FROM news_comments nc
      JOIN users u ON u.id = nc.user_id
      WHERE nc.news_id = '${safeNewsId}'
      ORDER BY nc.created_at DESC
    `)

    return NextResponse.json({ ok: true, items: result.rows })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'Erro ao buscar comentários' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: 'Não autenticado' }, { status: 401 })
    }

    const { newsId, content } = await req.json()
    if (!newsId || !content?.trim()) {
      return NextResponse.json({ ok: false, error: 'newsId e content obrigatórios' }, { status: 400 })
    }

    const userId = (session.user.id as string).replace(/'/g, "''")
    const safeNewsId = newsId.replace(/'/g, "''")
    const safeContent = content.replace(/'/g, "''")
    const id = crypto.randomUUID()

    await db.execute(`
      INSERT INTO news_comments (id, news_id, user_id, content)
      VALUES ('${id}', '${safeNewsId}', '${userId}', '${safeContent}')
    `)

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'Erro ao adicionar comentário' }, { status: 500 })
  }
}
