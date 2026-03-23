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
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const megaRef = useRef<HTMLDivElement>(null)
  const megaTimeout = useRef<NodeJS.Timeout>()
  const searchInputRef = useRef<HTMLInputElement>(null)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/producten?zoek=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMenuOpen(false)
      setSearchOpen(false)
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

  // Scroll detection for glass effect
  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Focus search input when overlay opens
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [searchOpen])

  const navLinks = [
    { href: '/bundels' as const, label: t('bundles') },
    { href: '/over-ons' as const, label: t('aboutUs') },
    { href: '/contact' as const, label: t('contact') },
  ]

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled ? 'apple-glass' : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-[980px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between" style={{ height: '44px' }}>
            {/* Logo */}
            <Link href="/" className="flex items-center flex-shrink-0">
              <span className="text-[14px] font-semibold tracking-[-0.01em]" style={{ color: '#1d1d1f' }}>
                PawsNL
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-0">
              {/* Producten mega menu */}
              <div
                className="relative"
                onMouseEnter={handleMegaEnter}
                onMouseLeave={handleMegaLeave}
                ref={megaRef}
              >
                <Link
                  href="/producten"
                  className="flex items-center gap-0.5 px-3 py-1 transition-colors duration-300"
                  style={{ fontSize: '12px', fontWeight: 400, color: '#1d1d1f' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#424245')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#1d1d1f')}
                >
                  {t('products')}
                  <ChevronDown className={`w-2.5 h-2.5 transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`} />
                </Link>

                {/* Mega dropdown — Apple glass style */}
                <div
                  className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 apple-glass-dropdown rounded-xl shadow-lg overflow-hidden transition-all duration-200 ${
                    megaOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-1 invisible'
                  }`}
                  style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                >
                  <div className="py-1">
                    <Link
                      href="/producten"
                      className="block px-4 py-2 transition-colors duration-200"
                      style={{ fontSize: '12px', fontWeight: 400, color: '#1d1d1f' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#424245'
                        e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = '#1d1d1f'
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                      onClick={() => setMegaOpen(false)}
                    >
                      {t('allProducts')}
                    </Link>
                    {CATEGORY_ITEMS.map((cat) => (
                      <a
                        key={cat.slug}
                        href={`/producten?categorie=${cat.slug}`}
                        className="block px-4 py-2 transition-colors duration-200"
                        style={{ fontSize: '12px', fontWeight: 400, color: '#1d1d1f' }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = '#424245'
                          e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.04)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = '#1d1d1f'
                          e.currentTarget.style.backgroundColor = 'transparent'
                        }}
                        onClick={() => setMegaOpen(false)}
                      >
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
                  className="px-3 py-1 transition-colors duration-300"
                  style={{ fontSize: '12px', fontWeight: 400, color: '#1d1d1f' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#424245')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = '#1d1d1f')}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop: search icon + locale + wishlist + cart */}
            <div className="hidden md:flex items-center gap-3">
              {/* Search icon — opens overlay */}
              <button
                onClick={() => setSearchOpen(true)}
                className="transition-colors duration-300 p-0.5"
                style={{ color: '#1d1d1f' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#424245')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#1d1d1f')}
                aria-label={t('searchPlaceholder')}
              >
                <Search style={{ width: '15px', height: '15px' }} />
              </button>

              <LocaleSwitcher />

              {/* Wishlist */}
              <Link
                href="/verlanglijst"
                className="relative transition-colors duration-300 p-0.5"
                style={{ color: '#1d1d1f' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#424245')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#1d1d1f')}
                aria-label={t('wishlist')}
              >
                <Heart style={{ width: '15px', height: '15px' }} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#1d1d1f] text-white text-[9px] rounded-full flex items-center justify-center font-medium leading-none">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                href="/winkelwagen"
                className="relative transition-colors duration-300 p-0.5"
                style={{ color: '#1d1d1f' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#424245')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#1d1d1f')}
                aria-label={t('cart')}
              >
                <ShoppingCart style={{ width: '15px', height: '15px' }} />
                {count > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-[#1d1d1f] text-white text-[9px] rounded-full flex items-center justify-center font-medium leading-none animate-scale-in">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </Link>
            </div>

            {/* Mobile: search + locale + wishlist + cart + hamburger */}
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 transition-colors duration-300"
                style={{ color: '#1d1d1f' }}
                aria-label={t('searchPlaceholder')}
              >
                <Search style={{ width: '15px', height: '15px' }} />
              </button>

              <LocaleSwitcher />

              <Link href="/verlanglijst" className="relative p-2" style={{ color: '#1d1d1f' }}>
                <Heart style={{ width: '17px', height: '17px' }} />
                {wishlistCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-[#1d1d1f] text-white text-[9px] rounded-full flex items-center justify-center font-medium leading-none">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              <Link href="/winkelwagen" className="relative p-2" style={{ color: '#1d1d1f' }}>
                <ShoppingCart style={{ width: '17px', height: '17px' }} />
                {count > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-[#1d1d1f] text-white text-[9px] rounded-full flex items-center justify-center font-medium leading-none">
                    {count > 9 ? '9+' : count}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 transition-colors duration-300"
                style={{ color: '#1d1d1f' }}
              >
                {menuOpen ? <X style={{ width: '17px', height: '17px' }} /> : <Menu style={{ width: '17px', height: '17px' }} />}
              </button>
            </div>
          </div>

          {/* Free shipping bar (when cart has items) */}
          <FreeShippingBar />
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            menuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
          } ${scrolled ? 'apple-glass-dropdown' : 'bg-white/80 backdrop-blur-xl'}`}
          style={{ borderTop: menuOpen ? '1px solid rgba(0,0,0,0.08)' : 'none' }}
        >
          <div className="px-6 py-5 space-y-0.5 max-w-[980px] mx-auto">
            {/* Mobile categories */}
            <p
              className="uppercase tracking-widest pb-2 pt-1"
              style={{ fontSize: '10px', fontWeight: 600, color: '#86868b' }}
            >
              {t('categories')}
            </p>
            {CATEGORY_ITEMS.map((cat) => (
              <a
                key={cat.slug}
                href={`/producten?categorie=${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-1 transition-colors duration-200"
                style={{ fontSize: '14px', fontWeight: 400, color: '#1d1d1f' }}
              >
                {t(cat.labelKey)}
              </a>
            ))}

            <div className="my-3" style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }} />

            <Link
              href="/producten"
              onClick={() => setMenuOpen(false)}
              className="block py-2 px-1 transition-colors duration-200"
              style={{ fontSize: '14px', fontWeight: 400, color: '#1d1d1f' }}
            >
              {t('allProducts')}
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-2 px-1 transition-colors duration-200"
                style={{ fontSize: '14px', fontWeight: 400, color: '#1d1d1f' }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Search overlay — Apple style */}
      <div
        className={`fixed inset-0 z-50 transition-all duration-300 ${
          searchOpen ? 'visible opacity-100' : 'invisible opacity-0'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          onClick={() => {
            setSearchOpen(false)
            setSearchQuery('')
          }}
        />
        {/* Search bar */}
        <div className="relative apple-glass-dropdown" style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <div className="max-w-[680px] mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <Search style={{ width: '17px', height: '17px', color: '#86868b', flexShrink: 0 }} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="flex-1 bg-transparent border-none outline-none"
                style={{ fontSize: '17px', fontWeight: 400, color: '#1d1d1f' }}
              />
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(false)
                  setSearchQuery('')
                }}
                className="transition-colors duration-200 p-1"
                style={{ color: '#86868b' }}
              >
                <X style={{ width: '17px', height: '17px' }} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}
