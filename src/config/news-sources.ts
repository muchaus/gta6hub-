export interface NewsSource {
  id: string
  name: string
  slug: string
  url: string
  rss?: string
  category: 'gaming' | 'news' | 'rumor'
  enabled: boolean
  color?: string
}

export const NEWS_SOURCES: NewsSource[] = [
  {
    id: 'flowgames',
    name: 'Flow Games',
    slug: 'flowgames',
    url: 'https://flowgames.gg',
    rss: 'https://flowgames.gg/feed/',
    category: 'gaming',
    enabled: true,
    color: '#22d3ee'
  },
  {
    id: 'rockstarintel',
    name: 'RockstarINTEL',
    slug: 'rockstarintel',
    url: 'https://rockstarintel.com',
    rss: 'https://rockstarintel.com/feed/',
    category: 'news',
    enabled: true,
    color: '#f59e0b'
  },
  {
    id: 'gtabase',
    name: 'GTABase',
    slug: 'gtabase',
    url: 'https://www.gtabase.com',
    rss: 'https://www.gtabase.com/news/feed/',
    category: 'news',
    enabled: true,
    color: '#22c55e'
  },
  {
    id: 'dexerto',
    name: 'Dexerto',
    slug: 'dexerto',
    url: 'https://www.dexerto.com',
    rss: 'https://www.dexerto.com/feed/',
    category: 'gaming',
    enabled: true,
    color: '#a855f7'
  },
  {
    id: 'ign',
    name: 'IGN',
    slug: 'ign',
    url: 'https://www.ign.com',
    rss: 'https://feeds.feedburner.com/ign/news',
    category: 'news',
    enabled: true,
    color: '#ef4444'
  },
  {
    id: 'gamespot',
    name: 'GameSpot',
    slug: 'gamespot',
    url: 'https://www.gamespot.com',
    rss: 'https://www.gamespot.com/feeds/news/',
    category: 'news',
    enabled: true,
    color: '#fb923c'
  },
  {
    id: 'gamingbolt',
    name: 'GamingBolt',
    slug: 'gamingbolt',
    url: 'https://gamingbolt.com',
    rss: 'https://gamingbolt.com/feed',
    category: 'gaming',
    enabled: true,
    color: '#06b6d4'
  }
]
