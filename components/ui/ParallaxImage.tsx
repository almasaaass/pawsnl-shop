'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import Image from 'next/image'

interface ParallaxImageProps {
  /** Image source URL or static import */
  src: string
  /** Alt text for accessibility */
  alt: string
  /** Image width */
  width?: number
  /** Image height */
  height?: number
  /** Whether the image should fill its container */
  fill?: boolean
  /** Parallax speed factor. 0 = fixed, 0.5 = half scroll speed, 1 = normal scroll (no parallax). Default 0.4 */
  speed?: number
  /** Additional CSS class names for the outer container */
  className?: string
  /** Additional CSS class names for the image element */
  imageClassName?: string
  /** How much extra vertical scale to apply so the image can move without gaps. Default 1.3 */
  overflow?: number
  /** Image priority (Next.js) */
  priority?: boolean
  /** Image sizes attribute for responsive images */
  sizes?: string
  /** Image quality (1-100) */
  quality?: number
  /** Object fit for the image */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none'
  /** Object position for the image */
  objectPosition?: string
  /** Placeholder blur data URL */
  blurDataURL?: string
  /** Whether to show a blur placeholder while loading */
  placeholder?: 'blur' | 'empty'
}

export default function ParallaxImage({
  src,
  alt,
  width,
  height,
  fill = false,
  speed = 0.4,
  className,
  imageClassName,
  overflow = 1.3,
  priority = false,
  sizes,
  quality,
  objectFit = 'cover',
  objectPosition = 'center',
  blurDataURL,
  placeholder,
}: ParallaxImageProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [offset, setOffset] = useState(0)
  const rafId = useRef<number>(0)

  // Detect reduced motion
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mql.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const handleScroll = useCallback(() => {
    if (prefersReducedMotion) return

    rafId.current = requestAnimationFrame(() => {
      const el = containerRef.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const windowHeight = window.innerHeight

      // Only compute when element is near the viewport
      if (rect.bottom < -100 || rect.top > windowHeight + 100) return

      // Normalized position: 0 when element top is at viewport bottom,
      // 1 when element bottom is at viewport top
      const scrollRange = windowHeight + rect.height
      const scrollPosition = windowHeight - rect.top
      const normalizedScroll = scrollPosition / scrollRange // 0 to 1

      // Calculate offset so the image moves slower than the container
      // The range is limited by the overflow factor
      const maxOffset = (rect.height * (overflow - 1)) / 2
      const parallaxOffset = (normalizedScroll - 0.5) * 2 * maxOffset * (1 - speed)

      setOffset(parallaxOffset)
    })
  }, [speed, overflow, prefersReducedMotion])

  useEffect(() => {
    if (prefersReducedMotion) return

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })
    handleScroll() // initial position

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [handleScroll, prefersReducedMotion])

  const containerStyle: React.CSSProperties = {
    overflow: 'hidden',
    position: 'relative',
  }

  const innerStyle: React.CSSProperties = prefersReducedMotion
    ? {
        width: '100%',
        height: '100%',
        position: 'relative',
      }
    : {
        width: '100%',
        height: '100%',
        position: 'relative',
        transform: `translateY(${offset}px) scale(${overflow})`,
        willChange: 'transform',
      }

  // Build Image props
  const imageProps: React.ComponentProps<typeof Image> = {
    src,
    alt,
    priority,
    quality,
    className: imageClassName,
    style: {
      objectFit,
      objectPosition,
    },
    ...(blurDataURL && { blurDataURL }),
    ...(placeholder && { placeholder }),
    ...(sizes && { sizes }),
  }

  if (fill) {
    imageProps.fill = true
  } else {
    imageProps.width = width
    imageProps.height = height
  }

  return (
    <div ref={containerRef} className={className} style={containerStyle}>
      <div style={innerStyle}>
        <Image {...imageProps} />
      </div>
    </div>
  )
}
