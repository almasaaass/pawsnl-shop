'use client'

import { Mail, Phone, MapPin, Truck, RotateCcw, ShieldCheck, Star, PawPrint, Instagram } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { useState } from 'react'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()

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

  const paymentMethods = [
    'Visa',
    'Mastercard',
    ...(locale === 'nl' ? ['iDEAL', 'Bancontact'] : []),
    'Klarna',
    'Apple Pay',
    'Google Pay',
  ]

  // Accordion state for mobile
  const [openSection, setOpenSection] = useState<string | null>(null)

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  return (
    <footer className="bg-apple-offwhite">
      {/* Top border */}
      <div className="max-w-[980px] mx-auto px-[22px]">
        <div className="border-t border-apple-silver" />
      </div>

      <div className="max-w-[980px] mx-auto px-[22px] pt-4 pb-6">
        {/* Trust bar - compact, Apple-style */}
        <div className="flex flex-wrap gap-x-6 gap-y-1 py-3 mb-2">
          {trustItems.map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-1.5"
              style={{ fontSize: '12px', color: '#6e6e73' }}
            >
              <item.icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#6e6e73' }} />
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-apple-silver" />

        {/* Column grid - desktop / Accordion - mobile */}
        <nav className="py-3">
          {/* Desktop grid */}
          <div className="hidden md:grid md:grid-cols-5 md:gap-x-5">
            {/* Column 1: Shop */}
            <div>
              <h3
                className="pb-1.5 uppercase tracking-wide"
                style={{ fontSize: '12px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '0.04em' }}
              >
                {t('shop')}
              </h3>
              <ul>
                {shopLinks.map((link, i) => (
                  <li key={i} style={{ lineHeight: '2' }}>
                    {link.query ? (
                      <a
                        href={`${link.href}${link.query}`}
                        className="hover:no-underline transition-colors duration-200"
                        style={{ fontSize: '12px', color: '#424245', textDecoration: 'none' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#1d1d1f')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#424245')}
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="hover:no-underline transition-colors duration-200"
                        style={{ fontSize: '12px', color: '#424245', textDecoration: 'none' }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = '#1d1d1f')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = '#424245')}
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Customer Service */}
            <div className="col-span-2">
              <h3
                className="pb-1.5 uppercase tracking-wide"
                style={{ fontSize: '12px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '0.04em' }}
              >
                {t('customerService')}
              </h3>
              <ul className="columns-2">
                {serviceLinks.map((link) => (
                  <li key={link.label} style={{ lineHeight: '2' }}>
                    <Link
                      href={link.href}
                      className="hover:no-underline transition-colors duration-200"
                      style={{ fontSize: '12px', color: '#424245', textDecoration: 'none' }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = '#1d1d1f')}
                      onMouseLeave={(e) => (e.currentTarget.style.color = '#424245')}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Our Promise */}
            <div>
              <h3
                className="pb-1.5 uppercase tracking-wide"
                style={{ fontSize: '12px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '0.04em' }}
              >
                {t('ourPromise')}
              </h3>
              <ul>
                {trustItems.map((item) => (
                  <li key={item.text} style={{ lineHeight: '2', fontSize: '12px', color: '#424245' }}>
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Contact */}
            <div>
              <h3
                className="pb-1.5 uppercase tracking-wide"
                style={{ fontSize: '12px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '0.04em' }}
              >
                {t('contactLink')}
              </h3>
              <ul>
                <li style={{ lineHeight: '2' }}>
                  <a
                    href="mailto:info@pawsnlshop.com"
                    className="transition-colors duration-200"
                    style={{ fontSize: '12px', color: '#424245', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#1d1d1f')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#424245')}
                  >
                    info@pawsnlshop.com
                  </a>
                </li>
                <li style={{ lineHeight: '2' }}>
                  <a
                    href="tel:+31681473561"
                    className="transition-colors duration-200"
                    style={{ fontSize: '12px', color: '#424245', textDecoration: 'none' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#1d1d1f')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#424245')}
                  >
                    06 - 814 73 561
                  </a>
                </li>
                <li style={{ lineHeight: '2', fontSize: '12px', color: '#424245' }}>
                  Weverstraat 227
                </li>
                <li style={{ lineHeight: '2', fontSize: '12px', color: '#424245' }}>
                  4204CB Gorinchem
                </li>
              </ul>

              {/* Social media */}
              <div className="mt-3 flex gap-3">
                <a
                  href="https://www.tiktok.com/@pawsnl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200"
                  style={{ color: '#424245' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#1d1d1f')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#424245')}
                  aria-label="TikTok"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.81.11v-3.51a6.27 6.27 0 0 0-.81-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.12a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.55z"/></svg>
                </a>
                <a
                  href="https://www.instagram.com/pawsnl.shop"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-200"
                  style={{ color: '#424245' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#1d1d1f')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#424245')}
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Mobile accordion */}
          <div className="md:hidden divide-y divide-apple-silver">
            {/* Shop accordion */}
            <div>
              <button
                onClick={() => toggleSection('shop')}
                className="w-full flex items-center justify-between py-3"
                style={{ fontSize: '12px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '0.04em' }}
              >
                <span className="uppercase">{t('shop')}</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-300 ${openSection === 'shop' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${openSection === 'shop' ? 'max-h-96 pb-3' : 'max-h-0'}`}
              >
                <ul>
                  {shopLinks.map((link, i) => (
                    <li key={i} style={{ lineHeight: '2.2' }}>
                      {link.query ? (
                        <a href={`${link.href}${link.query}`} style={{ fontSize: '12px', color: '#424245', textDecoration: 'none' }}>
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href} style={{ fontSize: '12px', color: '#424245', textDecoration: 'none' }}>
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Customer Service accordion */}
            <div>
              <button
                onClick={() => toggleSection('service')}
                className="w-full flex items-center justify-between py-3"
                style={{ fontSize: '12px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '0.04em' }}
              >
                <span className="uppercase">{t('customerService')}</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-300 ${openSection === 'service' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${openSection === 'service' ? 'max-h-96 pb-3' : 'max-h-0'}`}
              >
                <ul>
                  {serviceLinks.map((link) => (
                    <li key={link.label} style={{ lineHeight: '2.2' }}>
                      <Link href={link.href} style={{ fontSize: '12px', color: '#424245', textDecoration: 'none' }}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Our Promise accordion */}
            <div>
              <button
                onClick={() => toggleSection('promise')}
                className="w-full flex items-center justify-between py-3"
                style={{ fontSize: '12px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '0.04em' }}
              >
                <span className="uppercase">{t('ourPromise')}</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-300 ${openSection === 'promise' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${openSection === 'promise' ? 'max-h-96 pb-3' : 'max-h-0'}`}
              >
                <ul>
                  {trustItems.map((item) => (
                    <li key={item.text} style={{ lineHeight: '2.2', fontSize: '12px', color: '#424245' }}>
                      {item.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Contact accordion */}
            <div>
              <button
                onClick={() => toggleSection('contact')}
                className="w-full flex items-center justify-between py-3"
                style={{ fontSize: '12px', fontWeight: 600, color: '#1d1d1f', letterSpacing: '0.04em' }}
              >
                <span className="uppercase">{t('contactLink')}</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-300 ${openSection === 'contact' ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${openSection === 'contact' ? 'max-h-96 pb-3' : 'max-h-0'}`}
              >
                <ul>
                  <li style={{ lineHeight: '2.2' }}>
                    <a href="mailto:info@pawsnlshop.com" style={{ fontSize: '12px', color: '#424245', textDecoration: 'none' }}>
                      info@pawsnlshop.com
                    </a>
                  </li>
                  <li style={{ lineHeight: '2.2' }}>
                    <a href="tel:+31681473561" style={{ fontSize: '12px', color: '#424245', textDecoration: 'none' }}>
                      06 - 814 73 561
                    </a>
                  </li>
                  <li style={{ lineHeight: '2.2', fontSize: '12px', color: '#424245' }}>
                    Weverstraat 227, 4204CB Gorinchem
                  </li>
                </ul>

                {/* Social media - mobile */}
                <div className="mt-2 flex gap-3">
                  <a href="https://www.tiktok.com/@pawsnl" target="_blank" rel="noopener noreferrer" style={{ color: '#424245' }} aria-label="TikTok">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .56.04.81.11v-3.51a6.27 6.27 0 0 0-.81-.05A6.34 6.34 0 0 0 3.15 15.2a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.12a8.16 8.16 0 0 0 4.76 1.52v-3.4a4.85 4.85 0 0 1-1-.55z"/></svg>
                  </a>
                  <a href="https://www.instagram.com/pawsnl.shop" target="_blank" rel="noopener noreferrer" style={{ color: '#424245' }} aria-label="Instagram">
                    <Instagram className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Payment methods - subtle, small */}
        <div className="border-t border-apple-silver pt-3 pb-2">
          <p style={{ fontSize: '12px', color: '#6e6e73', marginBottom: '6px' }}>{t('paymentMethods')}</p>
          <div className="flex flex-wrap gap-2">
            {paymentMethods.map((method) => (
              <span
                key={method}
                className="border border-apple-silver rounded"
                style={{
                  fontSize: '11px',
                  color: '#6e6e73',
                  padding: '2px 8px',
                  lineHeight: '1.6',
                }}
              >
                {method}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom section - copyright, legal, all on one line with pipes */}
        <div className="border-t border-apple-silver pt-3">
          <p style={{ fontSize: '12px', color: '#6e6e73', lineHeight: '1.8' }}>
            {t('brandDescription')}
          </p>
          <div
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mt-2"
            style={{ fontSize: '12px', color: '#6e6e73' }}
          >
            <div className="flex flex-wrap items-center gap-x-1">
              <span>&copy; {new Date().getFullYear()} PawsNL. {t('allRightsReserved')}</span>
              <span className="hidden md:inline" style={{ color: '#d2d2d7' }}>|</span>
              <span>KvK: 92754783</span>
              <span style={{ color: '#d2d2d7' }}>|</span>
              <span>BTW: NL004974786B65</span>
            </div>
            <div className="flex flex-wrap items-center gap-x-1">
              <Link
                href="/privacybeleid"
                className="transition-colors duration-200"
                style={{ fontSize: '12px', color: '#424245', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1d1d1f')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#424245')}
              >
                {t('privacyPolicy')}
              </Link>
              <span style={{ color: '#d2d2d7' }}>|</span>
              <Link
                href="/algemene-voorwaarden"
                className="transition-colors duration-200"
                style={{ fontSize: '12px', color: '#424245', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1d1d1f')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#424245')}
              >
                {t('terms')}
              </Link>
              <span style={{ color: '#d2d2d7' }}>|</span>
              <a
                href="/privacybeleid#cookies"
                className="transition-colors duration-200"
                style={{ fontSize: '12px', color: '#424245', textDecoration: 'none' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#1d1d1f')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#424245')}
              >
                {t('cookiePolicy')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
