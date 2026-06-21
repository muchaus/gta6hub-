import { auth } from '@/lib/auth'
import db from '@/lib/db'
import Link from 'next/link'
import JoinClanButton from '@/components/clans/JoinClanButton'

export const dynamic = 'force-dynamic'

export default async function ClansPage({ searchParams }: { searchParams: { q?: string } }) {
  const session = await auth()
  const q = searchParams.q ?? ''

  const clansRes = await db.execute({
    sql: `SELECT c.*, u.username as owner_name,
                 (SELECT COUNT(*) FROM clan_members WHERE clan_id = c.id) as members_count,
                 (SELECT COUNT(*) FROM clan_members WHERE clan_id = c.id AND user_id = ?) as is_member
          FROM clans c
          JOIN users u ON u.id = c.owner_id
          WHERE c.name LIKE ? OR c.tag LIKE ?
          ORDER BY members_count DESC
          LIMIT 30`,
    args: [session!.user!.id, `%${q}%`, `%${q}%`],
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-neutral-200">Clãs</h1>
        <Link
          href="/clans/create"
          className="text-xs px-4 py-2 bg-[#e8c84a] text-[#0a0a0f] font-medium rounded-lg hover:bg-[#f0d460] transition-colors"
        >
          + Criar Clã
        </Link>
      </div>

      <form method="GET">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Buscar por nome ou tag..."
          className="w-full bg-[#13131d] border border-[#1e1e2e] rounded-lg px-4 py-2.5 text-sm text-neutral-200 outline-none focus:border-[#e8c84a]/40 transition-colors"
        />
      </form>

      <div className="space-y-3">
        {clansRes.rows.length === 0 && (
          <p className="text-sm text-neutral-700 text-center py-8">Nenhum clã encontrado.</p>
        )}
        {clansRes.rows.map(clan => (
          <div key={clan.id as string} className="bg-[#13131d] border border-[#1e1e2e] rounded-xl p-4 flex items-center gap-4 hover:border-[#2e2e4a] transition-colors">
            <div className="w-12 h-12 rounded-xl bg-[#1a1628] border border-[#2d2050] flex items-center justify-center text-sm font-medium text-[#7a6abf] shrink-0">
              {clan.tag as string}
            </div>
            <div className="flex-1 min-w-0">
              <Link href={`/clans/${(clan.tag as string).toLowerCase()}`} className="text-sm font-medium text-neutral-200 hover:text-[#e8c84a] transition-colors">
                {clan.name as string}
              </Link>
              {clan.focus && (
                <span className="ml-2 text-[10px] text-neutral-600">{clan.focus as string}</span>
              )}
              <p className="text-xs text-neutral-600 mt-0.5">
                {Number(clan.members_count)} membros · criado por {clan.owner_name as string}
              </p>
              {clan.description && (
                <p className="text-xs text-neutral-500 mt-1 line-clamp-1">{clan.description as string}</p>
              )}
            </div>
            <JoinClanButton
              clanId={clan.id as string}
              isMember={Number(clan.is_member) > 0}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
