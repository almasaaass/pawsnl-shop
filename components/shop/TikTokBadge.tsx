'use client'

import { TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { TRENDING_SLUGS } from '@/lib/trending'

// Re-export for convenience
export { isTrendingOnTikTok } from '@/lib/trending'

interface Props {
  slug: string
  size?: 'sm' | 'md' | 'lg'
}

export default function TikTokBadge({ slug, size = 'md' }: Props) {
  const t = useTranslations('tiktokBadge')
  const data = TRENDING_SLUGS[slug]
  if (!data) return null

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-sm px-3 py-1.5 gap-2',
    lg: 'text-base px-4 py-2 gap-2.5',
  }

  return (
    <div className={`inline-flex items-center bg-charcoal text-white rounded-full font-bold ${sizeClasses[size]}`}>
      <svg viewBox="0 0 24 24" fill="currentColor" className={size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'}>
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48 6.3 6.3 0 001.86-4.49V8.87a8.28 8.28 0 004.84 1.56V6.96a4.84 4.84 0 01-1.12-.27z" />
      </svg>
      <span>{data.views} views</span>
      <TrendingUp className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
    </div>
  )
}
