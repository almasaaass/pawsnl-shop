'use client'

import { ShieldCheck, RotateCcw, Heart } from 'lucide-react'
import Link from 'next/link'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function GuaranteeBanner() {
  const guarantees = [
    { icon: RotateCcw, title: '30 dagen retour', desc: 'Zonder vragen' },
    { icon: ShieldCheck, title: '100% geld terug', desc: 'Als het product niet past' },
    { icon: Heart, title: 'Getest op geluk', desc: 'Elk product gecontroleerd door ons team' },
  ]

  return (
    <section className="py-20 md:py-28 px-6" style={{ backgroundColor: '#f5f5f7' }}>
      <div className="max-w-5xl mx-auto text-center">
        {/* Shield icon */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="flex items-center justify-center mb-6">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#e8e8ed' }}
            >
              <ShieldCheck className="w-8 h-8" style={{ color: '#1d1d1f' }} />
            </div>
          </div>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal animation="fade-up" delay={100} duration={700}>
          <h2
            className="text-3xl md:text-5xl font-semibold tracking-tight mb-4"
            style={{ color: '#1d1d1f', letterSpacing: '-0.015em' }}
          >
            100% Blij Huisdier Garantie
          </h2>
        </ScrollReveal>

        {/* Subtitle */}
        <ScrollReveal animation="fade-up" delay={200} duration={700}>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto mb-12"
            style={{ color: '#6e6e73', lineHeight: 1.5 }}
          >
            Wij geloven zo sterk in onze producten dat we een onvoorwaardelijke garantie bieden.
            Is jouw huisdier niet blij? Dan krijg je je geld terug.
          </p>
        </ScrollReveal>

        {/* Guarantee cards */}
        <ScrollReveal animation="fade-up" delay={300} duration={700} stagger staggerDelay={120}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto mb-12">
            {guarantees.map((item) => (
              <div key={item.title} className="flex flex-col items-center gap-3">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: '#ffffff' }}
                >
                  <item.icon className="w-6 h-6" style={{ color: '#1d1d1f' }} />
                </div>
                <p
                  className="font-semibold text-base"
                  style={{ color: '#1d1d1f' }}
                >
                  {item.title}
                </p>
                <p
                  className="text-sm"
                  style={{ color: '#6e6e73' }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>

        {/* CTA button */}
        <ScrollReveal animation="fade-up" delay={500} duration={700}>
          <Link
            href="/contact"
            className="inline-block font-medium text-base transition-all duration-300 hover:opacity-80"
            style={{
              backgroundColor: '#0071e3',
              color: '#ffffff',
              padding: '12px 32px',
              borderRadius: '980px',
              textDecoration: 'none',
            }}
          >
            Neem contact op
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
