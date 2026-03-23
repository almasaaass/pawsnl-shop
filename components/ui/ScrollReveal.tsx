'use client'

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
  Children,
  cloneElement,
  isValidElement,
} from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  /** Animation type */
  animation?: 'fade-up' | 'fade-in' | 'scale' | 'slide-left' | 'slide-right' | 'parallax'
  /** Delay in ms */
  delay?: number
  /** Duration in ms */
  duration?: number
  /** Trigger threshold (0-1) */
  threshold?: number
  /** Whether to animate children in stagger */
  stagger?: boolean
  /** Stagger delay between children in ms */
  staggerDelay?: number
  /** Whether animation should only play once */
  once?: boolean
  /** For parallax: speed factor (0-1 = slower than scroll, >1 = faster) */
  parallaxSpeed?: number
}

const initialStyles: Record<string, React.CSSProperties> = {
  'fade-up': {
    opacity: 0,
    transform: 'translateY(60px)',
  },
  'fade-in': {
    opacity: 0,
  },
  scale: {
    opacity: 0,
    transform: 'scale(0.85)',
  },
  'slide-left': {
    opacity: 0,
    transform: 'translateX(80px)',
  },
  'slide-right': {
    opacity: 0,
    transform: 'translateX(-80px)',
  },
  parallax: {
    opacity: 0,
  },
}

const revealedStyles: Record<string, React.CSSProperties> = {
  'fade-up': {
    opacity: 1,
    transform: 'translateY(0)',
  },
  'fade-in': {
    opacity: 1,
  },
  scale: {
    opacity: 1,
    transform: 'scale(1)',
  },
  'slide-left': {
    opacity: 1,
    transform: 'translateX(0)',
  },
  'slide-right': {
    opacity: 1,
    transform: 'translateX(0)',
  },
  parallax: {
    opacity: 1,
  },
}

function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReduced(mql.matches)

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return prefersReduced
}

export default function ScrollReveal({
  children,
  className,
  animation = 'fade-up',
  delay = 0,
  duration = 800,
  threshold = 0.15,
  stagger = false,
  staggerDelay = 120,
  once = true,
  parallaxSpeed = 0.3,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [parallaxOffset, setParallaxOffset] = useState(0)
  const prefersReducedMotion = usePrefersReducedMotion()
  const rafId = useRef<number>(0)

  // Intersection Observer
  useEffect(() => {
    if (prefersReducedMotion) {
      setIsVisible(true)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once) observer.unobserve(el)
        } else if (!once) {
          setIsVisible(false)
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, once, prefersReducedMotion])

  // Parallax scroll handler
  const handleScroll = useCallback(() => {
    if (animation !== 'parallax' || !ref.current || prefersReducedMotion) return

    rafId.current = requestAnimationFrame(() => {
      const el = ref.current
      if (!el) return

      const rect = el.getBoundingClientRect()
      const windowHeight = window.innerHeight
      // Calculate how far through the viewport the element is
      const elementCenter = rect.top + rect.height / 2
      const viewportCenter = windowHeight / 2
      const distance = elementCenter - viewportCenter
      const offset = distance * parallaxSpeed * -1

      setParallaxOffset(offset)
    })
  }, [animation, parallaxSpeed, prefersReducedMotion])

  useEffect(() => {
    if (animation !== 'parallax' || prefersReducedMotion) return

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initial position

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [animation, handleScroll, prefersReducedMotion])

  // Build styles
  const baseTransition = `opacity ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94), transform ${duration}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`

  const getElementStyle = (childDelay: number = 0): React.CSSProperties => {
    if (prefersReducedMotion) {
      return {}
    }

    const totalDelay = delay + childDelay
    const animStyles = isVisible
      ? revealedStyles[animation]
      : initialStyles[animation]

    const style: React.CSSProperties = {
      ...animStyles,
      transition: baseTransition,
      transitionDelay: `${totalDelay}ms`,
      willChange: 'transform, opacity',
    }

    if (animation === 'parallax' && isVisible) {
      style.transform = `translateY(${parallaxOffset}px)`
    }

    return style
  }

  // Stagger mode: clone each direct child and apply increasing delays
  if (stagger) {
    const childArray = Children.toArray(children)
    return (
      <div ref={ref} className={className}>
        {childArray.map((child, index) => {
          if (!isValidElement(child)) return child

          const childStyle = getElementStyle(index * staggerDelay)
          return cloneElement(child as React.ReactElement<{ style?: React.CSSProperties }>, {
            style: {
              ...(child.props as { style?: React.CSSProperties }).style,
              ...childStyle,
            },
          })
        })}
      </div>
    )
  }

  return (
    <div ref={ref} className={className} style={getElementStyle()}>
      {children}
    </div>
  )
}
