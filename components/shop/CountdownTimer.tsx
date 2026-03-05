'use client'

import { useState, useEffect } from 'react'
import { Clock } from 'lucide-react'

interface Props {
  endDate?: Date
  label?: string
}

function getEndOfDay(): Date {
  const now = new Date()
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)
  return end
}

function formatTimeUnit(n: number): string {
  return n.toString().padStart(2, '0')
}

export default function CountdownTimer({ endDate, label = 'Aanbieding eindigt over' }: Props) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const target = endDate || getEndOfDay()

    function update() {
      const now = new Date().getTime()
      const diff = target.getTime() - now

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 })
        return
      }

      setTimeLeft({
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      })
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [endDate])

  if (!mounted) return null

  const { hours, minutes, seconds } = timeLeft

  if (hours === 0 && minutes === 0 && seconds === 0) return null

  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
      <Clock className="w-4 h-4 text-red-500 flex-shrink-0" />
      <span className="text-xs text-red-700 font-medium">{label}</span>
      <div className="flex items-center gap-1 font-mono text-sm font-bold text-red-600">
        <span className="bg-red-100 rounded px-1.5 py-0.5">{formatTimeUnit(hours)}</span>
        <span>:</span>
        <span className="bg-red-100 rounded px-1.5 py-0.5">{formatTimeUnit(minutes)}</span>
        <span>:</span>
        <span className="bg-red-100 rounded px-1.5 py-0.5">{formatTimeUnit(seconds)}</span>
      </div>
    </div>
  )
}
