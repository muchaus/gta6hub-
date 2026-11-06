import NewsComments from '@/components/news/NewsComments'
import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function metadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const { id } = params
  let news: any = null
  try {
    const safeId = id.replace(/'/g, "''")
    const result = await db.execute(`SELECT * FROM gta_news WHERE id = '${safeId}' LIMIT 1`)
    news = result.rows[0]
  } catch (e) {
    console.error('Erro ao buscar notícia:', e)
  }

  if (!news) return { title: 'Notícia não encontrada' }

  return {
    title: `${news.title} — GTA6Wire`,
    description: news.excerpt || 'Notícia sobre GTA 6 agregada pelo GTA6Hub.',
    openGraph: {
      title: news.title,
      description: news.excerpt || '',
      type: 'article',
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/note/${id}`,
      images: news.image ? [{ url: news.image }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: news.title,
      description: news.excerpt || '',
    },
  }
}

export default async function NotePage({ params }: { params: { id: string } }) {
  const { id } = params

  let news: any = null
  try {
    const safeId = id.replace(/'/g, "''")
    const result = await db.execute(`SELECT * FROM gta_news WHERE id = '${safeId}' LIMIT 1`)
    news = result.rows[0]
  } catch (e) {
    console.error('Erro ao buscar notícia:', e)
  }

  if (!news) notFound()

  const session = await auth()

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-xs">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5"
            style={{
              background: `${news.source_color || '#a3a3a3'}1a`,
              color: news.source_color || '#a3a3a3'
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: news.source_color || '#a3a3a3' }} />
            {news.source_name}
          </span>
          <span className="text-neutral-600">•</span>
          <span className="text-neutral-500 text-xs">
            {new Date(news.published_at * 1000).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
          {news.is_rumor === 1 && (
            <span className="text-xs bg-pink-neon/10 text-pink-neon border border-pink-neon/30 px-1.5 py-0.5 rounded">Rumor</span>
          )}
          {news.is_confirmed === 1 && (
            <span className="text-xs bg-neon-green/10 text-neon-green border border-neon-green/30 px-1.5 py-0.5 rounded">Confirmado</span>
          )}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-neutral-100 leading-tight">{news.title}</h1>
        <p className="text-lg text-neutral-400 leading-relaxed">{news.excerpt || ''}</p>
        <a
          href={news.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[#2d2050] px-5 py-2 text-xs font-bold text-[#b9a7ff] transition-colors hover:bg-[#1a1628] hover:text-[#e8c84a]"
        >
          Ler na fonte original
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.25 3.5H10.5V8.75M10.5 3.5L3.5 10.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </header>

      <article className="border border-[#1e1e2e] rounded-2xl bg-[#13131d] p-6 sm:p-8">
        <NewsComments newsId={news.id} />
      </article>

      {session && (
        <div className="rounded-xl border border-[#1e1e2e] bg-[#1a1628] p-4">
          <button
            onClick={() => {
              // toggle bookmark via client - handled by NewsCard, here just a placeholder
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-[#2d2050] text-sm text-[#e8c84a] hover:bg-[#241d3a] transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            Salvar notícia
          </button>
        </div>
      )}
    </div>
  )
}
