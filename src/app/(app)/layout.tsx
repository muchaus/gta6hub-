import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Navbar from '@/components/layout/Navbar'
import Sidebar from '@/components/layout/Sidebar'
import db from '@/lib/db'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  const clansResult = await db.execute({
    sql: `SELECT c.id, c.name, c.tag
          FROM clans c
          JOIN clan_members cm ON cm.clan_id = c.id
          WHERE cm.user_id = ?
          LIMIT 10`,
    args: [session.user.id],
  })

  const userClans = clansResult.rows.map(r => ({
    id: r.id as string,
    name: r.name as string,
    tag: r.tag as string,
  }))

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 pt-16">
        <div className="flex gap-6 py-6">
          <Sidebar userClans={userClans} />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
    </>
  )
}
