'use client'

import { Star, BadgeCheck } from 'lucide-react'
import { useInView } from '@/hooks/useInView'

const reviews = [
  {
    name: 'Lisa V.',
    rating: 5,
    text: 'Super snelle levering en het speelgoed is echt van goede kwaliteit. Mijn hond is er dol op!',
  },
  {
    name: 'Mark B.',
    rating: 5,
    text: 'Fijn dat je met iDEAL kunt betalen. Producten zijn precies zoals beschreven. Aanrader!',
  },
  {
    name: 'Sandra K.',
    rating: 4,
    text: 'Mijn kat is helemaal gek van het kattenspeelgoed. Goede prijs-kwaliteitverhouding.',
  },
]

export default function HomepageReviews() {
  const { ref, isInView } = useInView({ threshold: 0.15 })

  return (
    <section ref={ref} className="bg-warm-100 py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <h2 className="text-3xl font-bold text-charcoal mb-2">Wat onze klanten zeggen</h2>
          <p className="text-gray-500">Echte beoordelingen van tevreden dierenliefhebbers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl p-6 shadow-card border border-gray-100 ${
                isInView ? `animate-fade-in-up stagger-${i + 2}` : 'opacity-0'
              }`}
            >
              {/* Sterren */}
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star
                    key={j}
                    className={`w-4 h-4 ${
                      j < review.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200'
                    }`}
                  />
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-600 text-sm leading-relaxed mb-4">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center justify-between">
                <span className="font-semibold text-charcoal text-sm">{review.name}</span>
                <span className="flex items-center gap-1 text-trust-600 text-xs font-medium">
                  <BadgeCheck className="w-3.5 h-3.5" />
                  Geverifieerd
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
