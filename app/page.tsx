import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import HeroBanner from '@/components/shop/HeroBanner'
import FeaturedProducts from '@/components/shop/FeaturedProducts'
import CategoryOverview from '@/components/shop/CategoryOverview'
import TrustBadges from '@/components/shop/TrustBadges'
import GuaranteeBanner from '@/components/shop/GuaranteeBanner'
import WhyPawsNL from '@/components/shop/WhyPawsNL'
import HomepageReviews from '@/components/shop/HomepageReviews'
import LeadMagnet from '@/components/shop/LeadMagnet'
import NewsletterSection from '@/components/shop/NewsletterSection'

export const revalidate = 60

async function getFeaturedProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(8)

  if (error) {
    console.error('Error fetching featured products:', error)
    return []
  }

  return data || []
}

const homepageJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'PawsNL',
    url: 'https://pawsshop.nl',
    description: 'Online dierenwinkel met producten voor honden, katten, vogels en knaagdieren.',
    contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', url: 'https://pawsshop.nl/contact' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PawsNL',
    url: 'https://pawsshop.nl',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://pawsshop.nl/producten?zoek={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  },
]

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      <HeroBanner products={featuredProducts} />
      <TrustBadges />
      <FeaturedProducts products={featuredProducts} />
      <WhyPawsNL />
      <GuaranteeBanner />
      <HomepageReviews />
      <CategoryOverview />
      <NewsletterSection />
      <LeadMagnet />
    </div>
  )
}
