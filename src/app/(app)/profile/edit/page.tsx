'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function EditProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({ psn_id: '', bio: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (session?.user) {
      setForm({
        psn_id: (session.user as any).psnId ?? '',
        bio: '',
      })
    }
  }, [session])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)

    if (res.ok) {
      await update({ psnId: form.psn_id })
      setSuccess(true)
      setTimeout(() => router.push('/profile/me'), 1000)
    }
  }

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-lg font-medium text-neutral-200">Editar perfil</h1>

      <form onSubmit={handleSubmit} className="bg-[#13131d] border border-[#1e1e2e] rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-xs text-neutral-500 mb-1.5">PSN ID</label>
          <input
            type="text"
            value={form.psn_id}
            onChange={e => setForm(f => ({ ...f, psn_id: e.target.value }))}
            maxLength={16}
            className="w-full bg-[#0d0d18] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-neutral-200 outline-none focus:border-[#e8c84a]/40 transition-colors"
            placeholder="Seu ID do PlayStation"
          />
        </div>

        <div>
          <label className="block text-xs text-neutral-500 mb-1.5">Bio</label>
          <textarea
            value={form.bio}
            onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            maxLength={200}
            rows={3}
            className="w-full bg-[#0d0d18] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-neutral-200 outline-none focus:border-[#e8c84a]/40 transition-colors resize-none"
            placeholder="Fala algo sobre você..."
          />
        </div>

        {success && (
          <p className="text-xs text-green-400 bg-green-950/30 border border-green-900/40 rounded-lg px-3 py-2">
            Perfil atualizado!
          </p>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-xs px-4 py-2 text-neutral-500 hover:text-neutral-300 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="text-xs px-4 py-2 bg-[#e8c84a] text-[#0a0a0f] font-medium rounded-lg hover:bg-[#f0d460] disabled:opacity-50 transition-colors"
          >
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
}
