'use client'

import Image from 'next/image'
import { ArrowRight, Truck, ShieldCheck, RotateCcw } from 'lucide-react'
import { Product } from '@/lib/types'
import { getImageSrc } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

interface Props {
  products?: Product[]
}

function getCleanPhoto(product: Product): string {
  const GENERATED_PREFIX = 'https://mumuorbsfiklktwqtveb.supabase.co/storage/v1/object/public/product-images/'
  const cjPhotos = product.images.filter(img => !img.startsWith(GENERATED_PREFIX))
  return cjPhotos[1] || cjPhotos[0] || product.images[0] || ''
}

export default function HeroBanner({ products = [] }: Props) {
  const t = useTranslations('hero')
  const heroProducts = products.slice(0, 2)

  return (
    <section className="relative bg-gradient-to-br from-warm-100 via-warm-50 to-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Tekst */}
          <div>
            <h1 className="animate-fade-in-up text-4xl sm:text-5xl md:text-6xl font-bold text-charcoal leading-tight mb-6">
              {t('title')}{' '}
              <span className="text-accent-500">{t('titleHighlight')}</span>
            </h1>

            <p className="animate-fade-in-up stagger-1 text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
              {t('subtitle')}
            </p>

            <div className="animate-fade-in-up stagger-2 flex flex-col sm:flex-row gap-4">
              <Link
                href="/producten"
                className="btn-primary inline-flex items-center justify-center gap-2 text-base"
              >
                {t('viewProducts')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/producten"
                className="btn-secondary inline-flex items-center justify-center gap-2 text-base"
              >
                {t('discountCode')}
              </Link>
            </div>

            {/* TikTok Social Proof — inspired by Wild One "200M+ views" */}
            <div className="animate-fade-in-up stagger-3 mt-8 flex flex-col gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 bg-charcoal text-white px-3 py-1.5 rounded-full text-sm font-bold">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48 6.3 6.3 0 001.86-4.49V8.87a8.28 8.28 0 004.84 1.56V6.96a4.84 4.84 0 01-1.12-.27z" />
                  </svg>
                  30M+ views
                </div>
                <div className="flex -space-x-2">
                  {['L', 'M', 'S', 'J', 'A'].map((letter, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-accent-200 to-accent-400 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                      {letter}
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-500">15.000+ blije baasjes</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-accent-500" />
                  <span>{t('freeAbove')}</span>
                </div>
                <div className="w-px h-4 bg-gray-200" />
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-trust-500" />
                  <span>{t('safePayment')}</span>
                </div>
                <div className="w-px h-4 bg-gray-200 hidden sm:block" />
                <div className="hidden sm:flex items-center gap-1.5">
                  <RotateCcw className="w-4 h-4 text-accent-500" />
                  <span>{t('return30Days')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hero visual */}
          <div className="hidden lg:flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[540px]">
              <div className="animate-fade-in-up stagger-1 relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-card-hover">
                <Image
                  src="/hero-cat.jpg"
                  alt="PawsNL"
                  fill
                  className="object-cover"
                  sizes="540px"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-orange-900/10 via-transparent to-orange-100/10" />
              </div>

              {heroProducts.length >= 2 && (
                <>
                  <Link
                    href={{ pathname: '/producten/[slug]', params: { slug: heroProducts[0].slug } }}
                    className="animate-fade-in-up stagger-3 absolute -bottom-6 left-4 w-40 bg-white rounded-2xl shadow-card-hover overflow-hidden -rotate-2 hover:rotate-0 hover:scale-105 transition-transform duration-300 block z-10"
                  >
                    <div className="relative aspect-square bg-gray-50">
                      {getCleanPhoto(heroProducts[0]) && (
                        <Image
                          src={getImageSrc(getCleanPhoto(heroProducts[0]))}
                          alt={heroProducts[0].name}
                          fill
                          className="object-cover"
                          sizes="160px"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-[11px] font-semibold text-charcoal truncate">{heroProducts[0].name}</p>
                    </div>
                  </Link>

                  <Link
                    href={{ pathname: '/producten/[slug]', params: { slug: heroProducts[1].slug } }}
                    className="animate-fade-in-up stagger-4 absolute -bottom-4 right-6 w-40 bg-white rounded-2xl shadow-card-hover overflow-hidden rotate-2 hover:rotate-0 hover:scale-105 transition-transform duration-300 block z-10"
                  >
                    <div className="relative aspect-square bg-gray-50">
                      {getCleanPhoto(heroProducts[1]) && (
                        <Image
                          src={getImageSrc(getCleanPhoto(heroProducts[1]))}
                          alt={heroProducts[1].name}
                          fill
                          className="object-cover"
                          sizes="160px"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="p-2">
                      <p className="text-[11px] font-semibold text-charcoal truncate">{heroProducts[1].name}</p>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
