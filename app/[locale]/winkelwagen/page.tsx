'use client'

import { useCart } from '@/components/cart/CartContext'
import { getImageSrc } from '@/lib/utils'
import { cartItemKey, getVariantPrice, getVariantComparePrice, variantLabel } from '@/lib/variants'
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Truck, ShieldCheck, Check } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { formatLocalPrice, LOCALE_CONFIGS, convertPrice, type AppLocale } from '@/lib/locale-config'

export default function WinkelwagenPage() {
  const t = useTranslations('cart')
  const locale = useLocale() as AppLocale
  const config = LOCALE_CONFIGS[locale]
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const localTotal = convertPrice(total, config.currency)
  const threshold = config.freeShippingThreshold
  const shipping = localTotal >= threshold ? 0 : config.shippingCost
  const orderTotal = localTotal + shipping
  const remaining = threshold - localTotal
  const shippingProgress = Math.min((localTotal / threshold) * 100, 100)

  function fmtLocal(eur: number) {
    return formatLocalPrice(eur, locale)
  }

  function fmtLocalDirect(val: number) {
    return new Intl.NumberFormat(config.currencyLocale, {
      style: 'currency',
      currency: config.currencyCode,
    }).format(val)
  }

  async function handleCheckout() {
    setIsLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          items: items.map((item) => {
            const vLabel = variantLabel(item.selectedVariant)
            const price = getVariantPrice(item.product, item.selectedVariant)
            return {
              product_id: item.product.id,
              name: vLabel ? `${item.product.name} (${vLabel})` : item.product.name,
              price,
              quantity: item.quantity,
              image: item.selectedVariant?.image || item.product.images[0] || '',
              variant_id: item.selectedVariant?.id,
              variant_label: vLabel || undefined,
              cj_vid: item.selectedVariant?.cj_vid || item.product.cj_vid || undefined,
            }
          }),
        }),
      })

      if (!response.ok) throw new Error('Checkout failed')
      const { url } = await response.json()
      window.location.href = url
    } catch (error) {
      console.error('Checkout error:', error)
      alert(t('checkoutError'))
      setIsLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-gray-900 mb-3">{t('empty')}</h1>
        <p className="text-gray-500 mb-8">{t('emptyDescription')}</p>
        <Link href="/producten" className="btn-primary inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          {t('continueShopping')}
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h1>

      {/* Free shipping bar */}
      <div className={`mb-8 p-4 rounded-xl ${remaining <= 0 ? 'bg-trust-50 border border-trust-200' : 'bg-accent-50 border border-accent-200'}`}>
        <div className="flex items-center gap-2 mb-2">
          {remaining <= 0 ? (
            <>
              <Check className="w-5 h-5 text-trust-600" />
              <span className="font-semibold text-trust-700">{t('freeShippingReached')}</span>
            </>
          ) : (
            <>
              <Truck className="w-5 h-5 text-accent-600" />
              <span className="text-gray-700">
                {t('remainingForFree', { amount: fmtLocalDirect(Math.max(0, remaining)) })}
              </span>
            </>
          )}
        </div>
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${remaining <= 0 ? 'bg-trust-500' : 'bg-accent-500'}`}
            style={{ width: `${shippingProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => {
            const key = cartItemKey(item.product.id, item.selectedVariant)
            const price = getVariantPrice(item.product, item.selectedVariant)
            const vLabel = variantLabel(item.selectedVariant)
            const displayImage = item.selectedVariant?.image || item.product.images[0]

            return (
              <div key={key} className="card p-5 flex gap-4">
                <Link href={{ pathname: '/producten/[slug]', params: { slug: item.product.slug } }} className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  {displayImage ? (
                    <Image
                      src={getImageSrc(displayImage)}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      unoptimized
                      onError={(e) => { e.currentTarget.style.display = 'none' }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-3xl bg-orange-50">🐾</div>
                  )}
                </Link>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2 mb-1">
                    <Link href={{ pathname: '/producten/[slug]', params: { slug: item.product.slug } }} className="font-semibold text-gray-900 truncate hover:text-accent-500 transition-colors">
                      {item.product.name}
                    </Link>
                    <button
                      onClick={() => removeItem(key)}
                      className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                      aria-label={t('remove')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {vLabel && <p className="text-sm text-gray-500 mb-1">{vLabel}</p>}

                  <div className="mb-3">
                    <span className="text-accent-500 font-bold">{fmtLocal(price)}</span>
                    {(() => {
                      const comparePrice = getVariantComparePrice(item.product, item.selectedVariant)
                      return comparePrice && comparePrice > price ? (
                        <span className="text-xs text-gray-400 line-through ml-2">
                          {fmtLocal(comparePrice)}
                        </span>
                      ) : null
                    })()}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                      <button onClick={() => updateQuantity(key, item.quantity - 1)} className="px-3 py-1.5 hover:bg-gray-50 transition-colors">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 py-1.5 font-medium text-gray-900 border-x border-gray-200">{item.quantity}</span>
                      <button onClick={() => updateQuantity(key, item.quantity + 1)} className="px-3 py-1.5 hover:bg-gray-50 transition-colors">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="font-bold text-gray-900">{fmtLocal(price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            )
          })}

          <div className="flex justify-between pt-2">
            <Link href="/producten" className="flex items-center gap-2 text-sm text-gray-500 hover:text-accent-500 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              {t('continueShopping')}
            </Link>
            <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
              {t('clearCart')}
            </button>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="card p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-5">{t('orderSummary')}</h2>

            <div className="space-y-3 mb-5">
              <div className="flex justify-between text-gray-600">
                <span>{t('subtotal')}</span>
                <span>{fmtLocalDirect(localTotal)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('shippingCosts')}</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-trust-600 font-medium">{t('free')}</span>
                  ) : (
                    fmtLocalDirect(shipping)
                  )}
                </span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between text-lg font-bold text-gray-900">
                <span>{t('total')}</span>
                <span>{fmtLocalDirect(orderTotal)}</span>
              </div>
              <p className="text-xs text-gray-500">{t('inclVat')}</p>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {t('processing')}
                </>
              ) : (
                <>{t('checkout')}</>
              )}
            </button>

            {/* Trust signals */}
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <ShieldCheck className="w-3.5 h-3.5 text-trust-500" />
                <span>{t('safePaymentMethods')}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Truck className="w-3.5 h-3.5 text-trust-500" />
                <span>{t('returnNoHassle')}</span>
              </div>
            </div>

            {/* Payment methods */}
            <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
              <span className="bg-gray-100 px-2.5 py-1 rounded text-xs font-medium text-gray-600">Visa</span>
              <span className="bg-gray-100 px-2.5 py-1 rounded text-xs font-medium text-gray-600">Mastercard</span>
              {locale === 'nl' && (
                <>
                  <span className="bg-gray-100 px-2.5 py-1 rounded text-xs font-medium text-gray-600">iDEAL</span>
                  <span className="bg-gray-100 px-2.5 py-1 rounded text-xs font-medium text-gray-600">Bancontact</span>
                </>
              )}
              <span className="bg-gray-100 px-2.5 py-1 rounded text-xs font-medium text-gray-600">Klarna</span>
              <span className="bg-gray-100 px-2.5 py-1 rounded text-xs font-medium text-gray-600">Apple Pay</span>
              <span className="bg-gray-100 px-2.5 py-1 rounded text-xs font-medium text-gray-600">Google Pay</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
