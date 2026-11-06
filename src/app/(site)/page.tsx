import SiteHeader from '@/components/site/SiteHeader'
import SiteFooter from '@/components/site/SiteFooter'
import Hero from '@/components/site/Hero'
import BlogPreview from '@/components/site/BlogPreview'
import YoutubeSection from '@/components/site/YoutubeSection'
import About from '@/components/site/About'
import NewsletterSection from '@/components/site/NewsletterSection'

export const metadata = {
  title: 'LGamer GTA6 | Blog e Notícias sobre GTA 6',
  description: 'Tudo sobre GTA 6: notícias, trailers, rumores, mapa e novidades. Blog didático do canal LGamer GTA6.'
}

export default function SiteHomePage() {
  return (
    <div className="bg-[#07070a] text-neutral-100 min-h-screen">
      <SiteHeader />
      <main>
        <Hero />
        <BlogPreview />
        <YoutubeSection />
        <NewsletterSection />
        <About />
      </main>
      <SiteFooter />
    </div>
  )
}
