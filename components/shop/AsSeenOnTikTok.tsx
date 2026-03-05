'use client'

import { Product } from '@/lib/types'
import ProductCard from './ProductCard'
import { ArrowRight, TrendingUp } from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

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
  const { ref, isInView } = useInView({ threshold: 0.1 })

  // Filter products that are trending
  const trendingProducts = products.filter(p =>
    TIKTOK_TRENDING_SLUGS.includes(p.slug)
  ).slice(0, 4)

  // If we don't have enough trending products, just use featured ones
  const displayProducts = trendingProducts.length >= 2 ? trendingProducts : products.slice(0, 4)

  if (displayProducts.length === 0) return null

  return (
    <section ref={ref} className="section bg-gradient-to-b from-white to-accent-50/30">
      <div className={`flex items-center justify-between mb-8 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1.5 bg-charcoal text-white px-3 py-1 rounded-full text-sm font-bold">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48 6.3 6.3 0 001.86-4.49V8.87a8.28 8.28 0 004.84 1.56V6.96a4.84 4.84 0 01-1.12-.27z" />
              </svg>
              TRENDING
            </div>
            <TrendingUp className="w-5 h-5 text-accent-500" />
          </div>
          <h2 className="text-3xl font-bold text-charcoal mb-1">{t('title')}</h2>
          <p className="text-gray-500">{t('subtitle')}</p>
        </div>
        <Link
          href="/producten"
          className="hidden sm:flex items-center gap-2 text-accent-500 hover:text-accent-600 font-semibold transition-colors"
        >
          {t('viewAll')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {displayProducts.map((product, i) => (
          <div
            key={product.id}
            className={`relative ${isInView ? `animate-fade-in-up stagger-${Math.min(i + 1, 8)}` : 'opacity-0'}`}
          >
            {/* TikTok trending overlay badge */}
            <div className="absolute -top-2 -right-2 z-20">
              <div className="bg-charcoal text-white text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1 shadow-lg">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48 6.3 6.3 0 001.86-4.49V8.87a8.28 8.28 0 004.84 1.56V6.96a4.84 4.84 0 01-1.12-.27z" />
                </svg>
                VIRAL
              </div>
            </div>
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <div className="mt-8 text-center sm:hidden">
        <Link href="/producten" className="btn-secondary inline-flex items-center gap-2">
          {t('viewAll')}
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  )
}
