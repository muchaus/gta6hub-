import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import PostCard from '@/components/feed/PostCard'
import { formatDistanceToNow } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ProfilePage({ params }: { params: { username: string } }) {
  const session = await auth()
  const isMe = params.username === 'me'

  const targetUsername = isMe
    ? session?.user?.name
    : params.username

  const userRes = await db.execute({
    sql: `SELECT id, username, psn_id, bio, avatar_url, created_at FROM users WHERE username = ?`,
    args: [targetUsername],
  })

  if (!userRes.rows[0]) notFound()
  const user = userRes.rows[0]

  const clansRes = await db.execute({
    sql: `SELECT c.id, c.name, c.tag, cm.role
          FROM clans c JOIN clan_members cm ON cm.clan_id = c.id
          WHERE cm.user_id = ?`,
    args: [user.id],
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
          WHERE p.user_id = ?
          ORDER BY p.created_at DESC LIMIT 20`,
    args: [session?.user?.id ?? '', user.id],
  })

  const isOwn = session?.user?.id === (user.id as string)

  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-[#13131d] border border-[#1e1e2e] rounded-xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#1a1628] flex items-center justify-center text-xl font-medium text-[#9f8fdd]">
              {(user.username as string).slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h1 className="text-lg font-medium text-neutral-100">{user.username as string}</h1>
              {user.psn_id && (
                <div className="mt-1 inline-flex items-center gap-1.5 bg-[#0a2035] border border-[#1a3a5a] rounded-full px-3 py-1 text-xs text-[#5b9fd4]">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M8.985 2.596v17.548l3.915 1.261V6.688c0-.69.304-1.151.794-.999.636.198.762.89.762 1.58v5.584l3.915 1.256V7.522c0-3.294-2.024-4.83-4.954-3.753z"/><path d="M.006 17.34l4.141 1.738L13.012 21v-3.165l-5.987-2.135-.007-2.18L13.012 15V11.87L.006 7.598z"/></svg>
                  PSN: {user.psn_id as string}
                </div>
              )}
              <p className="text-xs text-neutral-600 mt-1.5">
                Membro desde {formatDistanceToNow(user.created_at as string)}
              </p>
            </div>
          </div>
          {isOwn && (
            <Link
              href="/profile/edit"
              className="text-xs px-3 py-1.5 border border-[#2d2050] text-[#7a6abf] rounded-lg hover:bg-[#1a1628] hover:text-[#e8c84a] transition-colors"
            >
              Editar perfil
            </Link>
          )}
        </div>

        {user.bio && (
          <p className="mt-4 text-sm text-neutral-400 leading-relaxed">{user.bio as string}</p>
        )}

        {clansRes.rows.length > 0 && (
          <div className="mt-4 pt-4 border-t border-[#1e1e2e]">
            <p className="text-xs text-neutral-600 mb-2">Clãs</p>
            <div className="flex flex-wrap gap-2">
              {clansRes.rows.map(c => (
                <Link
                  key={c.id as string}
                  href={`/clans/${(c.tag as string).toLowerCase()}`}
                  className="flex items-center gap-1.5 bg-[#1a1628] border border-[#2d2050] rounded-lg px-3 py-1 text-xs text-neutral-400 hover:text-[#e8c84a] hover:border-[#4a3a8a] transition-colors"
                >
                  <span className="text-[#7a6abf] font-medium">{c.tag as string}</span>
                  {c.name as string}
                  {c.role === 'owner' && <span className="text-[#e8c84a]">★</span>}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-neutral-500">
          Posts de {user.username as string}
        </h2>
        {postsRes.rows.length === 0 ? (
          <p className="text-sm text-neutral-700 text-center py-8">Nenhum post ainda.</p>
        ) : (
          postsRes.rows.map(post => (
            <PostCard key={post.id as string} post={post as any} currentUserId={session?.user?.id ?? ''} />
          ))
        )}
      </div>
    </div>
  )
}
