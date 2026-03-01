import { Heart, Package, Star, Users } from 'lucide-react'

export const metadata = {
  title: 'Over Ons | PawsShop.nl',
  description: 'Leer meer over PawsShop.nl en onze passie voor huisdieren.',
}

const stats = [
  { label: 'Tevreden klanten', value: '250+', icon: Users },
  { label: 'Producten', value: '20+', icon: Package },
  { label: 'Gemiddelde beoordeling', value: '4.9 ★', icon: Star },
  { label: 'Categorieën', value: '4', icon: Heart },
]

const team = [
  {
    name: 'Sophie de Vries',
    role: 'Oprichter & CEO',
    bio: 'Hondenliefhebber en ondernemer met een passie voor dierenwelzijn.',
    emoji: '👩‍💼',
  },
  {
    name: 'Mark Jansen',
    role: 'Productspecialist',
    bio: 'Veterinaire achtergrond, zorgt voor kwaliteitscontrole van elk product.',
    emoji: '👨‍⚕️',
  },
  {
    name: 'Lisa Bakker',
    role: 'Klantenservice',
    bio: 'Altijd klaar om je te helpen met al je vragen en zorgen.',
    emoji: '👩‍💻',
  },
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
            PawsNL is opgericht door dierenliefhebbers, voor dierenliefhebbers. Wij selecteren
            zorgvuldig de beste producten zodat jouw trouwe vriend altijd het beste krijgt.
          </p>
        </div>
      </section>

      {/* Stats */}
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

      {/* Verhaal */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">Ons verhaal</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  PawsNL begon in 2019 als een klein project van Sophie de Vries, een echte
                  hondenliefhebber die gefrustreerd was door het gebrek aan kwalitatieve
                  huisdierproducten in Nederland.
                </p>
                <p>
                  Wat begon als een persoonlijke zoektocht naar de beste producten voor haar
                  golden retriever Max, groeide uit tot een volledig assortiment dat nu duizenden
                  huisdierbezitters in Nederland bedient.
                </p>
                <p>
                  Elk product dat we verkopen is persoonlijk getest en goedgekeurd door ons team.
                  Wij geloven dat jouw huisdier alleen het beste verdient.
                </p>
              </div>
            </div>
            <div className="bg-orange-50 rounded-3xl p-8 text-center">
              <p className="text-8xl mb-4">🐾</p>
              <blockquote className="text-lg italic text-gray-700">
                &ldquo;Een gelukkig huisdier maakt een gelukkig gezin.&rdquo;
              </blockquote>
              <p className="text-sm text-gray-500 mt-3">– Sophie de Vries, oprichter</p>
            </div>
          </div>
        </div>
      </section>

      {/* Waarden */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Onze waarden</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: '💚',
                title: 'Duurzaamheid',
                text: 'We kiezen bewust voor milieuvriendelijke verpakkingen en werken samen met leveranciers die duurzaamheid hoog in het vaandel dragen.',
              },
              {
                emoji: '🔬',
                title: 'Kwaliteit',
                text: 'Elk product wordt grondig gecontroleerd voordat het in ons assortiment komt. Geen compromissen als het gaat om de gezondheid van jouw huisdier.',
              },
              {
                emoji: '❤️',
                title: 'Dierwelzijn',
                text: 'We steunen lokale dierenasielprojecten en doneren een percentage van elke verkoop aan dierenwelzijnsorganisaties.',
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

      {/* Team */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Ons team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="card p-6 text-center">
                <div className="text-5xl mb-4">{member.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900">{member.name}</h3>
                <p className="text-orange-500 text-sm font-medium mb-3">{member.role}</p>
                <p className="text-gray-500 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-orange-500 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Klaar om te beginnen?</h2>
        <p className="text-orange-100 mb-8 max-w-md mx-auto">
          Ontdek ons assortiment en geef jouw huisdier het beste dat hij verdient.
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
