'use client'

import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { Product } from '@/lib/types'
import { useCart } from '@/components/cart/CartContext'

interface Props {
  products: Product[]
  bundlePrice: number
  bundleName: string
}

export default function BundleAddToCart({ products, bundleName }: Props) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    for (const product of products) {
      addItem(product, 1)
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full flex items-center justify-center gap-2 font-bold py-4 px-6 rounded-2xl transition-all text-lg ${
        added
          ? 'bg-emerald-500 text-white'
          : 'bg-orange-500 hover:bg-orange-600 text-white shadow-sm hover:shadow-md'
      }`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" />
          Toegevoegd aan winkelwagen!
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Voeg hele bundel toe
        </>
      )}
    </button>
  )
}
