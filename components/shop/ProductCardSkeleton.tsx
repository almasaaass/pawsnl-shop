export default function ProductCardSkeleton() {
  return (
    <div className="card flex flex-col">
      {/* Image placeholder */}
      <div className="aspect-square skeleton" />

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        {/* Category */}
        <div className="h-3 w-16 skeleton" />

        {/* Title */}
        <div className="space-y-1.5">
          <div className="h-4 w-full skeleton" />
          <div className="h-4 w-3/4 skeleton" />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <div className="h-3 w-full skeleton" />
          <div className="h-3 w-5/6 skeleton" />
        </div>

        {/* Price + button */}
        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="h-6 w-16 skeleton" />
          <div className="h-[45px] w-28 skeleton" />
        </div>
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
