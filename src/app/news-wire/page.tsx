import NewsCard from '@/components/news/NewsCard'
import { NEWS_SOURCES } from '@/config/news-sources'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

async function getNews(source?: string, q?: string) {
  try {
    const params = new URLSearchParams({ limit: '80' })
    if (source && source !== 'all') params.set('source', source)
    if (q) params.set('q', q)
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/news/feed?${params}`, {
      cache: 'no-store'
    })
    const data = await res.json()
    return data.items || []
  } catch (e) {
    return []
  }
}

async function getBookmarks(userId: string): Promise<string[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/news/bookmarks`, {
      cache: 'no-store',
      headers: { Cookie: `authjs.session-token=placeholder` }
    })
    const data = await res.json()
    return (data.items || []).map((i: any) => i.news_id || i.id)
  } catch (e) {
    return []
  }
}

export default async function NewsWirePage({ searchParams }: { searchParams: { fonte?: string; q?: string } }) {
  const session = await auth()
  const userId = (session?.user as any)?.id
  const fonte = searchParams.fonte || 'all'
  const q = searchParams.q || ''

  const [items, bookmarks] = await Promise.all([getNews(fonte, q || undefined), userId ? getBookmarks(userId) : Promise.resolve([] as string[])])
  const bookmarkedSet = new Set(bookmarks)

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#e8c84a] shadow-[0_0_0_6px_rgba(232,200,74,0.08)]" />
            <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">GTA6Wire</p>
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-100">
            {q ? `Busca: "${q}"` : 'Notícias em tempo real'}
          </h1>
          <p className="text-sm text-neutral-500">
            Agregadas dos portais pré-vinculados. Sempre com link direto pra fonte original.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:flex-wrap">
          <a
            href="/api/news/collect"
            className="inline-flex items-center gap-2 rounded-full border border-[#2d2050] px-4 py-1.5 text-xs text-[#b9a7ff] transition-colors hover:bg-[#1a1628] hover:text-[#e8c84a]"
          >
            Atualizar agora
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.333 7a4.667 4.667 0 0 1 7.934-3.3M11.667 7A4.667 4.667 0 0 1 3.733 10.3M3.733 10.3V8.167M3.733 10.3H5.867M11.667 7V5.833M11.667 7H9.533" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          {session && (
            <a
              href="/bookmarks"
              className="inline-flex items-center gap-2 rounded-full border border-[#2d2050] px-4 py-1.5 text-xs text-[#b9a7ff] transition-colors hover:bg-[#1a1628] hover:text-[#e8c84a]"
            >
              Meus salvos
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
              </svg>
            </a>
          )}
        </div>
      </header>

      <div className="flex flex-wrap gap-2">
        <a
          href="/news-wire"
          className={`rounded-full px-3 py-1 text-xs transition-colors ${
            fonte === 'all' && !q
              ? 'bg-[#1a1628] text-[#e8c84a]'
              : 'border border-[#1e1e2e] text-neutral-500 hover:text-neutral-200'
          }`}
        >
          Todas as fontes
        </a>
        {NEWS_SOURCES.filter(s => s.enabled).map(source => (
          <a
            key={source.id}
            href={`/news-wire?fonte=${source.slug}${q ? `&q=${q}` : ''}`}
            className={`rounded-full px-3 py-1 text-xs transition-colors ${
              fonte === source.slug && !q
                ? 'bg-[#1a1628] text-[#e8c84a]'
                : 'border border-[#1e1e2e] text-neutral-500 hover:text-neutral-200'
            }`}
          >
            {source.name}
          </a>
        ))}
      </div>

      {q && (
        <div className="mb-2 text-xs text-neutral-500">
          {items.length} resultado(s) para "{q}"
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#1e1e2e] py-16 text-center text-sm text-neutral-600">
            {q ? 'Nenhuma notícia encontrada com esse termo.' : 'Nenhuma notícia coletada ainda. Clique em "Atualizar agora" pra puxar do Flow Games e outros portais.'}
          </div>
        ) : (
          items.map((item: any) => (
            <NewsCard
              key={item.id}
              item={{
                ...item,
                bookmarked: bookmarkedSet.has(item.id),
                comments_count: item.comments_count
              }}
            />
          ))
        )}
      </div>
    </div>
  )
}
