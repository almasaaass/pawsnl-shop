'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { X, Dog, Cat, Bird, Rabbit, Fish, Snail, TrendingUp } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Dog,
  Cat,
  Bird,
  Rabbit,
  Fish,
  Snail,
}

interface Category {
  slug: string
  label: string
  emoji: string
  icon?: string
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
      {/* Clear active filters */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex items-center gap-2 text-sm text-accent-500 hover:text-accent-600 font-medium"
        >
          <X className="w-4 h-4" />
          Filters wissen
        </button>
      )}

      {/* Trending filter */}
      <div>
        <button
          onClick={() => {
            const qs = createQueryString({
              trending: searchParams.get('trending') === '1' ? null : '1',
            })
            router.push(`${pathname}?${qs}`)
          }}
          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
            searchParams.get('trending') === '1'
              ? 'bg-charcoal text-white shadow-md'
              : 'bg-gray-50 text-charcoal hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48 6.3 6.3 0 001.86-4.49V8.87a8.28 8.28 0 004.84 1.56V6.96a4.84 4.84 0 01-1.12-.27z" />
          </svg>
          Trending op TikTok
          <TrendingUp className="w-3.5 h-3.5 ml-auto" />
        </button>
      </div>

      {/* Categories */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Categorie
        </p>
        <div className="space-y-1">
          <button
            onClick={() => setCategory('')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              !activeCategory
                ? 'bg-accent-500 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Alle categorieën
          </button>
          {categories.map((cat) => {
            const Icon = cat.icon ? iconMap[cat.icon] : null
            return (
              <button
                key={cat.slug}
                onClick={() => setCategory(cat.slug)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                  activeCategory === cat.slug
                    ? 'bg-accent-500 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {Icon ? (
                  <Icon className={`w-4 h-4 ${activeCategory === cat.slug ? 'text-white' : 'text-accent-500'}`} />
                ) : (
                  <span>{cat.emoji}</span>
                )}
                {cat.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Price */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
          Prijs
        </p>
        <div className="space-y-2">
          {[
            { label: 'Onder €15', min: '', max: '15' },
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
                    ? 'bg-accent-500 text-white'
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
