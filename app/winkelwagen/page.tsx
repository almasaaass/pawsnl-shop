'use client'

import { useCart } from '@/components/cart/CartContext'
import { formatPrice, getImageSrc } from '@/lib/utils'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function WinkelwagenPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const shipping = total >= 35 ? 0 : 4.95
  const orderTotal = total + shipping

  async function handleCheckout() {
    setIsLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => ({
            product_id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            image: item.product.images[0] || '',
          })),
        }),
      })

      if (!response.ok) {
        throw new Error('Checkout mislukt')
      }

      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Er is iets misgegaan. Probeer het opnieuw.')
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-3">Je winkelwagen is leeg</h1>
        <p className="text-gray-500 mb-8">Voeg producten toe om te beginnen met winkelen.</p>
        <Link href="/producten" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Verder winkelen
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Winkelwagen</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.product.id} className="card p-5 flex gap-4">
              {/* Afbeelding */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                {item.product.images[0] ? (
                  <Image
                    src={getImageSrc(item.product.images[0])}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    unoptimized
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : null}
                {!item.product.images[0] && (
                  <div className="w-full h-full flex items-center justify-center text-3xl bg-orange-50">🐾</div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900 truncate">{item.product.name}</h3>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                    aria-label="Verwijderen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-orange-500 font-bold mb-3">
                  {formatPrice(item.product.price)}
                </p>

                <div className="flex items-center justify-between">
                  {/* Aantal */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="px-3 py-1.5 hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 py-1.5 font-medium text-gray-900 border-x border-gray-200">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="px-3 py-1.5 hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotaal */}
                  <span className="font-bold text-gray-900">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between pt-2">
            <Link
              href="/producten"
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Verder winkelen
            </Link>
            <button
              onClick={clearCart}
              className="text-sm text-gray-400 hover:text-red-500 transition-colors"
            >
              Winkelwagen leegmaken
            </button>
          </div>
        </div>

        {/* Samenvatting */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-5">Overzicht</h2>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-gray-600">
                <span>Subtotaal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Verzending</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">Gratis</span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {total < 35 && (
                <p className="text-xs text-gray-500 bg-orange-50 p-2 rounded-lg">
                  Nog {formatPrice(35 - total)} tot gratis verzending!
                </p>
              )}
              <hr className="border-gray-100" />
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>Totaal</span>
                <span>{formatPrice(orderTotal)}</span>
              </div>
              <p className="text-xs text-gray-500">Inclusief BTW</p>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Bezig...
                </>
              ) : (
                <>Veilig afrekenen</>
              )}
            </button>

            {/* Betaalmethoden */}
            <div className="mt-4 flex items-center justify-center gap-3 text-gray-400">
              <span className="text-xs">Betaal via:</span>
              <div className="flex gap-2 text-xs font-medium">
                <span className="bg-gray-100 px-2 py-1 rounded">iDEAL</span>
                <span className="bg-gray-100 px-2 py-1 rounded">Visa</span>
                <span className="bg-gray-100 px-2 py-1 rounded">MC</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
