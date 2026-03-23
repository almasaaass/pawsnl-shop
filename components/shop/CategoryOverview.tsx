'use client'

import { CATEGORIES } from '@/lib/types'
import { Dog, Cat, Bird, Rabbit, Fish, Snail, ArrowRight } from 'lucide-react'
import { LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ui/ScrollReveal'

const iconMap: Record<string, LucideIcon> = {
  Dog, Cat, Bird, Rabbit, Fish, Snail,
}

export default function CategoryOverview() {
  const t = useTranslations('categories')

  return (
    <section className="py-20 md:py-28 bg-white">
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

        {/* Category grid: 3-col desktop, 2-col mobile */}
        <ScrollReveal
          stagger
          staggerDelay={100}
          animation="fade-up"
          className="grid grid-cols-2 md:grid-cols-3 gap-5 md:gap-6"
        >
          {CATEGORIES.map((category) => {
            const Icon = iconMap[category.icon]
            return (
              <a
                key={category.slug}
                href={`/producten?categorie=${category.slug}`}
                className="group bg-white rounded-[20px] p-6 md:p-8 text-center
                  shadow-[0_2px_12px_rgba(0,0,0,0.06)]
                  hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)]
                  transform hover:scale-[1.02]
                  transition-all duration-300 ease-out
                  cursor-pointer"
              >
                {/* Large rounded icon area */}
                <div className="w-16 h-16 md:w-20 md:h-20 bg-[#f5f5f7] rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-5
                  group-hover:bg-[#e8e8ed] transition-colors duration-300"
                >
                  {Icon ? (
                    <Icon className="w-8 h-8 md:w-10 md:h-10 text-[#1d1d1f] stroke-[1.5]" />
                  ) : (
                    <span className="text-3xl md:text-4xl">{category.emoji}</span>
                  )}
                </div>

                {/* Category name */}
                <p className="font-semibold text-[#1d1d1f] text-base md:text-lg tracking-tight mb-2">
                  {category.label}
                </p>

                {/* Arrow link */}
                <span className="inline-flex items-center gap-1 text-sm text-[#0071e3] font-medium
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  Bekijk
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform duration-300" />
                </span>
              </a>
            )
          })}
        </ScrollReveal>
      </div>
    </section>
  )
}
