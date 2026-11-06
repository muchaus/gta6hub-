import Link from 'next/link'

export default function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden py-24 pb-32">
      <div className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1512343877729-e1d8000529df?q=80&w=2070&auto=format&fit=crop"
          alt="neon city night"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070a]/95 via-[#07070a]/60 to-transparent" />
      </div>
      <div className="absolute inset-x-0 top-0 -z-10 h-[400px] bg-[radial-gradient(circle_at_top_right,rgba(255,0,128,0.15),transparent_50%)]" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-[300px] bg-[radial-gradient(circle_at_bottom_left,rgba(253,184,19,0.12),transparent_50%)]" />

      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 text-center">
        <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#ff0080]/30 bg-[#ff0080]/10 px-5 py-1.5 text-xs uppercase tracking-[0.5em] text-[#ff0080] font-bold shadow-[0_0_15px_rgba(255,0,128,0.2)]">
          <span className="h-2 w-2 rounded-full bg-[#ff0080]" />
          Blog GTA 6 • Novidades diárias
        </span>
        <h1 className="max-w-3xl text-5xl font-black tracking-tight text-neutral-100 sm:text-7xl lg:text-8xl leading-[1.05]">
          LGamer GTA6
          <br />
          <span className="text-gradient">Tudo sobre GTA 6</span>
        </h1>
        <p className="mt-10 max-w-2xl text-lg text-neutral-400 leading-relaxed">
          Notícias, rumores, trailers, mapa, personagens e muito mais explicado de forma simples e didática. Acompanhe o canal LGamer GTA6.
        </p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Link href="#blog" className="inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-black text-black shadow-[0_0_20px_rgba(253,184,19,0.5)] hover:bg-[#f5d95c] transition-transform hover:-translate-y-0.5">
            Ver Blog GTA 6
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M3.333 8h9.334M8.667 4l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <a href="https://www.youtube.com/@LGamerGTA6" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-8 py-3.5 text-sm font-bold text-neutral-200 hover:bg-white/5 transition-colors">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M15.8 4.8s-.16-1.12-.64-1.6c-.6-.64-1.28-.64-1.6-.68C11.36 2.4 8 2.4 8 2.4s-3.36 0-5.56.12c-.32.04-1 .04-1.6.68C.36 3.68.2 4.8.2 4.8S.04 6.12.04 7.44v1.12c0 1.32.16 2.64.16 2.64s.16 1.12.64 1.6c.6.64 1.4.62 1.76.68 1.28.12 5.4.12 5.4.12s3.36 0 5.56-.12c.32-.04 1-.04 1.6-.68.48-.48.64-1.6.64-1.6s.16-1.32.16-2.64V7.44c0-1.32-.16-2.64-.16-2.64zM6.4 10.16V5.36l4.28 2.4L6.4 10.16z" />
            </svg>
            Inscrever-se no canal
          </a>
        </div>
      </div>
    </section>
  )
}
