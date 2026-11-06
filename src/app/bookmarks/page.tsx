import NewsCard from '@/components/news/NewsCard'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export default async function BookmarksPage() {
  const session = await auth()
  if (!session?.user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-neutral-100 mb-2">Faça login para ver seus salvos</h2>
          <p className="text-neutral-500 mb-4">Entre na sua conta para acessar as notícias que você salvou.</p>
        </div>
      </div>
    )
  }

  const userId = (session.user as any).id

  let items: any[] = []
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/news/bookmarks`, {
      cache: 'no-store',
      headers: { Cookie: `authjs.session-token=placeholder` }
    })
    const data = await res.json()
    items = data.items || []
  } catch (e) {
    console.error('Erro ao buscar bookmarks:', e)
  }

  return (
    <div className="space-y-6">
      <header className="flex items-end gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#e8c84a]" />
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-500">GTA6Wire</p>
        </div>
        <h1 className="text-2xl font-semibold text-neutral-100">Meus salvos</h1>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#1e1e2e] py-20 text-center text-sm text-neutral-600">
          Nenhuma notícia salva ainda. Navegue pelo GTA6Wire e clique na estrela para salvar.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item: any) => (
            <NewsCard key={item.id} item={{ ...item, bookmarked: true }} />
          ))}
        </div>
      )}
    </div>
  )
}
