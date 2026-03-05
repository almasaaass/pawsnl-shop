'use client'

import { Flame } from 'lucide-react'

interface Props {
  stock: number
}

export default function ScarcityBadge({ stock }: Props) {
  if (stock === 0 || stock > 10) return null

  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
      <Flame className="w-3 h-3" />
      Nog maar {stock} op voorraad
    </span>
  )
}
