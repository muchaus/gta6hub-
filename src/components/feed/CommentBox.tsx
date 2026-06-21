'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function CommentBox({ postId }: { postId: string }) {
  const router = useRouter()
  const [content, setContent] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)

    let imageUrl = ''
    if (image) {
      const fd = new FormData()
      fd.append('file', image)
      fd.append('folder', 'comments')
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
      const uploadData = await uploadRes.json()
      if (uploadRes.ok) imageUrl = uploadData.url
    }

    await fetch(`/api/posts/${postId}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, image_url: imageUrl }),
    })

    setContent('')
    setImage(null)
    setImagePreview(null)
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Escreva um comentário..."
          value={content}
          maxLength={500}
          onChange={e => setContent(e.target.value)}
          className="flex-1 bg-[#13131d] border border-[#1e1e2e] rounded-lg px-4 py-2 text-sm text-neutral-200 outline-none focus:border-[#e8c84a]/40 transition-colors"
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="px-3 text-neutral-500 hover:text-[#e8c84a] transition-colors"
          title="Adicionar imagem"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="text-xs px-4 py-2 bg-[#e8c84a] text-[#0a0a0f] font-medium rounded-lg hover:bg-[#f0d460] disabled:opacity-40 transition-colors"
        >
          {loading ? '...' : 'Comentar'}
        </button>
      </div>
      {imagePreview && (
        <div className="relative w-32">
          <img src={imagePreview} alt="Preview" className="w-32 h-20 object-cover rounded-lg border border-[#1e1e2e]" />
          <button type="button" onClick={() => { setImage(null); setImagePreview(null) }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-black/80 rounded-full flex items-center justify-center text-white text-[10px]">✕</button>
        </div>
      )}
    </form>
  )
}
