'use client'

import { useState } from 'react'
import { Product } from '@/lib/types'
import { useCart } from './CartContext'
import { ShoppingCart, Plus, Minus, Check } from 'lucide-react'
import Link from 'next/link'

interface Props {
  product: Product
}

export default function AddToCartButton({ product }: Props) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addItem(product, quantity)
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
          Meld je aan voor een melding als dit product weer beschikbaar is.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Aantal selectie */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium text-gray-700">Aantal:</label>
        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700"
            aria-label="Minder"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="px-5 py-2.5 font-semibold text-gray-900 border-x border-gray-200 min-w-[3rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
            className="px-4 py-2.5 hover:bg-gray-50 transition-colors text-gray-700"
            aria-label="Meer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <span className="text-sm text-gray-500">({product.stock} beschikbaar)</span>
      </div>

      {/* Knoppen */}
      <div className="flex gap-3">
        <button
          onClick={handleAdd}
          className={`btn-primary flex-1 flex items-center justify-center gap-2 ${
            added ? 'bg-green-500 hover:bg-green-600' : ''
          }`}
        >
          {added ? (
            <>
              <Check className="w-5 h-5" />
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
          Wagen
        </Link>
      </div>
    </div>
  )
}
