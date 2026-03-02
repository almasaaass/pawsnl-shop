'use client'

import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react'
import { useInView } from '@/hooks/useInView'

const badges = [
  {
    icon: ShieldCheck,
    title: '100% Blij-Dier Garantie',
    subtitle: 'Niet blij? Geld terug.',
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
  const { ref, isInView } = useInView({ threshold: 0.2 })

  return (
    <section ref={ref} className="bg-white border-y border-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, i) => (
            <div
              key={badge.title}
              className={`flex items-center gap-3 py-2 px-3 rounded-xl transition-colors hover:bg-trust-50 ${
                isInView ? `animate-fade-in-up stagger-${i + 1}` : 'opacity-0'
              }`}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-trust-100">
                <badge.icon className="w-5 h-5 text-trust-600" />
              </div>
              <div>
                <p className="font-semibold text-sm text-charcoal">
                  {badge.title}
                </p>
                <p className="text-xs text-gray-500">
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
