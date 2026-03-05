export const EXCHANGE_RATES: Record<string, number> = {
  eur: 1,
  gbp: 0.86,
}

export const LOCALE_CONFIGS = {
  nl: {
    currency: 'eur',
    currencyCode: 'EUR',
    currencyLocale: 'nl-NL',
    freeShippingThreshold: 35,
    shippingCost: 4.95,
    allowedCountries: ['NL', 'BE', 'DE'] as const,
    paymentMethods: ['card', 'ideal', 'bancontact', 'klarna'] as const,
    deliveryDays: { min: 5, max: 10 },
    stripeLocale: 'nl' as const,
  },
  en: {
    currency: 'gbp',
    currencyCode: 'GBP',
    currencyLocale: 'en-GB',
    freeShippingThreshold: 30,
    shippingCost: 4.25,
    allowedCountries: ['GB', 'AU', 'IE'] as const,
    paymentMethods: ['card'] as const,
    deliveryDays: { min: 7, max: 14 },
    stripeLocale: 'en' as const,
  },
} as const

export type AppLocale = keyof typeof LOCALE_CONFIGS

export function convertPrice(eurPrice: number, currency: string): number {
  const rate = EXCHANGE_RATES[currency] ?? 1
  return Math.round(eurPrice * rate * 100) / 100
}

export function formatLocalPrice(price: number, locale: AppLocale): string {
  const config = LOCALE_CONFIGS[locale]
  return new Intl.NumberFormat(config.currencyLocale, {
    style: 'currency',
    currency: config.currencyCode,
  }).format(convertPrice(price, config.currency))
}
