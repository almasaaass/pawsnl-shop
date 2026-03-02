'use client'

import { Star } from 'lucide-react'
import { useInView } from '@/hooks/useInView'

// Voorbeeld reviews – vervang door echte reviews uit je database
const DEMO_REVIEWS = [
  {
    id: '1',
    author: 'Marieke V.',
    rating: 5,
    comment: 'Geweldig product! Mijn hond is er super blij mee. Snelle levering en prima verpakt.',
    date: '2024-11-15',
  },
  {
    id: '2',
    author: 'Joost K.',
    rating: 4,
    comment: 'Goede kwaliteit voor de prijs. Zou zeker opnieuw bestellen bij PawsNL.',
    date: '2024-10-28',
  },
  {
    id: '3',
    author: 'Sandra M.',
    rating: 5,
    comment:
      'Precies wat ik zocht. Mijn kat accepteert dit meteen, wat ik zeker niet verwachtte. Aanrader!',
    date: '2024-10-10',
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

interface Props {
  productId: string
  productName: string
}

export default function ReviewsSection({ productId: _productId, productName }: Props) {
  const { ref, isInView } = useInView({ threshold: 0.1 })
  const avgRating =
    DEMO_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / DEMO_REVIEWS.length

  return (
    <section ref={ref}>
      <h2 className={`text-2xl font-bold text-gray-900 mb-6 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
        Klantbeoordelingen voor {productName}
      </h2>

      {/* Samenvatting */}
      <div className={`card p-6 mb-6 flex items-center gap-6 ${isInView ? 'animate-fade-in-up stagger-1' : 'opacity-0'}`}>
        <div className="text-center flex-shrink-0">
          <p className="text-5xl font-bold text-gray-900">{avgRating.toFixed(1)}</p>
          <StarRating rating={Math.round(avgRating)} />
          <p className="text-sm text-gray-500 mt-1">{DEMO_REVIEWS.length} beoordelingen</p>
        </div>
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = DEMO_REVIEWS.filter((r) => r.rating === star).length
            const pct = (count / DEMO_REVIEWS.length) * 100
            return (
              <div key={star} className="flex items-center gap-2 mb-1">
                <span className="text-xs text-gray-500 w-4">{star}</span>
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: isInView ? `${pct}%` : '0%' }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-4">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Review lijst */}
      <div className="space-y-4">
        {DEMO_REVIEWS.map((review, i) => (
          <div
            key={review.id}
            className={`card p-5 ${isInView ? `animate-fade-in-up stagger-${Math.min(i + 2, 8)}` : 'opacity-0'}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-orange-600 font-bold text-sm">
                    {review.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{review.author}</p>
                  <StarRating rating={review.rating} />
                </div>
              </div>
              <time className="text-xs text-gray-400">
                {new Date(review.date).toLocaleDateString('nl-NL', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </time>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
