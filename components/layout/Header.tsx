'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ShoppingCart, Menu, X, Search } from 'lucide-react'
import { useCart } from '@/components/cart/CartContext'
import { useRouter } from 'next/navigation'

const navLinks = [
  { href: '/producten', label: 'Producten' },
  { href: '/over-ons', label: 'Over ons' },
  { href: '/contact', label: 'Contact' },
]

export default function Header() {
  const { count } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/producten?zoek=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('')
      setMenuOpen(false)
    }
  }

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span className="text-2xl">🐾</span>
            <span className="text-xl font-bold text-gray-900">
              Paws<span className="text-orange-500">NL</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop search + cart */}
          <div className="hidden md:flex items-center gap-4">
            <form onSubmit={handleSearch} className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Zoeken..."
                className="pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-orange-500 w-44 focus:w-56 transition-all"
              />
            </form>

            <Link
              href="/winkelwagen"
              className="relative flex items-center gap-1.5 bg-orange-500 text-white py-2 px-4 rounded-xl font-medium text-sm hover:bg-orange-600 transition-colors"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Wagen</span>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-gray-900 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile: cart + hamburger */}
          <div className="flex md:hidden items-center gap-3">
            <Link href="/winkelwagen" className="relative p-2">
              <ShoppingCart className="w-5 h-5 text-gray-700" />
              {count > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-orange-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {count > 9 ? '9+' : count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-gray-700 hover:text-orange-500 transition-colors"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-4 space-y-1">
            <form onSubmit={handleSearch} className="relative mb-3">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Zoeken..."
                className="input pl-9 text-sm"
              />
            </form>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block py-3 px-4 text-gray-700 hover:text-orange-500 hover:bg-orange-50 rounded-xl transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
