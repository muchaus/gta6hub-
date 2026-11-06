import Link from 'next/link'

async function getNews() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/news/feed?limit=12`, {
      cache: 'no-store'
    })
    const data = await res.json()
    return data.items || []
  } catch (e) {
    return []
  }
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  rumor: { label: 'RUMOR', color: 'text-pink-neon border-pink-neon/40 bg-pink-neon/10' },
  news: { label: 'NOTÍCIA', color: 'text-gold border-gold/40 bg-gold/10' },
  gaming: { label: 'GAMING', color: 'text-purple-neon border-purple-neon/40 bg-purple-neon/10' }
}

export default async function BlogPreview() {
  const items = await getNews()

  return (
    <section id="blog" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-[#8a2be2]/15 blur-[120px]" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#ff0080]/15 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_rgba(253,184,19,0.6)]" />
              <span className="text-xs uppercase tracking-[0.5em] text-gold font-bold">Blog GTA 6</span>
            </div>
            <h2 className="text-4xl font-black text-neutral-100 tracking-tight sm:text-5xl">Últimas notícias e atualizações</h2>
            <p className="mt-4 max-w-xl text-lg text-neutral-400 leading-relaxed">
              Agregado dos portais Flow Games, RockstarINTEL, Dexerto, IGN, GameSpot e GamingBolt. Link direto pra fonte original.
            </p>
          </div>
          <a href="/news-wire" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-2.5 text-xs font-bold text-neutral-400 hover:bg-white/5 transition-colors">
            Ver tudo
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.length === 0 ? (
            <div className="col-span-3 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 py-20 text-center text-sm text-neutral-600">
              Coletando primeiras notícias...
            </div>
          ) : (
            items.map((item: any) => {
              const config = CATEGORY_CONFIG[item.category] || CATEGORY_CONFIG.news
              const categoryColor = item.category ? config.color.split(' ').join(' ') : config.color
              return (
                <article key={item.id} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#101018]/80 backdrop-blur transition-all hover:border-[#fdb813]/40 hover:shadow-[0_0_30px_rgba(253,184,19,0.08)]">
                  <div className="relative h-48 overflow-hidden bg-[url('https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#101018] to-transparent" />
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-sm px-2 py-0.5 text-[10px] font-black text-black bg-gold shadow-md">
                      {config.label}
                    </span>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex h-6 items-center rounded-full px-2 py-0.5 text-[10px] font-bold {categoryColor}">
                        {item.source_name}
                      </span>
                      <span className="text-[10px] text-neutral-600">• {item.published_at ? new Date(item.published_at * 1000).toLocaleDateString('pt-BR') : ''}</span>
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-neutral-100 group-hover:text-gold transition-colors">{item.title}</h3>
                    <p className="line-clamp-2 text-sm text-neutral-400 leading-relaxed">{item.excerpt || ''}</p>
                    <a href={item.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#ff0080] hover:text-[#ff4da6]">
                      Ler na fonte →
                    </a>
                  </div>
                </article>
              )
            })
          )}
        </div>
      </div>
    </section>
  )
}
