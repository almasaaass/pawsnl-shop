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
    <section className="py-12 md:py-16 bg-apple-offwhite">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-6">
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-12">
            <h2 className="text-[28px] md:text-[40px] font-semibold tracking-tight text-apple-black mb-3">
              {t('title')}
            </h2>
            <p className="text-[17px] text-apple-gray max-w-2xl mx-auto">
              {t('subtitle')}
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal
          stagger
          staggerDelay={150}
          animation="fade-up"
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white rounded-apple p-6 md:p-7 shadow-apple-sm hover:shadow-apple-md transition-shadow duration-300"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${
                      j < review.rating
                        ? 'text-apple-black fill-apple-black'
                        : 'text-apple-silver fill-apple-silver'
                    }`}
                  />
                ))}
              </div>

              <p className="text-apple-black text-[15px] leading-relaxed mb-5">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-apple-silver">
                <div>
                  <span className="font-semibold text-apple-black text-sm block">
                    {review.name}
                  </span>
                  <span className="text-xs text-apple-gray">
                    {review.location}
                  </span>
                </div>
                <span className="flex items-center gap-1 text-apple-blue text-xs font-medium">
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
