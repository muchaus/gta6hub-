'use client'

import Link from 'next/link'
import { useState } from 'react'
import { formatDistanceToNow } from '@/lib/utils'

interface Post {
  id: string
  title: string
  content: string
  type: string
  username: string
  psn_id: string | null
  clan_name: string | null
  clan_tag: string | null
  created_at: string
  likes_count: number
  comments_count: number
  user_liked: number
  user_id: string
  image_url?: string | null
}

const typeConfig: Record<string, { label: string; color: string }> = {
  news:    { label: 'Notícia', color: 'bg-[#1a2e1a] text-[#5db85d] border-[#2a4a2a]' },
  clan:    { label: 'Clã',     color: 'bg-[#1a1628] text-[#7a6abf] border-[#2d2050]' },
  lfg:     { label: 'LFG',     color: 'bg-[#2a1a0a] text-[#c4824a] border-[#4a2a0a]' },
  general: { label: 'Geral',   color: 'bg-[#1a1a26] text-neutral-400 border-[#2a2a3a]' },
}

export default function PostCard({ post, currentUserId }: { post: Post; currentUserId: string }) {
  const [liked, setLiked] = useState(post.user_liked > 0)
  const [likesCount, setLikesCount] = useState(Number(post.likes_count))
  const type = typeConfig[post.type] ?? typeConfig.general
  const initials = post.username.slice(0, 2).toUpperCase()

  async function toggleLike() {
    setLiked(prev => !prev)
    setLikesCount(prev => liked ? prev - 1 : prev + 1)
    await fetch(`/api/posts/${post.id}/like`, { method: 'POST' })
  }

  return (
    <article className="bg-[#13131d] border border-[#1e1e2e] rounded-xl p-4 hover:border-[#2e2e4a] transition-colors">
      <div className="flex items-start gap-3 mb-3">
        <Link href={`/profile/${post.username}`} className="w-9 h-9 rounded-full bg-[#1a1628] flex items-center justify-center text-xs font-medium text-[#9f8fdd] hover:bg-[#241d3a] transition-colors shrink-0">
          {initials}
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Link href={`/profile/${post.username}`} className="text-sm font-medium text-neutral-200 hover:text-[#e8c84a] transition-colors">
              {post.username}
            </Link>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${type.color}`}>{type.label}</span>
            {post.clan_tag && (
              <Link href={`/clans/${post.clan_tag.toLowerCase()}`} className="text-[10px] text-neutral-600 hover:text-neutral-400">
                · {post.clan_name}
              </Link>
            )}
          </div>
          <p className="text-[11px] text-neutral-600 mt-0.5">{formatDistanceToNow(post.created_at)}</p>
        </div>
      </div>

      <Link href={`/posts/${post.id}`} className="block group">
        <h2 className="text-sm font-medium text-neutral-100 group-hover:text-[#e8c84a] transition-colors mb-1.5">{post.title}</h2>
        <p className="text-sm text-neutral-500 leading-relaxed line-clamp-3">{post.content}</p>
      </Link>

      {post.image_url && (
        <Link href={`/posts/${post.id}`} className="block mt-3">
          <img
            src={post.image_url}
            alt="Imagem do post"
            className="w-full max-h-72 object-cover rounded-lg border border-[#1e1e2e]"
          />
        </Link>
      )}

      {post.psn_id && (post.type === 'clan' || post.type === 'lfg') && (
        <div className="mt-3 inline-flex items-center gap-1.5 bg-[#0a2035] border border-[#1a3a5a] rounded-full px-3 py-1 text-xs text-[#5b9fd4]">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M8.985 2.596v17.548l3.915 1.261V6.688c0-.69.304-1.151.794-.999.636.198.762.89.762 1.58v5.584l3.915 1.256V7.522c0-3.294-2.024-4.83-4.954-3.753z"/><path d="M.006 17.34l4.141 1.738L13.012 21v-3.165l-5.987-2.135-.007-2.18L13.012 15V11.87L.006 7.598z"/></svg>
          {post.psn_id}
        </div>
      )}

      <div className="flex items-center gap-4 mt-4">
        <button onClick={toggleLike} className={`flex items-center gap-1.5 text-xs transition-colors ${liked ? 'text-[#e8c84a]' : 'text-neutral-600 hover:text-[#e8c84a]'}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          {likesCount}
        </button>
        <Link href={`/posts/${post.id}`} className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-300 transition-colors">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          {Number(post.comments_count)} comentários
        </Link>
      </div>
    </article>
  )
}
