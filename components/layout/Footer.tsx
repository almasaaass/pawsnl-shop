import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'

const shopLinks = [
  { href: '/producten', label: 'Alle producten' },
  { href: '/producten?categorie=honden', label: 'Honden' },
  { href: '/producten?categorie=katten', label: 'Katten' },
  { href: '/producten?categorie=vogels', label: 'Vogels' },
  { href: '/producten?categorie=knaagdieren', label: 'Knaagdieren' },
]

const serviceLinks = [
  { href: '/contact', label: 'Contact' },
  { href: '/over-ons', label: 'Over ons' },
  { href: '/veelgestelde-vragen', label: 'Veelgestelde vragen' },
  { href: '/retourbeleid', label: 'Retourneren' },
  { href: '/verzendbeleid', label: 'Bezorging & verzending' },
]

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🐾</span>
              <span className="text-xl font-bold text-white">
                Paws<span className="text-orange-400">NL</span>
              </span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed mb-5">
              De beste producten voor jouw huisdier. Betrouwbaar, snel en voordelig bezorgd.
            </p>
            {/* Contact info */}
            <div className="space-y-2">
              <a href="mailto:info@pawsshop.nl" className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors">
                <Mail className="w-4 h-4" />
                info@pawsshop.nl
              </a>
              <a href="tel:+31201234567" className="flex items-center gap-2 text-sm text-gray-400 hover:text-orange-400 transition-colors">
                <Phone className="w-4 h-4" />
                020 - 123 45 67
              </a>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="w-4 h-4" />
                Amsterdam, Nederland
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold text-white mb-4">Winkel</h3>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Klantenservice */}
          <div>
            <h3 className="font-semibold text-white mb-4">Klantenservice</h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-orange-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Vertrouwen */}
          <div>
            <h3 className="font-semibold text-white mb-4">Ons belofte</h3>
            <div className="space-y-3">
              {[
                { emoji: '🚚', text: 'Gratis verzending vanaf €35' },
                { emoji: '↩️', text: '30 dagen retourrecht' },
                { emoji: '🔒', text: 'Veilig betalen via Stripe' },
                { emoji: '⭐', text: '4.8/5 klanttevredenheid' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-sm text-gray-400">
                  <span>{item.emoji}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Betaalmethoden */}
            <div className="mt-5">
              <p className="text-xs text-gray-500 mb-2">Betaalmethoden</p>
              <div className="flex flex-wrap gap-2">
                {['iDEAL', 'Visa', 'Mastercard', 'Bancontact', 'PayPal'].map((method) => (
                  <span
                    key={method}
                    className="text-xs bg-gray-800 text-gray-400 px-2 py-1 rounded font-medium"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div className="flex flex-col md:flex-row gap-1 md:gap-4 text-center">
            <span>© {new Date().getFullYear()} PawsNL. Alle rechten voorbehouden.</span>
            <span className="hidden md:block">|</span>
            <span>KvK: 94028374 · BTW: NL004738291B01</span>
          </div>
          <div className="flex gap-4">
            <Link href="/privacybeleid" className="hover:text-orange-400 transition-colors">Privacybeleid</Link>
            <Link href="/algemene-voorwaarden" className="hover:text-orange-400 transition-colors">Algemene voorwaarden</Link>
            <Link href="/privacybeleid#cookies" className="hover:text-orange-400 transition-colors">Cookiebeleid</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
