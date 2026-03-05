'use client'

import { Mail, Phone, MapPin, Truck, RotateCcw, ShieldCheck, Star, PawPrint, Instagram } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function Footer() {
  const t = useTranslations('footer')

  const shopLinks = [
    { href: '/producten' as const, label: t('allProducts') },
    { href: '/producten' as const, query: '?categorie=honden', label: t('dogs') },
    { href: '/producten' as const, query: '?categorie=katten', label: t('cats') },
    { href: '/producten' as const, query: '?categorie=vogels', label: t('birds') },
    { href: '/producten' as const, query: '?categorie=knaagdieren', label: t('rodents') },
  ]

  const serviceLinks = [
    { href: '/contact' as const, label: t('contactLink') },
    { href: '/over-ons' as const, label: t('aboutLink') },
    { href: '/veelgestelde-vragen' as const, label: t('faq') },
    { href: '/retourbeleid' as const, label: t('returns') },
    { href: '/track' as const, label: t('trackOrder') },
    { href: '/verzendbeleid' as const, label: t('shippingDelivery') },
    { href: '/klachtenprocedure' as const, label: t('complaints') },
  ]

  const trustItems = [
    { icon: Truck, text: t('freeShipping') },
    { icon: RotateCcw, text: t('returnPolicy') },
    { icon: ShieldCheck, text: t('safePayment') },
    { icon: Star, text: t('customerSatisfaction') },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <PawPrint className="w-6 h-6 text-accent-400" />
              <span className="text-xl font-heading font-bold text-white">
                Paws<span className="text-accent-400">NL</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              {t('brandDescription')}
            </p>
            {/* Contact info */}
            <div className="space-y-2">
              <a href="mailto:info@pawsnlshop.com" className="flex items-center gap-2 text-sm text-gray-400 hover:text-accent-400 transition-colors">
                <Mail className="w-4 h-4" />
                info@pawsnlshop.com
              </a>
              <a href="tel:+31681473561" className="flex items-center gap-2 text-sm text-gray-400 hover:text-accent-400 transition-colors">
                <Phone className="w-4 h-4" />
                06 - 814 73 561
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                Weverstraat 227, 4204CB Gorinchem
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">{t('shop')}</h3>
            <ul className="space-y-2.5">
              {shopLinks.map((link, i) => (
                <li key={i}>
                  {link.query ? (
                    <a
                      href={`${link.href}${link.query}`}
                      className="text-sm text-gray-400 hover:text-accent-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 hover:text-accent-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Klantenservice */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">{t('customerService')}</h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-accent-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vertrouwen */}
          <div>
            <h3 className="font-heading font-semibold text-white mb-4">{t('ourPromise')}</h3>
            <div className="space-y-3">
              {trustItems.map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-sm text-gray-400">
                  <item.icon className="w-4 h-4 text-trust-400 flex-shrink-0" />
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Betaalmethoden */}
            <div className="mt-5">
              <p className="text-xs text-gray-500 mb-2">{t('paymentMethods')}</p>
              <div className="flex flex-wrap gap-2">
                {['Visa', 'Mastercard'].map((method) => (
                  <span
                    key={method}
                    className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded font-medium"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {/* Social media */}
            <div className="mt-5">
              <p className="text-xs text-gray-500 mb-2">{t('followUs')}</p>
              <div className="flex gap-3">
                <a href="https://www.tiktok.com/@pawsshopnl" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="TikTok">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.81.11v-3.51a6.27 6.27 0 0 0-.81-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.12a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.55z"/></svg>
                </a>
                <a href="https://www.instagram.com/pawsnl.shop" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div className="flex flex-col md:flex-row gap-1 md:gap-4 text-center">
            <span>&copy; {new Date().getFullYear()} PawsNL. {t('allRightsReserved')}</span>
            <span className="hidden md:block">|</span>
            <span>KvK: 92754783 &middot; BTW: NL004974786B65</span>
          </div>
          <div className="flex gap-4">
            <Link href="/privacybeleid" className="hover:text-accent-400 transition-colors">{t('privacyPolicy')}</Link>
            <Link href="/algemene-voorwaarden" className="hover:text-accent-400 transition-colors">{t('terms')}</Link>
            <a href="/privacybeleid#cookies" className="hover:text-accent-400 transition-colors">{t('cookiePolicy')}</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
