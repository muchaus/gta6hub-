import { auth } from '@/lib/auth'
import db from '@/lib/db'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from '@/lib/utils'
import CommentBox from '@/components/feed/CommentBox'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function PostPage({ params }: { params: { id: string } }) {
  const session = await auth()

  const postRes = await db.execute({
    sql: `SELECT p.*, u.username, u.psn_id,
                 c.name as clan_name, c.tag as clan_tag,
                 (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as likes_count
          FROM posts p
          JOIN users u ON u.id = p.user_id
          LEFT JOIN clans c ON c.id = p.clan_id
          WHERE p.id = ?`,
    args: [params.id],
  })

  if (!postRes.rows[0]) notFound()
  const post = postRes.rows[0]

  const commentsRes = await db.execute({
    sql: `SELECT cm.*, u.username
          FROM comments cm
          JOIN users u ON u.id = cm.user_id
          WHERE cm.post_id = ?
          ORDER BY cm.created_at ASC`,
    args: [params.id],
  })
  const comments = commentsRes.rows

  return (
    <div className="max-w-2xl space-y-4">
      <Link href="/feed" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors">
        ← Voltar ao feed
      </Link>

      <article className="bg-[#13131d] border border-[#1e1e2e] rounded-xl p-5">
        <div className="flex items-center gap-3 mb-4">
          <Link
            href={`/profile/${post.username}`}
            className="w-9 h-9 rounded-full bg-[#1a1628] flex items-center justify-center text-xs font-medium text-[#9f8fdd]"
          >
            {(post.username as string).slice(0, 2).toUpperCase()}
          </Link>
          <div>
            <Link href={`/profile/${post.username}`} className="text-sm font-medium text-neutral-200 hover:text-[#e8c84a]">
              {post.username as string}
            </Link>
            <p className="text-xs text-neutral-600">{formatDistanceToNow(post.created_at as string)}</p>
          </div>
        </div>

        <h1 className="text-lg font-medium text-neutral-100 mb-3">{post.title as string}</h1>
        <p className="text-sm text-neutral-400 leading-relaxed whitespace-pre-wrap">{post.content as string}</p>

        {post.psn_id && (
          <div className="mt-4 inline-flex items-center gap-1.5 bg-[#0a2035] border border-[#1a3a5a] rounded-full px-3 py-1 text-xs text-[#5b9fd4]">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M8.985 2.596v17.548l3.915 1.261V6.688c0-.69.304-1.151.794-.999.636.198.762.89.762 1.58v5.584l3.915 1.256V7.522c0-3.294-2.024-4.83-4.954-3.753z"/><path d="M.006 17.34l4.141 1.738L13.012 21v-3.165l-5.987-2.135-.007-2.18L13.012 15V11.87L.006 7.598z"/></svg>
            PSN: {post.psn_id as string}
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-[#1e1e2e] text-xs text-neutral-600">
          {Number(post.likes_count)} curtidas · {comments.length} comentários
        </div>
      </article>

      <div className="space-y-3">
        <h2 className="text-sm font-medium text-neutral-400">Comentários</h2>
        <CommentBox postId={params.id} />

        {comments.map(c => (
          <div key={c.id as string} className="bg-[#13131d] border border-[#1e1e2e] rounded-xl px-4 py-3 flex gap-3">
            <Link
              href={`/profile/${c.username}`}
              className="w-7 h-7 rounded-full bg-[#1a1628] flex items-center justify-center text-[10px] font-medium text-[#9f8fdd] shrink-0"
            >
              {(c.username as string).slice(0, 2).toUpperCase()}
            </Link>
            <div>
              <Link href={`/profile/${c.username}`} className="text-xs font-medium text-neutral-300 hover:text-[#e8c84a]">
                {c.username as string}
              </Link>
              <span className="text-xs text-neutral-700 ml-2">{formatDistanceToNow(c.created_at as string)}</span>
              <p className="text-sm text-neutral-400 mt-1 leading-relaxed">{c.content as string}</p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <p className="text-xs text-neutral-700 text-center py-6">Nenhum comentário ainda.</p>
        )}
      </div>
    </div>
  )
}
