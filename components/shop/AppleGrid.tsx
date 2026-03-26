'use client'

import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { Product, getLocalizedName } from '@/lib/types'
import { getImageSrc } from '@/lib/utils'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { formatLocalPrice, type AppLocale } from '@/lib/locale-config'
import ScrollReveal from '@/components/ui/ScrollReveal'

interface Props {
  featuredProducts: Product[]
  allProducts: Product[]
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

/* ─── Compact product card (used in grids) ─── */
function ProductCard({ product, locale, dark = false }: {
  product: Product; locale: AppLocale; dark?: boolean
}) {
  const name = getLocalizedName(product, locale)
  const imgSrc = getCleanPhoto(product)

  return (
    <Link
      href={{ pathname: '/producten/[slug]', params: { slug: product.slug } }}
      className={`group rounded-apple overflow-hidden p-4 md:p-5 flex flex-col items-center text-center transition-all duration-300 ${
        dark
          ? 'bg-white/5 hover:bg-white/10'
          : 'bg-white shadow-apple-sm hover:shadow-apple-md'
      }`}
    >
      {imgSrc && (
        <div className="relative w-full aspect-square mb-3 max-w-[180px]">
          <Image
            src={getImageSrc(imgSrc)}
            alt={name}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 42vw, 20vw"
          />
        </div>
      )}
      <h3 className={`text-sm font-semibold leading-tight line-clamp-2 mb-1 ${dark ? 'text-white' : 'text-apple-black'}`}>
        {name}
      </h3>
      <p className={`text-xs ${dark ? 'text-[#86868b]' : 'text-apple-gray'}`}>
        {formatLocalPrice(product.price, locale)}
      </p>
    </Link>
  )
}

/* ─── Category section with product grid ─── */
function CategorySection({ title, subtitle, href, products, locale, dark = false, discoverLabel = 'Discover', viewAllLabel = 'View all' }: {
  title: string; subtitle: string; href: string
  products: Product[]; locale: AppLocale; dark?: boolean
  discoverLabel?: string; viewAllLabel?: string
}) {
  const displayProducts = products.filter(p => getCleanPhoto(p) && p.price < 500 && p.stock > 0).slice(0, 4)
  if (displayProducts.length === 0) return null

  return (
    <div className={`${dark ? 'bg-apple-black' : 'bg-[#fbfbfd]'} py-12 md:py-16`}>
      <div className="max-w-[1280px] mx-auto px-5 sm:px-6 text-center">
        <h2 className={`text-[22px] md:text-[32px] font-semibold tracking-tight mb-1 ${dark ? 'text-white' : 'text-apple-black'}`}>
          {title}
        </h2>
        <p className={`text-[15px] mb-4 ${dark ? 'text-[#86868b]' : 'text-apple-gray'}`}>
          {subtitle}
        </p>
        <div className="flex items-center justify-center gap-4 mb-8">
          <a href={href} className={`inline-flex items-center text-sm font-medium px-5 py-2.5 rounded-full transition-colors ${
            dark ? 'bg-white text-apple-black hover:bg-apple-offwhite' : 'bg-apple-blue text-white hover:bg-[#0077ED]'
          }`}>
            {discoverLabel}
          </a>
          <a href={href} className={`inline-flex items-center text-sm hover:underline ${dark ? 'text-[#2997ff]' : 'text-apple-blue'}`}>
            {viewAllLabel} <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} dark={dark} />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════
   Main Homepage Grid — Clean & Focused
   ═══════════════════════════════════════════════ */
export default function AppleGrid({ featuredProducts, allProducts }: Props) {
  const locale = useLocale() as AppLocale
  const t = useTranslations('hero')

  // Filter out absurdly priced products and out of stock
  const validProducts = allProducts.filter(p => p.price < 500 && p.stock > 0)

  const dogs = getByCategory(validProducts, 'honden')
  const cats = getByCategory(validProducts, 'katten')

  // Collect unique bestsellers with images (max 8)
  const usedIds = new Set<string>()
  const bestsellers: Product[] = []
  for (const p of [...featuredProducts.filter(p => p.stock > 0), ...validProducts]) {
    if (!usedIds.has(p.id) && getCleanPhoto(p) && p.price < 500) {
      usedIds.add(p.id)
      bestsellers.push(p)
    }
    if (bestsellers.length >= 8) break
  }

  // Electric/smart products
  const electricKeywords = ['elektr', 'electric', 'automa', 'smart', 'gps', 'led', 'stoom', 'steam', 'laser', 'usb']
  const electricProducts = validProducts.filter(p => {
    const text = (p.name + ' ' + (p.slug || '')).toLowerCase()
    return electricKeywords.some(kw => text.includes(kw)) && getCleanPhoto(p) && p.stock > 0
  }).slice(0, 4)

  return (
    <div className="space-y-3">

      {/* ── BESTSELLERS — 4 producten per rij ── */}
      <div className="bg-[#fbfbfd] py-12 md:py-16">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6">
          <div className="text-center mb-8">
            <h2 className="text-[22px] md:text-[32px] font-semibold text-apple-black tracking-tight mb-1">
              {t('popularProducts')}
            </h2>
            <p className="text-[15px] text-apple-gray">
              {t('discoverBestsellers')}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {bestsellers.slice(0, 8).map((product) => (
              <ScrollReveal key={product.id} animation="fade-up" duration={600}>
                <ProductCard product={product} locale={locale} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* Katten/Honden secties alleen tonen als er producten met foto's zijn */}
      {cats.filter(p => getCleanPhoto(p) && p.price < 500).length >= 2 && (
        <ScrollReveal animation="fade-up" duration={800}>
          <CategorySection
            title={t('cats')} subtitle={t('catsSubtitle')}
            href="/producten?categorie=katten"
            products={cats} locale={locale} dark
            discoverLabel={t('discover')} viewAllLabel={t('viewAll')}
          />
        </ScrollReveal>
      )}

      {dogs.filter(p => getCleanPhoto(p) && p.price < 500).length >= 2 && (
        <ScrollReveal animation="fade-up" duration={800}>
          <CategorySection
            title={t('dogs')} subtitle={t('dogsSubtitle')}
            href="/producten?categorie=honden"
            products={dogs} locale={locale}
            discoverLabel={t('discover')} viewAllLabel={t('viewAll')}
          />
        </ScrollReveal>
      )}

      {/* ── ELEKTRISCH — donkere sectie ── */}
      {electricProducts.length > 0 && (
        <ScrollReveal animation="fade-up" duration={800}>
          <div className="bg-apple-black py-12 md:py-16">
            <div className="max-w-[1280px] mx-auto px-5 sm:px-6 text-center">
              <h2 className="text-[22px] md:text-[32px] font-semibold text-white tracking-tight mb-1">
                {t('smartElectric')}
              </h2>
              <p className="text-[15px] text-[#86868b] mb-8">
                {t('smartElectricSub')}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {electricProducts.map((product) => (
                  <ProductCard key={product.id} product={product} locale={locale} dark />
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
      )}

      {/* ── TRUST BAR ── */}
      <div className="bg-[#fbfbfd] py-10 md:py-14">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🚚', title: t('freeShipping'), sub: t('freeShippingSub') },
              { icon: '↩️', title: t('easyReturns'), sub: t('easyReturnsSub') },
              { icon: '🔒', title: t('securePayment'), sub: t('securePaymentSub') },
              { icon: '⭐', title: t('happyCustomers'), sub: t('happyCustomersSub') },
            ].map((item) => (
              <div key={item.title}>
                <span className="text-2xl mb-2 block">{item.icon}</span>
                <p className="text-sm font-semibold text-apple-black">{item.title}</p>
                <p className="text-xs text-apple-gray">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
