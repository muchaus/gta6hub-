import { NextResponse } from 'next/server'
import { fetchAndStoreNews } from '@/lib/news/fetcher'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const result = await fetchAndStoreNews()
    return NextResponse.json({ ok: true, ...result })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'Erro ao coletar notícias' }, { status: 500 })
  }
}
