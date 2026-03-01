import Link from 'next/link'
import { CATEGORIES } from '@/lib/types'

export default function CategoryOverview() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Winkel per categorie</h2>
          <p className="text-gray-500">Vind het perfecte product voor jouw trouwe vriend</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((category) => (
            <Link
              key={category.slug}
              href={`/producten?categorie=${category.slug}`}
              className="card p-5 text-center hover:shadow-md hover:border-orange-200 transition-all group cursor-pointer"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">
                {category.emoji}
              </div>
              <p className="font-semibold text-gray-900 text-sm">{category.label}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
