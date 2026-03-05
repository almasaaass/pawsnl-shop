'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/lib/types'
import { formatPrice, getImageSrc } from '@/lib/utils'
import { useCart } from '@/components/cart/CartContext'
import { ShoppingCart, Check, Plus } from 'lucide-react'

interface Props {
  products: Product[]
  currentProduct: Product
}

export default function CrossSell({ products, currentProduct }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [selected, setSelected] = useState<Set<string>>(
    new Set(products.map((p) => p.id))
  )

  if (products.length === 0) return null

  const selectedProducts = products.filter((p) => selected.has(p.id))
  const bundleTotal = currentProduct.price + selectedProducts.reduce((sum, p) => sum + p.price, 0)
  const discount = selectedProducts.length >= 2 ? 0.1 : selectedProducts.length === 1 ? 0.05 : 0
  const bundlePrice = Math.round(bundleTotal * (1 - discount) * 100) / 100
  const savings = Math.round((bundleTotal - bundlePrice) * 100) / 100

  function toggleProduct(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function handleAddAll() {
    addItem(currentProduct)
    selectedProducts.forEach((p) => addItem(p))
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="bg-gradient-to-br from-accent-50 to-warm-50 border border-accent-100 rounded-2xl p-6">
      <h3 className="font-bold text-charcoal mb-4">Vaak samen gekocht</h3>

      <div className="flex items-center gap-3 flex-wrap mb-4">
        {/* Huidig product */}
        <div className="flex items-center gap-2 bg-white rounded-xl p-2 border border-gray-100">
          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {currentProduct.images[0] && (
              <Image
                src={getImageSrc(currentProduct.images[0])}
                alt={currentProduct.name}
                fill
                className="object-cover"
                sizes="48px"
                unoptimized
              />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-charcoal truncate max-w-[120px]">{currentProduct.name}</p>
            <p className="text-xs text-accent-500 font-bold">{formatPrice(currentProduct.price)}</p>
          </div>
        </div>

        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-2">
            <Plus className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <button
              onClick={() => toggleProduct(product.id)}
              className={`flex items-center gap-2 rounded-xl p-2 border transition-all ${
                selected.has(product.id)
                  ? 'bg-white border-accent-300 ring-2 ring-accent-100'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                {product.images[0] && (
                  <Image
                    src={getImageSrc(product.images[0])}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                    unoptimized
                  />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-charcoal truncate max-w-[120px]">{product.name}</p>
                <p className="text-xs text-accent-500 font-bold">{formatPrice(product.price)}</p>
              </div>
            </button>
          </div>
        ))}
      </div>

      {/* Prijs + knop */}
      {selectedProducts.length > 0 && (
        <div className="flex items-center justify-between gap-4 pt-4 border-t border-accent-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-accent-500">{formatPrice(bundlePrice)}</span>
              {savings > 0 && (
                <>
                  <span className="text-sm text-gray-400 line-through">{formatPrice(bundleTotal)}</span>
                  <span className="text-xs font-bold text-trust-600 bg-trust-50 px-2 py-0.5 rounded-full">
                    Bespaar {formatPrice(savings)}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {selectedProducts.length + 1} producten samen
            </p>
          </div>

          <button
            onClick={handleAddAll}
            className={`flex items-center gap-2 font-semibold text-sm py-3 px-5 rounded-xl transition-all ${
              added
                ? 'bg-trust-500 text-white'
                : 'bg-accent-500 hover:bg-accent-600 text-white'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4" />
                Toegevoegd!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Alles toevoegen
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
