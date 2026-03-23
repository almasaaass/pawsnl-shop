import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import HeroBanner from '@/components/shop/HeroBanner'
import TopProducts from '@/components/shop/TopProducts'
import AppleGrid from '@/components/shop/AppleGrid'
import HomepageReviews from '@/components/shop/HomepageReviews'
import LeadMagnet from '@/components/shop/LeadMagnet'
import NewsletterSection from '@/components/shop/NewsletterSection'
import RecentlyViewed from '@/components/shop/RecentlyViewed'

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
    url: 'https://pawsnlshop.com',
    description: 'Online dierenwinkel met producten voor honden, katten en meer. Snelle levering in Nederland en België.',
    contactPoint: { '@type': 'ContactPoint', contactType: 'klantenservice', url: 'https://pawsnlshop.com/contact' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'PawsNL',
    url: 'https://pawsnlshop.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://pawsnlshop.com/producten?zoek={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  },
]

async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching all products:', error)
    return []
  }

  return data || []
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()
  const allProducts = await getAllProducts()

  return (
    <div className="bg-[#f5f5f7]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageJsonLd) }}
      />
      <HeroBanner products={featuredProducts} />
      <TopProducts products={allProducts} />
      <div className="pt-3">
        <AppleGrid featuredProducts={featuredProducts} allProducts={allProducts} />
      </div>
      <HomepageReviews />
      <div className="max-w-[980px] mx-auto px-3 pb-3">
        <RecentlyViewed />
      </div>
      <NewsletterSection />
      <LeadMagnet />
    </div>
  )
}
