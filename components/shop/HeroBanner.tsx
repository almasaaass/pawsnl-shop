import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

export default function HeroBanner() {
  return (
    <section className="relative bg-gradient-to-br from-orange-50 via-white to-amber-50 overflow-hidden">
      {/* Decoratieve cirkels */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-orange-100 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-100 rounded-full translate-y-1/2 -translate-x-1/3 opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Tekst */}
          <div>
            {/* Social proof badge */}
            <div className="inline-flex items-center gap-2 bg-white border border-orange-100 rounded-full px-4 py-2 mb-6 shadow-sm">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-700">4.8 – Meer dan 10.000 klanten</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Alles voor{' '}
              <span className="text-orange-500 relative">
                jouw huisdier
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 300 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2 6C50 2 100 2 150 5C200 8 250 4 298 2"
                    stroke="#F97316"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
              Ontdek ons zorgvuldig geselecteerde assortiment van premium dierenproducten. Gratis
              verzending vanaf €35, 30 dagen retour.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/producten"
                className="btn-primary inline-flex items-center justify-center gap-2 text-base"
              >
                Bekijk alle producten
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/over-ons"
                className="btn-secondary inline-flex items-center justify-center gap-2 text-base"
              >
                Over PawsNL
              </Link>
            </div>

            {/* Trust pillars */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-8">
              {['✓ Gratis retour', '✓ Veilig betalen', '✓ Snelle levering'].map((item) => (
                <span key={item} className="text-sm font-medium text-gray-500">
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Hero visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full flex items-center justify-center shadow-2xl">
                <span className="text-9xl md:text-[10rem]" role="img" aria-label="Hond">
                  🐕
                </span>
              </div>
              {/* Floating badges */}
              <div className="absolute -top-4 -left-4 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2">
                <span className="text-2xl">🚚</span>
                <div>
                  <p className="text-xs font-bold text-gray-900">Gratis verzending</p>
                  <p className="text-xs text-gray-500">Vanaf €35</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl shadow-lg p-3 flex items-center gap-2">
                <span className="text-2xl">↩️</span>
                <div>
                  <p className="text-xs font-bold text-gray-900">30 dagen retour</p>
                  <p className="text-xs text-gray-500">Geen gedoe</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
