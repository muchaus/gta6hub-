import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { ensureNewsTable } from '@/lib/news/schema'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    await ensureNewsTable()
    const { searchParams } = new URL(req.url)
    const source = searchParams.get('source')
    const limit = Math.min(Number(searchParams.get('limit')) || 40, 80)

    let sql = `SELECT * FROM gta_news`
    const args: any[] = []

    if (source && source !== 'all') {
      sql += ` WHERE source_slug = ?`
      args.push(source)
    }

    sql += ` ORDER BY published_at DESC LIMIT ?`
    args.push(limit)

    const result = await db.execute({ sql, args })
    return NextResponse.json({ ok: true, items: result.rows })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'Erro ao buscar notícias' }, { status: 500 })
  }
}
