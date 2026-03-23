'use client'

import { useState, useEffect } from 'react'
import { Truck, RotateCcw, ShieldCheck } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function AnnouncementBar() {
  const t = useTranslations('announcement')
  const [current, setCurrent] = useState(0)

  const messages = [
    { icon: Truck, text: t('freeShipping') },
    { icon: RotateCcw, text: t('returnPolicy') },
    { icon: ShieldCheck, text: t('safePayment') },
    { icon: ShieldCheck, text: t('discountCode') },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % messages.length)
    }, 3500)
    return () => clearInterval(timer)
  }, [messages.length])

  return (
    <div className="bg-[#1d1d1f] text-[#f5f5f7] text-[12px] py-2.5">
      <div className="max-w-[980px] mx-auto px-4 sm:px-6">
        {/* Desktop: alle berichten inline */}
        <div className="hidden sm:flex items-center justify-center gap-8">
          {messages.map((msg, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <msg.icon className="w-3 h-3 text-[#86868b]" />
              <span className="tracking-wide">{msg.text}</span>
              {i < messages.length - 1 && (
                <span className="ml-8 text-[#424245]">|</span>
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
                <Icon className="w-3 h-3 text-[#86868b]" />
                <span className="tracking-wide">{messages[current].text}</span>
              </>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
