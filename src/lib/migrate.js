import { createClient } from '@libsql/client/http'
import { readFileSync } from 'fs'
import { join } from 'path'

function loadEnv() {
  try {
    const envPath = join(process.cwd(), '.env.local')
    const text = readFileSync(envPath, 'utf-8')
    for (const line of text.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eq = trimmed.indexOf('=')
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      const value = trimmed.slice(eq + 1).trim()
      if (key && !process.env[key]) {
        process.env[key] = value
      }
    }
  } catch (e) {
    console.warn('Não foi possível ler .env.local:', e.message)
  }
}

loadEnv()

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const schema = readFileSync(join(process.cwd(), 'schema.sql'), 'utf-8')

const statements = schema
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--') && s.length > 10)

for (const statement of statements) {
  try {
    await db.execute(statement)
    console.log('✓', statement.slice(0, 70).replace(/\n/g, ' '))
  } catch (e) {
    console.error('✗', e.message)
  }
}

// Tabelas criadas diretamente (evita problemas com CREATE TABLE IF NOT EXISTS no Turso)
const extraTables = [
  `CREATE TABLE IF NOT EXISTS gta_news (
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
  )`,
  `CREATE INDEX IF NOT EXISTS idx_gta_news_published_at ON gta_news(published_at DESC)`,
  `CREATE INDEX IF NOT EXISTS idx_gta_news_source ON gta_news(source_slug)`,
  `CREATE TABLE IF NOT EXISTS news_bookmarks (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    news_id TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(user_id, news_id)
  )`,
  `CREATE INDEX IF NOT EXISTS idx_news_bookmarks_user ON news_bookmarks(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_news_bookmarks_news ON news_bookmarks(news_id)`,
  `CREATE TABLE IF NOT EXISTS news_comments (
    id TEXT PRIMARY KEY,
    news_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE INDEX IF NOT EXISTS idx_news_comments_news ON news_comments(news_id)`,
  `CREATE INDEX IF NOT EXISTS idx_news_comments_user ON news_comments(user_id)`,
  `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`,
  `CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email)`,
]

console.log('\n--- Criando tabelas extras ---')
for (const statement of extraTables) {
  try {
    await db.execute(statement)
    console.log('✓', statement.slice(0, 70).replace(/\n/g, ' '))
  } catch (e) {
    console.error('✗', e.message)
  }
}

console.log('\n✅ Migração concluída!')
