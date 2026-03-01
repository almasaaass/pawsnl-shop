import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import HeroBanner from '@/components/shop/HeroBanner'
import FeaturedProducts from '@/components/shop/FeaturedProducts'
import CategoryOverview from '@/components/shop/CategoryOverview'
import TrustBadges from '@/components/shop/TrustBadges'
import GuaranteeBanner from '@/components/shop/GuaranteeBanner'

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

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div>
      <HeroBanner />
      <TrustBadges />
      <FeaturedProducts products={featuredProducts} />
      <GuaranteeBanner />
      <CategoryOverview />
    </div>
  )
}
