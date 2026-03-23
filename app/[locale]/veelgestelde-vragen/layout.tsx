import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Veelgestelde Vragen | PawsNL',
  description: 'Antwoorden op veelgestelde vragen over bestellen, verzending, retourneren, betaalmethoden en producten bij PawsNL.',
  alternates: {
    canonical: 'https://pawsnlshop.com/veelgestelde-vragen',
    languages: {
      nl: 'https://pawsnlshop.com/veelgestelde-vragen',
      en: 'https://pawsnlshop.com/en/faq',
    },
  },
}

const faqItems = [
  {
    question: 'Hoe plaats ik een bestelling?',
    answer: 'Bestellen bij PawsNL is heel eenvoudig! Kies de producten die je wilt, voeg ze toe aan je winkelwagen en ga naar de kassa. Vul je gegevens in, kies een betaalmethode en bevestig je bestelling. Je ontvangt direct een bevestigingsmail.',
  },
  {
    question: 'Hoe lang duurt de levering?',
    answer: 'De levering duurt gemiddeld 7 tot 14 werkdagen in Nederland en België. Onze producten worden verzonden vanuit een internationaal magazijn.',
  },
  {
    question: 'Hoe retourneer ik een product?',
    answer: 'Je kunt een product binnen 30 dagen na ontvangst retourneren. Neem contact op via info@pawsnlshop.com met je bestelnummer en de reden voor de retour.',
  },
  {
    question: 'Welke betaalmethoden accepteren jullie?',
    answer: 'We accepteren iDEAL, Bancontact, Visa, Mastercard, Klarna, Apple Pay en Google Pay.',
  },
  {
    question: 'Zijn de producten veilig voor mijn huisdier?',
    answer: 'Ja, alle producten in ons assortiment worden zorgvuldig gecontroleerd op kwaliteit en veiligheid.',
  },
]

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
}

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {children}
    </>
  )
}
