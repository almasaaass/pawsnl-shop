'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Product, getLocalizedName } from '@/lib/types'
import { getImageSrc } from '@/lib/utils'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { formatLocalPrice, type AppLocale } from '@/lib/locale-config'
import ScrollReveal from '@/components/ui/ScrollReveal'

interface Props {
  featuredProducts: Product[]
  allProducts: Product[]
}

function getCleanPhoto(product: Product): string {
  const GENERATED_PREFIX = 'https://mumuorbsfiklktwqtveb.supabase.co/storage/v1/object/public/product-images/'
  const cjPhotos = product.images.filter(img => !img.startsWith(GENERATED_PREFIX))
  return cjPhotos[1] || cjPhotos[0] || product.images[0] || ''
}

function getProductsByCategory(products: Product[], category: string): Product[] {
  return products.filter(p => p.category === category)
}

/* ─── Apple-style product card (used in grid) ──────────────────── */
function AppleProductCard({
  product,
  bg = 'bg-[#f5f5f7]',
  textColor = 'text-[#1d1d1f]',
  subtitleColor = 'text-[#6e6e73]',
  ctaStyle = 'primary',
  tall = false,
  locale,
}: {
  product: Product
  bg?: string
  textColor?: string
  subtitleColor?: string
  ctaStyle?: 'primary' | 'light'
  tall?: boolean
  locale: AppLocale
}) {
  const name = getLocalizedName(product, locale)
  const imgSrc = getCleanPhoto(product)
  const price = formatLocalPrice(product.price, locale)

  return (
    <Link
      href={{ pathname: '/producten/[slug]', params: { slug: product.slug } }}
      className={`group relative ${bg} rounded-[20px] overflow-hidden flex flex-col items-center justify-between ${
        tall ? 'min-h-[580px] md:min-h-[680px]' : 'min-h-[480px] md:min-h-[580px]'
      } p-8 md:p-12 transition-all duration-500`}
    >
      {/* Text content — top */}
      <div className="text-center z-10 relative">
        <h2 className={`text-[28px] md:text-[40px] font-semibold ${textColor} tracking-tight leading-[1.1] mb-2`}>
          {name}
        </h2>
        <p className={`text-[14px] md:text-[17px] ${subtitleColor} mb-5`}>
          Vanaf {price}
        </p>
        <div className="flex items-center justify-center gap-4">
          <span className={`inline-flex items-center text-[14px] font-medium ${
            ctaStyle === 'primary'
              ? 'bg-[#0071e3] text-white px-5 py-2.5 rounded-full hover:bg-[#0077ED]'
              : 'bg-white/90 text-[#1d1d1f] px-5 py-2.5 rounded-full hover:bg-white'
          } transition-colors`}>
            Meer info
          </span>
          <span className={`inline-flex items-center text-[14px] ${
            ctaStyle === 'primary' ? 'text-[#0071e3]' : 'text-white'
          } hover:underline`}>
            Bekijk <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </div>
      </div>

      {/* Product image — bottom, large */}
      <div className="relative w-full flex-1 flex items-end justify-center mt-6">
        {imgSrc ? (
          <div className="relative w-[70%] md:w-[60%] aspect-square">
            <Image
              src={getImageSrc(imgSrc)}
              alt={name}
              fill
              className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 70vw, 35vw"
            />
          </div>
        ) : (
          <div className="w-[60%] aspect-square bg-white/10 rounded-3xl" />
        )}
      </div>
    </Link>
  )
}

/* ─── Apple-style category card (used in grid) ──────────────────── */
function AppleCategoryCard({
  title,
  subtitle,
  href,
  bg,
  textColor = 'text-[#1d1d1f]',
  subtitleColor = 'text-[#6e6e73]',
  emoji,
  dark = false,
  products,
  locale,
}: {
  title: string
  subtitle: string
  href: string
  bg: string
  textColor?: string
  subtitleColor?: string
  emoji: string
  dark?: boolean
  products: Product[]
  locale: AppLocale
}) {
  const topProduct = products[0]
  const imgSrc = topProduct ? getCleanPhoto(topProduct) : ''

  return (
    <a
      href={href}
      className={`group relative ${bg} rounded-[20px] overflow-hidden flex flex-col items-center justify-between min-h-[480px] md:min-h-[580px] p-8 md:p-12 transition-all duration-500`}
    >
      {/* Text */}
      <div className="text-center z-10">
        <h2 className={`text-[28px] md:text-[40px] font-semibold ${textColor} tracking-tight leading-[1.1] mb-2`}>
          {title}
        </h2>
        <p className={`text-[14px] md:text-[17px] ${subtitleColor} mb-5`}>
          {subtitle}
        </p>
        <div className="flex items-center justify-center gap-4">
          <span className={`inline-flex items-center text-[14px] font-medium px-5 py-2.5 rounded-full transition-colors ${
            dark ? 'bg-white text-[#1d1d1f] hover:bg-[#f5f5f7]' : 'bg-[#0071e3] text-white hover:bg-[#0077ED]'
          }`}>
            Ontdek
          </span>
          <span className={`inline-flex items-center text-[14px] hover:underline ${
            dark ? 'text-[#2997ff]' : 'text-[#0071e3]'
          }`}>
            Bekijk alles <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </div>
      </div>

      {/* Image — product image or large emoji fallback */}
      <div className="relative w-full flex-1 flex items-end justify-center mt-6">
        {imgSrc ? (
          <div className="relative w-[65%] md:w-[55%] aspect-square">
            <Image
              src={getImageSrc(imgSrc)}
              alt={title}
              fill
              className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 65vw, 30vw"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center group-hover:scale-110 transition-transform duration-700">
            <span className="text-[120px] md:text-[160px] drop-shadow-lg select-none">{emoji}</span>
          </div>
        )}
      </div>
    </a>
  )
}

/* ─── Main Apple Grid Component ──────────────────── */
export default function AppleGrid({ featuredProducts, allProducts }: Props) {
  const t = useTranslations('hero')
  const locale = useLocale() as AppLocale

  const catDogs = getProductsByCategory(allProducts, 'honden')
  const catCats = getProductsByCategory(allProducts, 'katten')
  const catBirds = getProductsByCategory(allProducts, 'vogels')
  const catRodents = getProductsByCategory(allProducts, 'knaagdieren')

  // Pick specific products for the grid
  const topProduct1 = featuredProducts[0]
  const topProduct2 = featuredProducts[1]
  const topProduct3 = featuredProducts[2]
  const topProduct4 = featuredProducts[3]

  return (
    <div className="max-w-[980px] mx-auto px-3 space-y-3">
      {/* ── Row 1: Full-width featured product ── */}
      {topProduct1 && (
        <ScrollReveal animation="fade-up" duration={800}>
          <AppleProductCard
            product={topProduct1}
            bg="bg-[#f5f5f7]"
            tall
            locale={locale}
          />
        </ScrollReveal>
      )}

      {/* ── Row 2: Two-column grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ScrollReveal animation="fade-up" duration={800}>
          <AppleCategoryCard
            title="Honden"
            subtitle="Alles voor je trouwe viervoeter"
            href="/producten?categorie=honden"
            bg="bg-[#fbfbfd]"
            emoji="🐕"
            products={catDogs}
            locale={locale}
          />
        </ScrollReveal>
        <ScrollReveal animation="fade-up" duration={800} delay={100}>
          <AppleCategoryCard
            title="Katten"
            subtitle="Speelgoed, verzorging & meer"
            href="/producten?categorie=katten"
            bg="bg-[#1d1d1f]"
            textColor="text-white"
            subtitleColor="text-[#a1a1a6]"
            emoji="🐈"
            dark
            products={catCats}
            locale={locale}
          />
        </ScrollReveal>
      </div>

      {/* ── Row 3: Two-column — products ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {topProduct2 && (
          <ScrollReveal animation="fade-up" duration={800}>
            <AppleProductCard
              product={topProduct2}
              bg="bg-[#faf5ee]"
              locale={locale}
            />
          </ScrollReveal>
        )}
        {topProduct3 && (
          <ScrollReveal animation="fade-up" duration={800} delay={100}>
            <AppleProductCard
              product={topProduct3}
              bg="bg-[#e3f0e8]"
              locale={locale}
            />
          </ScrollReveal>
        )}
      </div>

      {/* ── Row 4: Two-column — categories ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ScrollReveal animation="fade-up" duration={800}>
          <AppleCategoryCard
            title="Vogels"
            subtitle="Speelgoed & accessoires"
            href="/producten?categorie=vogels"
            bg="bg-[#f5f5f7]"
            emoji="🦜"
            products={catBirds}
            locale={locale}
          />
        </ScrollReveal>
        <ScrollReveal animation="fade-up" duration={800} delay={100}>
          <AppleCategoryCard
            title="Knaagdieren"
            subtitle="Het beste voor kleine vriendjes"
            href="/producten?categorie=knaagdieren"
            bg="bg-[#1d1d1f]"
            textColor="text-white"
            subtitleColor="text-[#a1a1a6]"
            emoji="🐹"
            dark
            products={catRodents}
            locale={locale}
          />
        </ScrollReveal>
      </div>

      {/* ── Row 5: Full-width — Trending / TikTok ── */}
      {topProduct4 && (
        <ScrollReveal animation="fade-up" duration={800}>
          <Link
            href={{ pathname: '/producten/[slug]', params: { slug: topProduct4.slug } }}
            className="group relative bg-[#1d1d1f] rounded-[20px] overflow-hidden flex flex-col md:flex-row items-center min-h-[400px] md:min-h-[500px] p-8 md:p-12 transition-all duration-500"
          >
            {/* Text left */}
            <div className="text-center md:text-left md:w-1/2 z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full mb-4">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48 6.3 6.3 0 001.86-4.49V8.87a8.28 8.28 0 004.84 1.56V6.96a4.84 4.84 0 01-1.12-.27z" />
                </svg>
                <span className="text-white text-[13px] font-medium">Trending op TikTok</span>
              </div>
              <h2 className="text-[32px] md:text-[48px] font-semibold text-white tracking-tight leading-[1.05] mb-3">
                {getLocalizedName(topProduct4, locale)}
              </h2>
              <p className="text-[15px] md:text-[17px] text-[#a1a1a6] mb-6">
                Populair op TikTok. Bekijk waarom!
              </p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <span className="inline-flex items-center text-[14px] font-medium bg-white text-[#1d1d1f] px-5 py-2.5 rounded-full hover:bg-[#f5f5f7] transition-colors">
                  Bekijk nu
                </span>
                <span className="inline-flex items-center text-[14px] text-[#2997ff] hover:underline">
                  Alle producten <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </span>
              </div>
            </div>

            {/* Image right */}
            <div className="md:w-1/2 relative flex items-center justify-center mt-8 md:mt-0">
              {getCleanPhoto(topProduct4) && (
                <div className="relative w-[70%] aspect-square">
                  <Image
                    src={getImageSrc(getCleanPhoto(topProduct4))}
                    alt={getLocalizedName(topProduct4, locale)}
                    fill
                    className="object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 70vw, 35vw"
                  />
                </div>
              )}
            </div>
          </Link>
        </ScrollReveal>
      )}

      {/* ── Row 6: Trust / Guarantee bar ── */}
      <ScrollReveal animation="fade-up" duration={800}>
        <div className="bg-[#f5f5f7] rounded-[20px] py-12 px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: '🚚', title: 'Gratis verzending', sub: 'Vanaf €35' },
              { icon: '↩️', title: '30 dagen retour', sub: 'Geen gedoe' },
              { icon: '🔒', title: 'Veilig betalen', sub: 'iDEAL & Klarna' },
              { icon: '⭐', title: 'Klanttevredenheid', sub: 'Groeiende community' },
            ].map((item) => (
              <div key={item.title}>
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-[15px] font-semibold text-[#1d1d1f]">{item.title}</p>
                <p className="text-[13px] text-[#6e6e73]">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}
