export default function YoutubeSection() {
  const videos = [
    {
      id: 'trailer1',
      title: 'GTA 6 | Primeiro Trailer Oficial - Análise Completa',
      views: '2,4M views',
      ago: '2 meses',
      thumb: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 'mapa',
      title: 'Mapa de GTA 6 | Vice City - Tudo o que sabemos',
      views: '1,8M views',
      ago: '1 mês',
      thumb: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 'personagens',
      title: 'Lucia e Jason | Quem são os protagonistas de GTA 6',
      views: '1,2M views',
      ago: '3 semanas',
      thumb: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 'teorias',
      title: 'Teorias de GTA 6 | O que vem no próximo trailer?',
      views: '890K views',
      ago: '2 semanas',
      thumb: 'https://images.unsplash.com/photo-1512343877729-e1d8000529df?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 'rumores',
      title: 'RUMORES de GTA 6 | Data de lançamento',
      views: '640K views',
      ago: '5 dias',
      thumb: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 'gameplay',
      title: 'GTA 6 Gameplay | Novas mecânicas reveladas',
      views: '410K views',
      ago: 'ontem',
      thumb: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop',
    },
  ]

  return (
    <section id="canal" className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-10 -left-10 h-72 w-72 rounded-full bg-[#ff0080]/20 blur-[140px]" />
        <div className="absolute -bottom-10 -right-10 h-72 w-72 rounded-full bg-[#fdb813]/20 blur-[140px]" />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ff0033]/30 bg-[#ff0033]/10 px-4 py-1 text-xs uppercase tracking-[0.5em] text-[#ff0033] font-bold shadow-[0_0_15px_rgba(255,0,51,0.2)]">
              <span className="h-2 w-2 rounded-full bg-[#ff0033]" />
              Canal no YouTube
            </span>
            <h2 className="mt-3 text-4xl font-black text-neutral-100 tracking-tight sm:text-5xl">Acompanhe o LGamer GTA6</h2>
            <p className="mt-4 max-w-2xl text-lg text-neutral-400 leading-relaxed">
              Vídeos didáticos, teorias, notícias e análises de GTA 6. Inscreva-se pra não perder nenhum lançamento.
            </p>
          </div>
          <a
            href="https://www.youtube.com/@LGamerGTA6"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-[#ff0033] px-8 py-3 text-sm font-bold text-white shadow-[0_0_25px_rgba(255,0,51,0.4)] hover:bg-[#cc002c] transition-transform hover:-translate-y-0.5"
          >
            Inscrever-se agora
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
              <path d="M15.8 4.8s-.16-1.12-.64-1.6c-.6-.64-1.28-.64-1.6-.68C11.36 2.4 8 2.4 8 2.4s-3.36 0-5.56.12c-.32.04-1 .04-1.6.68C.36 3.68.2 4.8.2 4.8S.04 6.12.04 7.44v1.12c0 1.32.16 2.64.16 2.64s.16 1.12.64 1.6c.6.64 1.4.62 1.76.68 1.28.12 5.4.12 5.4.12s3.36 0 5.56-.12c.32-.04 1-.04 1.6-.68.48-.48.64-1.6.64-1.6s.16-1.32.16-2.64V7.44c0-1.32-.16-2.64-.16-2.64zM6.4 10.16V5.36l4.28 2.4L6.4 10.16z" />
            </svg>
          </a>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {videos.map((video) => (
            <article key={video.id} className="group relative overflow-hidden rounded-2xl border border-white/5 bg-[#101018]/80 backdrop-blur transition-all hover:border-[#ff0033]/40 hover:shadow-[0_0_30px_rgba(255,0,51,0.06)]">
              <div className="relative h-44 overflow-hidden bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: 'url(' + video.thumb + ')' }}>
                <span className="absolute -top-1 right-1 px-2 py-0.5 text-[10px] font-black bg-gold text-black rounded-bl-sm rounded-tr-sm shadow-md">YouTube</span>
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                <div className="absolute bottom-3 right-3 flex items-center gap-1 text-xs font-bold text-white bg-black/70 px-2 py-0.5 rounded">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M10 15l5-3-5-3z" />
                  </svg>
                  <span className="ml-1">{video.views}</span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="mb-1.5 text-lg font-bold text-neutral-100 group-hover:text-gold transition-colors line-clamp-1">{video.title}</h3>
                <p className="text-xs text-neutral-500">{video.views} • {video.ago}</p>
              </div>
              <a href="https://www.youtube.com/@LGamerGTA6" target="_blank" rel="noopener noreferrer" className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Assistir vídeo">
                <span className="sr-only">Assistir vídeo</span>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
