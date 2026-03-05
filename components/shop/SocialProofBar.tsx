'use client'

import { useState, useEffect } from 'react'
import { Eye, Star, TrendingUp, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'

const STATS = [
  { icon: Eye, key: 'views' as const, color: 'text-accent-500' },
  { icon: Star, key: 'rating' as const, color: 'text-yellow-500' },
  { icon: Users, key: 'customers' as const, color: 'text-trust-500' },
  { icon: TrendingUp, key: 'trending' as const, color: 'text-pink-500' },
]

export default function SocialProofBar() {
  const t = useTranslations('socialProof')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="bg-charcoal border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 overflow-x-auto gap-6 md:gap-8 scrollbar-hide">
          {STATS.map((stat, i) => (
            <div
              key={stat.key}
              className={`flex items-center gap-2 whitespace-nowrap transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <stat.icon className={`w-4 h-4 ${stat.color} flex-shrink-0`} />
              <span className="text-white font-bold text-sm">{t(`${stat.key}Value`)}</span>
              <span className="text-gray-400 text-sm hidden sm:inline">{t(`${stat.key}Label`)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
