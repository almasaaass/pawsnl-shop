'use client'

import { ShieldCheck, RotateCcw, Heart } from 'lucide-react'
import { useInView } from '@/hooks/useInView'

export default function GuaranteeBanner() {
  const { ref, isInView } = useInView({ threshold: 0.2 })

  return (
    <section ref={ref} className="py-16 md:py-20 px-4">
      <div className={`max-w-4xl mx-auto bg-gradient-to-br from-trust-50 via-trust-50/50 to-trust-50 border border-trust-200 rounded-3xl p-8 md:p-12 text-center ${
        isInView ? 'animate-scale-in' : 'opacity-0'
      }`}>
        <div className="flex items-center justify-center gap-2 mb-4">
          <ShieldCheck className="w-8 h-8 text-trust-600" />
          <h2 className="text-2xl md:text-3xl font-bold text-trust-800">
            100% Blij-Dier Garantie
          </h2>
        </div>
        <p className="text-trust-700 text-lg mb-8 max-w-xl mx-auto">
          Wij geloven zo sterk in onze producten dat we een onvoorwaardelijke garantie bieden.
          Is jouw huisdier niet blij? Dan krijg je je geld terug.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          {[
            { icon: RotateCcw, title: '30 dagen retour', desc: 'Geen vragen, geen gedoe' },
            { icon: ShieldCheck, title: '100% geld terug', desc: 'Als het product niet bevalt' },
            { icon: Heart, title: 'Getest op geluk', desc: 'Elk product door ons gecontroleerd' },
          ].map((item, i) => (
            <div
              key={item.title}
              className={`flex flex-col items-center gap-2 ${isInView ? `animate-fade-in-up stagger-${i + 3}` : 'opacity-0'}`}
            >
              <div className="w-12 h-12 bg-trust-100 rounded-2xl flex items-center justify-center">
                <item.icon className="w-6 h-6 text-trust-600" />
              </div>
              <p className="font-semibold text-trust-800 text-sm">{item.title}</p>
              <p className="text-xs text-trust-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
