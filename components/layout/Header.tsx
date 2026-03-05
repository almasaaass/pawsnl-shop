'use client'

import { useState, useRef, useEffect } from 'react'
import { ShoppingCart, Menu, X, Search, PawPrint, Heart, ChevronDown, Dog, Cat, Bird, Rabbit, Fish, Snail } from 'lucide-react'
import { useCart } from '@/components/cart/CartContext'
import { useWishlist } from '@/components/shop/WishlistContext'
import { useRouter } from 'next/navigation'
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/i18n/navigation'
import FreeShippingBar from '@/components/shop/FreeShippingBar'
import LocaleSwitcher from './LocaleSwitcher'

const CATEGORY_ITEMS = [
  { slug: 'honden', labelKey: 'dogs' as const, icon: Dog, color: 'text-amber-600' },
  { slug: 'katten', labelKey: 'cats' as const, icon: Cat, color: 'text-orange-500' },
  { slug: 'vogels', labelKey: 'birds' as const, icon: Bird, color: 'text-sky-500' },
  { slug: 'knaagdieren', labelKey: 'rodents' as const, icon: Rabbit, color: 'text-emerald-500' },
  { slug: 'vissen', labelKey: 'fish' as const, icon: Fish, color: 'text-blue-500' },
  { slug: 'reptielen', labelKey: 'reptiles' as const, icon: Snail, color: 'text-green-600' },
]

export default function Header() {
  const t = useTranslations('header')
  const { count } = useCart()
  const { count: wishlistCount } = useWishlist()
  const [menuOpen, setMenuOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const megaRef = useRef<HTMLDivElement>(null)
  const megaTimeout = useRef<NodeJS.Timeout>()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/producten?zoek=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMenuOpen(false)
    }
  }

  function handleMegaEnter() {
    clearTimeout(megaTimeout.current)
    setMegaOpen(true)
  }

  function handleMegaLeave() {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 200)
  }

  useEffect(() => {
    return () => clearTimeout(megaTimeout.current)
  }, [])

  const navLinks = [
    { href: '/bundels' as const, label: t('bundles') },
    { href: '/over-ons' as const, label: t('aboutUs') },
    { href: '/contact' as const, label: t('contact') },
  ]

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <PawPrint className="w-6 h-6 text-accent-500" />
            <span className="text-xl font-heading font-bold text-charcoal">
              Paws<span className="text-accent-500">NL</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {/* Producten mega menu */}
            <div
              className="relative"
              onMouseEnter={handleMegaEnter}
              onMouseLeave={handleMegaLeave}
              ref={megaRef}
            >
              <Link
                href="/producten"
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-accent-500 transition-colors px-3 py-2 rounded-lg hover:bg-accent-50"
              >
                {t('products')}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${megaOpen ? 'rotate-180' : ''}`} />
              </Link>

              {/* Mega dropdown */}
              <div
                className={`absolute top-full left-0 mt-1 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200 ${
                  megaOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-2 invisible'
                }`}
              >
                <div className="p-2">
                  <Link
                    href="/producten"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-accent-50 hover:text-accent-600 transition-colors"
                    onClick={() => setMegaOpen(false)}
                  >
                    <div className="w-8 h-8 rounded-lg bg-accent-100 flex items-center justify-center">
                      <PawPrint className="w-4 h-4 text-accent-500" />
                    </div>
                    {t('allProducts')}
                  </Link>
                  {CATEGORY_ITEMS.map((cat) => (
                    <a
                      key={cat.slug}
                      href={`/producten?categorie=${cat.slug}`}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 hover:bg-accent-50 hover:text-accent-600 transition-colors"
                      onClick={() => setMegaOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                        <cat.icon className={`w-4 h-4 ${cat.color}`} />
                      </div>
                      {t(cat.labelKey)}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-accent-500 transition-colors px-3 py-2 rounded-lg hover:bg-accent-50"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop search + locale + wishlist + cart */}
          <div className="hidden md:flex items-center gap-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-accent-500 w-44 focus:w-56 transition-all"
              />
            </form>

            <LocaleSwitcher />

            {/* Wishlist */}
            <Link
              href="/verlanglijst"
              className="relative p-2 text-gray-500 hover:text-accent-500 transition-colors"
              aria-label={t('wishlist')}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/winkelwagen"
              className="relative flex items-center gap-1.5 bg-accent-500 text-white py-2 px-4 rounded-xl font-medium text-sm hover:bg-accent-600 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{t('cart')}</span>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center font-bold animate-scale-in">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile: wishlist + cart + hamburger */}
          <div className="flex md:hidden items-center gap-2">
            <LocaleSwitcher />
            <Link href="/verlanglijst" className="relative p-2">
              <Heart className="w-5 h-5 text-gray-700" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>
            <Link href="/winkelwagen" className="relative p-2">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-accent-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-700 hover:text-accent-500 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Free shipping bar (when cart has items) */}
        <FreeShippingBar />
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden border-t border-gray-100 bg-white overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 py-4 space-y-1">
          <form onSubmit={handleSearch} className="relative mb-3">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="input pl-9 text-sm"
            />
          </form>

          {/* Mobile categories with icons */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 pt-2 pb-1">{t('categories')}</p>
          {CATEGORY_ITEMS.map((cat) => (
            <a
              key={cat.slug}
              href={`/producten?categorie=${cat.slug}`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-3 py-2.5 px-4 text-gray-700 hover:text-accent-500 hover:bg-accent-50 rounded-xl transition-colors font-medium"
            >
              <cat.icon className={`w-4 h-4 ${cat.color}`} />
              {t(cat.labelKey)}
            </a>
          ))}

          <hr className="border-gray-100 my-2" />

          <Link
            href="/producten"
            onClick={() => setMenuOpen(false)}
            className="block py-3 px-4 text-gray-700 hover:text-accent-500 hover:bg-accent-50 rounded-xl transition-colors font-medium"
          >
            {t('allProducts')}
          </Link>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-3 px-4 text-gray-700 hover:text-accent-500 hover:bg-accent-50 rounded-xl transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  )
}
