'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

type PostType = 'general' | 'news' | 'clan' | 'lfg'

export default function ComposeBox() {
  const { data: session } = useSession()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', type: 'general' as PostType })
  const [loading, setLoading] = useState(false)

  const initials = (session?.user?.name ?? 'U').slice(0, 2).toUpperCase()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) return
    setLoading(true)

    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)
    setForm({ title: '', content: '', type: 'general' })
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
          <div className="flex gap-2">
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

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs px-4 py-2 text-neutral-500 hover:text-neutral-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="text-xs px-4 py-2 bg-[#e8c84a] text-[#0a0a0f] font-medium rounded-lg hover:bg-[#f0d460] disabled:opacity-50 transition-colors"
            >
              {loading ? 'Postando...' : 'Postar'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
