const GTA6_TIMELINE = [
  {
    date: '2023-09',
    title: 'Anúncio oficial do GTA 6',
    description: 'Rockstar confirma que GTA 6 está em desenvolvimento.',
    type: 'confirmed',
    source: 'Rockstar Games',
  },
  {
    date: '2025-02',
    title: 'Primeiro trailer oficial',
    description: 'Trailer 1 revela Vice City, Lucia e Jason, lançamento em 2025.',
    type: 'confirmed',
    source: 'Rockstar Games',
  },
  {
    date: '2025-05',
    title: 'Adiamento do lançamento',
    description: 'GTA 6 adiado para 2026 para garantir qualidade.',
    type: 'confirmed',
    source: 'Rockstar Games',
  },
  {
    date: '2025-10',
    title: 'Segundo trailer rumorado',
    description: 'Especulação de novo trailer focado em gameplay e mapa.',
    type: 'rumor',
    source: 'RockstarINTEL',
  },
  {
    date: '2026-01',
    title: 'Lançamento no PS5 e Xbox Series X|S',
    description: 'Versões de console esperadas primeiro, PC depois.',
    type: 'confirmed',
    source: 'Rockstar Games',
  },
  {
    date: '2026-06',
    title: 'Versão para PC',
    description: 'Lançamento da versão PC ainda sem data oficial.',
    type: 'rumor',
    source: 'GTABase',
  },
  {
    date: '2026-10',
    title: 'GTA Online para GTA 6',
    description: 'Possível lançamento de GTA Online integrado ao novo jogo.',
    type: 'rumor',
    source: 'Dexerto',
  },
]

export default function TimelinePage() {
  return (
    <div className="space-y-6">
      <header className="flex items-end gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#e8c84a]" />
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">GTA6Wire</p>
        </div>
        <h1 className="text-2xl font-semibold text-neutral-100">Timeline GTA 6</h1>
      </header>

      <p className="text-neutral-400 max-w-xl">
        Linha do tempo dos principais eventos, anúncios e rumores de GTA 6. Itens marcados como
        <span className="text-xs bg-neon-green/10 text-neon-green border border-neon-green/30 px-1.5 py-0.5 rounded">Confirmado</span>
        têm fonte oficial; <span className="text-xs bg-pink-neon/10 text-pink-neon border border-pink-neon/30 px-1.5 py-0.5 rounded">Rumor</span>
        são especulações de portais.
      </p>

      <div className="relative space-y-8">
        <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-[#1e1e2e]" />

        {GTA6_TIMELINE.map((event, i) => {
          const isConfirmed = event.type === 'confirmed'
          const color = isConfirmed ? '#00ff88' : '#ff0080'
          return (
            <div key={event.date} className="relative pl-10">
              <div className="absolute left-0 top-2 w-4 h-4 rounded-full border-2 border-[#1e1e2e] bg-[#13131d]">
                <div className="w-2 h-2 rounded-full bg-current" style={{ backgroundColor: color }} />
              </div>
              <div className="flex items-center gap-2 text-xs mb-1">
                <span className={`font-medium ${isConfirmed ? 'text-neon-green' : 'text-pink-neon'}`}>{event.type === 'confirmed' ? 'CONFIRMADO' : 'RUMOR'}</span>
                <span className="text-neutral-600">•</span>
                <span className="text-neutral-500">{event.date}</span>
              </div>
              <h3 className="text-sm font-semibold text-neutral-200">{event.title}</h3>
              <p className="text-sm text-neutral-400">{event.description}</p>
              <span className="text-[10px] text-neutral-600 font-medium uppercase tracking-tighter">{event.source}</span>
              {i < GTA6_TIMELINE.length - 1 && (
                <div className="absolute left-1 top-[24px] bottom-[-12px] w-0.5 bg-[#1e1e2e]" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
