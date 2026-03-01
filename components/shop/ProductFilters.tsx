'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { X } from 'lucide-react'

interface Category {
  slug: string
  label: string
  emoji: string
}

interface Props {
  categories: Category[]
  activeCategory: string
  minPrijs?: string
  maxPrijs?: string
}

export default function ProductFilters({ categories, activeCategory, minPrijs, maxPrijs }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null) {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
      return params.toString()
    },
    [searchParams]
  )

  function setCategory(slug: string) {
    const qs = createQueryString({
      categorie: slug || null,
    })
    router.push(`${pathname}?${qs}`)
  }

  function setPriceRange(min: string, max: string) {
    const qs = createQueryString({
      min_prijs: min || null,
      max_prijs: max || null,
    })
    router.push(`${pathname}?${qs}`)
  }

  function clearAll() {
    router.push(pathname)
  }

  const hasFilters = activeCategory || minPrijs || maxPrijs

  return (
    <div className="space-y-6">
      {/* Actieve filters wissen */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-2 text-sm text-orange-500 hover:text-orange-600 font-medium"
        >
          <X className="w-4 h-4" />
          Filters wissen
        </button>
      )}

      {/* Categorieën */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Categorie
        </p>
        <div className="space-y-1">
          <button
            onClick={() => setCategory('')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              !activeCategory
                ? 'bg-orange-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Alle categorieën
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setCategory(cat.slug)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                activeCategory === cat.slug
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Prijs */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Prijs
        </p>
        <div className="space-y-2">
          {[
            { label: 'Tot €15', min: '', max: '15' },
            { label: '€15 – €30', min: '15', max: '30' },
            { label: '€30 – €50', min: '30', max: '50' },
            { label: 'Boven €50', min: '50', max: '' },
          ].map((range) => {
            const isActive = minPrijs === range.min && maxPrijs === range.max
            return (
              <button
                key={range.label}
                onClick={() => setPriceRange(range.min, range.max)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {range.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
