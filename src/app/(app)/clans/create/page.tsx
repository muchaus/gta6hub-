'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateClanPage() {
  const router = useRouter()
  const [form, setForm] = useState({ name: '', tag: '', description: '', focus: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/clans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) {
      setError(data.error)
      return
    }

    router.push(`/clans/${form.tag.toLowerCase()}`)
    router.refresh()
  }

  return (
    <div className="max-w-md space-y-6">
      <h1 className="text-lg font-medium text-neutral-200">Criar clã</h1>

      <form onSubmit={handleSubmit} className="bg-[#13131d] border border-[#1e1e2e] rounded-xl p-5 space-y-4">
        <div>
          <label className="block text-xs text-neutral-500 mb-1.5">Nome do clã</label>
          <input
            type="text"
            required
            maxLength={40}
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="w-full bg-[#0d0d18] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-neutral-200 outline-none focus:border-[#e8c84a]/40 transition-colors"
            placeholder="Ex: Los Reyes"
          />
        </div>

        <div>
          <label className="block text-xs text-neutral-500 mb-1.5">
            Tag <span className="text-neutral-700">(3-5 letras, única)</span>
          </label>
          <input
            type="text"
            required
            minLength={2}
            maxLength={5}
            value={form.tag}
            onChange={e => setForm(f => ({ ...f, tag: e.target.value.toUpperCase() }))}
            className="w-full bg-[#0d0d18] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-neutral-200 outline-none focus:border-[#e8c84a]/40 transition-colors font-mono"
            placeholder="LOS"
          />
        </div>

        <div>
          <label className="block text-xs text-neutral-500 mb-1.5">Foco</label>
          <select
            value={form.focus}
            onChange={e => setForm(f => ({ ...f, focus: e.target.value }))}
            className="w-full bg-[#0d0d18] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-neutral-200 outline-none focus:border-[#e8c84a]/40 transition-colors"
          >
            <option value="">Selecionar...</option>
            <option value="Assaltos & Missões">Assaltos & Missões</option>
            <option value="Corridas & PvP">Corridas & PvP</option>
            <option value="Crime Organizado">Crime Organizado</option>
            <option value="Roleplay">Roleplay</option>
            <option value="Geral">Geral</option>
          </select>
        </div>

        <div>
          <label className="block text-xs text-neutral-500 mb-1.5">Descrição</label>
          <textarea
            maxLength={300}
            rows={3}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            className="w-full bg-[#0d0d18] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-neutral-200 outline-none focus:border-[#e8c84a]/40 transition-colors resize-none"
            placeholder="Apresente seu clã para a comunidade..."
          />
        </div>

        {error && (
          <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#e8c84a] text-[#0a0a0f] font-medium text-sm rounded-lg py-2.5 hover:bg-[#f0d460] disabled:opacity-50 transition-colors"
        >
          {loading ? 'Criando...' : 'Criar clã'}
        </button>
      </form>
    </div>
  )
}
