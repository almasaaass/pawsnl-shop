'use client'

import { CATEGORIES } from '@/lib/types'
import { Dog, Cat, Bird, Rabbit, Fish, Snail } from 'lucide-react'
import { LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

const iconMap: Record<string, LucideIcon> = {
  Dog, Cat, Bird, Rabbit, Fish, Snail,
}

export default function CategoryOverview() {
  const t = useTranslations('categories')

  return (
    <section className="bg-warm-100 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-charcoal mb-2">{t('title')}</h2>
          <p className="text-gray-500">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((category) => {
            const Icon = iconMap[category.icon]
            return (
              <a
                key={category.slug}
                href={`/producten?categorie=${category.slug}`}
                className="card p-5 text-center hover:shadow-card-hover hover:border-accent-200 transition-all group cursor-pointer"
              >
                <div className="w-12 h-12 bg-accent-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  {Icon ? (
                    <Icon className="w-6 h-6 text-accent-500" />
                  ) : (
                    <span className="text-2xl">{category.emoji}</span>
                  )}
                </div>
                <p className="font-semibold text-charcoal text-sm">{category.label}</p>
              </a>
            )
          })}
        </div>
      </div>
    </section>
  )
}
