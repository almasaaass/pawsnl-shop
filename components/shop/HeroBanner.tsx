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
    <section className="bg-apple-offwhite overflow-hidden">
      {/* Text block — compact */}
      <div className="text-center px-5 sm:px-6 pt-10 pb-6 md:pt-14 md:pb-8">
        <ScrollReveal animation="fade-up" duration={900}>
          <h1 className="text-[28px] sm:text-[36px] md:text-[48px] font-semibold tracking-tight leading-[1.05] text-apple-black">
            {t('title')}{' '}
            <span className="text-accent-500">{t('titleHighlight')}</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={150} duration={900}>
          <p className="text-[17px] md:text-[21px] text-apple-gray max-w-2xl mx-auto mt-3">
            {t('subtitle')}
          </p>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={300} duration={900}>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/producten"
              className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold text-[15px] px-6 py-2.5 rounded-full transition-colors"
            >
              {t('viewProducts')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/bundels"
              className="inline-flex items-center gap-1 text-accent-500 hover:text-accent-600 font-semibold text-[15px] transition-colors group"
            >
              {t('discountCode')}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* Two hero images side by side */}
      <div className="max-w-[1280px] mx-auto px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ScrollReveal animation="fade-up" duration={800}>
            <a href="/producten?categorie=katten" className="group block relative rounded-apple overflow-hidden aspect-[4/3]">
              <Image
                src="/hero-cat.jpg"
                alt={t('cats')}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8">
                <h2 className="text-white text-[24px] md:text-[32px] font-semibold tracking-tight">{t('cats')}</h2>
                <span className="inline-flex items-center text-white/90 text-sm mt-1 group-hover:underline">
                  {t('discover')} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </a>
          </ScrollReveal>
          <ScrollReveal animation="fade-up" duration={800} delay={100}>
            <a href="/producten?categorie=honden" className="group block relative rounded-apple overflow-hidden aspect-[4/3]">
              <Image
                src="/hero-dog.jpg"
                alt={t('dogs')}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-5 left-5 md:bottom-8 md:left-8">
                <h2 className="text-white text-[24px] md:text-[32px] font-semibold tracking-tight">{t('dogs')}</h2>
                <span className="inline-flex items-center text-white/90 text-sm mt-1 group-hover:underline">
                  {t('discover')} <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </a>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
