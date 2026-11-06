import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'GTA6Hub — Notícias GTA 6',
  description: 'Portal de notícias do GTA 6 agregando os melhores portais em um só lugar. Sem login, sem assinatura.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'GTA6Hub',
    images: ['/Drift_icon.png']
  },
  twitter: {
    card: 'summary_large_image',
    site: '@GTA6Hub'
  },
  manifest: '/manifest.json',
  themeColor: '#fdb813'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
