'use client'

import { CheckCircle, Tag, Heart } from 'lucide-react'
import { useInView } from '@/hooks/useInView'

const reasons = [
  {
    icon: CheckCircle,
    title: 'Zorgvuldig Geselecteerd',
    description:
      'Elk product wordt door ons team getest en beoordeeld voordat het in de shop komt.',
  },
  {
    icon: Tag,
    title: 'Altijd Eerlijke Prijzen',
    description:
      'Topkwaliteit hoeft niet duur te zijn. Wij bieden de beste prijs-kwaliteitverhouding.',
  },
  {
    icon: Heart,
    title: 'Persoonlijke Klantenservice',
    description:
      'Vragen of problemen? Ons team staat altijd voor je klaar met een echt antwoord.',
  },
]

export default function WhyPawsNL() {
  const { ref, isInView } = useInView({ threshold: 0.2 })

  return (
    <section ref={ref} className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl font-bold text-charcoal mb-2">Waarom PawsNL?</h2>
          <p className="text-gray-500">Daarom kiezen duizenden dierenliefhebbers voor ons</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reasons.map((reason, i) => (
            <div
              key={reason.title}
              className={`text-center ${isInView ? `animate-scale-in stagger-${i + 2}` : 'opacity-0'}`}
            >
              <div className="w-14 h-14 bg-accent-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <reason.icon className="w-7 h-7 text-accent-500" />
              </div>
              <h3 className="text-lg font-semibold text-charcoal mb-2">{reason.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{reason.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
