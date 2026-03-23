'use client'

import { useState, useEffect } from 'react'
import { Eye, Star, Users, TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import CountUp from '@/components/ui/CountUp'

const STATS = [
  { icon: Eye, key: 'views' as const, countEnd: 0, suffix: '', color: '#1d1d1f', noCount: true },
  { icon: Star, key: 'rating' as const, countEnd: 0, suffix: '', decimals: 0, color: '#1d1d1f', noCount: true },
  { icon: Users, key: 'customers' as const, countEnd: 0, suffix: '', color: '#1d1d1f', noCount: true },
  { icon: TrendingUp, key: 'trending' as const, countEnd: 0, suffix: '', color: '#1d1d1f', noCount: true },
]

export default function SocialProofBar() {
  const t = useTranslations('socialProof')
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="bg-white border-b border-[#e8e8ed]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-10 md:py-14">
          {STATS.map((stat, i) => (
            <div
              key={stat.key}
              className={`flex flex-col items-center text-center transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <stat.icon className="w-5 h-5 text-[#86868b] mb-3" />
              <div className="text-[#1d1d1f] font-semibold text-3xl md:text-4xl tracking-tight mb-1">
                {t(`${stat.key}Value`)}
              </div>
              <span className="text-[#86868b] text-sm font-medium">{t(`${stat.key}Label`)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
