'use client'

import { useState, useMemo } from 'react'
import { Product, ProductVariant } from '@/lib/types'
import Image from 'next/image'
import { getImageSrc } from '@/lib/utils'

interface Props {
  product: Product
  onVariantChange: (variant: ProductVariant | null) => void
}

/** Check if a value looks like a CJ internal code (e.g. CJGY191930702BY) */
function isCjCode(value: string): boolean {
  return /^CJ[A-Z]{2}\d{6,}/.test(value)
}

export default function VariantSelector({ product, onVariantChange }: Props) {
  const { variants, option_types } = product

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selected, setSelected] = useState<Record<string, string>>({})

  const hasReadableOptions = useMemo(() => {
    if (!variants || !option_types || option_types.length === 0) return false
    return variants.some((v) => Object.values(v.options).some((val) => !isCjCode(val)))
  }, [variants, option_types])

  // Get unique values per option type
  const optionValues = useMemo(() => {
    const result: Record<string, string[]> = {}
    if (!variants || !option_types) return result
    for (const type of option_types) {
      const values = new Set<string>()
      for (const v of variants) {
        if (v.options[type]) values.add(v.options[type])
      }
      result[type] = Array.from(values)
    }
    return result
  }, [variants, option_types])

  // Early return AFTER all hooks
  if (!variants || !option_types || variants.length <= 1) return null

  // Image-based selector for CJ code variants
  if (!hasReadableOptions) {
    return (
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Kies een variant:
        </label>
        <div className="flex flex-wrap gap-2">
          {variants.map((variant) => {
            const isSelected = selectedVariant?.id === variant.id
            return (
              <button
                key={variant.id}
                onClick={() => {
                  setSelectedVariant(variant)
                  onVariantChange(variant)
                }}
                className={`relative w-16 h-16 rounded-xl border-2 overflow-hidden transition-all ${
                  isSelected
                    ? 'border-accent-500 ring-2 ring-accent-200 scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {variant.image ? (
                  <Image
                    src={getImageSrc(variant.image)}
                    alt={`Variant ${variants.indexOf(variant) + 1}`}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-400">
                    {variants.indexOf(variant) + 1}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // Readable options — text-based selector
  function handleSelect(type: string, value: string) {
    const next = { ...selected, [type]: value }
    setSelected(next)

    if (option_types!.every((t) => next[t])) {
      const match = variants!.find((v) =>
        option_types!.every((t) => v.options[t] === next[t])
      )
      setSelectedVariant(match ?? null)
      onVariantChange(match ?? null)
    } else {
      setSelectedVariant(null)
      onVariantChange(null)
    }
  }

  function getOptionImage(type: string, value: string): string | undefined {
    return variants!.find((v) => v.options[type] === value)?.image
  }

  return (
    <div className="space-y-4">
      {option_types.map((type) => (
        <div key={type}>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            {type}: <span className="text-gray-900">{selected[type] ?? '—'}</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {optionValues[type]?.map((value) => {
              const isSelected = selected[type] === value
              const img = type === 'Kleur' ? getOptionImage(type, value) : undefined

              if (img) {
                return (
                  <button
                    key={value}
                    onClick={() => handleSelect(type, value)}
                    title={value}
                    className={`relative w-12 h-12 rounded-xl border-2 overflow-hidden transition-all ${
                      isSelected
                        ? 'border-accent-500 ring-2 ring-accent-200 scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={getImageSrc(img)}
                      alt={value}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </button>
                )
              }

              return (
                <button
                  key={value}
                  onClick={() => handleSelect(type, value)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                    isSelected
                      ? 'border-accent-500 bg-accent-50 text-accent-700 ring-2 ring-accent-200'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
