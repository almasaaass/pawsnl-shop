'use client'

import { CheckCircle, Tag, Heart, Truck } from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import { useTranslations } from 'next-intl'

export default function WhyPawsNL() {
  const t = useTranslations('whyPawsNL')
  const { ref, isInView } = useInView({ threshold: 0.2 })

  const reasons = [
    { icon: CheckCircle, title: t('reason1Title'), description: t('reason1Description') },
    { icon: Tag, title: t('reason2Title'), description: t('reason2Description') },
    { icon: Truck, title: t('reason3Title'), description: t('reason3Description') },
    { icon: Heart, title: t('reason4Title'), description: t('reason4Description') },
  ]

  return (
    <section ref={ref} className="bg-white py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl font-bold text-charcoal mb-2">{t('title')}</h2>
          <p className="text-gray-500">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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
