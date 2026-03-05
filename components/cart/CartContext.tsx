'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem, Product, ProductVariant } from '@/lib/types'
import { cartItemKey, getVariantPrice } from '@/lib/variants'

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number, variant?: ProductVariant | null) => void
  removeItem: (key: string) => void
  updateQuantity: (key: string, quantity: number) => void
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pawsshop-cart')
      if (saved) {
        setItems(JSON.parse(saved))
      }
    } catch {
      // localStorage not available
    }
    setHydrated(true)
  }, [])

  // Save to localStorage on every change
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem('pawsshop-cart', JSON.stringify(items))
    } catch {
      // localStorage not available
    }
  }, [items, hydrated])

  function addItem(product: Product, quantity = 1, variant?: ProductVariant | null) {
    setItems((prev) => {
      const key = cartItemKey(product.id, variant)
      const existing = prev.find(
        (item) => cartItemKey(item.product.id, item.selectedVariant) === key
      )
      if (existing) {
        return prev.map((item) =>
          cartItemKey(item.product.id, item.selectedVariant) === key
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, quantity, selectedVariant: variant ?? null }]
    })

    // Track AddToCart for ad pixels
    const price = getVariantPrice(product, variant)
    if (typeof window !== 'undefined') {
      if (window.fbq) {
        window.fbq('track', 'AddToCart', {
          value: price * quantity,
          currency: 'EUR',
          content_name: product.name,
          content_type: 'product',
        })
      }
      // @ts-expect-error TikTok pixel global
      if (window.ttq) {
        // @ts-expect-error TikTok pixel global
        window.ttq.track('AddToCart', {
          value: price * quantity,
          currency: 'EUR',
          content_name: product.name,
          content_type: 'product',
        })
      }
    }
  }

  function removeItem(key: string) {
    setItems((prev) =>
      prev.filter((item) => cartItemKey(item.product.id, item.selectedVariant) !== key)
    )
  }

  function updateQuantity(key: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(key)
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        cartItemKey(item.product.id, item.selectedVariant) === key
          ? { ...item, quantity }
          : item
      )
    )
  }

  function clearCart() {
    setItems([])
  }

  const total = items.reduce(
    (sum, item) => sum + getVariantPrice(item.product, item.selectedVariant) * item.quantity,
    0
  )
  const count = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
