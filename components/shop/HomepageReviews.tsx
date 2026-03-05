'use client'

import { Star, BadgeCheck } from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import { useTranslations } from 'next-intl'

export default function HomepageReviews() {
  const t = useTranslations('reviews')
  const { ref, isInView } = useInView({ threshold: 0.15 })

  const reviews = [
    { name: t('review1Name'), location: t('review1Location'), rating: 5, text: t('review1Text') },
    { name: t('review2Name'), location: t('review2Location'), rating: 5, text: t('review2Text') },
    { name: t('review3Name'), location: t('review3Location'), rating: 5, text: t('review3Text') },
  ]

  return (
    <section ref={ref} className="bg-warm-100 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl font-bold text-charcoal mb-2">{t('title')}</h2>
          <p className="text-gray-500">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl p-6 shadow-card border border-gray-100 ${
                isInView ? `animate-fade-in-up stagger-${i + 2}` : 'opacity-0'
              }`}
            >
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${
                      j < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold text-charcoal text-sm">{review.name}</span>
                  <span className="text-xs text-gray-400 ml-1.5">{review.location}</span>
                </div>
                <span className="flex items-center gap-1 text-trust-600 text-xs font-medium">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {t('verified')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
