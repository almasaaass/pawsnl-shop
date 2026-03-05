'use client'

import { useState, useEffect } from 'react'
import { Product } from '@/lib/types'
import ProductCard from './ProductCard'
import { Clock } from 'lucide-react'

const STORAGE_KEY = 'pawsshop-recently-viewed'
const MAX_ITEMS = 8

export function trackProductView(product: Product) {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    let items: Product[] = stored ? JSON.parse(stored) : []
    items = items.filter((p) => p.id !== product.id)
    items.unshift(product)
    items = items.slice(0, MAX_ITEMS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {}
}

interface Props {
  currentProductId?: string
}

export default function RecentlyViewed({ currentProductId }: Props) {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        let items: Product[] = JSON.parse(stored)
        if (currentProductId) {
          items = items.filter((p) => p.id !== currentProductId)
        }
        setProducts(items.slice(0, 4))
      }
    } catch {}
  }, [currentProductId])

  if (products.length === 0) return null

  return (
    <section className="mt-16">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-accent-500" />
        <h2 className="text-2xl font-bold text-charcoal">Recent bekeken</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
