import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react'

const badges = [
  {
    icon: ShieldCheck,
    title: '100% Blij-Dier Garantie',
    subtitle: 'Niet blij? Geld terug.',
    highlight: true,
  },
  {
    icon: Truck,
    title: 'Gratis verzending',
    subtitle: 'Bij bestellingen vanaf €35',
  },
  {
    icon: RotateCcw,
    title: '30 dagen retour',
    subtitle: 'Geen vragen, geen gedoe.',
  },
  {
    icon: Headphones,
    title: 'Persoonlijke service',
    subtitle: 'Altijd een echt antwoord',
  },
]

export default function TrustBadges() {
  return (
    <section className="bg-white border-y border-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.title}
              className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-colors ${
                badge.highlight
                  ? 'bg-emerald-50 border border-emerald-200'
                  : 'hover:bg-orange-50'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                badge.highlight ? 'bg-emerald-100' : 'bg-orange-100'
              }`}>
                <badge.icon className={`w-5 h-5 ${badge.highlight ? 'text-emerald-600' : 'text-orange-500'}`} />
              </div>
              <div>
                <p className={`font-semibold text-sm ${badge.highlight ? 'text-emerald-800' : 'text-gray-900'}`}>
                  {badge.title}
                </p>
                <p className={`text-xs ${badge.highlight ? 'text-emerald-600' : 'text-gray-500'}`}>
                  {badge.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
