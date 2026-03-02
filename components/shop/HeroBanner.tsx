'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Product } from '@/lib/types'
import { getImageSrc } from '@/lib/utils'

interface Props {
  products?: Product[]
}

/**
 * Vind een schone productfoto (geen branded/marketing afbeelding).
 * - Supabase storage images (social.png, feature.png) = eigen branded images → skip
 * - Eerste CJ-foto is vaak ook een marketing-afbeelding met tekst → skip
 * - Latere CJ-foto's zijn schone productfoto's → gebruik deze
 */
function getCleanPhoto(product: Product): string {
  const GENERATED_PREFIX = 'https://mumuorbsfiklktwqtveb.supabase.co/storage/v1/object/public/product-images/'
  // Filter alle Supabase branded images eruit
  const cjPhotos = product.images.filter(img => !img.startsWith(GENERATED_PREFIX))
  // Pak de 2e CJ-foto (index 1) als die bestaat — de eerste is vaak een marketing-foto
  // Val terug op de 1e CJ-foto, dan op images[0]
  return cjPhotos[1] || cjPhotos[0] || product.images[0] || ''
}

export default function HeroBanner({ products = [] }: Props) {
  const heroProducts = products.slice(0, 3)

  return (
    <section className="relative bg-gradient-to-br from-warm-100 via-warm-50 to-white overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Tekst */}
          <div>
            <h1 className="animate-fade-in-up text-4xl sm:text-5xl md:text-6xl font-bold text-charcoal leading-tight mb-6">
              Maak jouw huisdier{' '}
              <span className="text-accent-500">gelukkig</span>
            </h1>

            <p className="animate-fade-in-up stagger-1 text-lg text-gray-600 mb-8 leading-relaxed max-w-lg">
              Speelgoed, verzorging en accessoires die je huisdier echt leuk vindt.
            </p>

            <div className="animate-fade-in-up stagger-2 flex flex-col sm:flex-row gap-4">
              <Link
                href="/producten"
                className="btn-primary inline-flex items-center justify-center gap-2 text-base"
              >
                Bekijk producten
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/over-ons"
                className="btn-secondary inline-flex items-center justify-center gap-2 text-base"
              >
                Over PawsNL
              </Link>
            </div>

          </div>

          {/* Hero visual: overlappende productkaartjes */}
          <div className="hidden lg:flex justify-center lg:justify-end">
            <div className="relative w-[380px] h-[380px]">
              {heroProducts.length >= 3 ? (
                <>
                  {/* Kaartje 1 - links achter */}
                  <Link
                    href={`/producten/${heroProducts[0].slug}`}
                    className="animate-fade-in-up stagger-2 absolute top-8 left-0 w-52 bg-white rounded-2xl shadow-card-hover overflow-hidden -rotate-6 hover:rotate-0 hover:scale-105 transition-transform duration-300 block"
                  >
                    <div className="relative aspect-square bg-gray-50">
                      {getCleanPhoto(heroProducts[0]) && (
                        <Image
                          src={getImageSrc(getCleanPhoto(heroProducts[0]))}
                          alt={heroProducts[0].name}
                          fill
                          className="object-cover"
                          sizes="208px"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-charcoal truncate">{heroProducts[0].name}</p>
                    </div>
                  </Link>

                  {/* Kaartje 2 - midden voor */}
                  <Link
                    href={`/producten/${heroProducts[1].slug}`}
                    className="animate-fade-in-up stagger-3 absolute top-0 left-1/2 -translate-x-1/2 w-56 bg-white rounded-2xl shadow-card-hover overflow-hidden z-10 hover:scale-105 transition-transform duration-300 block"
                  >
                    <div className="relative aspect-square bg-gray-50">
                      {getCleanPhoto(heroProducts[1]) && (
                        <Image
                          src={getImageSrc(getCleanPhoto(heroProducts[1]))}
                          alt={heroProducts[1].name}
                          fill
                          className="object-cover"
                          sizes="224px"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-charcoal truncate">{heroProducts[1].name}</p>
                    </div>
                  </Link>

                  {/* Kaartje 3 - rechts achter */}
                  <Link
                    href={`/producten/${heroProducts[2].slug}`}
                    className="animate-fade-in-up stagger-4 absolute top-12 right-0 w-48 bg-white rounded-2xl shadow-card-hover overflow-hidden rotate-6 hover:rotate-0 hover:scale-105 transition-transform duration-300 block"
                  >
                    <div className="relative aspect-square bg-gray-50">
                      {getCleanPhoto(heroProducts[2]) && (
                        <Image
                          src={getImageSrc(getCleanPhoto(heroProducts[2]))}
                          alt={heroProducts[2].name}
                          fill
                          className="object-cover"
                          sizes="192px"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-charcoal truncate">{heroProducts[2].name}</p>
                    </div>
                  </Link>
                </>
              ) : (
                /* Fallback als er minder dan 3 producten zijn */
                <div className="w-full h-full bg-gradient-to-br from-accent-100 to-accent-50 rounded-3xl flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-6xl font-heading font-bold text-accent-500 mb-2">Paws</p>
                    <p className="text-lg text-accent-400">NL</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
