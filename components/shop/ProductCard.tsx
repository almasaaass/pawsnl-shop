'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Product } from '@/lib/types'
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
    <div className="card group flex flex-col hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <Link href={{ pathname: '/producten/[slug]', params: { slug: product.slug } }} className="block relative">
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {imgSrc && !imgError ? (
            <Image
              src={imgSrc}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
              unoptimized
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-accent-50">
              <PawPrint className="w-12 h-12 text-accent-300" />
            </div>
          )}
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.stock === 0 && (
            <span className="badge-gray text-xs">{t('outOfStock')}</span>
          )}
          {discount && (
            <span className="flex items-center gap-1 bg-trust-600 text-white text-xs font-bold px-2 py-1 rounded-full">
              <Tag className="w-3 h-3" />
              -{discount}%
            </span>
          )}
          {product.stock > 0 && product.stock <= 5 && (
            <span className="flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
              <Flame className="w-3 h-3" />
              {t('stockLeft', { count: product.stock })}
            </span>
          )}
        </div>

        {/* Wishlist heart */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors group/heart"
          aria-label={liked ? t('removeFromWishlist') : t('addToWishlist')}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              liked ? 'text-red-500 fill-red-500' : 'text-gray-400 group-hover/heart:text-red-400'
            }`}
          />
        </button>
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-gray-400 uppercase tracking-wider mb-1 capitalize">
          {product.category}
        </span>
        <Link href={{ pathname: '/producten/[slug]', params: { slug: product.slug } }} className="block mb-1 min-h-[2.75rem]">
          <h3 className="font-semibold text-charcoal hover:text-accent-500 transition-colors leading-snug line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="mb-2">
          <StarRating rating={rating} count={count} />
        </div>

        <p className="text-gray-500 text-sm mb-3 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        {/* Price + button */}
        <div className="mt-auto">
          <div className="h-5 mb-1">
            {product.compare_price && product.compare_price > product.price && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 line-through">
                  {formatLocalPrice(product.compare_price, locale)}
                </span>
                <span className="text-xs font-bold text-trust-600">
                  {t('save', { amount: formatLocalPrice(product.compare_price - product.price, locale) })}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-bold text-accent-500">{formatLocalPrice(product.price, locale)}</span>
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={`flex items-center gap-1.5 font-medium text-sm py-2.5 px-3.5 rounded-xl transition-all min-h-[45px] ${
                added
                  ? 'bg-trust-500 text-white animate-button-pulse'
                  : 'bg-accent-500 hover:bg-accent-600 disabled:bg-gray-200 disabled:text-gray-400 text-white'
              }`}
              aria-label={t('addToCart')}
            >
              {added ? (
                <>
                  <Check className="w-4 h-4 animate-check-bounce" />
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
