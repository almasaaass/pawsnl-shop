'use client'

import { Product } from '@/lib/types'
import ProductCard from './ProductCard'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ui/ScrollReveal'

// Product slugs that are trending on TikTok — matched to actual Supabase products
const TIKTOK_TRENDING_SLUGS = [
  'automatische-kattenlaser-eindeloos-speelplezier',
  'stille-kattenfontein-altijd-vers-gefilterd-water',
  'kattenrugzak-met-kijkvenster-veilig-comfortabel-op-pad',
  'rups-speeltje-onvoorspelbaar-verslavend-voor-katten',
  'zelfreinigende-kattenborstel-minder-haaruitval',
  'kattentunnel-3-weg-verstoppen-rennen-spelen',
  'led-halsband-usb-zichtbaar-tot-500m-in-het-donker',
  'elektrische-kattenmassage-pure-ontspanning',
]

interface Props {
  products: Product[]
}

export default function AsSeenOnTikTok({ products }: Props) {
  const t = useTranslations('asSeenOnTikTok')

  // Filter products that are trending
  const trendingProducts = products.filter(p =>
    TIKTOK_TRENDING_SLUGS.includes(p.slug)
  ).slice(0, 4)

  // If we don't have enough trending products, just use featured ones
  const displayProducts = trendingProducts.length >= 2 ? trendingProducts : products.slice(0, 4)

  if (displayProducts.length === 0) return null

  return (
    <section className="bg-[#f5f5f7] py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full mb-5 shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#1d1d1f]">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48 6.3 6.3 0 001.86-4.49V8.87a8.28 8.28 0 004.84 1.56V6.96a4.84 4.84 0 01-1.12-.27z" />
              </svg>
              <span className="text-[#1d1d1f] font-semibold text-sm">Trending</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tight mb-3">
              {t('title')}
            </h2>
            <p className="text-[#6e6e73] text-lg max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
        </ScrollReveal>

        {/* Product Grid */}
        <ScrollReveal animation="fade-up" stagger staggerDelay={100} className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {displayProducts.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
            </div>
          ))}
        </ScrollReveal>

        {/* View All Link */}
        <ScrollReveal animation="fade-up" delay={400}>
          <div className="mt-12 text-center">
            <Link
              href="/producten"
              className="inline-flex items-center gap-2 text-[#0066cc] hover:text-[#0055b3] font-medium text-lg transition-colors"
            >
              {t('viewAll')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
