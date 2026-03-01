import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { CartProvider } from '@/components/cart/CartContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    default: 'PawsNL – Dierenwinkel voor Jouw Trouwe Vriend',
    template: '%s | PawsNL',
  },
  description:
    'De beste producten voor jouw huisdier. Gratis verzending vanaf €35. 30 dagen retour. Veilig betalen.',
  keywords: ['dierenwinkel', 'huisdier', 'hond', 'kat', 'PawsNL', 'dierenbenodigdheden'],
  openGraph: {
    title: 'PawsNL – Dierenwinkel voor Jouw Trouwe Vriend',
    description: 'De beste producten voor jouw huisdier. Gratis verzending vanaf €35.',
    type: 'website',
    locale: 'nl_NL',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className={inter.className}>
        <CartProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </body>
    </html>
  )
}
