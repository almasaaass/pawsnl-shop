'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Product, getLocalizedName } from '@/lib/types'
import { getImageSrc } from '@/lib/utils'
import { useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { formatLocalPrice, type AppLocale } from '@/lib/locale-config'
import ScrollReveal from '@/components/ui/ScrollReveal'

/* ─── Types ─── */
interface Props {
  featuredProducts: Product[]
  allProducts: Product[]
}

type Theme = {
  bg: string
  text: string
  sub: string
  variant: 'light' | 'dark'
}

/* ─── Consistent Apple design tokens ─── */
const THEMES: Record<string, Theme> = {
  light:   { bg: 'bg-[#fbfbfd]', text: 'text-apple-black', sub: 'text-apple-gray', variant: 'light' },
  dark:    { bg: 'bg-apple-black', text: 'text-white', sub: 'text-[#86868b]', variant: 'dark' },
  gray:    { bg: 'bg-apple-offwhite', text: 'text-apple-black', sub: 'text-apple-gray', variant: 'light' },
  warm:    { bg: 'bg-[#faf5ee]', text: 'text-apple-black', sub: 'text-apple-gray', variant: 'light' },
  green:   { bg: 'bg-[#e8f0e3]', text: 'text-apple-black', sub: 'text-apple-gray', variant: 'light' },
}

/* ─── Helpers ─── */
function getCleanPhoto(product: Product): string {
  const PREFIX = 'https://mumuorbsfiklktwqtveb.supabase.co/storage/v1/object/public/product-images/'
  const cjPhotos = product.images.filter(img => !img.startsWith(PREFIX))
  return cjPhotos[1] || cjPhotos[0] || product.images[0] || ''
}

function getByCategory(products: Product[], category: string): Product[] {
  return products.filter(p => p.category === category)
}

/* ─── CTA Buttons (consistent everywhere) ─── */
function CTAButtons({ variant, primaryLabel = 'Meer info', secondaryLabel = 'Koop' }: {
  variant: 'light' | 'dark'
  primaryLabel?: string
  secondaryLabel?: string
}) {
  return (
    <div className="flex items-center justify-center gap-4">
      <span className={`inline-flex items-center text-sm font-medium px-5 py-2.5 rounded-full transition-colors ${
        variant === 'light'
          ? 'bg-apple-blue text-white hover:bg-[#0077ED]'
          : 'bg-white text-apple-black hover:bg-apple-offwhite'
      }`}>
        {primaryLabel}
      </span>
      <span className={`inline-flex items-center text-sm hover:underline ${
        variant === 'light' ? 'text-apple-blue' : 'text-[#2997ff]'
      }`}>
        {secondaryLabel} <ArrowRight className="w-3.5 h-3.5 ml-1" />
      </span>
    </div>
  )
}

/* ─── Full-width product card ─── */
function FullCard({ product, theme, locale }: { product: Product; theme: Theme; locale: AppLocale }) {
  const name = getLocalizedName(product, locale)
  const imgSrc = getCleanPhoto(product)
  const price = formatLocalPrice(product.price, locale)

  return (
    <Link
      href={{ pathname: '/producten/[slug]', params: { slug: product.slug } }}
      className={`group relative ${theme.bg} overflow-hidden flex flex-col items-center justify-between min-h-[320px] md:min-h-[440px] py-10 px-5 md:py-12 md:px-8 transition-colors`}
    >
      <div className="text-center z-10">
        <h2 className={`text-[24px] md:text-[40px] font-semibold ${theme.text} tracking-tight leading-[1.05] mb-2`}>
          {name}
        </h2>
        <p className={`text-[15px] md:text-[17px] ${theme.sub} mb-5`}>
          Vanaf {price}
        </p>
        <CTAButtons variant={theme.variant} />
      </div>
      <div className="relative flex-1 flex items-end justify-center mt-6 w-full">
        {imgSrc && (
          <div className="relative w-[55%] md:w-[30%] aspect-square max-w-[320px]">
            <Image
              src={getImageSrc(imgSrc)}
              alt={name}
              fill
              className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 55vw, 30vw"
            />
          </div>
        )}
      </div>
    </Link>
  )
}

/* ─── Half-width product card ─── */
function HalfCard({ product, theme, locale }: { product: Product; theme: Theme; locale: AppLocale }) {
  const name = getLocalizedName(product, locale)
  const imgSrc = getCleanPhoto(product)
  const price = formatLocalPrice(product.price, locale)

  return (
    <Link
      href={{ pathname: '/producten/[slug]', params: { slug: product.slug } }}
      className={`group relative ${theme.bg} rounded-apple overflow-hidden flex flex-col items-center justify-between min-h-[300px] md:min-h-[420px] py-8 px-5 md:py-10 md:px-6 transition-colors`}
    >
      <div className="text-center z-10">
        <h2 className={`text-[22px] md:text-[32px] font-semibold ${theme.text} tracking-tight leading-[1.1] mb-2`}>
          {name}
        </h2>
        <p className={`text-[14px] md:text-[17px] ${theme.sub} mb-4`}>
          Vanaf {price}
        </p>
        <CTAButtons variant={theme.variant} />
      </div>
      <div className="relative flex-1 flex items-end justify-center mt-4 w-full">
        {imgSrc && (
          <div className="relative w-[65%] md:w-[55%] aspect-square max-w-[280px]">
            <Image
              src={getImageSrc(imgSrc)}
              alt={name}
              fill
              className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 65vw, 30vw"
            />
          </div>
        )}
      </div>
    </Link>
  )
}

/* ─── Category showcase section (full-width) ─── */
function CategorySection({
  title, subtitle, href, theme, products, locale, emoji,
}: {
  title: string; subtitle: string; href: string; theme: Theme
  products: Product[]; locale: AppLocale; emoji: string
}) {
  const displayProducts = products.filter(p => getCleanPhoto(p)).slice(0, 4)

  return (
    <div className={`${theme.bg} py-12 md:py-16`}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 text-center">
        <h2 className={`text-[22px] md:text-[32px] font-semibold ${theme.text} tracking-tight leading-[1.05] mb-2`}>
          {title}
        </h2>
        <p className={`text-[15px] md:text-[17px] ${theme.sub} mb-5`}>
          {subtitle}
        </p>
        <div className="mb-10">
          <CTAButtons variant={theme.variant} primaryLabel="Ontdek" secondaryLabel="Bekijk alles" />
        </div>

        {displayProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {displayProducts.map((product) => {
              const imgSrc = getCleanPhoto(product)
              const name = getLocalizedName(product, locale)
              const isDark = theme.variant === 'dark'
              return (
                <Link
                  key={product.id}
                  href={{ pathname: '/producten/[slug]', params: { slug: product.slug } }}
                  className={`group rounded-apple overflow-hidden p-4 md:p-5 flex flex-col items-center text-center transition-all duration-300 ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10'
                      : 'bg-white shadow-apple-sm hover:shadow-apple-md'
                  }`}
                >
                  {imgSrc && (
                    <div className="relative w-full aspect-square mb-3">
                      <Image
                        src={getImageSrc(imgSrc)}
                        alt={name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 42vw, 20vw"
                      />
                    </div>
                  )}
                  <h3 className={`text-sm font-semibold leading-tight line-clamp-2 mb-1 ${isDark ? 'text-white' : 'text-apple-black'}`}>
                    {name}
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-[#86868b]' : 'text-apple-gray'}`}>
                    {formatLocalPrice(product.price, locale)}
                  </p>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="flex items-center justify-center py-12">
            <span className="text-[80px] md:text-[120px] select-none">{emoji}</span>
          </div>
        )}
      </div>
    </div>
  )
}

/* ─── Category card (half-width) ─── */
function CategoryCard({
  title, subtitle, href, theme, products, locale, emoji,
}: {
  title: string; subtitle: string; href: string; theme: Theme
  products: Product[]; locale: AppLocale; emoji: string
}) {
  const topProduct = products.find(p => getCleanPhoto(p))
  const imgSrc = topProduct ? getCleanPhoto(topProduct) : ''

  return (
    <a
      href={href}
      className={`group ${theme.bg} rounded-apple overflow-hidden flex flex-col items-center justify-between min-h-[300px] md:min-h-[420px] py-8 px-5 md:py-10 md:px-6 transition-colors`}
    >
      <div className="text-center z-10">
        <h2 className={`text-[22px] md:text-[32px] font-semibold ${theme.text} tracking-tight leading-[1.1] mb-2`}>
          {title}
        </h2>
        <p className={`text-[14px] md:text-[17px] ${theme.sub} mb-4`}>
          {subtitle}
        </p>
        <CTAButtons variant={theme.variant} primaryLabel="Ontdek" secondaryLabel="Bekijk alles" />
      </div>
      <div className="relative flex-1 flex items-end justify-center mt-6 w-full">
        {imgSrc ? (
          <div className="relative w-[60%] md:w-[50%] aspect-square max-w-[240px]">
            <Image
              src={getImageSrc(imgSrc)}
              alt={title}
              fill
              className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 60vw, 25vw"
            />
          </div>
        ) : (
          <span className="text-[80px] md:text-[120px] drop-shadow-lg select-none group-hover:scale-110 transition-transform duration-700">
            {emoji}
          </span>
        )}
      </div>
    </a>
  )
}

/* ═══════════════════════════════════════════════
   Main Apple Grid
   ═══════════════════════════════════════════════ */
export default function AppleGrid({ featuredProducts, allProducts }: Props) {
  const locale = useLocale() as AppLocale

  const dogs = getByCategory(allProducts, 'honden')
  const cats = getByCategory(allProducts, 'katten')
  const birds = getByCategory(allProducts, 'vogels')
  const rodents = getByCategory(allProducts, 'knaagdieren')

  // Collect unique products with images
  const usedIds = new Set<string>()
  const grid: Product[] = []
  for (const p of [...featuredProducts, ...allProducts]) {
    if (!usedIds.has(p.id) && getCleanPhoto(p)) {
      usedIds.add(p.id)
      grid.push(p)
    }
    if (grid.length >= 12) break
  }

  // Find electric/smart products
  const electricKeywords = ['elektr', 'electric', 'automa', 'smart', 'gps', 'led', 'stoom', 'steam', 'laser', 'usb']
  const electricProducts = allProducts.filter(p => {
    const name = (p.name + ' ' + (p.slug || '')).toLowerCase()
    return electricKeywords.some(kw => name.includes(kw)) && getCleanPhoto(p)
  }).slice(0, 3)

  return (
    <div className="space-y-3">

      {/* Row 1: Top 3 products */}
      <div className="max-w-[1280px] mx-auto px-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {grid.slice(0, 3).map((product, i) => (
            <ScrollReveal key={product.id} animation="fade-up" duration={800} delay={i * 80}>
              <HalfCard product={product} theme={[THEMES.light, THEMES.dark, THEMES.warm][i]} locale={locale} />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Katten — full-width dark section */}
      <ScrollReveal animation="fade-up" duration={800}>
        <CategorySection
          title="Katten" subtitle="Speelgoed, verzorging & accessoires"
          href="/producten?categorie=katten" theme={THEMES.dark}
          products={cats} locale={locale} emoji="🐈"
        />
      </ScrollReveal>

      {/* Two products */}
      <div className="max-w-[1280px] mx-auto px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {grid[3] && (
            <ScrollReveal animation="fade-up" duration={800}>
              <HalfCard product={grid[3]} theme={THEMES.green} locale={locale} />
            </ScrollReveal>
          )}
          {grid[4] && (
            <ScrollReveal animation="fade-up" duration={800} delay={100}>
              <HalfCard product={grid[4]} theme={THEMES.light} locale={locale} />
            </ScrollReveal>
          )}
        </div>
      </div>

      {/* Elektrische producten — 3 compact cards */}
      <ScrollReveal animation="fade-up" duration={800}>
        <div className="bg-apple-black py-12 md:py-16">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-6 text-center">
            <h2 className="text-[22px] md:text-[32px] font-semibold text-white tracking-tight mb-2">
              Elektrische producten
            </h2>
            <p className="text-[15px] text-[#86868b] mb-8">
              Slim & elektrisch voor jouw huisdier
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {electricProducts.slice(0, 3).map((product) => {
                const imgSrc = getCleanPhoto(product)
                const name = getLocalizedName(product, locale)
                return (
                  <Link
                    key={product.id}
                    href={{ pathname: '/producten/[slug]', params: { slug: product.slug } }}
                    className="group bg-white/5 hover:bg-white/10 rounded-apple overflow-hidden p-5 md:p-6 flex flex-col items-center text-center transition-all duration-300"
                  >
                    {imgSrc && (
                      <div className="relative w-full aspect-square mb-4 max-w-[200px]">
                        <Image
                          src={getImageSrc(imgSrc)}
                          alt={name}
                          fill
                          className="object-contain group-hover:scale-105 transition-transform duration-500"
                          sizes="(max-width: 768px) 80vw, 25vw"
                        />
                      </div>
                    )}
                    <h3 className="text-[15px] font-semibold text-white leading-tight line-clamp-2 mb-1">
                      {name}
                    </h3>
                    <p className="text-sm text-[#86868b]">
                      {formatLocalPrice(product.price, locale)}
                    </p>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Honden — full-width light section */}
      <ScrollReveal animation="fade-up" duration={800}>
        <CategorySection
          title="Honden" subtitle="Alles voor je trouwe viervoeter"
          href="/producten?categorie=honden" theme={THEMES.light}
          products={dogs} locale={locale} emoji="🐕"
        />
      </ScrollReveal>

      {/* Row 4: Two products */}
      <div className="max-w-[1280px] mx-auto px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {grid[5] && (
            <ScrollReveal animation="fade-up" duration={800}>
              <HalfCard product={grid[5]} theme={THEMES.green} locale={locale} />
            </ScrollReveal>
          )}
          {grid[6] && (
            <ScrollReveal animation="fade-up" duration={800} delay={100}>
              <HalfCard product={grid[6]} theme={THEMES.light} locale={locale} />
            </ScrollReveal>
          )}
        </div>
      </div>

      {/* 3 extra producten — compact row */}
      <div className="max-w-[1280px] mx-auto px-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {grid.slice(7, 10).map((product, i) => (
            <ScrollReveal key={product.id} animation="fade-up" duration={800} delay={i * 80}>
              <HalfCard product={product} theme={i === 1 ? THEMES.dark : THEMES.gray} locale={locale} />
            </ScrollReveal>
          ))}
        </div>
      </div>

      {/* Vogels & Knaagdieren */}
      <div className="max-w-[1280px] mx-auto px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ScrollReveal animation="fade-up" duration={800}>
            <CategoryCard
              title="Vogels" subtitle="Speelgoed & accessoires"
              href="/producten?categorie=vogels" theme={THEMES.gray}
              products={birds} locale={locale} emoji="🦜"
            />
          </ScrollReveal>
          <ScrollReveal animation="fade-up" duration={800} delay={100}>
            <CategoryCard
              title="Knaagdieren" subtitle="Het beste voor kleine vriendjes"
              href="/producten?categorie=knaagdieren" theme={THEMES.dark}
              products={rodents} locale={locale} emoji="🐹"
            />
          </ScrollReveal>
        </div>
      </div>

      {/* More products */}
      <div className="max-w-[1280px] mx-auto px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {grid[8] && (
            <ScrollReveal animation="fade-up" duration={800}>
              <HalfCard product={grid[8]} theme={THEMES.dark} locale={locale} />
            </ScrollReveal>
          )}
          {grid[9] && (
            <ScrollReveal animation="fade-up" duration={800} delay={100}>
              <HalfCard product={grid[9]} theme={THEMES.warm} locale={locale} />
            </ScrollReveal>
          )}
        </div>
      </div>

      {/* Trust bar — full-width dark */}
      <ScrollReveal animation="fade-up" duration={800}>
        <div className="bg-apple-black py-12 md:py-16">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-6">
            <h2 className="text-[24px] md:text-[32px] font-semibold text-white tracking-tight text-center mb-10">
              Waarom PawsNL?
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { icon: '🚚', title: 'Gratis verzending', sub: 'Vanaf €35' },
                { icon: '↩️', title: '30 dagen retour', sub: 'Geen gedoe' },
                { icon: '🔒', title: 'Veilig betalen', sub: 'iDEAL & Klarna' },
                { icon: '⭐', title: 'Klanttevredenheid', sub: 'Groeiende community' },
              ].map((item) => (
                <div key={item.title}>
                  <span className="text-2xl mb-2 block">{item.icon}</span>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs text-[#86868b]">{item.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  )
}
