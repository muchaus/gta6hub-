'use client'

import { useState } from 'react'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const subscribed = status === 'success'

  async function subscribe(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()
      setStatus(data.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="newsletter" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-[#ff0080]/20 blur-[140px]" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#fdb813]/20 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-2xl px-4 text-center">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-2 w-2 rounded-full bg-gold shadow-[0_0_12px_rgba(253,184,19,0.6)]" />
          <span className="text-xs uppercase tracking-[0.5em] text-gold font-bold">Newsletter GTA 6</span>
        </div>
        <h2 className="text-3xl font-black text-neutral-100 tracking-tight sm:text-4xl">
          Receba as principais notícias de GTA 6 no seu email
        </h2>
        <p className="mt-4 max-w-lg mx-auto text-lg text-neutral-400 leading-relaxed">
          Sem spam. Apenas as notícias mais importantes de GTA 6, direto dos portais parceiros.
        </p>

        {status === 'success' ? (
          <div className="mt-8 p-4 rounded-xl bg-neon-green/10 border border-neon-green/30 text-neon-green text-sm">
            Inscrição confirmada! Obrigado por fazer parte da comunidade.
          </div>
        ) : (
          <form onSubmit={subscribe} className="mt-8 flex flex-col sm:flex-row gap-3" id="newsletter-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="flex-1 min-w-0 rounded-xl border border-[#1e1e2e] bg-[#101018]/80 px-4 py-3 text-sm text-neutral-200 focus:border-[#e8c84a] focus:outline-none placeholder-neutral-600"
              required
            />
            <button
              type="submit"
              disabled={subscribed}
              className="rounded-xl bg-gold px-8 py-3 text-black font-black text-sm hover:bg-[#f5d95c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Inscrever-se
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
