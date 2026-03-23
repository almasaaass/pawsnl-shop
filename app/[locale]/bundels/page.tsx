import { supabase } from '@/lib/supabase'
import { Product } from '@/lib/types'
import { formatPrice, getImageSrc } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { ShieldCheck, Tag, ArrowRight } from 'lucide-react'
import BundleAddToCart from '@/components/shop/BundleAddToCart'

export const revalidate = 60

export const metadata = {
  title: 'Bundels — Bespaar tot 25% | PawsNL',
  description: 'Samengestelde productbundels voor jouw huisdier. Bespaar tot 25% ten opzichte van losse producten.',
}

interface Bundle {
  name: string
  slug: string
  emoji: string
  description: string
  category: string
  productSlugs: string[]
  discountPercent: number
}

const bundles: Bundle[] = [
  {
    name: 'Verwenpakket Hond',
    slug: 'verwenpakket-hond',
    emoji: '🐕',
    description: 'Alles wat je nodig hebt voor een gelukkige hond. Van verzorging tot wandelen.',
    category: 'honden',
    productSlugs: [],
    discountPercent: 15,
  },
  {
    name: 'Speelpakket Kat',
    slug: 'speelpakket-kat',
    emoji: '🐈',
    description: 'Verwend je kat met dit pakket vol speelgoed en plezier.',
    category: 'katten',
    productSlugs: [],
    discountPercent: 15,
  },
]

async function getProductsByCategory(): Promise<Record<string, Product[]>> {
  const { data } = await supabase
    .from('products')
    .select('*')
    .gt('stock', 0)
    .order('featured', { ascending: false })
    .order('price', { ascending: false })

  const grouped: Record<string, Product[]> = {}
  for (const p of data || []) {
    if (!grouped[p.category]) grouped[p.category] = []
    grouped[p.category].push(p)
  }
  return grouped
}

export default async function BundelsPage() {
  const productsByCategory = await getProductsByCategory()

  const populatedBundles = bundles
    .map((bundle) => {
      const categoryProducts = productsByCategory[bundle.category] || []
      const bundleProducts = categoryProducts.slice(0, 3)
      if (bundleProducts.length < 2) return null

      const originalTotal = bundleProducts.reduce((sum, p) => sum + p.price, 0)
      const bundlePrice = Math.round(originalTotal * (1 - bundle.discountPercent / 100) * 100) / 100
      const savings = Math.round((originalTotal - bundlePrice) * 100) / 100

      return {
        ...bundle,
        products: bundleProducts,
        originalTotal,
        bundlePrice,
        savings,
      }
    })
    .filter(Boolean) as Array<Bundle & { products: Product[]; originalTotal: number; bundlePrice: number; savings: number }>

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-amber-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-4 py-2 mb-4">
            <Tag className="w-4 h-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Bespaar tot 15%</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Productbundels
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Samengestelde pakketten voor jouw huisdier. Meer waarde, minder kosten.
          </p>
        </div>
      </section>

      {/* Garantie */}
      <section className="py-6 px-4 bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-800">100% Tevreden Huisdier Garantie op alle bundels</span>
          <span className="text-xs text-emerald-600">— Niet tevreden? Geld terug.</span>
        </div>
      </section>

      {/* Bundels */}
      <section className="py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          {populatedBundles.map((bundle) => (
            <div key={bundle.slug} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Bundelkoptekst */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-6 md:p-8">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{bundle.emoji}</span>
                    <div>
                      <h2 className="text-2xl font-bold">{bundle.name}</h2>
                      <p className="text-orange-100 text-sm">{bundle.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-orange-100 line-through">
                      Waarde {formatPrice(bundle.originalTotal)}
                    </div>
                    <div className="text-3xl font-bold">{formatPrice(bundle.bundlePrice)}</div>
                    <div className="text-sm font-semibold bg-white/20 rounded-full px-3 py-0.5 mt-1 inline-block">
                      Bespaar {formatPrice(bundle.savings)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Producten in bundel */}
              <div className="p-6 md:p-8">
                <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-4">
                  In deze bundel ({bundle.products.length} producten)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {bundle.products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/producten/${product.slug}`}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className="relative w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                        {product.images[0] ? (
                          <Image
                            src={getImageSrc(product.images[0])}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl bg-orange-50">🐾</div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-400 line-through">{formatPrice(product.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                <BundleAddToCart
                  products={bundle.products}
                  bundlePrice={bundle.bundlePrice}
                  bundleName={bundle.name}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Individuele producten CTA */}
      <section className="py-12 px-4 bg-gray-50 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Liever losse producten?</h2>
        <p className="text-gray-500 mb-6">Bekijk ons volledige assortiment en stel je eigen selectie samen.</p>
        <Link
          href="/producten"
          className="btn-primary inline-flex items-center gap-2"
        >
          Bekijk alle producten
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
    </div>
  )
}
