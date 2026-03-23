'use client'

import { Star, BadgeCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function HomepageReviews() {
  const t = useTranslations('reviews')

  const reviews = [
    { name: t('review1Name'), location: t('review1Location'), rating: 5, text: t('review1Text') },
    { name: t('review2Name'), location: t('review2Location'), rating: 5, text: t('review2Text') },
    { name: t('review3Name'), location: t('review3Location'), rating: 5, text: t('review3Text') },
  ]

  return (
    <section className="py-20 md:py-28 bg-[#fbfbfd]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Apple-style centered headline */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f] mb-3">
              {t('title')}
            </h2>
            <p className="text-lg text-[#86868b] max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
        </ScrollReveal>

        {/* Reviews grid with stagger */}
        <ScrollReveal
          stagger
          staggerDelay={150}
          animation="fade-up"
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white rounded-[20px] p-7 md:p-8
                shadow-[0_2px_12px_rgba(0,0,0,0.06)]
                hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]
                transition-shadow duration-300"
            >
              {/* Minimal star rating */}
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${
                      j < review.rating
                        ? 'text-[#1d1d1f] fill-[#1d1d1f]'
                        : 'text-[#d2d2d7] fill-[#d2d2d7]'
                    }`}
                  />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-[#1d1d1f] text-base leading-relaxed mb-6">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author info */}
              <div className="flex items-center justify-between pt-5 border-t border-[#e8e8ed]">
                <div>
                  <span className="font-semibold text-[#1d1d1f] text-sm block">
                    {review.name}
                  </span>
                  <span className="text-xs text-[#86868b]">
                    {review.location}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[#0071e3] text-xs font-medium">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  {t('verified')}
                </span>
              </div>
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  )
}
