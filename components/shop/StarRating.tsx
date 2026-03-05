import { Star } from 'lucide-react'

interface Props {
  rating: number
  count?: number
  size?: 'sm' | 'md'
}

export default function StarRating({ rating, count, size = 'sm' }: Props) {
  const starSize = size === 'sm' ? 'w-3.5 h-3.5' : 'w-4 h-4'
  const textSize = size === 'sm' ? 'text-xs' : 'text-sm'

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${starSize} ${
              star <= Math.round(rating)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-gray-200 fill-gray-200'
            }`}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className={`${textSize} text-gray-500`}>({count})</span>
      )}
    </div>
  )
}
