'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  clanId: string
  isMember: boolean
}

export default function JoinClanButton({ clanId, isMember }: Props) {
  const router = useRouter()
  const [member, setMember] = useState(isMember)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    await fetch(`/api/clans/${clanId}/join`, { method: 'POST' })
    setMember(prev => !prev)
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`text-xs px-4 py-1.5 rounded-lg border transition-colors shrink-0 ${
        member
          ? 'border-[#2d2050] text-neutral-500 hover:text-red-400 hover:border-red-900'
          : 'border-[#2d2050] text-[#7a6abf] hover:bg-[#1a1628] hover:text-[#e8c84a] hover:border-[#4a3a8a]'
      } disabled:opacity-50`}
    >
      {loading ? '...' : member ? 'Sair' : 'Entrar'}
    </button>
  )
}
