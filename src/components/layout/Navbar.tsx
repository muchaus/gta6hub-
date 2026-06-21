'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const links = [
    { href: '/feed', label: 'Feed' },
    { href: '/clans', label: 'Clãs' },
    { href: '/lfg', label: 'LFG' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0d0d14] border-b border-[#1e1e2e] h-13">
      <div className="max-w-6xl mx-auto px-4 h-13 flex items-center justify-between">
        <Link href="/feed" className="text-[#e8c84a] font-medium text-lg tracking-tight">
          GTA6<span className="text-neutral-500 font-normal text-sm">Hub</span>
        </Link>

        <div className="flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                pathname.startsWith(l.href)
                  ? 'bg-[#1a1628] text-[#e8c84a]'
                  : 'text-neutral-500 hover:text-[#e8c84a] hover:bg-[#1a1628]'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {session?.user && (
            <>
              {(session.user as any).psnId && (
                <span className="hidden sm:flex items-center gap-1.5 bg-[#0a2035] border border-[#1a4a7a] rounded-full px-3 py-1 text-xs text-[#5b9fd4]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M8.985 2.596v17.548l3.915 1.261V6.688c0-.69.304-1.151.794-.999.636.198.762.89.762 1.58v5.584l3.915 1.256V7.522c0-3.294-2.024-4.83-4.954-3.753z"/><path d="M.006 17.34l4.141 1.738L13.012 21v-3.165l-5.987-2.135-.007-2.18L13.012 15V11.87L.006 7.598z"/></svg>
                  {(session.user as any).psnId}
                </span>
              )}
              <Link
                href="/profile/me"
                className="w-8 h-8 rounded-full bg-[#1a1628] flex items-center justify-center text-xs font-medium text-[#9f8fdd] hover:bg-[#241d3a] transition-colors"
              >
                {(session.user.name ?? 'U').slice(0, 2).toUpperCase()}
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/auth/login' })}
                className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors"
              >
                Sair
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
