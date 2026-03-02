import { ShieldCheck } from 'lucide-react'

interface Props {
  variant?: 'inline' | 'banner' | 'compact'
}

export default function GuaranteeBadge({ variant = 'inline' }: Props) {
  if (variant === 'banner') {
    return (
      <div className="bg-gradient-to-r from-trust-50 to-trust-50/50 border border-trust-200 rounded-2xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <ShieldCheck className="w-7 h-7 text-trust-600" />
          <span className="text-xl font-bold text-trust-800">100% Blij-Dier Garantie</span>
        </div>
        <p className="text-sm text-trust-700 max-w-md mx-auto">
          Is jouw huisdier niet blij? Dan krijg je je geld terug. Geen vragen, geen gedoe.
          30 dagen lang.
        </p>
      </div>
    )
  }

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 text-trust-700 bg-trust-50 border border-trust-200 rounded-xl px-3 py-2">
        <ShieldCheck className="w-4 h-4 flex-shrink-0" />
        <span className="text-xs font-semibold">100% Blij-Dier Garantie</span>
      </div>
    )
  }

  // inline (default)
  return (
    <div className="flex items-center gap-3 bg-trust-50 border border-trust-200 rounded-xl p-4">
      <div className="w-10 h-10 bg-trust-100 rounded-xl flex items-center justify-center flex-shrink-0">
        <ShieldCheck className="w-5 h-5 text-trust-600" />
      </div>
      <div>
        <p className="font-bold text-trust-800 text-sm">100% Blij-Dier Garantie</p>
        <p className="text-xs text-trust-600">Niet tevreden? Geld terug, geen vragen.</p>
      </div>
    </div>
  )
}
