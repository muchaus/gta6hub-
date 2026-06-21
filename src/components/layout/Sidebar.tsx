'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Clan {
  id: string
  name: string
  tag: string
}

interface SidebarProps {
  userClans?: Clan[]
}

export default function Sidebar({ userClans = [] }: SidebarProps) {
  const pathname = usePathname()

  const nav = [
    { href: '/feed', icon: '⌂', label: 'Início' },
    { href: '/profile/me', icon: '◉', label: 'Meu Perfil' },
    { href: '/clans', icon: '◈', label: 'Clãs' },
    { href: '/lfg', icon: '◎', label: 'LFG' },
  ]

  return (
    <aside className="w-52 shrink-0 hidden lg:block">
      <div className="sticky top-16 pt-4 space-y-6">
        <div className="space-y-0.5">
          {nav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                pathname === item.href
                  ? 'bg-[#1a1628] text-[#e8c84a]'
                  : 'text-neutral-500 hover:bg-[#13131d] hover:text-neutral-200'
              }`}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>

        {userClans.length > 0 && (
          <div>
            <p className="text-xs text-neutral-700 uppercase tracking-wider px-3 mb-2">Meus Clãs</p>
            <div className="space-y-0.5">
              {userClans.map(clan => (
                <Link
                  key={clan.id}
                  href={`/clans/${clan.tag.toLowerCase()}`}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-neutral-500 hover:bg-[#13131d] hover:text-neutral-200 transition-colors"
                >
                  <span className="bg-[#1a1628] border border-[#2d2050] rounded px-1.5 py-0.5 text-[10px] text-[#7a6abf] font-medium">
                    {clan.tag}
                  </span>
                  <span className="truncate">{clan.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}

        <Link
          href="/clans/create"
          className="flex items-center gap-2 mx-3 px-3 py-2 rounded-lg border border-[#2d2050] text-xs text-[#7a6abf] hover:bg-[#1a1628] hover:text-[#e8c84a] hover:border-[#4a3a8a] transition-colors"
        >
          <span className="text-base leading-none">+</span> Criar Clã
        </Link>
      </div>
    </aside>
  )
}
