import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import db from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: 'Não autenticado' }, { status: 401 })
    }

    const userId = (session.user.id as string).replace(/'/g, "''")

    const result = await db.execute(`
      SELECT n.*, nb.created_at AS bookmarked_at
      FROM news_bookmarks nb
      JOIN gta_news n ON n.id = nb.news_id
      WHERE nb.user_id = '${userId}'
      ORDER BY nb.created_at DESC
    `)

    return NextResponse.json({ ok: true, items: result.rows })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'Erro ao buscar bookmarks' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: 'Não autenticado' }, { status: 401 })
    }

    const { newsId } = await req.json()
    if (!newsId) {
      return NextResponse.json({ ok: false, error: 'newsId obrigatório' }, { status: 400 })
    }

    const userId = (session.user.id as string).replace(/'/g, "''")
    const safeNewsId = newsId.replace(/'/g, "''")
    const id = crypto.randomUUID()

    await db.execute(`
      INSERT OR IGNORE INTO news_bookmarks (id, user_id, news_id)
      VALUES ('${id}', '${userId}', '${safeNewsId}')
    `)

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'Erro ao salvar bookmark' }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ ok: false, error: 'Não autenticado' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const newsId = searchParams.get('newsId')
    if (!newsId) {
      return NextResponse.json({ ok: false, error: 'newsId obrigatório' }, { status: 400 })
    }

    const userId = (session.user.id as string).replace(/'/g, "''")
    const safeNewsId = newsId.replace(/'/g, "''")

    await db.execute(`
      DELETE FROM news_bookmarks
      WHERE user_id = '${userId}' AND news_id = '${safeNewsId}'
    `)

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'Erro ao remover bookmark' }, { status: 500 })
  }
}
