'use client'

import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/pt-br'
import { useState } from 'react'

dayjs.extend(relativeTime)
dayjs.locale('pt-br')

interface NewsItem {
  id: string
  title: string
  excerpt: string | null
  link: string
  image: string | null
  source_name: string
  source_slug: string
  source_color: string | null
  published_at: number
  category?: string
  is_rumor?: number
  is_confirmed?: number
  bookmarked?: boolean
  comments_count?: number
}

export default function NewsCard({ item }: { item: NewsItem }) {
  const timeAgo = item.published_at ? dayjs.unix(item.published_at).fromNow() : ''
  const [bookmarked, setBookmarked] = useState(item.bookmarked ?? false)

  const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
    rumor: { label: 'RUMOR', color: 'text-pink-neon border-pink-neon/40 bg-pink-neon/10' },
    news: { label: 'NOTÍCIA', color: 'text-gold border-gold/40 bg-gold/10' },
    gaming: { label: 'GAMING', color: 'text-purple-neon border-purple-neon/40 bg-purple-neon/10' }
  }

  const config = CATEGORY_CONFIG[item.category || 'news'] || CATEGORY_CONFIG.news
  const isRumor = item.is_rumor === 1
  const isConfirmed = item.is_confirmed === 1

  async function toggleBookmark() {
    try {
      const url = bookmarked
        ? `/api/news/bookmarks?newsId=${encodeURIComponent(item.id)}`
        : '/api/news/bookmarks'
      const res = await fetch(url, { method: bookmarked ? 'DELETE' : 'POST' })
      if (res.ok) setBookmarked(!bookmarked)
    } catch (e) {
      console.error('Erro ao alternar bookmark:', e)
    }
  }

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[#1e1e2e] bg-[#13131d] transition-all hover:-translate-y-0.5 hover:border-[#2d2050] hover:shadow-[0_0_0_1px_rgba(232,200,74,0.08)]">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">
        <Link href={`/note/${item.id}`} className="block flex-1 min-w-0">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5"
                style={{
                  background: `${item.source_color || '#a3a3a3'}1a`,
                  color: item.source_color || '#a3a3a3'
                }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: item.source_color || '#a3a3a3' }} />
                {item.source_name}
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-500">{timeAgo}</span>
              {isRumor && (
                <span className="text-xs bg-pink-neon/10 text-pink-neon border border-pink-neon/30 px-1.5 py-0.5 rounded">Rumor</span>
              )}
              {isConfirmed && (
                <span className="text-xs bg-neon-green/10 text-neon-green border border-neon-green/30 px-1.5 py-0.5 rounded">Confirmado</span>
              )}
            </div>
            <h3 className="text-lg sm:text-xl font-semibold leading-tight text-neutral-100 group-hover:text-[#e8c84a] transition-colors">
              {item.title}
            </h3>
            {item.excerpt && (
              <p className="text-sm text-neutral-400 line-clamp-2">{item.excerpt}</p>
            )}
          </div>
        </Link>
        <div className="flex items-center justify-end gap-2 pt-2 sm:pt-0 border-t border-[#1e1e2e]/50 sm:border-t-0 sm:border-l border-[#1e1e2e]/50">
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-neutral-600 group-hover:text-[#e8c84a] hover:underline transition-colors"
          >
            Ler na fonte →
          </a>
          <button
            onClick={toggleBookmark}
            className={`p-1.5 rounded-md transition-colors ${bookmarked ? 'text-[#e8c84a] bg-[#e8c84a]/10' : 'text-neutral-500 hover:text-[#e8c84a] hover:bg-[#e8c84a]/10'}`}
            aria-label={bookmarked ? 'Remover dos salvos' : 'Salvar notícia'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </button>
        </div>
      </div>
    </article>
  )
}
