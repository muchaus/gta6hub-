import { auth } from '@/lib/auth'
import db from '@/lib/db'
import PostCard from '@/components/feed/PostCard'
import ComposeBox from '@/components/feed/ComposeBox'

export const dynamic = 'force-dynamic'

export default async function LFGPage() {
  const session = await auth()

  const result = await db.execute({
    sql: `SELECT p.*, u.username, u.psn_id, u.avatar_url,
                 c.name as clan_name, c.tag as clan_tag,
                 (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
                 (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
                 (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id AND user_id = ?) as user_liked
          FROM posts p
          JOIN users u ON u.id = p.user_id
          LEFT JOIN clans c ON c.id = p.clan_id
          WHERE p.type = 'lfg'
          ORDER BY p.created_at DESC LIMIT 30`,
    args: [session!.user!.id],
  })

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-lg font-medium text-neutral-200">Looking for Group</h1>
        <p className="text-xs text-neutral-600 mt-1">Encontre jogadores para missões, assaltos e mais.</p>
      </div>

      <ComposeBox />

      {result.rows.length === 0 ? (
        <p className="text-center py-16 text-neutral-600 text-sm">Nenhuma busca por jogadores ainda.</p>
      ) : (
        result.rows.map(post => (
          <PostCard key={post.id as string} post={post as any} currentUserId={session!.user!.id} />
        ))
      )}
    </div>
  )
}
