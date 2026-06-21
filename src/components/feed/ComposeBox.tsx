'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

type PostType = 'general' | 'news' | 'clan' | 'lfg'

export default function ComposeBox() {
  const { data: session } = useSession()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', type: 'general' as PostType })
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const initials = (session?.user?.name ?? 'U').slice(0, 2).toUpperCase()

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { setError('Imagem muito grande (máx 5MB)'); return }
    setImage(file)
    setImagePreview(URL.createObjectURL(file))
    setError('')
  }

  function removeImage() {
    setImage(null)
    setImagePreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) return
    setLoading(true)
    setError('')

    let imageUrl = ''

    if (image) {
      const fd = new FormData()
      fd.append('file', image)
      fd.append('folder', 'posts')
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
      const uploadData = await uploadRes.json()
      if (!uploadRes.ok) { setError(uploadData.error); setLoading(false); return }
      imageUrl = uploadData.url
    }

    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, image_url: imageUrl }),
    })

    setLoading(false)
    setForm({ title: '', content: '', type: 'general' })
    setImage(null)
    setImagePreview(null)
    setOpen(false)
    router.refresh()
  }

  return (
    <div className="bg-[#13131d] border border-[#1e1e2e] rounded-xl p-4">
      {!open ? (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#1a1628] flex items-center justify-center text-xs font-medium text-[#9f8fdd] shrink-0">
            {initials}
          </div>
          <button
            onClick={() => setOpen(true)}
            className="flex-1 text-left text-sm text-neutral-600 bg-[#0d0d18] border border-[#1e1e2e] rounded-lg px-4 py-2.5 hover:border-[#2e2e4a] transition-colors"
          >
            O que está acontecendo em Leonida?
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex gap-2 flex-wrap">
            {(['general', 'news', 'clan', 'lfg'] as PostType[]).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setForm(f => ({ ...f, type: t }))}
                className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                  form.type === t
                    ? 'bg-[#1a1628] border-[#4a3a8a] text-[#e8c84a]'
                    : 'border-[#1e1e2e] text-neutral-600 hover:border-[#2e2e4a]'
                }`}
              >
                {t === 'general' ? 'Geral' : t === 'news' ? 'Notícia' : t === 'lfg' ? 'LFG' : 'Clã'}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Título"
            required
            maxLength={120}
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="w-full bg-[#0d0d18] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-neutral-200 outline-none focus:border-[#e8c84a]/40 transition-colors"
          />

          <textarea
            placeholder="Escreva algo..."
            required
            maxLength={2000}
            rows={3}
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            className="w-full bg-[#0d0d18] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-neutral-200 outline-none focus:border-[#e8c84a]/40 transition-colors resize-none"
          />

          {imagePreview && (
            <div className="relative w-full rounded-lg overflow-hidden border border-[#1e1e2e]">
              <img src={imagePreview} alt="Preview" className="w-full max-h-64 object-cover" />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 w-6 h-6 bg-black/70 rounded-full flex items-center justify-center text-white text-xs hover:bg-black"
              >
                ✕
              </button>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2">{error}</p>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-[#e8c84a] transition-colors"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
              {image ? 'Trocar imagem' : 'Adicionar imagem'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setOpen(false); removeImage() }}
                className="text-xs px-4 py-2 text-neutral-500 hover:text-neutral-300 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="text-xs px-4 py-2 bg-[#e8c84a] text-[#0a0a0f] font-medium rounded-lg hover:bg-[#f0d460] disabled:opacity-50 transition-colors"
              >
                {loading ? (image ? 'Enviando...' : 'Postando...') : 'Postar'}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  )
}
