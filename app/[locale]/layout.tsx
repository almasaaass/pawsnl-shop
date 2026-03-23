import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import './globals.css'
import { CartProvider } from '@/components/cart/CartContext'
import { WishlistProvider } from '@/components/shop/WishlistContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import AnnouncementBar from '@/components/layout/AnnouncementBar'
import CookieBanner from '@/components/CookieBanner'
import PurchaseNotification from '@/components/shop/PurchaseNotification'
import TikTokPixel from '@/components/TikTokPixel'
import MetaPixel from '@/components/MetaPixel'
import ExitIntentPopup from '@/components/shop/ExitIntentPopup'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
  variable: '--font-poppins',
})

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string }
}): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === 'en'

  return {
    metadataBase: new URL('https://pawsnlshop.com'),
    title: {
      default: isEn
        ? 'PawsNL – Pet Products for Dogs & Cats | Free Shipping over £30'
        : 'PawsNL – Dierenproducten voor Hond & Kat | Gratis verzending vanaf €35',
      template: '%s | PawsNL',
    },
    description: isEn
      ? 'The best products for your pet. Toys, accessories & grooming for dogs and cats. Free shipping over £30. Fast delivery to UK & Australia.'
      : 'De leukste producten voor jouw huisdier. Speelgoed, accessoires & verzorging voor honden en katten. Gratis verzending vanaf €35. Snelle levering in Nederland & België.',
    keywords: isEn
      ? ['pet shop', 'dog products', 'cat products', 'pet toys', 'pet accessories', 'PawsNL', 'UK', 'Australia']
      : ['dierenwinkel', 'hondenproducten', 'kattenproducten', 'huisdier speelgoed', 'dierenproducten', 'PawsNL', 'Nederland', 'België'],
    openGraph: {
      title: isEn
        ? 'PawsNL – Pet Products for Dogs & Cats'
        : 'PawsNL – Dierenproducten voor Hond & Kat',
      description: isEn
        ? 'The best products for your pet. Free shipping over £30 to UK & Australia.'
        : 'De leukste producten voor jouw huisdier. Gratis verzending vanaf €35 in Nederland & België.',
      type: 'website',
      locale: isEn ? 'en_GB' : 'nl_NL',
      url: isEn ? 'https://pawsnlshop.com/en' : 'https://pawsnlshop.com',
      siteName: 'PawsNL',
    },
    twitter: {
      card: 'summary_large_image',
      title: isEn
        ? 'PawsNL – Pet Products for Dogs & Cats'
        : 'PawsNL – Dierenproducten voor Hond & Kat',
      description: isEn
        ? 'The best products for your pet. Free shipping over £30 to UK & Australia.'
        : 'De leukste producten voor jouw huisdier. Gratis verzending vanaf €35 in Nederland & België.',
    },
    alternates: {
      canonical: isEn ? 'https://pawsnlshop.com/en' : 'https://pawsnlshop.com',
      languages: {
        nl: 'https://pawsnlshop.com',
        en: 'https://pawsnlshop.com/en',
      },
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className={`${inter.variable} ${poppins.variable}`}>
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'PetStore',
              name: 'PawsNL',
              url: 'https://pawsnlshop.com',
              logo: 'https://pawsnlshop.com/logo-pawsnl.svg',
              description: 'Online dierenwinkel voor honden, katten en andere huisdieren. Speelgoed, accessoires & verzorging.',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Weverstraat 227',
                addressLocality: 'Gorinchem',
                postalCode: '4204CB',
                addressCountry: 'NL',
              },
              telephone: '+31681473561',
              email: 'info@pawsnlshop.com',
              priceRange: '€€',
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
                opens: '00:00',
                closes: '23:59',
              },
              sameAs: [],
            }),
          }}
        />
        <NextIntlClientProvider messages={messages}>
          <CartProvider>
            <WishlistProvider>
              <div className="min-h-screen flex flex-col">
                <AnnouncementBar />
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
                <CookieBanner />
                <PurchaseNotification />
                <TikTokPixel />
                <MetaPixel />
                <ExitIntentPopup />
              </div>
            </WishlistProvider>
          </CartProvider>
        </NextIntlClientProvider>
        {/* Tawk.to Live Chat */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
              (function(){
                var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
                s1.async=true;
                s1.src='https://embed.tawk.to/69a87acd9f47f71c33c64d73/1jit1vd06';
                s1.charset='UTF-8';
                s1.setAttribute('crossorigin','*');
                s0.parentNode.insertBefore(s1,s0);
              })();
            `,
          }}
        />
      </body>
    </html>
  )
}
