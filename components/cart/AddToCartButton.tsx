'use client'

import { useState } from 'react'
import { Product, ProductVariant } from '@/lib/types'
import { useCart } from './CartContext'
import { hasVariants } from '@/lib/variants'
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react'
import Link from 'next/link'

interface Props {
  product: Product
  selectedVariant?: ProductVariant | null
}

export default function AddToCartButton({ product, selectedVariant }: Props) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  const needsVariant = hasVariants(product) && !selectedVariant
  const disabled = product.stock === 0 || needsVariant

  function handleAdd() {
    if (disabled) return
    addItem(product, quantity, selectedVariant)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (product.stock === 0) {
    return (
      <div className="flex flex-col gap-3">
        <button disabled className="btn-primary opacity-50 cursor-not-allowed w-full">
          Tijdelijk uitverkocht
        </button>
        <p className="text-sm text-gray-500 text-center">
          Meld je aan om een melding te ontvangen wanneer dit product weer op voorraad is.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity selection */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Aantal:</label>
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-2.5 hover:bg-gray-50 active:scale-95 transition-all text-gray-700"
            aria-label="Verlagen"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-5 py-2.5 font-semibold text-gray-900 border-x border-gray-200 min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            className="px-4 py-2.5 hover:bg-gray-50 active:scale-95 transition-all text-gray-700"
            aria-label="Verhogen"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="text-sm text-gray-500">({product.stock} beschikbaar)</span>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          disabled={disabled}
          className={`btn-primary flex-1 flex items-center justify-center gap-2 ${
            added ? 'bg-green-500 hover:bg-green-600 animate-button-pulse' : ''
          } ${needsVariant ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {needsVariant ? (
            'Kies een optie'
          ) : added ? (
            <>
              <Check className="w-5 h-5 animate-check-bounce" />
              Toegevoegd!
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              In winkelwagen
            </>
          )}
        </button>

        <Link href="/winkelwagen" className="btn-secondary flex items-center justify-center px-5">
          Winkelwagen
        </Link>
      </div>
    </div>
  )
}
