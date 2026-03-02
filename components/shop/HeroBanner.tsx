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
 */
function getCleanPhoto(product: Product): string {
  const GENERATED_PREFIX = 'https://mumuorbsfiklktwqtveb.supabase.co/storage/v1/object/public/product-images/'
  const cjPhotos = product.images.filter(img => !img.startsWith(GENERATED_PREFIX))
  return cjPhotos[1] || cjPhotos[0] || product.images[0] || ''
}

export default function HeroBanner({ products = [] }: Props) {
  const heroProducts = products.slice(0, 2)

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

          {/* Hero visual: lifestyle foto + 2 overlappende productkaartjes */}
          <div className="hidden lg:flex justify-center lg:justify-end">
            <div className="relative w-[500px] h-[420px]">
              {/* Lifestyle afbeelding — afgerond met schaduw */}
              <div className="animate-fade-in-up stagger-1 relative w-[400px] h-[400px] rounded-[2rem] overflow-hidden shadow-card-hover">
                <Image
                  src="https://images.unsplash.com/photo-1574158622682-e40e69881006?w=800&h=800&fit=crop&crop=faces"
                  alt="Blije kat — PawsNL dierenwinkel"
                  fill
                  className="object-cover"
                  sizes="400px"
                  priority
                  unoptimized
                />
              </div>

              {/* Product kaartjes die over de foto heen zweven */}
              {heroProducts.length >= 2 && (
                <>
                  {/* Kaartje 1 — linksonder */}
                  <Link
                    href={`/producten/${heroProducts[0].slug}`}
                    className="animate-fade-in-up stagger-3 absolute -bottom-4 -left-6 w-44 bg-white rounded-2xl shadow-card-hover overflow-hidden -rotate-3 hover:rotate-0 hover:scale-105 transition-transform duration-300 block z-10"
                  >
                    <div className="relative aspect-square bg-gray-50">
                      {getCleanPhoto(heroProducts[0]) && (
                        <Image
                          src={getImageSrc(getCleanPhoto(heroProducts[0]))}
                          alt={heroProducts[0].name}
                          fill
                          className="object-cover"
                          sizes="176px"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-charcoal truncate">{heroProducts[0].name}</p>
                    </div>
                  </Link>

                  {/* Kaartje 2 — rechtsonder */}
                  <Link
                    href={`/producten/${heroProducts[1].slug}`}
                    className="animate-fade-in-up stagger-4 absolute -bottom-2 right-0 w-44 bg-white rounded-2xl shadow-card-hover overflow-hidden rotate-3 hover:rotate-0 hover:scale-105 transition-transform duration-300 block z-10"
                  >
                    <div className="relative aspect-square bg-gray-50">
                      {getCleanPhoto(heroProducts[1]) && (
                        <Image
                          src={getImageSrc(getCleanPhoto(heroProducts[1]))}
                          alt={heroProducts[1].name}
                          fill
                          className="object-cover"
                          sizes="176px"
                          unoptimized
                        />
                      )}
                    </div>
                    <div className="p-2.5">
                      <p className="text-xs font-semibold text-charcoal truncate">{heroProducts[1].name}</p>
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
