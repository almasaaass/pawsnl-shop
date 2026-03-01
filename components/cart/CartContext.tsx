'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { CartItem, Product } from '@/lib/types'

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Laad winkelwagen uit localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('pawsnl-cart')
      if (saved) {
        setItems(JSON.parse(saved))
      }
    } catch {
      // localStorage niet beschikbaar
    }
    setHydrated(true)
  }, [])

  // Sla op in localStorage bij elke wijziging
  useEffect(() => {
    if (!hydrated) return
    try {
      localStorage.setItem('pawsnl-cart', JSON.stringify(items))
    } catch {
      // localStorage niet beschikbaar
    }
  }, [items, hydrated])

  function addItem(product: Product, quantity = 1) {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, quantity }]
    })
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  function updateQuantity(productId: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  function clearCart() {
    setItems([])
  }

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
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
    throw new Error('useCart moet binnen een CartProvider gebruikt worden')
  }
  return context
}
