'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: (...args: unknown[]) => void
  }
}

export default function MetaPixel() {
  const pathname = usePathname()

  useEffect(() => {
    const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID
    if (!pixelId || typeof window === 'undefined') return

    if (window.fbq) return

    /* eslint-disable */
    const n: any = (window.fbq = function (...args: unknown[]) {
      n.callMethod ? n.callMethod(...args) : n.queue.push(args)
    })
    if (!window._fbq) window._fbq = n
    n.push = n
    n.loaded = true
    n.version = '2.0'
    n.queue = [] as unknown[][]
    /* eslint-enable */

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(script)

    window.fbq('init', pixelId)
    window.fbq('track', 'PageView')
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', 'PageView')
    }
  }, [pathname])

  return null
}
