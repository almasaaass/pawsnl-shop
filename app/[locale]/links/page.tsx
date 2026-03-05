import Link from 'next/link'
import { PawPrint, ShoppingBag, Gift, BookOpen, Instagram, Mail } from 'lucide-react'

export const metadata = {
  title: 'PawsNL Links',
  description: 'Alle links van PawsNL op één plek.',
}

const links = [
  {
    href: '/producten',
    icon: ShoppingBag,
    label: 'Shop alle producten',
    description: 'Ontdek ons assortiment',
    color: 'bg-accent-500 hover:bg-accent-600',
    utm: '?utm_source=tiktok&utm_medium=bio&utm_campaign=linktree',
  },
  {
    href: '/bundels',
    icon: Gift,
    label: 'Bundels — Bespaar 15%',
    description: 'Samengestelde pakketten',
    color: 'bg-orange-500 hover:bg-orange-600',
    utm: '?utm_source=tiktok&utm_medium=bio&utm_campaign=bundels',
  },
  {
    href: '/producten?categorie=honden',
    icon: PawPrint,
    label: 'Hondenproducten',
    description: 'Alles voor je hond',
    color: 'bg-amber-500 hover:bg-amber-600',
    utm: '&utm_source=tiktok&utm_medium=bio',
  },
  {
    href: '/producten?categorie=katten',
    icon: PawPrint,
    label: 'Kattenproducten',
    description: 'Alles voor je kat',
    color: 'bg-pink-500 hover:bg-pink-600',
    utm: '&utm_source=tiktok&utm_medium=bio',
  },
]

export default function LinksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-warm-50">
      <div className="max-w-md mx-auto px-4 py-12">
        {/* Profile */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <PawPrint className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-charcoal">PawsNL</h1>
          <p className="text-gray-500 text-sm mt-1">
            De leukste producten voor jouw huisdier 🐾
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Gratis verzending vanaf €35 | 30 dagen retour
          </p>
        </div>

        {/* Links */}
        <div className="space-y-3">
          {links.map((link) => (
            <Link
              key={link.href}
              href={`${link.href}${link.utm}`}
              className={`${link.color} text-white rounded-2xl p-4 flex items-center gap-4 transition-all transform hover:scale-[1.02] active:scale-95 shadow-sm`}
            >
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <link.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">{link.label}</p>
                <p className="text-sm opacity-80">{link.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="text-xs text-gray-400">
            pawsnlshop.com — Dierenproducten voor Nederland & België
          </p>
        </div>
      </div>
    </div>
  )
}
