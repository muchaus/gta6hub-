import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PostCard from '@/components/feed/PostCard'
import JoinClanButton from '@/components/clans/JoinClanButton'

export const dynamic = 'force-dynamic'

export default async function ClanPage({ params }: { params: { tag: string } }) {
  const session = await auth()
  const tag = params.tag.toUpperCase()

  const clanRes = await db.execute({
    sql: `SELECT c.*, u.username as owner_name,
                 (SELECT COUNT(*) FROM clan_members WHERE clan_id = c.id) as members_count,
                 (SELECT COUNT(*) FROM clan_members WHERE clan_id = c.id AND user_id = ?) as is_member
          FROM clans c JOIN users u ON u.id = c.owner_id
          WHERE c.tag = ?`,
    args: [session!.user!.id, tag],
  })

  if (!clanRes.rows[0]) notFound()
  const clan = clanRes.rows[0]

  const membersRes = await db.execute({
    sql: `SELECT u.id, u.username, u.psn_id, cm.role
          FROM clan_members cm JOIN users u ON u.id = cm.user_id
          WHERE cm.clan_id = ?
          ORDER BY cm.role = 'owner' DESC, cm.joined_at ASC
          LIMIT 20`,
    args: [clan.id],
  })

  const postsRes = await db.execute({
    sql: `SELECT p.*, u.username, u.psn_id, u.avatar_url,
                 c.name as clan_name, c.tag as clan_tag,
                 (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
                 (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
                 (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id AND user_id = ?) as user_liked
          FROM posts p
          JOIN users u ON u.id = p.user_id
          LEFT JOIN clans c ON c.id = p.clan_id
          WHERE p.clan_id = ?
          ORDER BY p.created_at DESC LIMIT 20`,
    args: [session!.user!.id, clan.id],
  })

  return (
    <div className="space-y-6">
      <div className="bg-[#13131d] border border-[#1e1e2e] rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#1a1628] border border-[#2d2050] flex items-center justify-center text-lg font-medium text-[#7a6abf]">
              {clan.tag as string}
            </div>
            <div>
              <h1 className="text-xl font-medium text-neutral-100">{clan.name as string}</h1>
              {clan.focus && (
                <p className="text-xs text-neutral-600 mt-0.5">{clan.focus as string}</p>
              )}
              <p className="text-xs text-neutral-600 mt-1">
                {Number(clan.members_count)} membros · Fundado por {clan.owner_name as string}
              </p>
            </div>
          </div>
          <JoinClanButton
            clanId={clan.id as string}
            isMember={Number(clan.is_member) > 0}
          />
        </div>

        {clan.description && (
          <p className="mt-4 text-sm text-neutral-400 leading-relaxed">{clan.description as string}</p>
        )}

        <div className="mt-5 pt-4 border-t border-[#1e1e2e]">
          <p className="text-xs text-neutral-600 mb-3">Membros</p>
          <div className="flex flex-wrap gap-2">
            {membersRes.rows.map(m => (
              <Link
                key={m.id as string}
                href={`/profile/${m.username}`}
                className="flex items-center gap-2 bg-[#0d0d18] border border-[#1e1e2e] rounded-lg px-3 py-1.5 hover:border-[#2d2050] transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-[#1a1628] flex items-center justify-center text-[10px] font-medium text-[#9f8fdd]">
                  {(m.username as string).slice(0, 2).toUpperCase()}
                </div>
                <span className="text-xs text-neutral-300">{m.username as string}</span>
                {m.role === 'owner' && <span className="text-[10px] text-[#e8c84a]">★</span>}
                {m.psn_id && (
                  <span className="text-[10px] text-[#5b9fd4]">{m.psn_id as string}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-neutral-500">Posts do clã</h2>
        {postsRes.rows.length === 0 ? (
          <p className="text-sm text-neutral-700 text-center py-8">Nenhum post ainda.</p>
        ) : (
          postsRes.rows.map(post => (
            <PostCard key={post.id as string} post={post as any} currentUserId={session!.user!.id} />
          ))
        )}
      </div>
    </div>
  )
}
