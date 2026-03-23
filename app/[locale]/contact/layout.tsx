import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | PawsNL',
  description: 'Neem contact op met PawsNL. Wij helpen je graag met vragen over bestellingen, producten of retourzendingen. Bereikbaar via email, telefoon en contactformulier.',
  alternates: {
    canonical: 'https://pawsnlshop.com/contact',
    languages: {
      nl: 'https://pawsnlshop.com/contact',
      en: 'https://pawsnlshop.com/en/contact',
    },
  },
  openGraph: {
    title: 'Contact | PawsNL',
    description: 'Neem contact op met PawsNL. Wij helpen je graag met vragen over bestellingen, producten of retourzendingen.',
    type: 'website',
    locale: 'nl_NL',
  },
}

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
