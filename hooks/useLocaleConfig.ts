'use client'

import { useLocale } from 'next-intl'
import { LOCALE_CONFIGS, convertPrice, formatLocalPrice, type AppLocale } from '@/lib/locale-config'

export function useLocaleConfig() {
  const locale = useLocale() as AppLocale
  const config = LOCALE_CONFIGS[locale]

  return {
    locale,
    config,
    convertPrice: (eurPrice: number) => convertPrice(eurPrice, config.currency),
    formatLocalPrice: (eurPrice: number) => formatLocalPrice(eurPrice, locale),
    formatDirectPrice: (amount: number) =>
      new Intl.NumberFormat(config.currencyLocale, {
        style: 'currency',
        currency: config.currencyCode,
      }).format(amount),
  }
}
