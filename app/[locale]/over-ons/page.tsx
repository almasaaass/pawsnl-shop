import { Heart, Package, Star, Users } from 'lucide-react'

export const metadata = {
  title: 'Over Ons | PawsNL',
  description: 'Leer meer over PawsNL en onze passie voor dieren.',
}

const stats = [
  { label: 'Producten', value: '30+', icon: Package },
  { label: 'Categorieën', value: '4', icon: Heart },
  { label: 'Retour', value: '30 dagen', icon: Star },
  { label: 'Verzending', value: 'Gratis €35+', icon: Users },
]

export default function OverOnsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-3">
            Over PawsNL
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Wij geloven in een <span className="text-orange-500">gelukkig huisdier</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            PawsNL is opgericht door dierenliefhebbers, voor dierenliefhebbers. We selecteren zorgvuldig
            de beste producten zodat jouw trouwe vriend altijd het beste krijgt.
          </p>
        </div>
      </section>

      {/* Statistieken */}
      <section className="py-12 px-4 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ons verhaal */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">Ons verhaal</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  PawsNL is ontstaan vanuit een simpele frustratie: waarom is het zo moeilijk om goede,
                  betaalbare dierenproducten te vinden in Nederland en België? Overal dezelfde producten
                  voor hoge prijzen — terwijl er internationaal zoveel meer keuze is.
                </p>
                <p>
                  Daarom richtten we PawsNL op. We zoeken wereldwijd naar de beste producten voor
                  honden, katten en kleine huisdieren. Elk product wordt zorgvuldig geselecteerd op
                  kwaliteit, veiligheid en prijs-kwaliteitverhouding.
                </p>
                <p>
                  Als Nederlandse webshop blijven we dicht bij onze klanten. Een vraag? Je krijgt
                  altijd een persoonlijk antwoord — geen chatbot, geen wachtrij.
                </p>
              </div>
            </div>
            <div className="bg-orange-50 rounded-3xl p-8 text-center">
              <p className="text-8xl mb-4">🐾</p>
              <blockquote className="text-lg italic text-gray-700">
                &ldquo;Een gelukkig huisdier maakt een gelukkig thuis.&rdquo;
              </blockquote>
              <p className="text-sm text-gray-500 mt-3">– Team PawsNL</p>
            </div>
          </div>
        </div>
      </section>

      {/* Onze waarden */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Onze waarden</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: '💚',
                title: 'Duurzaamheid',
                text: 'We kiezen bewust voor milieuvriendelijke verpakkingen en werken met leveranciers die duurzaamheid vooropstellen.',
              },
              {
                emoji: '🔬',
                title: 'Kwaliteit',
                text: 'Elk product wordt grondig gecontroleerd voordat het ons assortiment inkomt. Geen compromissen als het gaat om de gezondheid van jouw huisdier.',
              },
              {
                emoji: '❤️',
                title: 'Dierenwelzijn',
                text: 'We ondersteunen lokale dierenopvangprojecten en doneren een percentage van elke verkoop aan dierenwelzijnsorganisaties.',
              },
            ].map((value) => (
              <div key={value.title} className="card p-6 text-center">
                <div className="text-4xl mb-4">{value.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waarom PawsNL */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Waarom PawsNL?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: '🔍', title: 'Zorgvuldig geselecteerd', text: 'We testen en controleren elk product voordat het in de winkel komt. Geen rommel, alleen kwaliteit.' },
              { emoji: '💰', title: 'Eerlijke prijzen', text: 'Geen opgeblazen prijzen. We kopen direct bij leveranciers en geven de besparing aan jou door.' },
              { emoji: '📦', title: 'Gratis verzending', text: 'Bestellingen boven €35 worden gratis verzonden. Geleverd binnen 7-14 werkdagen met track & trace.' },
            ].map((item) => (
              <div key={item.title} className="card p-6 text-center">
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-orange-500 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Klaar om te beginnen?</h2>
        <p className="text-orange-100 mb-8 max-w-md mx-auto">
          Ontdek ons assortiment en geef jouw huisdier het beste wat het verdient.
        </p>
        <a
          href="/producten"
          className="bg-white text-orange-500 font-bold py-3 px-8 rounded-xl hover:bg-orange-50 transition-colors inline-block"
        >
          Bekijk producten
        </a>
      </section>
    </div>
  )
}
