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
    <section className="relative bg-[#fbfbfd] overflow-hidden flex flex-col">
      {/* ── Text block: centered, Apple-style ── */}
      <div className="flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 pt-12 pb-4 md:pt-16 md:pb-6">
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

        {/* ── Two CTAs: pill primary + text link secondary ── */}
        <ScrollReveal animation="fade-up" delay={300} duration={900}>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/producten"
              className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-semibold text-base px-8 py-3.5 rounded-full transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {t('viewProducts')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/bundels"
              className="inline-flex items-center gap-1 text-accent-500 hover:text-accent-600 font-semibold text-base transition-colors duration-200 group"
            >
              {t('discountCode')}
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </ScrollReveal>
      </div>

      {/* ── Hero image: Apple-style edge-to-edge ── */}
      <div className="w-full max-w-[1120px] mx-auto px-3">
        <div className="apple-hero-image-reveal relative w-full aspect-[16/9] md:aspect-[21/9] rounded-[28px] overflow-hidden">
          <Image
            src="/hero-cat.jpg"
            alt="Schattige kat met PawsNL dierenproducten - online dierenwinkel"
            fill
            className="object-cover"
            sizes="(max-width: 1200px) 100vw, 980px"
            priority
          />
        </div>
      </div>
    </section>
  )
}
