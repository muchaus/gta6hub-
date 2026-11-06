import Parser from 'rss-parser'
import * as cheerio from 'cheerio'
import dayjs from 'dayjs'
import db from '@/lib/db'
import { NEWS_SOURCES } from '@/config/news-sources'
import { ensureNewsTable } from './schema'

const parser = new Parser({
  timeout: 15000,
  headers: {
    'User-Agent': 'GTA6WireBot/1.0 (+https://gta6hub.app)'
  }
})

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function makeId(sourceSlug: string, link: string) {
  const base = slugify(link)
  return `${sourceSlug}-${base.slice(0, 80)}`
}

export async function fetchAndStoreNews() {
  await ensureNewsTable()

  let added = 0
  let skipped = 0

  for (const source of NEWS_SOURCES) {
    if (!source.enabled) continue

    try {
      if (source.rss) {
        const feed = await parser.parseURL(source.rss)
        for (const item of feed.items.slice(0, 25)) {
          if (!item.link) continue

          const title = (item.title || '').trim()
          if (!title) continue

          const link = item.link
          const id = makeId(source.slug, link)
          const publishedAt = item.isoDate ? Math.floor(new Date(item.isoDate).getTime() / 1000) : Math.floor(Date.now() / 1000)
          
          let excerpt = ''
          if (item.contentSnippet) {
            excerpt = item.contentSnippet.replace(/\s+/g, ' ').trim().slice(0, 220)
          } else if (item.content) {
            const $ = cheerio.load(item.content)
            excerpt = $.text().replace(/\s+/g, ' ').trim().slice(0, 220)
          }

          let image: string | null = null
          if ((item as any).enclosure?.url) {
            image = (item as any).enclosure.url
          }

          try {
            await db.execute({
              sql: `INSERT OR IGNORE INTO gta_news (id, title, excerpt, link, image, source_id, source_name, source_slug, source_color, category, published_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              args: [id, title, excerpt, link, image, source.id, source.name, source.slug, source.color || '#a3a3a3', source.category, publishedAt]
            })
            added++
          } catch (e) {
            skipped++
          }
        }
      }
    } catch (err) {
      console.error(`[news] Erro ao buscar ${source.name}:`, err)
      skipped++
    }
  }

  return { added, skipped, at: dayjs().format('YYYY-MM-DD HH:mm:ss') }
}
