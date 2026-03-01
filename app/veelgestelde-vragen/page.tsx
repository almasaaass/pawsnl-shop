'use client'

import { useState } from 'react'
import { ChevronDown, ShoppingCart, Truck, RotateCcw, CreditCard, Package, Mail } from 'lucide-react'

const categories = [
  {
    name: 'Bestellen',
    icon: ShoppingCart,
    faqs: [
      {
        question: 'Hoe plaats ik een bestelling?',
        answer:
          'Bestellen bij PawsShop is heel eenvoudig! Kies de producten die je wilt, voeg ze toe aan je winkelwagen en ga naar de checkout. Vul je gegevens in, kies een betaalmethode en rond je bestelling af. Je ontvangt direct een bevestigingsmail.',
      },
      {
        question: 'Kan ik mijn bestelling annuleren?',
        answer:
          'Ja, dat kan! Neem binnen 24 uur na het plaatsen van je bestelling contact met ons op via info@pawsshop.nl. We annuleren je bestelling en je ontvangt het volledige bedrag terug. Na 24 uur is de bestelling mogelijk al in verwerking en kan annuleren helaas niet meer.',
      },
    ],
  },
  {
    name: 'Verzending',
    icon: Truck,
    faqs: [
      {
        question: 'Hoe lang duurt de levering?',
        answer:
          'De levertijd bedraagt gemiddeld 5 tot 12 werkdagen. Onze producten worden verzonden vanuit een internationaal magazijn, waardoor de levertijd iets langer kan zijn dan bij lokale winkels. We doen er alles aan om je bestelling zo snel mogelijk te bezorgen.',
      },
      {
        question: 'Hoeveel kost de verzending?',
        answer:
          'Bij bestellingen vanaf \u20ac35 is de verzending helemaal gratis! Voor bestellingen onder de \u20ac35 betaal je slechts \u20ac4,95 verzendkosten.',
      },
      {
        question: 'Kan ik mijn bestelling volgen?',
        answer:
          'Ja, zodra je bestelling is verzonden ontvang je automatisch een e-mail met een track & trace code. Hiermee kun je de status van je pakket op elk moment volgen.',
      },
    ],
  },
  {
    name: 'Retourneren',
    icon: RotateCcw,
    faqs: [
      {
        question: 'Hoe retourneer ik een product?',
        answer:
          'Je kunt een product binnen 30 dagen na ontvangst retourneren. Neem contact met ons op via info@pawsshop.nl met je bestelnummer en de reden van retour. Wij sturen je vervolgens de retourinstructies toe.',
      },
      {
        question: 'Wanneer krijg ik mijn geld terug na een retour?',
        answer:
          'Nadat wij je retour hebben ontvangen en gecontroleerd, wordt het bedrag binnen 5 tot 7 werkdagen teruggestort op je rekening via dezelfde betaalmethode als waarmee je hebt betaald.',
      },
    ],
  },
  {
    name: 'Betalen',
    icon: CreditCard,
    faqs: [
      {
        question: 'Welke betaalmethoden accepteren jullie?',
        answer:
          'We accepteren iDEAL, creditcard (Visa, Mastercard) en Bancontact. Zo kun je altijd op een manier betalen die bij je past.',
      },
      {
        question: 'Is betalen bij PawsShop veilig?',
        answer:
          'Absoluut! Alle betalingen worden verwerkt via Stripe, een van de meest betrouwbare betaalplatformen ter wereld. Je gegevens worden beschermd met SSL-encryptie en we slaan nooit je betaalgegevens op.',
      },
    ],
  },
  {
    name: 'Producten',
    icon: Package,
    faqs: [
      {
        question: 'Zijn de producten veilig voor mijn huisdier?',
        answer:
          'Ja, alle producten in ons assortiment worden zorgvuldig gecontroleerd op kwaliteit en veiligheid. Ons team beoordeelt elk product voordat het in de webshop komt, zodat jij met een gerust hart kunt bestellen.',
      },
      {
        question: 'Waar komen de producten vandaan?',
        answer:
          'Onze producten komen van geselecteerde internationale leveranciers. Ons team voert kwaliteitscontroles uit om ervoor te zorgen dat elk product aan onze hoge standaarden voldoet.',
      },
      {
        question: 'Hoe neem ik contact op met PawsShop?',
        answer:
          'Je kunt ons bereiken via e-mail op info@pawsshop.nl of via het contactformulier op onze website. We reageren doorgaans binnen 24 uur op werkdagen.',
      },
    ],
  },
]

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="px-5 pb-5 text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

export default function VeelgesteldeVragenPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-3">
            FAQ
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Veelgestelde <span className="text-orange-500">Vragen</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Vind snel antwoord op de meest gestelde vragen over bestellen, verzending,
            retourneren en meer.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          {categories.map((category) => (
            <div key={category.name}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
              </div>
              <div className="space-y-3">
                {category.faqs.map((faq) => (
                  <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <Mail className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Staat je vraag er niet tussen?
          </h2>
          <p className="text-gray-600 mb-6">
            Neem gerust contact met ons op. We helpen je graag verder!
          </p>
          <a
            href="/contact"
            className="bg-orange-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-orange-600 transition-colors inline-block"
          >
            Neem contact op
          </a>
        </div>
      </section>
    </div>
  )
}
