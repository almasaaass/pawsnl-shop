'use client'

import { useEffect, useRef } from 'react'

interface Props {
  value: number
  currency?: string
  orderId?: string
}

export default function ConversionTracker({ value, currency = 'EUR', orderId }: Props) {
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current || typeof window === 'undefined' || !value) return
    tracked.current = true

    // Meta Pixel — Purchase event
    if (window.fbq) {
      window.fbq('track', 'Purchase', {
        value,
        currency,
        content_type: 'product',
      })
    }

    // TikTok Pixel — Purchase event
    // @ts-expect-error TikTok pixel global
    if (window.ttq) {
      // @ts-expect-error TikTok pixel global
      window.ttq.track('CompletePayment', {
        value,
        currency,
        content_type: 'product',
      })
    }
  }, [value, currency, orderId])

  return null
}
