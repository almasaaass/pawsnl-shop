import { ShieldCheck, RotateCcw, Heart } from 'lucide-react'

export default function GuaranteeBanner() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-50 border border-emerald-200 rounded-3xl p-8 md:p-12 text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <ShieldCheck className="w-8 h-8 text-emerald-600" />
          <h2 className="text-2xl md:text-3xl font-bold text-emerald-800">
            100% Blij-Dier Garantie
          </h2>
        </div>
        <p className="text-emerald-700 text-lg mb-8 max-w-xl mx-auto">
          Wij geloven zo sterk in onze producten dat we een onvoorwaardelijke garantie bieden.
          Is jouw huisdier niet blij? Dan krijg je je geld terug.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <RotateCcw className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="font-semibold text-emerald-800 text-sm">30 dagen retour</p>
            <p className="text-xs text-emerald-600">Geen vragen, geen gedoe</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="font-semibold text-emerald-800 text-sm">100% geld terug</p>
            <p className="text-xs text-emerald-600">Als het product niet bevalt</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="font-semibold text-emerald-800 text-sm">Getest op geluk</p>
            <p className="text-xs text-emerald-600">Elk product door ons gecontroleerd</p>
          </div>
        </div>
      </div>
    </section>
  )
}
