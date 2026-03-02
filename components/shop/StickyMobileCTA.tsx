'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/components/cart/CartContext'
import { ShoppingCart, Check } from 'lucide-react'

interface Props {
  product: Product
}

export default function StickyMobileCTA({ product }: Props) {
  const { addItem } = useCart()
  const [visible, setVisible] = useState(false)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling 400px
      setVisible(window.scrollY > 400)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function handleAdd() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (product.stock === 0) return null

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-30 md:hidden transition-all duration-300 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
      }`}
    >
      <div className="bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] px-4 py-3">
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div className="flex flex-col min-w-0">
            <span className="text-xs text-gray-500 truncate">{product.name}</span>
            <span className="text-lg font-bold text-accent-500">{formatPrice(product.price)}</span>
          </div>
          <button
            onClick={handleAdd}
            className={`flex items-center gap-2 font-semibold text-sm py-3 px-6 rounded-xl transition-all min-h-[45px] ${
              added
                ? 'bg-green-500 text-white animate-button-pulse'
                : 'bg-accent-500 hover:bg-accent-600 text-white'
            }`}
          >
            {added ? (
              <>
                <Check className="w-4 h-4 animate-check-bounce" />
                Toegevoegd!
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Toevoegen
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
