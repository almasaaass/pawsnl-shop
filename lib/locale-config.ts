export const EXCHANGE_RATES: Record<string, number> = {
  eur: 1,
}

export const LOCALE_CONFIGS = {
  nl: {
    currency: 'eur',
    currencyCode: 'EUR',
    currencyLocale: 'nl-NL',
    freeShippingThreshold: 35,
    shippingCost: 4.95,
    allowedCountries: ['NL', 'BE', 'DE', 'LU'] as const,
    paymentMethods: ['card', 'ideal', 'bancontact', 'klarna'] as const,
    deliveryDays: { min: 5, max: 10 },
    stripeLocale: 'nl' as const,
  },
  en: {
    currency: 'eur',
    currencyCode: 'EUR',
    currencyLocale: 'en-US',
    freeShippingThreshold: 35,
    shippingCost: 5.95,
    allowedCountries: [
      // Europe
      'GB', 'IE', 'FR', 'DE', 'ES', 'IT', 'PT', 'AT', 'CH', 'SE',
      'NO', 'DK', 'FI', 'PL', 'CZ', 'GR', 'HR', 'RO', 'BG', 'HU',
      'SK', 'SI', 'EE', 'LV', 'LT', 'CY', 'MT', 'IS', 'LU', 'BE',
      // North America
      'US', 'CA',
      // Oceania
      'AU', 'NZ',
      // Asia
      'SG', 'JP', 'KR', 'HK', 'MY', 'TH',
      // Middle East
      'AE', 'SA', 'QA', 'KW', 'BH',
    ] as const,
    paymentMethods: ['card', 'klarna', 'link'] as const,
    deliveryDays: { min: 7, max: 18 },
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
