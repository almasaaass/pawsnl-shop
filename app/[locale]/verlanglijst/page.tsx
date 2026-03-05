'use client'

import { useWishlist } from '@/components/shop/WishlistContext'
import ProductCard from '@/components/shop/ProductCard'
import { Heart, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function VerlanglijstPage() {
  const { items } = useWishlist()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal mb-2">Mijn verlanglijst</h1>
        <p className="text-gray-500">
          {items.length} {items.length === 1 ? 'product' : 'producten'} opgeslagen
        </p>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <Heart className="w-20 h-20 text-gray-200 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Je verlanglijst is leeg</h2>
          <p className="text-gray-500 mb-8">
            Klik op het hartje bij een product om het hier op te slaan.
          </p>
          <Link href="/producten" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Bekijk producten
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
