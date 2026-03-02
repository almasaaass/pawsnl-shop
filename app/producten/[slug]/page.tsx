import { cache } from 'react'
import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import { notFound } from 'next/navigation'
import { formatPrice } from '@/lib/utils'
import Link from 'next/link'
import ImageCarousel from '@/components/shop/ImageCarousel'
import AddToCartButton from '@/components/cart/AddToCartButton'
import ReviewsSection from '@/components/shop/ReviewsSection'
import { Truck, RotateCcw, ShieldCheck, Tag, Clock } from 'lucide-react'
import ProductCard from '@/components/shop/ProductCard'
import GuaranteeBadge from '@/components/shop/GuaranteeBadge'
import StickyMobileCTA from '@/components/shop/StickyMobileCTA'

export const revalidate = 60

interface PageProps {
  params: { slug: string }
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
  const product = await getProduct(params.slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.description.substring(0, 160),
    alternates: {
      canonical: `https://pawsshop.nl/producten/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.description.substring(0, 160),
      type: 'website',
      images: product.images[0] ? [{ url: product.images[0] }] : [],
      locale: 'nl_NL',
    },
  }
}

export default async function ProductDetailPage({ params }: PageProps) {
  const product = await getProduct(params.slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id)
  const discount =
    product.compare_price && product.compare_price > product.price
      ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
      : null

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    brand: { '@type': 'Brand', name: 'PawsNL' },
    offers: {
      '@type': 'Offer',
      url: `https://pawsshop.nl/producten/${product.slug}`,
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
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://pawsshop.nl' },
      { '@type': 'ListItem', position: 2, name: 'Producten', item: 'https://pawsshop.nl/producten' },
      { '@type': 'ListItem', position: 3, name: product.name },
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

      {/* Sticky mobile CTA */}
      <StickyMobileCTA product={product} />

      {/* Breadcrumb */}
      <nav className="animate-fade-in text-sm text-gray-500 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-accent-500 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/producten" className="hover:text-accent-500 transition-colors">Producten</Link>
        <span>/</span>
        <span className="text-gray-800">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Foto carousel */}
        <ImageCarousel images={product.images} name={product.name} />

        {/* Product info */}
        <div className="flex flex-col">
          {/* Categorie badge */}
          <div className="mb-3">
            <span className="badge-orange capitalize">{product.category}</span>
          </div>

          <h1 className="text-3xl font-bold text-charcoal mb-4">{product.name}</h1>

          {/* Prijs */}
          <div className="mb-6">
            <div className="flex items-center gap-3">
              <span className="text-4xl font-bold text-accent-500">{formatPrice(product.price)}</span>
              {product.compare_price && product.compare_price > product.price && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    {formatPrice(product.compare_price)}
                  </span>
                  {discount && (
                    <span className="flex items-center gap-1 badge-green font-bold">
                      <Tag className="w-3.5 h-3.5" />
                      -{discount}%
                    </span>
                  )}
                </>
              )}
            </div>
            {product.compare_price && product.compare_price > product.price && (
              <p className="text-sm text-trust-600 font-medium mt-1">
                Je bespaart {formatPrice(product.compare_price - product.price)}
              </p>
            )}
          </div>

          {/* Voorraad */}
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="badge-green">
                ✓ Op voorraad ({product.stock} beschikbaar)
              </span>
            ) : (
              <span className="badge-gray">Tijdelijk uitverkocht</span>
            )}
          </div>

          {/* Beschrijving */}
          <div className="prose prose-gray mb-8 text-gray-600 leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* In winkelwagen knop */}
          <AddToCartButton product={product} />

          {/* Vertrouwenselementen */}
          <div className="mt-8 space-y-3 border-t pt-6">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Truck className="w-5 h-5 text-accent-500 flex-shrink-0" />
              <span><strong>Gratis verzending</strong> bij bestellingen vanaf €35</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Clock className="w-5 h-5 text-accent-500 flex-shrink-0" />
              <span><strong>Levertijd:</strong> 7-14 werkdagen</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <RotateCcw className="w-5 h-5 text-accent-500 flex-shrink-0" />
              <span><strong>30 dagen retour</strong> – Niet tevreden? Geld terug.</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <ShieldCheck className="w-5 h-5 text-accent-500 flex-shrink-0" />
              <span><strong>Veilig betalen</strong> via iDEAL, Creditcard of Bancontact</span>
            </div>
          </div>

          {/* Garantie badge */}
          <div className="mt-4">
            <GuaranteeBadge />
          </div>
        </div>
      </div>

      {/* Reviews */}
      <ReviewsSection productId={product.id} productName={product.name} />

      {/* Gerelateerde producten */}
      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-charcoal mb-6">Anderen kochten ook</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
