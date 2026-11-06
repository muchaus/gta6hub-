import Link from 'next/link'

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#05050a]">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <div className="w-5 h-5 rounded-sm bg-gold flex items-center justify-center text-[7px] font-bold text-black shadow-[0_0_10px_rgba(253,184,19,0.6)]">GTA</div>
            <div className="w-5 h-5 rounded-sm bg-pink-neon flex items-center justify-center text-[7px] font-bold text-white shadow-[0_0_10px_rgba(255,0,128,0.6)]">6</div>
          </div>
          <span className="text-lg font-black text-neutral-100 tracking-wider">LGamer GTA6</span>
        </div>
        <nav className="flex flex-wrap items-center gap-5 text-xs uppercase tracking-widest text-neutral-500">
          <Link href="#blog" className="hover:text-gold">Blog GTA 6</Link>
          <Link href="#canal" className="hover:text-[#ff0033]">Canal YouTube</Link>
          <Link href="#sobre" className="hover:text-neutral-200">Sobre</Link>
        </nav>
        <div className="flex flex-col items-center gap-2 text-xs text-neutral-600">
          <a href="https://www.youtube.com/@LGamerGTA6" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300">
            youtube.com/@LGamerGTA6
          </a>
          <p>© {new Date().getFullYear()} LGamer GTA6.</p>
        </div>
      </div>
    </footer>
  )
}
