'use client'

import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react'
import ScrollReveal from '@/components/ui/ScrollReveal'

const badges = [
  {
    icon: ShieldCheck,
    title: '100% Blij Huisdier Garantie',
    subtitle: 'Niet tevreden? Geld terug.',
  },
  {
    icon: Truck,
    title: 'Gratis verzending',
    subtitle: 'Vanaf \u20AC35 besteding',
  },
  {
    icon: RotateCcw,
    title: '30 dagen retourrecht',
    subtitle: 'Zonder vragen.',
  },
  {
    icon: Headphones,
    title: 'Persoonlijke service',
    subtitle: 'Altijd een echt antwoord',
  },
]

export default function TrustBadges() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal
          animation="fade-up"
          stagger
          staggerDelay={100}
          className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-8"
        >
          {badges.map((badge) => (
            <div
              key={badge.title}
              className="flex flex-col items-center text-center"
            >
              <badge.icon
                className="w-8 h-8 text-[#86868b] mb-4"
                strokeWidth={1.5}
              />
              <p className="font-semibold text-[#1d1d1f] text-sm tracking-tight">
                {badge.title}
              </p>
              <p className="text-[#6e6e73] text-sm mt-1 leading-relaxed">
                {badge.subtitle}
              </p>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}
