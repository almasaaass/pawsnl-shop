export default function ProductDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-4 w-48 bg-gray-100 rounded animate-pulse mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="aspect-square bg-gray-100 rounded-2xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-6 bg-gray-100 rounded animate-pulse w-24" />
          <div className="h-8 bg-gray-200 rounded-lg animate-pulse w-3/4" />
          <div className="h-10 bg-gray-100 rounded-lg animate-pulse w-32" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-100 rounded animate-pulse" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-gray-100 rounded animate-pulse w-4/6" />
          </div>
          <div className="h-12 bg-orange-100 rounded-xl animate-pulse" />
        </div>
      </div>
    </div>
  )
}
