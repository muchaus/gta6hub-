import { auth } from '@/lib/auth'
import db from '@/lib/db'
import PostCard from '@/components/feed/PostCard'
import ComposeBox from '@/components/feed/ComposeBox'

export const dynamic = 'force-dynamic'

type Tab = 'all' | 'clans' | 'lfg'

export default async function FeedPage({ searchParams }: { searchParams: { tab?: Tab } }) {
  const session = await auth()
  const tab = searchParams.tab ?? 'all'
  const userId = (session?.user?.id ?? '').replace(/'/g, "''")

  let whereClause = ''
  if (tab === 'clans') whereClause = `WHERE p.type = 'clan'`
  else if (tab === 'lfg') whereClause = `WHERE p.type = 'lfg'`

  let posts: any[] = []

  try {
    const result = await db.execute(
      `SELECT p.*, u.username, u.psn_id, u.avatar_url,
              c.name as clan_name, c.tag as clan_tag,
              (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count,
              (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as comments_count,
              (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id AND user_id = '${userId}') as user_liked
       FROM posts p
       JOIN users u ON u.id = p.user_id
       LEFT JOIN clans c ON c.id = p.clan_id
       ${whereClause}
       ORDER BY p.created_at DESC LIMIT 30`
    )
    posts = result.rows
  } catch (e) {
    console.error('Feed fetch error:', e)
  }

  return (
    <div className="space-y-4">
      <ComposeBox />

      <div className="flex gap-1 bg-[#13131d] border border-[#1e1e2e] rounded-xl p-1 w-fit">
        {([['all', 'Tudo'], ['clans', 'Clãs'], ['lfg', 'LFG']] as const).map(([value, label]) => (
          <a
            key={value}
            href={`/feed?tab=${value}`}
            className={`text-xs px-4 py-1.5 rounded-lg transition-colors ${
              tab === value
                ? 'bg-[#1a1628] text-[#e8c84a]'
                : 'text-neutral-500 hover:text-neutral-300'
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-neutral-600 text-sm">
          Nenhum post ainda. Seja o primeiro!
        </div>
      ) : (
        posts.map(post => (
          <PostCard key={post.id as string} post={post as any} currentUserId={userId} />
        ))
      )}
    </div>
  )
}
