'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CommentBox({ postId }: { postId: string }) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)

    await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })

    setContent('')
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Escreva um comentário..."
        value={content}
        maxLength={500}
        onChange={e => setContent(e.target.value)}
        className="flex-1 bg-[#13131d] border border-[#1e1e2e] rounded-lg px-4 py-2 text-sm text-neutral-200 outline-none focus:border-[#e8c84a]/40 transition-colors"
      />
      <button
        type="submit"
        disabled={loading || !content.trim()}
        className="text-xs px-4 py-2 bg-[#e8c84a] text-[#0a0a0f] font-medium rounded-lg hover:bg-[#f0d460] disabled:opacity-40 transition-colors"
      >
        {loading ? '...' : 'Comentar'}
      </button>
    </form>
  )
}
