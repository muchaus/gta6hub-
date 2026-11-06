import db from '@/lib/db'

export async function ensureNewsTable() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS gta_news (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      excerpt TEXT,
      link TEXT UNIQUE NOT NULL,
      image TEXT,
      source_id TEXT NOT NULL,
      source_name TEXT NOT NULL,
      source_slug TEXT NOT NULL,
      source_color TEXT,
      category TEXT DEFAULT 'news',
      published_at INTEGER,
      created_at INTEGER DEFAULT (strftime('%s','now')),
      is_rumor INTEGER DEFAULT 0,
      is_confirmed INTEGER DEFAULT 0
    )
  `)

  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_gta_news_published_at ON gta_news(published_at DESC)
  `)

  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_gta_news_source ON gta_news(source_slug)
  `)
}
