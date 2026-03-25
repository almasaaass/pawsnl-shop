'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Product } from '@/lib/types'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ui/ScrollReveal'

interface Props {
  products?: Product[]
}

export default function HeroBanner({ products = [] }: Props) {
  const t = useTranslations('hero')

  return (
    <section className="relative bg-apple-offwhite overflow-hidden flex flex-col">
      {/* Text block */}
      <div className="flex flex-col items-center justify-center text-center px-5 sm:px-6 pt-12 pb-6 md:pt-16 md:pb-8">
        <ScrollReveal animation="fade-up" duration={900}>
          <h1 className="apple-headline max-w-4xl mx-auto">
            {t('title')}{' '}
            <span className="text-accent-500">{t('titleHighlight')}</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={150} duration={900}>
          <p className="apple-subheadline max-w-2xl mx-auto mt-4">
            {t('subtitle')}
          </p>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={300} duration={900}>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/producten"
              className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold text-[17px] px-7 py-3 rounded-full transition-colors"
            >
              {t('viewProducts')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/bundels"
              className="inline-flex items-center gap-1 text-accent-500 hover:text-accent-600 font-semibold text-[17px] transition-colors group"
            >
              {t('discountCode')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* Hero image — full-width */}
      <div className="w-full">
        <div className="apple-hero-image-reveal relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden">
          <Image
            src="/hero-cat.jpg"
            alt="Schattige kat met PawsNL dierenproducten - online dierenwinkel"
            fill
            className="object-cover"
            sizes="100vw"
            priority
          />
        </div>
      </div>
    </section>
  )
}
