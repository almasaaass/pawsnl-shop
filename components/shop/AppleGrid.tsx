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

/* ── Card themes: alternate light/dark like Apple ── */
const CARD_THEMES = [
  { bg: 'bg-[#fbfbfd]', text: 'text-[#1d1d1f]', sub: 'text-[#6e6e73]', cta: 'primary' as const },
  { bg: 'bg-[#1d1d1f]', text: 'text-white', sub: 'text-[#a1a1a6]', cta: 'light' as const },
  { bg: 'bg-[#f5f5f7]', text: 'text-[#1d1d1f]', sub: 'text-[#6e6e73]', cta: 'primary' as const },
  { bg: 'bg-[#faf5ee]', text: 'text-[#1d1d1f]', sub: 'text-[#86868b]', cta: 'primary' as const },
  { bg: 'bg-[#1d1d1f]', text: 'text-white', sub: 'text-[#a1a1a6]', cta: 'light' as const },
  { bg: 'bg-[#e8f0e3]', text: 'text-[#1d1d1f]', sub: 'text-[#6e6e73]', cta: 'primary' as const },
] as const

/* ─── Full-width Apple product card ──────────────────── */
function AppleFullCard({
  product,
  theme,
  locale,
}: {
  product: Product
  theme: typeof CARD_THEMES[number]
  locale: AppLocale
}) {
  const name = getLocalizedName(product, locale)
  const imgSrc = getCleanPhoto(product)
  const price = formatLocalPrice(product.price, locale)

  return (
    <Link
      href={{ pathname: '/producten/[slug]', params: { slug: product.slug } }}
      className={`group relative ${theme.bg} overflow-hidden flex flex-col items-center justify-between min-h-[500px] md:min-h-[580px] p-8 md:p-16 transition-all duration-500`}
    >
      <div className="text-center z-10 relative">
        <h2 className={`text-[36px] md:text-[56px] font-semibold ${theme.text} tracking-tight leading-[1.05] mb-2`}>
          {name}
        </h2>
        <p className={`text-[17px] md:text-[21px] ${theme.sub} mb-5`}>
          Vanaf {price}
        </p>
        <div className="flex items-center justify-center gap-4">
          <span className={`inline-flex items-center text-[14px] font-medium px-5 py-2.5 rounded-full transition-colors ${
            theme.cta === 'primary'
              ? 'bg-[#0071e3] text-white hover:bg-[#0077ED]'
              : 'bg-white/90 text-[#1d1d1f] hover:bg-white'
          }`}>
            Meer info
          </span>
          <span className={`inline-flex items-center text-[14px] hover:underline ${
            theme.cta === 'primary' ? 'text-[#0071e3]' : 'text-[#2997ff]'
          }`}>
            Koop <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </div>
      </div>

      <div className="relative w-full flex-1 flex items-end justify-center mt-4">
        {imgSrc ? (
          <div className="relative w-[50%] md:w-[35%] aspect-square">
            <Image
              src={getImageSrc(imgSrc)}
              alt={name}
              fill
              className="object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-700"
              sizes="(max-width: 768px) 50vw, 35vw"
            />
          </div>
        ) : (
          <div className="w-[35%] aspect-square bg-white/5 rounded-3xl" />
        )}
      </div>
    </Link>
  )
}

/* ─── Half-width Apple product card ──────────────────── */
function AppleHalfCard({
  product,
  theme,
  locale,
}: {
  product: Product
  theme: typeof CARD_THEMES[number]
  locale: AppLocale
}) {
  const name = getLocalizedName(product, locale)
  const imgSrc = getCleanPhoto(product)
  const price = formatLocalPrice(product.price, locale)

  return (
    <Link
      href={{ pathname: '/producten/[slug]', params: { slug: product.slug } }}
      className={`group relative ${theme.bg} rounded-[20px] overflow-hidden flex flex-col items-center justify-between min-h-[480px] md:min-h-[580px] p-8 md:p-10 transition-all duration-500`}
    >
      <div className="text-center z-10 relative">
        <h2 className={`text-[24px] md:text-[36px] font-semibold ${theme.text} tracking-tight leading-[1.1] mb-2`}>
          {name}
        </h2>
        <p className={`text-[14px] md:text-[17px] ${theme.sub} mb-4`}>
          Vanaf {price}
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className={`inline-flex items-center text-[14px] font-medium px-5 py-2.5 rounded-full transition-colors ${
            theme.cta === 'primary'
              ? 'bg-[#0071e3] text-white hover:bg-[#0077ED]'
              : 'bg-white/90 text-[#1d1d1f] hover:bg-white'
          }`}>
            Meer info
          </span>
          <span className={`inline-flex items-center text-[14px] hover:underline ${
            theme.cta === 'primary' ? 'text-[#0071e3]' : 'text-[#2997ff]'
          }`}>
            Koop <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </div>
      </div>

      <div className="relative w-full flex-1 flex items-end justify-center mt-4">
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
          <div className="w-[60%] aspect-square bg-white/5 rounded-3xl" />
        )}
      </div>
    </Link>
  )
}

/* ─── Category card ──────────────────── */
function AppleCategoryCard({
  title,
  subtitle,
  href,
  theme,
  products,
  emoji,
  locale,
}: {
  title: string
  subtitle: string
  href: string
  theme: typeof CARD_THEMES[number]
  products: Product[]
  emoji: string
  locale: AppLocale
}) {
  const topProduct = products[0]
  const imgSrc = topProduct ? getCleanPhoto(topProduct) : ''

  return (
    <a
      href={href}
      className={`group relative ${theme.bg} rounded-[20px] overflow-hidden flex flex-col items-center justify-between min-h-[480px] md:min-h-[580px] p-8 md:p-10 transition-all duration-500`}
    >
      <div className="text-center z-10">
        <h2 className={`text-[28px] md:text-[40px] font-semibold ${theme.text} tracking-tight leading-[1.1] mb-2`}>
          {title}
        </h2>
        <p className={`text-[14px] md:text-[17px] ${theme.sub} mb-5`}>
          {subtitle}
        </p>
        <div className="flex items-center justify-center gap-3">
          <span className={`inline-flex items-center text-[14px] font-medium px-5 py-2.5 rounded-full transition-colors ${
            theme.cta === 'primary'
              ? 'bg-[#0071e3] text-white hover:bg-[#0077ED]'
              : 'bg-white text-[#1d1d1f] hover:bg-[#f5f5f7]'
          }`}>
            Ontdek
          </span>
          <span className={`inline-flex items-center text-[14px] hover:underline ${
            theme.cta === 'primary' ? 'text-[#0071e3]' : 'text-[#2997ff]'
          }`}>
            Bekijk alles <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </span>
        </div>
      </div>

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

/* ─── Main Apple Grid ──────────────────── */
export default function AppleGrid({ featuredProducts, allProducts }: Props) {
  const t = useTranslations('hero')
  const locale = useLocale() as AppLocale

  const catDogs = getProductsByCategory(allProducts, 'honden')
  const catCats = getProductsByCategory(allProducts, 'katten')
  const catBirds = getProductsByCategory(allProducts, 'vogels')
  const catRodents = getProductsByCategory(allProducts, 'knaagdieren')

  // Get unique products for the grid (featured first, then fill from all)
  const usedIds = new Set<string>()
  const gridProducts: Product[] = []

  for (const p of [...featuredProducts, ...allProducts]) {
    if (!usedIds.has(p.id) && getCleanPhoto(p)) {
      usedIds.add(p.id)
      gridProducts.push(p)
    }
    if (gridProducts.length >= 10) break
  }

  return (
    <div className="space-y-3">
      {/* ── Row 1: Full-width hero product (edge to edge) ── */}
      {gridProducts[0] && (
        <ScrollReveal animation="fade-up" duration={800}>
          <AppleFullCard
            product={gridProducts[0]}
            theme={CARD_THEMES[0]}
            locale={locale}
          />
        </ScrollReveal>
      )}

      {/* ── Row 2: Two products side by side ── */}
      <div className="max-w-[1280px] mx-auto px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {gridProducts[1] && (
            <ScrollReveal animation="fade-up" duration={800}>
              <AppleHalfCard
                product={gridProducts[1]}
                theme={CARD_THEMES[1]}
                locale={locale}
              />
            </ScrollReveal>
          )}
          {gridProducts[2] && (
            <ScrollReveal animation="fade-up" duration={800} delay={100}>
              <AppleHalfCard
                product={gridProducts[2]}
                theme={CARD_THEMES[2]}
                locale={locale}
              />
            </ScrollReveal>
          )}
        </div>
      </div>

      {/* ── Row 3: Two products side by side ── */}
      <div className="max-w-[1280px] mx-auto px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {gridProducts[3] && (
            <ScrollReveal animation="fade-up" duration={800}>
              <AppleHalfCard
                product={gridProducts[3]}
                theme={CARD_THEMES[3]}
                locale={locale}
              />
            </ScrollReveal>
          )}
          {gridProducts[4] && (
            <ScrollReveal animation="fade-up" duration={800} delay={100}>
              <AppleHalfCard
                product={gridProducts[4]}
                theme={CARD_THEMES[4]}
                locale={locale}
              />
            </ScrollReveal>
          )}
        </div>
      </div>

      {/* ── Row 4: Full-width product (edge to edge) ── */}
      {gridProducts[5] && (
        <ScrollReveal animation="fade-up" duration={800}>
          <AppleFullCard
            product={gridProducts[5]}
            theme={CARD_THEMES[1]}
            locale={locale}
          />
        </ScrollReveal>
      )}

      {/* ── Row 5: Two categories ── */}
      <div className="max-w-[1280px] mx-auto px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ScrollReveal animation="fade-up" duration={800}>
            <AppleCategoryCard
              title="Honden"
              subtitle="Alles voor je trouwe viervoeter"
              href="/producten?categorie=honden"
              theme={CARD_THEMES[0]}
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
              theme={CARD_THEMES[1]}
              emoji="🐈"
              products={catCats}
              locale={locale}
            />
          </ScrollReveal>
        </div>
      </div>

      {/* ── Row 6: Two more products ── */}
      <div className="max-w-[1280px] mx-auto px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {gridProducts[6] && (
            <ScrollReveal animation="fade-up" duration={800}>
              <AppleHalfCard
                product={gridProducts[6]}
                theme={CARD_THEMES[5]}
                locale={locale}
              />
            </ScrollReveal>
          )}
          {gridProducts[7] && (
            <ScrollReveal animation="fade-up" duration={800} delay={100}>
              <AppleHalfCard
                product={gridProducts[7]}
                theme={CARD_THEMES[3]}
                locale={locale}
              />
            </ScrollReveal>
          )}
        </div>
      </div>

      {/* ── Row 7: Full-width product (edge to edge) ── */}
      {gridProducts[8] && (
        <ScrollReveal animation="fade-up" duration={800}>
          <AppleFullCard
            product={gridProducts[8]}
            theme={CARD_THEMES[5]}
            locale={locale}
          />
        </ScrollReveal>
      )}

      {/* ── Row 8: Two categories ── */}
      <div className="max-w-[1280px] mx-auto px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <ScrollReveal animation="fade-up" duration={800}>
            <AppleCategoryCard
              title="Vogels"
              subtitle="Speelgoed & accessoires"
              href="/producten?categorie=vogels"
              theme={CARD_THEMES[2]}
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
              theme={CARD_THEMES[4]}
              emoji="🐹"
              products={catRodents}
              locale={locale}
            />
          </ScrollReveal>
        </div>
      </div>

      {/* ── Row 9: Last product + trust bar side by side ── */}
      <div className="max-w-[1280px] mx-auto px-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {gridProducts[9] && (
            <ScrollReveal animation="fade-up" duration={800}>
              <AppleHalfCard
                product={gridProducts[9]}
                theme={CARD_THEMES[0]}
                locale={locale}
              />
            </ScrollReveal>
          )}
          <ScrollReveal animation="fade-up" duration={800} delay={100}>
            <div className="bg-[#1d1d1f] rounded-[20px] py-12 px-8 flex flex-col items-center justify-center min-h-[480px] md:min-h-[580px]">
              <h2 className="text-[28px] md:text-[36px] font-semibold text-white tracking-tight text-center mb-10">
                Waarom PawsNL?
              </h2>
              <div className="grid grid-cols-2 gap-8 text-center w-full max-w-md">
                {[
                  { icon: '🚚', title: 'Gratis verzending', sub: 'Vanaf €35' },
                  { icon: '↩️', title: '30 dagen retour', sub: 'Geen gedoe' },
                  { icon: '🔒', title: 'Veilig betalen', sub: 'iDEAL & Klarna' },
                  { icon: '⭐', title: 'Klanttevredenheid', sub: 'Groeiende community' },
                ].map((item) => (
                  <div key={item.title}>
                    <span className="text-3xl mb-3 block">{item.icon}</span>
                    <p className="text-[15px] font-semibold text-white">{item.title}</p>
                    <p className="text-[13px] text-[#a1a1a6]">{item.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  )
}
