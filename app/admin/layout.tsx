import Link from 'next/link'
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Music, BarChart2, Download, TrendingUp, Shield, Camera, CalendarDays, Video } from 'lucide-react'
import '../[locale]/globals.css'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/analytics', label: 'Analyse', icon: BarChart2 },
  { href: '/admin/importeren', label: 'Importeren', icon: Download },
  { href: '/admin/trending', label: 'Trending', icon: TrendingUp },
  { href: '/admin/quality', label: 'Kwaliteitscheck', icon: Shield },
  { href: '/admin/producten', label: 'Producten', icon: Package },
  { href: '/admin/bestellingen', label: 'Bestellingen', icon: ShoppingCart },
  { href: '/admin/klanten', label: 'Klanten', icon: Users },
  { href: '/admin/tiktok', label: 'TikTok Scripts', icon: Music },
  { href: '/admin/tiktok-pipeline', label: 'Video Pipeline', icon: Video },
  { href: '/admin/tiktok-kalender', label: 'TikTok Kalender', icon: CalendarDays },
  { href: '/admin/foto-studio', label: 'Fotostudio', icon: Camera },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body>
        <div className="min-h-screen bg-gray-50 flex">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-900 text-white flex flex-col fixed inset-y-0 left-0 z-50">
            {/* Logo */}
            <div className="p-6 border-b border-gray-700">
              <Link href="/admin" className="flex items-center gap-2">
                <span className="text-2xl">🐾</span>
                <div>
                  <span className="font-bold text-white">PawsNL</span>
                  <span className="block text-xs text-gray-400">Admin panel</span>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-colors group"
                >
                  <item.icon className="w-5 h-5 group-hover:text-orange-400 transition-colors" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-700">
              <Link
                href="/api/admin/logout"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium text-sm">Uitloggen</span>
              </Link>
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-colors mt-1"
              >
                <span className="text-sm">&larr; Terug naar winkel</span>
              </Link>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 ml-64">
            <main className="p-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  )
}
