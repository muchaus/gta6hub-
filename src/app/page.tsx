import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function HomePage() {
  const session = await auth()
  if (session?.user) redirect('/feed')

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-medium text-[#e8c84a] mb-2">GTA6Hub</h1>
      <p className="text-neutral-500 text-sm mb-8 max-w-xs">
        A comunidade brasileira do GTA 6. Forme clãs, encontre jogadores e fique por dentro das novidades.
      </p>
      <div className="flex gap-3">
        <Link
          href="/auth/register"
          className="px-6 py-2.5 bg-[#e8c84a] text-[#0a0a0f] text-sm font-medium rounded-lg hover:bg-[#f0d460] transition-colors"
        >
          Criar conta
        </Link>
        <Link
          href="/auth/login"
          className="px-6 py-2.5 border border-[#2d2050] text-[#7a6abf] text-sm rounded-lg hover:bg-[#1a1628] hover:text-[#e8c84a] transition-colors"
        >
          Entrar
        </Link>
      </div>
    </div>
  )
}
