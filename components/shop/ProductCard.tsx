'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Product } from '@/lib/types'
import { formatPrice, getImageSrc } from '@/lib/utils'
import { ShoppingCart, Tag, PawPrint } from 'lucide-react'
import { useCart } from '@/components/cart/CartContext'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart()
  const [imgError, setImgError] = useState(false)
  const discount =
    product.compare_price && product.compare_price > product.price
      ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
      : null

  const imgSrc = product.images[0] ? getImageSrc(product.images[0]) : ''

  return (
    <div className="card group flex flex-col hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
      {/* Afbeelding */}
      <Link href={`/producten/${product.slug}`} className="block relative">
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {imgSrc && !imgError ? (
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
              unoptimized
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-accent-50">
              <PawPrint className="w-12 h-12 text-accent-300" />
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.stock === 0 && (
            <span className="badge-gray text-xs">Uitverkocht</span>
          )}
          {discount && (
            <span className="flex items-center gap-1 bg-trust-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              <Tag className="w-3 h-3" />
              -{discount}%
            </span>
          )}
          {product.featured && (
            <span className="badge-orange text-xs">Uitgelicht</span>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-gray-400 uppercase tracking-wider mb-1 capitalize">
          {product.category}
        </span>
        <Link href={`/producten/${product.slug}`} className="block mb-2">
          <h3 className="font-semibold text-charcoal hover:text-accent-500 transition-colors leading-snug line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-500 text-sm mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>

        {/* Prijs + knop */}
        <div className="mt-auto">
          {product.compare_price && product.compare_price > product.price && (
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-400 line-through">
                Waarde {formatPrice(product.compare_price)}
              </span>
              <span className="text-xs font-bold text-trust-600">
                Bespaar {formatPrice(product.compare_price - product.price)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-bold text-accent-500">{formatPrice(product.price)}</span>
            <button
              onClick={() => addItem(product)}
              disabled={product.stock === 0}
              className="flex items-center gap-1.5 bg-accent-500 hover:bg-accent-600 disabled:bg-gray-200 disabled:text-gray-400 text-white font-medium text-sm py-2.5 px-3.5 rounded-xl transition-colors min-h-[45px]"
              aria-label={`Voeg ${product.name} toe aan winkelwagen`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Toevoegen</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
