import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/cart/CartContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import CookieBanner from '@/components/CookieBanner'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://pawsshop.nl'),
  title: {
    default: 'PawsNL – Dierenwinkel voor Jouw Trouwe Vriend',
    template: '%s | PawsNL',
  },
  description:
    'De beste producten voor jouw huisdier. Veilig betalen met iDEAL.',
  keywords: ['dierenwinkel', 'huisdier', 'hond', 'kat', 'PawsNL', 'dierenbenodigdheden', 'hondenproducten', 'kattenspeelgoed'],
  openGraph: {
    title: 'PawsNL – Dierenwinkel voor Jouw Trouwe Vriend',
    description: 'De beste producten voor jouw huisdier. Gratis verzending vanaf €35.',
    type: 'website',
    locale: 'nl_NL',
    url: 'https://pawsshop.nl',
    siteName: 'PawsNL',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PawsNL – Dierenwinkel voor Jouw Trouwe Vriend',
    description: 'De beste producten voor jouw huisdier. Gratis verzending vanaf €35.',
  },
  alternates: {
    canonical: 'https://pawsshop.nl',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${inter.variable} ${poppins.variable}`}>
      <body className={inter.className}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <AnnouncementBar />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CookieBanner />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
