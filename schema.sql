-- GTA6Hub — Schema Turso (libSQL)
-- Execute via: npx @libsql/client ou turso db shell

CREATE TABLE IF NOT EXISTS users (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  username    TEXT NOT NULL UNIQUE,
  email       TEXT NOT NULL UNIQUE,
  password    TEXT NOT NULL,
  psn_id      TEXT,
  avatar_url  TEXT,
  bio         TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS clans (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  name        TEXT NOT NULL,
  tag         TEXT NOT NULL UNIQUE,       -- ex: "LOS", "VRML" (max 5 chars)
  description TEXT,
  focus       TEXT,                        -- ex: "Assaltos", "Corridas", "PvP"
  owner_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  banner_url  TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS clan_members (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  clan_id     TEXT NOT NULL REFERENCES clans(id) ON DELETE CASCADE,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role        TEXT NOT NULL DEFAULT 'member', -- 'owner' | 'admin' | 'member'
  joined_at   TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(clan_id, user_id)
);

CREATE TABLE IF NOT EXISTS posts (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  clan_id     TEXT REFERENCES clans(id) ON DELETE SET NULL,
  type        TEXT NOT NULL DEFAULT 'general', -- 'general' | 'news' | 'clan' | 'lfg'
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS comments (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  post_id     TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content     TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS post_likes (
  id          TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  post_id     TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(post_id, user_id)
);

CREATE TABLE IF NOT EXISTS follows (
  id            TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
  follower_id   TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id  TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(follower_id, following_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_posts_user ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
CREATE INDEX IF NOT EXISTS idx_posts_created ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_clan_members_clan ON clan_members(clan_id);
CREATE INDEX IF NOT EXISTS idx_clan_members_user ON clan_members(user_id);
CREATE INDEX IF NOT EXISTS idx_follows_follower ON follows(follower_id);

-- Tabela de notícias agregadas (usada pelo GTA6Wire)
CREATE TABLE IF NOT EXISTS gta_news (
  id           TEXT PRIMARY KEY,
  title        TEXT NOT NULL,
  excerpt      TEXT,
  link         TEXT UNIQUE NOT NULL,
  image        TEXT,
  source_id    TEXT NOT NULL,
  source_name  TEXT NOT NULL,
  source_slug  TEXT NOT NULL,
  source_color TEXT,
  category     TEXT DEFAULT 'news',
  published_at INTEGER,
  created_at   INTEGER DEFAULT (strftime('%s','now')),
  is_rumor     INTEGER DEFAULT 0,
  is_confirmed INTEGER DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_gta_news_published_at ON gta_news(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_gta_news_source ON gta_news(source_slug);

-- Bookmarks de notícias (usuário salva notícia pra ler depois)
CREATE TABLE IF NOT EXISTS news_bookmarks (
  id          TEXT PRIMARY KEY,
  user_id     TEXT NOT NULL,
  news_id     TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(user_id, news_id)
);
CREATE INDEX IF NOT EXISTS idx_news_bookmarks_user ON news_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_news_bookmarks_news ON news_bookmarks(news_id);

-- Comentários em notícias agregadas
CREATE TABLE IF NOT EXISTS news_comments (
  id          TEXT PRIMARY KEY,
  news_id     TEXT NOT NULL,
  user_id     TEXT NOT NULL,
  content     TEXT NOT NULL,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_news_comments_news ON news_comments(news_id);
CREATE INDEX IF NOT EXISTS idx_news_comments_user ON news_comments(user_id);

-- Newsletter (inscritos por email)
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id          TEXT PRIMARY KEY,
  email       TEXT NOT NULL UNIQUE,
  name        TEXT,
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
