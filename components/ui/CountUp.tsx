'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'

interface CountUpProps {
  /** Target number to count up to */
  end: number
  /** Animation duration in ms */
  duration?: number
  /** Text to display before the number */
  prefix?: string
  /** Text to display after the number */
  suffix?: string
  /** Additional CSS class names */
  className?: string
  /** Number of decimal places */
  decimals?: number
  /** Starting number */
  start?: number
  /** Thousand separator character */
  separator?: string
}

/**
 * Easing function for a smooth deceleration curve (Apple-style ease-out).
 * Creates an effect where the counter starts fast and slows down near the end.
 */
function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4)
}

function formatNumber(
  value: number,
  decimals: number,
  separator: string
): string {
  const fixed = value.toFixed(decimals)
  if (!separator) return fixed

  const [intPart, decPart] = fixed.split('.')
  const withSeparator = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  return decPart !== undefined ? `${withSeparator}.${decPart}` : withSeparator
}

export default function CountUp({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  className,
  decimals = 0,
  start = 0,
  separator = '',
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [displayValue, setDisplayValue] = useState(start)
  const [hasStarted, setHasStarted] = useState(false)
  const rafId = useRef<number>(0)
  const startTime = useRef<number>(0)

  // Detect reduced motion preference
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mql.matches)
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp

      const elapsed = timestamp - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutQuart(progress)
      const currentValue = start + (end - start) * easedProgress

      setDisplayValue(currentValue)

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate)
      } else {
        // Ensure we land exactly on the end value
        setDisplayValue(end)
      }
    },
    [start, end, duration]
  )

  // Intersection Observer: start counting when visible
  useEffect(() => {
    if (prefersReducedMotion) {
      setDisplayValue(end)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
          startTime.current = 0
          rafId.current = requestAnimationFrame(animate)
          observer.unobserve(el)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)

    return () => {
      observer.disconnect()
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [animate, hasStarted, prefersReducedMotion, end])

  const formatted = formatNumber(displayValue, decimals, separator)

  return (
    <span
      ref={ref}
      className={className}
      style={{ fontVariantNumeric: 'tabular-nums' }}
    >
      {prefix}
      {formatted}
      {suffix}
    </span>
  )
}
