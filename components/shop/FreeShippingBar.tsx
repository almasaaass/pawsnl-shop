'use client'

import { useCart } from '@/components/cart/CartContext'
import { Truck, Check } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { formatLocalPrice, LOCALE_CONFIGS, convertPrice, type AppLocale } from '@/lib/locale-config'

export default function FreeShippingBar() {
  const t = useTranslations('freeShipping')
  const locale = useLocale() as AppLocale
  const { total } = useCart()

  if (total === 0) return null

  const config = LOCALE_CONFIGS[locale]
  const localTotal = convertPrice(total, config.currency)
  const threshold = config.freeShippingThreshold
  const remaining = threshold - localTotal
  const progress = Math.min((localTotal / threshold) * 100, 100)
  const isFree = remaining <= 0

  const remainingFormatted = new Intl.NumberFormat(config.currencyLocale, {
    style: 'currency',
    currency: config.currencyCode,
  }).format(Math.max(0, remaining))

  return (
    <div className={`px-4 py-2.5 rounded-xl text-sm ${isFree ? 'bg-trust-50 border border-trust-200' : 'bg-accent-50 border border-accent-200'}`}>
      <div className="flex items-center gap-2 mb-1.5">
        {isFree ? (
          <>
            <Check className="w-4 h-4 text-trust-600" />
            <span className="font-semibold text-trust-700">{t('reached')}</span>
          </>
        ) : (
          <>
            <Truck className="w-4 h-4 text-accent-600" />
            <span className="text-gray-700">
              {t('remaining', { amount: remainingFormatted })}
            </span>
          </>
        )}
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${isFree ? 'bg-trust-500' : 'bg-accent-500'}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
