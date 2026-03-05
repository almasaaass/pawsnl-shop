'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

export default function TikTokPixel() {
  const pathname = usePathname()

  useEffect(() => {
    const pixelId = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID
    if (!pixelId || typeof window === 'undefined') return

    // @ts-expect-error TikTok pixel global
    if (window.ttq) return

    const script = document.createElement('script')
    script.innerHTML = `!function (w, d, t) {
      w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e+"_"+o]=1,ttq._o=ttq._o||{},ttq._o[e]=n||{};var i=document.createElement("script");i.type="text/javascript",i.async=!0,i.src=r+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(i,a)};
      ttq.load('${pixelId}');
      ttq.page();
    }(window, document, 'ttq');`
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    // @ts-expect-error TikTok pixel global
    if (typeof window !== 'undefined' && window.ttq) {
      // @ts-expect-error TikTok pixel global
      window.ttq.page()
    }
  }, [pathname])

  return null
}
