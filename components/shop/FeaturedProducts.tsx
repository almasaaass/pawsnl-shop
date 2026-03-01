import Link from 'next/link'
import { Product } from '@/lib/types'
import ProductCard from './ProductCard'
import { ArrowRight } from 'lucide-react'

interface Props {
  products: Product[]
}

export default function FeaturedProducts({ products }: Props) {
  return (
    <section className="section">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Uitgelichte producten</h2>
          <p className="text-gray-500">Onze meest populaire keuzes voor jouw huisdier</p>
        </div>
        <Link
          href="/producten"
          className="hidden sm:flex items-center gap-2 text-orange-500 hover:text-orange-600 font-semibold transition-colors"
        >
          Alles bekijken
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <p className="text-5xl mb-4">🐾</p>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Nog geen producten</h3>
          <p className="text-gray-500 text-sm mb-4">
            Voeg producten toe in het admin paneel om ze hier te tonen.
          </p>
          <Link href="/admin" className="btn-primary inline-block text-sm">
            Naar admin
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-8 text-center sm:hidden">
            <Link href="/producten" className="btn-secondary inline-flex items-center gap-2">
              Alles bekijken
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </>
      )}
    </section>
  )
}
