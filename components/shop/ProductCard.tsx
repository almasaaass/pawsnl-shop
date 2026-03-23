'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product, getLocalizedName, getLocalizedDescription } from '@/lib/types'
import { getImageSrc, getProductRating } from '@/lib/utils'
import { ShoppingCart, Tag, PawPrint, Heart, Check, Flame } from 'lucide-react'
import { useCart } from '@/components/cart/CartContext'
import { useWishlist } from '@/components/shop/WishlistContext'
import StarRating from './StarRating'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { formatLocalPrice, type AppLocale } from '@/lib/locale-config'

interface Props {
  product: Product
}

export default function ProductCard({ product }: Props) {
  const t = useTranslations('product')
  const locale = useLocale() as AppLocale
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const [imgError, setImgError] = useState(false)
  const [added, setAdded] = useState(false)

  const discount =
    product.compare_price && product.compare_price > product.price
      ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
      : null

  const imgSrc = product.images[0] ? getImageSrc(product.images[0]) : ''
  const liked = isInWishlist(product.id)
  const { rating, count } = getProductRating(product.id)

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  function handleWishlist(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    toggleItem(product)
  }

  return (
    <div
      className="group flex flex-col bg-white rounded-[20px] overflow-hidden transition-all duration-[400ms] ease-out"
      style={{
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.1)'
        e.currentTarget.style.transform = 'scale(1.02)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'
        e.currentTarget.style.transform = 'scale(1)'
      }}
    >
      {/* Image */}
      <Link href={{ pathname: '/producten/[slug]', params: { slug: product.slug } }} className="block relative">
        <div className="relative aspect-square bg-[#fbfbfd] overflow-hidden">
          {imgSrc && !imgError ? (
            <Image
              src={imgSrc}
              alt={getLocalizedName(product, locale)}
              fill
              className="object-cover transition-transform duration-[600ms] ease-out group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#fbfbfd]">
              <PawPrint className="w-12 h-12 text-[#d2d2d7]" />
            </div>
          )}
        </div>

        {/* Discount badge only */}
        {discount && (
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1 bg-[#1d1d1f] text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
              <Tag className="w-3 h-3" />
              -{discount}%
            </span>
          </div>
        )}

        {/* Out of stock / low stock badges */}
        {!discount && (
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            {product.stock === 0 && (
              <span className="inline-flex items-center text-[11px] font-medium text-[#86868b] bg-[#f5f5f7] px-2.5 py-1 rounded-full">
                {t('outOfStock')}
              </span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#bf4800] bg-[#fff8f3] px-2.5 py-1 rounded-full">
                <Flame className="w-3 h-3" />
                {t('stockLeft', { count: product.stock })}
              </span>
            )}
          </div>
        )}
        {discount && (
          <div className="absolute top-12 left-4 flex flex-col gap-1.5">
            {product.stock === 0 && (
              <span className="inline-flex items-center text-[11px] font-medium text-[#86868b] bg-[#f5f5f7] px-2.5 py-1 rounded-full">
                {t('outOfStock')}
              </span>
            )}
            {product.stock > 0 && product.stock <= 5 && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#bf4800] bg-[#fff8f3] px-2.5 py-1 rounded-full">
                <Flame className="w-3 h-3" />
                {t('stockLeft', { count: product.stock })}
              </span>
            )}
          </div>
        )}

        {/* Wishlist heart — subtle, no background circle */}
        <button
          onClick={handleWishlist}
          className="absolute top-4 right-4 p-1 transition-all duration-200"
          aria-label={liked ? t('removeFromWishlist') : t('addToWishlist')}
        >
          <Heart
            className={`w-5 h-5 transition-all duration-200 ${
              liked
                ? 'text-[#ff3b30] fill-[#ff3b30]'
                : 'text-[#86868b] opacity-0 group-hover:opacity-100 hover:text-[#ff3b30]'
            }`}
          />
        </button>
      </Link>

      {/* Content */}
      <div className="px-5 pt-4 pb-5 flex flex-col flex-1">
        <span className="text-[11px] text-[#86868b] uppercase tracking-[0.08em] font-medium mb-1">
          {product.category}
        </span>

        <Link href={{ pathname: '/producten/[slug]', params: { slug: product.slug } }} className="block mb-1.5 min-h-[2.75rem]">
          <h3 className="font-semibold text-[#1d1d1f] leading-snug line-clamp-2 text-[15px] tracking-[-0.01em] hover:text-[#0071e3] transition-colors duration-200">
            {getLocalizedName(product, locale)}
          </h3>
        </Link>

        <div className="mb-2">
          <StarRating rating={rating} count={count} />
        </div>

        <p className="text-[#86868b] text-[13px] leading-relaxed mb-4 line-clamp-2 min-h-[2.5rem]">
          {getLocalizedDescription(product, locale)}
        </p>

        {/* Price + button */}
        <div className="mt-auto">
          <div className="h-5 mb-1">
            {product.compare_price && product.compare_price > product.price && (
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-[#86868b] line-through">
                  {formatLocalPrice(product.compare_price, locale)}
                </span>
                <span className="text-[12px] font-semibold text-[#bf4800]">
                  {t('save', { amount: formatLocalPrice(product.compare_price - product.price, locale) })}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3">
            <span className="text-[20px] font-bold text-[#1d1d1f] tracking-[-0.02em]">
              {formatLocalPrice(product.price, locale)}
            </span>

            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={`flex items-center gap-1.5 font-medium text-[13px] py-2.5 px-4 rounded-full transition-all duration-200 min-h-[42px] ${
                added
                  ? 'bg-[#34c759] text-white'
                  : 'bg-accent-500 hover:bg-accent-600 disabled:bg-[#f5f5f7] disabled:text-[#86868b] text-white'
              }`}
              aria-label={t('addToCart')}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('addedToCart')}</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('addToCart')}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
