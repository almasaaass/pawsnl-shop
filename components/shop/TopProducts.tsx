'use client'

import { Product } from '@/lib/types'
import ProductCard from './ProductCard'
import { ArrowRight } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ui/ScrollReveal'

interface Props {
  products: Product[]
}

export default function TopProducts({ products }: Props) {
  const t = useTranslations('hero')

  if (!products || products.length === 0) return null

  // Show first 8 products
  const displayProducts = products.slice(0, 8)

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-[980px] mx-auto px-3">
        {/* Section header */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-[28px] md:text-[40px] font-semibold text-[#1d1d1f] tracking-tight leading-[1.1]">
                Onze producten
              </h2>
              <p className="text-[15px] md:text-[17px] text-[#6e6e73] mt-2">
                De beste producten voor jouw huisdier.
              </p>
            </div>
            <Link
              href="/producten"
              className="hidden sm:inline-flex items-center gap-1 text-[#0071e3] text-[15px] font-medium hover:underline whitespace-nowrap"
            >
              Bekijk alles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        {/* Product grid — 2 cols mobile, 4 cols desktop */}
        <ScrollReveal animation="fade-up" delay={100} duration={700}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {displayProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </ScrollReveal>

        {/* Mobile CTA */}
        <div className="sm:hidden mt-6 text-center">
          <Link
            href="/producten"
            className="inline-flex items-center gap-1 text-[#0071e3] text-[15px] font-medium hover:underline"
          >
            Bekijk alle producten <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
