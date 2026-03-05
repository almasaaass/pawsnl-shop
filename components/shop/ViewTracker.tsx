'use client'

import { useEffect } from 'react'
import { Product } from '@/lib/types'
import { trackProductView } from './RecentlyViewed'

interface Props {
  product: Product
}

export default function ViewTracker({ product }: Props) {
  useEffect(() => {
    trackProductView(product)

    // Track ViewContent for ad pixels
    if (typeof window !== 'undefined') {
      if (window.fbq) {
        window.fbq('track', 'ViewContent', {
          value: product.price,
          currency: 'EUR',
          content_name: product.name,
          content_type: 'product',
          content_ids: [product.id],
        })
      }
      // @ts-expect-error TikTok pixel global
      if (window.ttq) {
        // @ts-expect-error TikTok pixel global
        window.ttq.track('ViewContent', {
          value: product.price,
          currency: 'EUR',
          content_name: product.name,
          content_type: 'product',
        })
      }
    }
  }, [product])

  return null
}
