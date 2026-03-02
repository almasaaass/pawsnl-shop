export default function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6">
        <div className="h-3 w-12 skeleton" />
        <div className="h-3 w-2 skeleton" />
        <div className="h-3 w-20 skeleton" />
        <div className="h-3 w-2 skeleton" />
        <div className="h-3 w-40 skeleton" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Image carousel */}
        <div className="flex flex-col gap-4">
          <div className="aspect-square skeleton rounded-2xl" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-16 h-16 skeleton rounded-xl flex-shrink-0" />
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-4">
          {/* Category badge */}
          <div className="h-6 w-20 skeleton rounded-full" />

          {/* Title */}
          <div className="space-y-2">
            <div className="h-8 w-full skeleton" />
            <div className="h-8 w-3/4 skeleton" />
          </div>

          {/* Price */}
          <div className="h-10 w-24 skeleton" />

          {/* Stock badge */}
          <div className="h-6 w-40 skeleton rounded-full" />

          {/* Description */}
          <div className="space-y-2 mt-2">
            <div className="h-4 w-full skeleton" />
            <div className="h-4 w-full skeleton" />
            <div className="h-4 w-5/6 skeleton" />
            <div className="h-4 w-3/4 skeleton" />
          </div>

          {/* Quantity + button */}
          <div className="flex items-center gap-4 mt-4">
            <div className="h-10 w-32 skeleton rounded-xl" />
          </div>
          <div className="flex gap-3">
            <div className="h-[45px] flex-1 skeleton rounded-xl" />
            <div className="h-[45px] w-20 skeleton rounded-xl" />
          </div>

          {/* Trust icons */}
          <div className="space-y-3 border-t pt-6 mt-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 skeleton rounded" />
                <div className="h-4 w-48 skeleton" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
