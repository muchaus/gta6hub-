import { NextResponse } from 'next/server'
import db from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.trim()
    const limit = Math.min(Number(searchParams.get('limit')) || 40, 80)

    if (!q) {
      return NextResponse.json({ ok: true, items: [] })
    }

    const safeQ = q.replace(/'/g, "''")

    const result = await db.execute(`
      SELECT * FROM gta_news
      WHERE title LIKE '%${safeQ}%' OR excerpt LIKE '%${safeQ}%'
      ORDER BY published_at DESC
      LIMIT ${limit}
    `)

    return NextResponse.json({ ok: true, items: result.rows, query: q })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'Erro ao buscar notícias' }, { status: 500 })
  }
}
