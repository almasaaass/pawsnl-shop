'use client'

import { useState, useEffect } from 'react'
import { Truck, RotateCcw, ShieldCheck } from 'lucide-react'

const messages = [
  { icon: Truck, text: 'Gratis verzending vanaf €35' },
  { icon: RotateCcw, text: '30 dagen retour' },
  { icon: ShieldCheck, text: 'Veilig betalen met iDEAL' },
]

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % messages.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="bg-trust-700 text-white text-xs sm:text-sm py-2">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Desktop: alle berichten inline */}
        <div className="hidden sm:flex items-center justify-center gap-6">
          {messages.map((msg, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <msg.icon className="w-3.5 h-3.5" />
              <span>{msg.text}</span>
              {i < messages.length - 1 && (
                <span className="ml-6 text-trust-300">·</span>
              )}
            </div>
          ))}
        </div>

        {/* Mobile: auto-rotate */}
        <div className="sm:hidden flex items-center justify-center gap-1.5">
          {(() => {
            const Icon = messages[current].icon
            return (
              <>
                <Icon className="w-3.5 h-3.5" />
                <span>{messages[current].text}</span>
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
