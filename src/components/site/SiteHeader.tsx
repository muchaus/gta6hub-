'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const NAV = [
  { href: '#inicio', label: 'Início' },
  { href: '#blog', label: 'Blog GTA 6' },
  { href: '#canal', label: 'Canal' },
  { href: '#sobre', label: 'Sobre' },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#07070a]/70 backdrop-blur-xl transition-all duration-300">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex items-center gap-1">
            <div className="w-6 h-6 rounded-sm bg-gold flex items-center justify-center text-[8px] font-bold text-black shadow-[0_0_12px_rgba(253,184,19,0.6)]">GTA</div>
            <div className="w-6 h-6 rounded-sm bg-pink-neon flex items-center justify-center text-[8px] font-bold text-white shadow-[0_0_12px_rgba(255,0,128,0.6)]">6</div>
          </div>
          <span className="text-lg font-black text-neutral-100 tracking-wider">LGamer GTA6</span>
        </Link>
        <nav className="hidden items-center gap-6 text-xs uppercase tracking-widest text-neutral-500 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition-colors ${pathname === item.href ? 'text-gold font-medium' : 'text-neutral-500 hover:text-gold'}`}
            >
              {item.label}
            </Link>
          ))}
          <a href="https://www.youtube.com/@LGamerGTA6" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#ff0033] hover:text-[#ff4d4d]">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M15.8 4.8s-.16-1.12-.64-1.6c-.6-.64-1.28-.64-1.6-.68C11.36 2.4 8 2.4 8 2.4s-3.36 0-5.56.12c-.32.04-1 .04-1.6.68C.36 3.68.2 4.8.2 4.8S.04 6.12.04 7.44v1.12c0 1.32.16 2.64.16 2.64s.16 1.12.64 1.6c.6.64 1.4.62 1.76.68 1.28.12 5.4.12 5.4.12s3.36 0 5.56-.12c.32-.04 1-.04 1.6-.68.48-.48.64-1.6.64-1.6s.16-1.32.16-2.64V7.44c0-1.32-.16-2.64-.16-2.64zM6.4 10.16V5.36l4.28 2.4L6.4 10.16z" />
            </svg>
            YouTube
          </a>
        </nav>
        <div className="hidden md:flex items-center gap-3">
          <a href="https://www.youtube.com/@LGamerGTA6" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 rounded-full border border-[#ff0033]/30 bg-[#ff0033]/10 px-4 py-1.5 text-xs font-bold text-[#ff0033] hover:bg-[#ff0033] hover:text-white transition-colors">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <path d="M15.8 4.8s-.16-1.12-.64-1.6c-.6-.64-1.28-.64-1.6-.68C11.36 2.4 8 2.4 8 2.4s-3.36 0-5.56.12c-.32.04-1 .04-1.6.68C.36 3.68.2 4.8.2 4.8S.04 6.12.04 7.44v1.12c0 1.32.16 2.64.16 2.64s.16 1.12.64 1.6c.6.64 1.4.62 1.76.68 1.28.12 5.4.12 5.4.12s3.36 0 5.56-.12c.32-.04 1-.04 1.6-.68.48-.48.64-1.6.64-1.6s.16-1.32.16-2.64V7.44c0-1.32-.16-2.64-.16-2.64zM6.4 10.16V5.36l4.28 2.4L6.4 10.16z" />
            </svg>
            Inscrever-se
          </a>
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-neutral-300 hover:bg-white/5"
          aria-label="Menu"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor">
            <path d="M3 5h12M3 9h12M3 13h12" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-white/5 bg-[#07070a]/95 backdrop-blur-xl">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-4 gap-1 text-sm">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="px-3 py-2 rounded-lg transition-colors hover:bg-white/5 text-neutral-300">
                {item.label}
              </Link>
            ))}
            <div className="mt-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5 flex items-center gap-2 text-xs font-bold text-[#ff0033]">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M15.8 4.8s-.16-1.12-.64-1.6c-.6-.64-1.28-.64-1.6-.68C11.36 2.4 8 2.4 8 2.4s-3.36 0-5.56.12c-.32.04-1 .04-1.6.68C.36 3.68.2 4.8.2 4.8S.04 6.12.04 7.44v1.12c0 1.32.16 2.64.16 2.64s.16 1.12.64 1.6c.6.64 1.4.62 1.76.68 1.28.12 5.4.12 5.4.12s3.36 0 5.56-.12c.32-.04 1-.04 1.6-.68.48-.48.64-1.6.64-1.6s.16-1.32.16-2.64V7.44c0-1.32-.16-2.64-.16-2.64zM6.4 10.16V5.36l4.28 2.4L6.4 10.16z" />
              </svg>
              <a href="https://www.youtube.com/@LGamerGTA6" target="_blank" rel="noopener noreferrer" className="hover:text-white">youtube.com/@LGamerGTA6</a>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
