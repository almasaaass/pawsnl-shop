'use client'

import { CheckCircle, Tag, Heart, Truck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import ScrollReveal from '@/components/ui/ScrollReveal'
import CountUp from '@/components/ui/CountUp'

export default function WhyPawsNL() {
  const t = useTranslations('whyPawsNL')

  const reasons = [
    { icon: CheckCircle, title: t('reason1Title'), description: t('reason1Description') },
    { icon: Tag, title: t('reason2Title'), description: t('reason2Description') },
    { icon: Truck, title: t('reason3Title'), description: t('reason3Description') },
    { icon: Heart, title: t('reason4Title'), description: t('reason4Description') },
  ]

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section headline */}
        <ScrollReveal animation="fade-up" className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight">
            {t('title')}
          </h2>
          <p className="text-[#6e6e73] text-lg mt-3 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </ScrollReveal>

        {/* Stats bar */}
        <ScrollReveal
          animation="fade-up"
          delay={200}
          className="flex flex-wrap justify-center gap-x-16 gap-y-6 mb-20"
        >
          <div className="text-center">
            <span className="block text-4xl font-semibold text-[#1d1d1f] tracking-tight">
              <CountUp end={5000} suffix="+" separator="." duration={2000} />
            </span>
            <span className="text-[#6e6e73] text-sm mt-1 block">Blije huisdieren</span>
          </div>
          <div className="text-center">
            <span className="block text-4xl font-semibold text-[#1d1d1f] tracking-tight">
              <CountUp end={30} duration={1500} />
            </span>
            <span className="text-[#6e6e73] text-sm mt-1 block">Dagen retourrecht</span>
          </div>
          <div className="text-center">
            <span className="block text-4xl font-semibold text-[#1d1d1f] tracking-tight">
              <CountUp end={100} suffix="%" duration={1800} />
            </span>
            <span className="text-[#6e6e73] text-sm mt-1 block">Tevredenheidsgarantie</span>
          </div>
        </ScrollReveal>

        {/* Feature grid — 3 columns on desktop, wraps on mobile */}
        <ScrollReveal
          animation="fade-up"
          stagger
          staggerDelay={120}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-y-14 gap-x-10"
        >
          {reasons.map((reason) => (
            <div
              key={reason.title}
              className="flex flex-col items-center text-center"
            >
              <reason.icon
                className="w-8 h-8 text-[#86868b] mb-4"
                strokeWidth={1.5}
              />
              <h3 className="text-lg font-semibold text-[#1d1d1f] tracking-tight">
                {reason.title}
              </h3>
              <p className="text-[#6e6e73] text-sm mt-2 leading-relaxed max-w-xs">
                {reason.description}
              </p>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}
