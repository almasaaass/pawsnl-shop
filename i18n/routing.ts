import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['nl', 'en'],
  defaultLocale: 'nl',
  localePrefix: 'as-needed',
  pathnames: {
    '/': '/',
    '/producten': { nl: '/producten', en: '/products' },
    '/producten/[slug]': { nl: '/producten/[slug]', en: '/products/[slug]' },
    '/winkelwagen': { nl: '/winkelwagen', en: '/cart' },
    '/bevestiging': { nl: '/bevestiging', en: '/confirmation' },
    '/over-ons': { nl: '/over-ons', en: '/about' },
    '/contact': { nl: '/contact', en: '/contact' },
    '/veelgestelde-vragen': { nl: '/veelgestelde-vragen', en: '/faq' },
    '/retourbeleid': { nl: '/retourbeleid', en: '/returns' },
    '/verzendbeleid': { nl: '/verzendbeleid', en: '/shipping' },
    '/privacybeleid': { nl: '/privacybeleid', en: '/privacy' },
    '/algemene-voorwaarden': { nl: '/algemene-voorwaarden', en: '/terms' },
    '/track': { nl: '/track', en: '/track' },
    '/bundels': { nl: '/bundels', en: '/bundles' },
    '/verlanglijst': { nl: '/verlanglijst', en: '/wishlist' },
    '/klachtenprocedure': { nl: '/klachtenprocedure', en: '/complaints' },
    '/links': { nl: '/links', en: '/links' },
  },
})
