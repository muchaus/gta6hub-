import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/news-wire', '/note'],
      disallow: ['/api/', '/auth/', '/bookmarks', '/feed', '/clans', '/lfg', '/profile', '/_next/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
