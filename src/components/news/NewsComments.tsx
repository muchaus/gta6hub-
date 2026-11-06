'use client'

import { useState, useEffect } from 'react'

interface NewsComment {
  id: string
  username: string
  avatar_url: string | null
  content: string
  created_at: string
}

export default function NewsComments({ newsId }: { newsId: string }) {
  const [comments, setComments] = useState<NewsComment[]>([])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchComments()
  }, [newsId])

  async function fetchComments() {
    try {
      const res = await fetch(`/api/news/comments?newsId=${encodeURIComponent(newsId)}`, { cache: 'no-store' })
      const data = await res.json()
      if (data.ok) setComments(data.items || [])
    } catch (e) {
      console.error('Erro ao buscar comentários:', e)
    }
  }

  async function addComment(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/news/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newsId, content: content.trim() })
      })
      if (res.ok) {
        setContent('')
        await fetchComments()
      }
    } catch (e) {
      console.error('Erro ao adicionar comentário:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <span className="w-1 h-3 bg-[#e8c84a] rounded-full" />
        <h3 className="text-sm font-semibold text-neutral-100 uppercase tracking-wider">Comentários ({comments.length})</h3>
      </div>

      <div className="space-y-3">
        {comments.length === 0 && (
          <p className="text-xs text-neutral-500 italic">Sem comentários ainda. Seja o primeiro!</p>
        )}
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3 pt-3 border-t border-[#1e1e2e]/40">
            <div className="w-8 h-8 rounded-full bg-[#1a1628] flex items-center justify-center text-xs font-bold text-[#9f8fdd] shrink-0">
              {(c.username ?? 'U').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="font-medium text-neutral-300">{c.username}</span>
                <span className="text-neutral-500">•</span>
                <span className="text-neutral-600">{new Date(c.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-sm text-neutral-200 mt-0.5 leading-relaxed">{c.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-4 border-t border-[#1e1e2e]/40">
        <form onSubmit={addComment} className="flex gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escreva um comentário..."
            className="flex-1 min-h-[60px] resize-y rounded-xl border border-[#1e1e2e] bg-[#0a0a0f] px-3 py-2 text-sm text-neutral-200 focus:border-[#e8c84a] focus:outline-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="px-4 py-2 rounded-xl bg-[#e8c84a] text-black font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Comentar
          </button>
        </form>
      </div>
    </div>
  )
}
