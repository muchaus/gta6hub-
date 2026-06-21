'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

export default function EditProfilePage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({ psn_id: '', bio: '' })
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (session?.user) {
      setForm({ psn_id: (session.user as any).psnId ?? '', bio: '' })
    }
  }, [session])

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatar(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)

    let avatarUrl = ''
    if (avatar) {
      const fd = new FormData()
      fd.append('file', avatar)
      fd.append('folder', 'avatars')
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
      const uploadData = await uploadRes.json()
      if (uploadRes.ok) avatarUrl = uploadData.url
    }

    await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, avatar_url: avatarUrl || undefined }),
    })

    setLoading(false)
    setSuccess(true)
    await update({ psnId: form.psn_id })
    setTimeout(() => router.push('/profile/me'), 1000)
  }

  const initials = (session?.user?.name ?? 'U').slice(0, 2).toUpperCase()

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-lg font-medium text-neutral-200">Editar perfil</h1>

      <form onSubmit={handleSubmit} className="bg-[#13131d] border border-[#1e1e2e] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-[#2d2050]" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#1a1628] flex items-center justify-center text-xl font-medium text-[#9f8fdd]">
                {initials}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#e8c84a] rounded-full flex items-center justify-center text-[#0a0a0f] text-xs hover:bg-[#f0d460] transition-colors"
            >
              +
            </button>
          </div>
          <div>
            <p className="text-sm font-medium text-neutral-200">{session?.user?.name}</p>
            <button type="button" onClick={() => fileRef.current?.click()} className="text-xs text-[#7a6abf] hover:text-[#e8c84a] transition-colors">
              Trocar foto
            </button>
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>

        <div>
          <label className="block text-xs text-neutral-500 mb-1.5">PSN ID</label>
          <input type="text" value={form.psn_id} onChange={e => setForm(f => ({ ...f, psn_id: e.target.value }))}
            maxLength={16} className="w-full bg-[#0d0d18] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-neutral-200 outline-none focus:border-[#e8c84a]/40 transition-colors"
            placeholder="Seu ID do PlayStation" />
        </div>

        <div>
          <label className="block text-xs text-neutral-500 mb-1.5">Bio</label>
          <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
            maxLength={200} rows={3}
            className="w-full bg-[#0d0d18] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-neutral-200 outline-none focus:border-[#e8c84a]/40 transition-colors resize-none"
            placeholder="Fala algo sobre você..." />
        </div>

        {success && <p className="text-xs text-green-400 bg-green-950/30 border border-green-900/40 rounded-lg px-3 py-2">Perfil atualizado!</p>}

        <div className="flex justify-end gap-2">
          <button type="button" onClick={() => router.back()} className="text-xs px-4 py-2 text-neutral-500 hover:text-neutral-300 transition-colors">Cancelar</button>
          <button type="submit" disabled={loading} className="text-xs px-4 py-2 bg-[#e8c84a] text-[#0a0a0f] font-medium rounded-lg hover:bg-[#f0d460] disabled:opacity-50 transition-colors">
            {loading ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  )
}
