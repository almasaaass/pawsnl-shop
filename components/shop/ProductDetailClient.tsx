'use client'

import { useState } from 'react'
import { useLocale } from 'next-intl'
import { Product, ProductVariant, getLocalizedName } from '@/lib/types'
import { hasVariants, getVariantPrice, getVariantComparePrice } from '@/lib/variants'
import { formatPrice } from '@/lib/utils'
import ImageCarousel from './ImageCarousel'
import AddToCartButton from '@/components/cart/AddToCartButton'
import VariantSelector from './VariantSelector'
import StickyMobileCTA from './StickyMobileCTA'
import { Tag } from 'lucide-react'

interface Props {
  product: Product
  children?: React.ReactNode
}

export default function ProductDetailClient({ product, children }: Props) {
  const locale = useLocale()
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

  const showVariants = hasVariants(product)
  const effectivePrice = getVariantPrice(product, selectedVariant)
  const effectiveComparePrice = getVariantComparePrice(product, selectedVariant)

  const discount =
    effectiveComparePrice && effectiveComparePrice > effectivePrice
      ? Math.round(((effectiveComparePrice - effectivePrice) / effectiveComparePrice) * 100)
      : null

  // Prepend variant image to carousel if available
  const images = selectedVariant?.image
    ? [selectedVariant.image, ...product.images.filter((img) => img !== selectedVariant.image)]
    : product.images

  return (
    <>
      {/* Image carousel */}
      <ImageCarousel images={images} name={getLocalizedName(product, locale)} />

      {/* Product info */}
      <div className="flex flex-col">
        {children}

        {/* Price - dynamic based on variant */}
        <div className="mb-5">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-bold text-accent-500">{formatPrice(effectivePrice)}</span>
            {effectiveComparePrice && effectiveComparePrice > effectivePrice && (
              <>
                <span className="text-xl text-gray-400 line-through">
                  {formatPrice(effectiveComparePrice)}
                </span>
                {discount && (
                  <span className="flex items-center gap-1 badge-green font-bold">
                    <Tag className="w-3.5 h-3.5" />
                    -{discount}%
                  </span>
                )}
              </>
            )}
          </div>
          {effectiveComparePrice && effectiveComparePrice > effectivePrice && (
            <p className="text-sm text-trust-600 font-medium mt-1">
              Je bespaart {formatPrice(effectiveComparePrice - effectivePrice)}
            </p>
          )}
        </div>

        {/* Variant Selector */}
        {showVariants && (
          <div className="mb-5">
            <VariantSelector product={product} onVariantChange={setSelectedVariant} />
          </div>
        )}

        {/* Klarna badge */}
        <div className="mb-4 flex items-center gap-2 bg-pink-50 border border-pink-200 rounded-xl px-3 py-2">
          <span className="text-pink-600 font-bold text-sm">Klarna</span>
          <span className="text-sm text-gray-600">Nu kopen, later betalen — 0% rente</span>
        </div>

        {/* Add to cart */}
        <AddToCartButton product={product} selectedVariant={selectedVariant} />
      </div>

      {/* Sticky mobiele CTA */}
      <StickyMobileCTA product={product} selectedVariant={selectedVariant} />
    </>
  )
}
