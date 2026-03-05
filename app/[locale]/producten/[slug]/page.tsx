import { cache } from 'react'
import { supabase } from '@/lib/supabase'
import { Product, getLocalizedName, getLocalizedDescription } from '@/lib/types'
import { notFound } from 'next/navigation'
import { getProductRating } from '@/lib/utils'
import Link from 'next/link'
import ReviewsSection from '@/components/shop/ReviewsSection'
import { Truck, RotateCcw, ShieldCheck, Clock, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/shop/ProductCard'
import GuaranteeBadge from '@/components/shop/GuaranteeBadge'
import ViewTracker from '@/components/shop/ViewTracker'
import RecentlyViewed from '@/components/shop/RecentlyViewed'
import ScarcityBadge from '@/components/shop/ScarcityBadge'
import StarRating from '@/components/shop/StarRating'
import CrossSell from '@/components/shop/CrossSell'
import CountdownTimer from '@/components/shop/CountdownTimer'
import ProductDetailClient from '@/components/shop/ProductDetailClient'
import TikTokBadge from '@/components/shop/TikTokBadge'
import { getTranslations } from 'next-intl/server'

export const revalidate = 60

interface PageProps {
  params: { slug: string; locale: string }
}

const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) return null
  return data
})

async function getRelatedProducts(category: string, currentId: string): Promise<Product[]> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('category', category)
    .neq('id', currentId)
    .limit(4)

  return data || []
}

export async function generateStaticParams() {
  const { data } = await supabase.from('products').select('slug')
  return (data || []).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params
  const product = await getProduct(params.slug)
  if (!product) return {}
  const name = getLocalizedName(product, locale)
  const desc = getLocalizedDescription(product, locale)
  return {
    title: `${name} | PawsNL`,
    description: desc.substring(0, 160),
    alternates: {
      canonical: `https://pawsnlshop.com/producten/${product.slug}`,
    },
    openGraph: {
      title: name,
      description: desc.substring(0, 160),
      type: 'website',
      images: product.images[0] ? [{ url: product.images[0] }] : [],
      locale: 'nl_NL',
    },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale } = await params
  const t = await getTranslations('product')
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id)
  const discount =
    product.compare_price && product.compare_price > product.price
      ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
      : null

  const { rating, count: reviewCount } = getProductRating(product.id)

  const localName = getLocalizedName(product, locale)
  const localDesc = getLocalizedDescription(product, locale)

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: localName,
    description: localDesc,
    image: product.images,
    sku: product.id,
    brand: { '@type': 'Brand', name: 'PawsNL' },
    offers: {
      '@type': 'Offer',
      url: `https://pawsnlshop.com/producten/${product.slug}`,
      priceCurrency: 'EUR',
      price: product.price.toFixed(2),
      availability: product.stock > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: { '@type': 'Organization', name: 'PawsNL' },
    },
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pawsnlshop.com' },
      { '@type': 'ListItem', position: 2, name: 'Producten', item: 'https://pawsnlshop.com/producten' },
      { '@type': 'ListItem', position: 3, name: product.category, item: `https://pawsnlshop.com/producten?categorie=${product.category}` },
      { '@type': 'ListItem', position: 4, name: localName },
    ],
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <ViewTracker product={product} />

      {/* Breadcrumb */}
      <nav className="animate-fade-in text-sm text-gray-500 mb-6 flex items-center gap-1.5 flex-wrap">
        <Link href="/" className="hover:text-accent-500 transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/producten" className="hover:text-accent-500 transition-colors">Producten</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/producten?categorie=${product.category}`} className="hover:text-accent-500 transition-colors capitalize">
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-charcoal font-medium line-clamp-1">{localName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <ProductDetailClient product={product}>
          <div className="mb-3 flex items-center gap-2 flex-wrap">
            <span className="badge-orange capitalize">{product.category}</span>
            <TikTokBadge slug={product.slug} size="sm" />
          </div>

          <h1 className="text-3xl font-bold text-charcoal mb-3">{localName}</h1>

          <div className="flex items-center gap-3 mb-4">
            <StarRating rating={rating} count={reviewCount} size="md" />
          </div>

          <div className="mb-5 flex items-center gap-3 flex-wrap">
            {product.stock > 0 ? (
              <span className="badge-green">{t('inStock')}</span>
            ) : (
              <span className="badge-gray">{t('temporarilyOutOfStock')}</span>
            )}
            <ScarcityBadge stock={product.stock} />
          </div>

          {discount && (
            <div className="mb-5">
              <CountdownTimer label={t('offerEndsIn')} />
            </div>
          )}

          <div className="prose prose-gray mb-6 text-gray-600 leading-relaxed">
            <p>{localDesc}</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5 text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2.5">
              <Truck className="w-4 h-4 text-accent-500 flex-shrink-0" />
              <span><strong>{t('freeAbove').split(' ')[0]}</strong> {t('freeAbove').split(' ').slice(1).join(' ')}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2.5">
              <Clock className="w-4 h-4 text-accent-500 flex-shrink-0" />
              <span>{t('deliveryDays')}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2.5">
              <RotateCcw className="w-4 h-4 text-accent-500 flex-shrink-0" />
              <span><strong>{t('return30Days').split(' ')[0]}</strong> {t('return30Days').split(' ').slice(1).join(' ')}</span>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-gray-600 bg-gray-50 rounded-xl px-3 py-2.5">
              <ShieldCheck className="w-4 h-4 text-accent-500 flex-shrink-0" />
              <span>{t('safePayment')}</span>
            </div>
          </div>

          <div className="mt-4">
            <GuaranteeBadge />
          </div>
        </ProductDetailClient>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mb-12">
          <CrossSell products={relatedProducts.slice(0, 2)} currentProduct={product} />
        </div>
      )}

      <ReviewsSection productId={product.id} productName={product.name} />

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-charcoal mb-6">{t('alsoViewed')}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <RecentlyViewed currentProductId={product.id} />
    </div>
  )
}
