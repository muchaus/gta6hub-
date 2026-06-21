import { createClient } from '@libsql/client/http'
import { readFileSync } from 'fs'
import { join } from 'path'

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

console.log('\n✅ Migração concluída!')
