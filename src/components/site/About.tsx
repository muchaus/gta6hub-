export default function About() {
  return (
    <section id="sobre" className="relative pb-28 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-[#ff0080]/20 blur-[160px]" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-[#fdb813]/20 blur-[160px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-14 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#fdb813]/30 bg-[#fdb813]/10 px-4 py-1 text-xs uppercase tracking-[0.5em] text-[#fdb813] font-bold shadow-[0_0_15px_rgba(253,184,19,0.2)]">
              <span className="h-2 w-2 rounded-full bg-[#fdb813]" />
              Sobre o projeto
            </span>
            <h2 className="mt-4 text-4xl font-black text-neutral-100 tracking-tight sm:text-5xl">Blog feito pra entender GTA 6 sem enrolação</h2>
            <p className="mt-6 text-lg text-neutral-400 leading-relaxed max-w-xl">
              LGamer GTA6 nasceu pra ser um espaço didático. Aqui você encontra tudo o que importa sobre GTA 6: notícias, rumores validados, trailers, personagens, mapa, veículos e muito mais.
            </p>
            <p className="mt-6 text-neutral-500 max-w-xl">
              A ideia é simples: traduzir o hype em informação clara. Menos clickbait, mais explicação de verdade.
            </p>
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              <div className="p-5 rounded-2xl border border-white/5 bg-[#101018]/50">
                <span className="text-gold text-sm font-bold uppercase tracking-tighter">Foco</span>
                <p className="mt-1 text-neutral-400 text-sm">GTA 6 + Comunidade brasileira</p>
              </div>
              <div className="p-5 rounded-2xl border border-white/5 bg-[#101018]/50">
                <span className="text-pink-neon text-sm font-bold uppercase tracking-tighter">Formato</span>
                <p className="mt-1 text-neutral-400 text-sm">Notícias, guias e vídeos didáticos</p>
              </div>
              <div className="p-5 rounded-2xl border border-white/5 bg-[#101018]/50">
                <span className="text-purple-neon text-sm font-bold uppercase tracking-tighter">Canal</span>
                <a href="https://www.youtube.com/@LGamerGTA6" target="_blank" rel="noopener noreferrer" className="mt-1 text-neutral-400 text-sm hover:text-gold underline underline-offset-4">
                  youtube.com/@LGamerGTA6
                </a>
              </div>
              <div className="p-5 rounded-2xl border border-white/5 bg-[#101018]/50">
                <span className="text-gold text-sm font-bold uppercase tracking-tighter">Atualizações</span>
                <p className="mt-1 text-neutral-400 text-sm">Feed automático dos principais portais</p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#101018]/60 p-8 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
            <div className="absolute top-6 right-6 h-32 w-32 bg-[#ff0080]/10 rounded-full blur-2xl" />
            <img
              src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000&auto=format&fit=crop"
              alt="neon city night cars"
              className="relative rounded-2xl border border-white/10 shadow-[0_25px_80px_rgba(0,0,0,0.6)]"
            />
            <div className="absolute bottom-6 left-6 rounded-xl border border-[#fdb813]/40 bg-[#07070a]/90 backdrop-blur px-5 py-3 shadow-lg">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#ff0080] animate-pulse" />
                <span className="text-sm font-medium text-neutral-100">Blog ao vivo</span>
              </div>
              <p className="text-[10px] text-neutral-500 mt-1">Atualizado automaticamente</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
