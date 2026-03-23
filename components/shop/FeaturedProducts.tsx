'use client'

import { Product } from '@/lib/types'
import ProductCard from './ProductCard'
import { ArrowRight, PawPrint } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ui/ScrollReveal'

interface Props {
  products: Product[]
}

export default function FeaturedProducts({ products }: Props) {
  const t = useTranslations('featured')

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[980px] mx-auto px-6">
        {/* Apple-style centered headline */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="text-center mb-16">
            <h2
              className="text-[32px] md:text-[40px] lg:text-[48px] leading-tight font-semibold tracking-tight"
              style={{ color: '#1d1d1f' }}
            >
              {t('title')}
            </h2>
            <p
              className="mt-3 text-[17px] md:text-[19px] leading-relaxed max-w-xl mx-auto"
              style={{ color: '#6e6e73' }}
            >
              {t('subtitle')}
            </p>
          </div>
        </ScrollReveal>

        {products.length === 0 ? (
          <ScrollReveal animation="fade-up">
            <div className="text-center py-20 rounded-3xl" style={{ backgroundColor: '#fbfbfd' }}>
              <PawPrint className="w-12 h-12 mx-auto mb-4" style={{ color: '#d2d2d7' }} />
              <h3
                className="text-lg font-semibold mb-2"
                style={{ color: '#1d1d1f' }}
              >
                {t('noProductsTitle')}
              </h3>
              <p
                className="text-sm mb-6"
                style={{ color: '#6e6e73' }}
              >
                {t('noProductsDescription')}
              </p>
              <a
                href="/admin"
                className="inline-block text-sm font-medium px-6 py-3 rounded-full text-white transition-opacity hover:opacity-80"
                style={{ backgroundColor: '#0071e3' }}
              >
                {t('toAdmin')}
              </a>
            </div>
          </ScrollReveal>
        ) : (
          <>
            {/* Product grid with staggered reveal */}
            <ScrollReveal
              animation="fade-up"
              stagger
              staggerDelay={150}
              duration={700}
              className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10"
            >
              {products.map((product) => (
                <div key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </ScrollReveal>

            {/* Apple-style "View all" link */}
            <ScrollReveal animation="fade-up" delay={400} duration={600}>
              <div className="mt-14 text-center">
                <Link
                  href="/producten"
                  className="inline-flex items-center gap-1.5 text-[17px] font-normal transition-colors group"
                  style={{ color: '#0066cc' }}
                >
                  {t('viewAll')}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </ScrollReveal>
          </>
        )}
      </div>
    </section>
  )
}
