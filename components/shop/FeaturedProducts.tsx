'use client'

import { Product } from '@/lib/types'
import ProductCard from './ProductCard'
import { ArrowRight, PawPrint } from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

interface Props {
  products: Product[]
}

export default function FeaturedProducts({ products }: Props) {
  const t = useTranslations('featured')
  const { ref, isInView } = useInView({ threshold: 0.1 })

  return (
    <section ref={ref} className="section">
      <div className={`flex items-center justify-between mb-8 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
        <div>
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

      {products.length === 0 ? (
        <div className="text-center py-16 bg-warm-100 rounded-2xl">
          <PawPrint className="w-12 h-12 text-accent-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-charcoal mb-2">{t('noProductsTitle')}</h3>
          <p className="text-gray-500 text-sm mb-4">{t('noProductsDescription')}</p>
          <a href="/admin" className="btn-primary inline-block text-sm">{t('toAdmin')}</a>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, i) => (
              <div
                key={product.id}
                className={isInView ? `animate-fade-in-up stagger-${Math.min(i + 1, 8)}` : 'opacity-0'}
              >
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
        </>
      )}
    </section>
  )
}
