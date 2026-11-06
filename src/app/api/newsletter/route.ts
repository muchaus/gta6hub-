import { NextResponse } from 'next/server'
import db from '@/lib/db'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
})

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: 'Email inválido' }, { status: 400 })
    }

    const { email, name } = parsed.data
    const safeEmail = email.replace(/'/g, "''")
    const safeName = (name ?? '').replace(/'/g, "''")
    const id = crypto.randomUUID()

    await db.execute(`
      INSERT OR IGNORE INTO newsletter_subscribers (id, email, name)
      VALUES ('${id}', '${safeEmail}', '${safeName}')
    `)

    return NextResponse.json({ ok: true, message: 'Inscrição realizada com sucesso!' })
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message || 'Erro ao inscrever' }, { status: 500 })
  }
}
