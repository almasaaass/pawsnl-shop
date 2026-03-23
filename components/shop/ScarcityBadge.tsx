'use client'

import { Flame, AlertTriangle } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface Props {
  stock: number
}

export default function ScarcityBadge({ stock }: Props) {
  const t = useTranslations('product')

  if (stock === 0 || stock > 10) return null

  if (stock <= 3) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 bg-red-100 px-2 py-1 rounded-full animate-pulse">
        <AlertTriangle className="w-3 h-3" />
        {t('almostSoldOut', { count: stock })}
      </span>
    )
  }

  if (stock <= 7) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
        <Flame className="w-3 h-3" />
        {t('stockLeft', { count: stock })}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
      <Flame className="w-3 h-3" />
      {t('popular', { count: stock })}
    </span>
  )
}
