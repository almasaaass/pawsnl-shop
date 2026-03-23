'use client'

import { useState, useRef, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, PawPrint, X, ZoomIn } from 'lucide-react'
import { getImageSrc } from '@/lib/utils'

interface Props {
  images: string[]
  name: string
}

export default function ImageCarousel({ images, name }: Props) {
  const [current, setCurrent] = useState(0)
  const [prevIndex, setPrevIndex] = useState<number | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set())
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const hasImages = images.length > 0

  // Touch/swipe refs
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const goTo = useCallback((index: number) => {
    if (index === current || isTransitioning) return
    setPrevIndex(current)
    setIsTransitioning(true)
    setCurrent(index)
    setTimeout(() => {
      setIsTransitioning(false)
      setPrevIndex(null)
    }, 350)
  }, [current, isTransitioning])

  const prev = () => goTo((current - 1 + images.length) % images.length)
  const next = () => goTo((current + 1) % images.length)

  const handleError = (index: number) => {
    setFailedImages((prev) => new Set(prev).add(index))
  }

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }
  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current
    if (Math.abs(diff) > 50) {
      if (diff > 0) next()
      else prev()
    }
  }

  const currentFailed = failedImages.has(current)

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Hoofdafbeelding */}
        <div
          className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden group cursor-zoom-in"
          onClick={() => hasImages && !currentFailed && setLightboxOpen(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Crossfade: vorige afbeelding (fading out) */}
          {prevIndex !== null && !failedImages.has(prevIndex) && (
            <Image
              src={getImageSrc(images[prevIndex])}
              alt={`${name} - foto ${prevIndex + 1}`}
              fill
              className="object-cover transition-opacity duration-300 opacity-0"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          )}

          {/* Huidige afbeelding (fading in) */}
          {hasImages && !currentFailed ? (
            <Image
              src={getImageSrc(images[current])}
              alt={`${name} - foto ${current + 1}`}
              fill
              className={`object-cover transition-opacity duration-300 ${
                isTransitioning ? 'opacity-0 animate-fade-in' : 'opacity-100'
              } group-hover:scale-105 transition-transform duration-500`}
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
              onError={() => handleError(current)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-accent-50">
              <PawPrint className="w-16 h-16 text-accent-300 mb-4" />
              {hasImages && currentFailed && (
                <p className="text-sm text-gray-400">Afbeelding kon niet geladen worden</p>
              )}
            </div>
          )}

          {/* Zoom indicator */}
          {hasImages && !currentFailed && (
            <div className="absolute top-3 right-3 w-8 h-8 bg-white/70 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn className="w-4 h-4 text-gray-700" />
            </div>
          )}

          {/* Navigatiepijlen */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Vorige foto"
              >
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Volgende foto"
              >
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>
            </>
          )}

          {/* Foto teller */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded-full">
              {current + 1} / {images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollBehavior: 'smooth' }}>
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  i === current
                    ? 'border-accent-500 ring-2 ring-accent-200'
                    : 'border-transparent hover:border-gray-300'
                }`}
                aria-label={`Foto ${i + 1}`}
              >
                {failedImages.has(i) ? (
                  <div className="w-full h-full flex items-center justify-center bg-accent-50">
                    <PawPrint className="w-5 h-5 text-accent-300" />
                  </div>
                ) : (
                  <Image
                    src={getImageSrc(img)}
                    alt={`${name} - thumbnail ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                    onError={() => handleError(i)}
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && hasImages && !currentFailed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center animate-fade-in"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors z-10"
            aria-label="Sluiten"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          {/* Foto teller */}
          {images.length > 1 && (
            <div className="absolute top-4 left-4 text-white/80 text-sm font-medium">
              {current + 1} / {images.length}
            </div>
          )}

          {/* Prev/Next */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Vorige foto"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                aria-label="Volgende foto"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}

          {/* Lightbox image */}
          <div
            className="relative w-[90vw] h-[90vh] max-w-4xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <Image
              src={getImageSrc(images[current])}
              alt={`${name} - foto ${current + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>
        </div>
      )}
    </>
  )
}
