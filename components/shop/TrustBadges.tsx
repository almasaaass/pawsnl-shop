import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react'

const badges = [
  {
    icon: Truck,
    title: 'Gratis verzending',
    subtitle: 'Bij bestellingen vanaf €35',
  },
  {
    icon: RotateCcw,
    title: '30 dagen retour',
    subtitle: 'Niet tevreden? Geld terug.',
  },
  {
    icon: ShieldCheck,
    title: 'Veilig betalen',
    subtitle: 'iDEAL, Visa, Mastercard',
  },
  {
    icon: Headphones,
    title: 'Klantenservice',
    subtitle: 'Ma–Za 09:00–17:00',
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
              className="flex items-center gap-3 py-2 px-3 rounded-xl hover:bg-orange-50 transition-colors"
            >
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <badge.icon className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{badge.title}</p>
                <p className="text-xs text-gray-500">{badge.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
