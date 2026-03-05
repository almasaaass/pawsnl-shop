'use client'

import { useState } from 'react'
import { Search, Package, Truck, CheckCircle, Clock, XCircle, ChevronRight, Mail } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface TrackedOrder {
  id: string
  items: { name: string; quantity: number }[]
  total: number
  status: string
  statusLabel: string
  statusDescription: string
  step: number
  date: string
  city: string
}

const STEPS = [
  { label: 'Bestelling ontvangen', icon: Package },
  { label: 'Onderweg', icon: Truck },
  { label: 'Afgeleverd', icon: CheckCircle },
]

export default function TrackPage() {
  const [email, setEmail] = useState('')
  const [orders, setOrders] = useState<TrackedOrder[] | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    setError('')
    setOrders(null)

    try {
      const res = await fetch(`/api/track?email=${encodeURIComponent(email.trim())}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Er is iets misgegaan')
      } else {
        setOrders(data.orders)
      }
    } catch {
      setError('Er is iets misgegaan. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 rounded-full px-4 py-2 mb-4 text-sm font-semibold">
            <Truck className="w-4 h-4" />
            Bestelling volgen
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Waar is mijn <span className="text-blue-600">pakket</span>?
          </h1>
          <p className="text-gray-600 mb-8">
            Voer je e-mailadres in om de status van je bestelling(en) te bekijken.
          </p>

          {/* Zoekformulier */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="je@email.nl"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Zoeken
                </>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* Resultaten */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-5 text-center">
              <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-red-700 font-medium">{error}</p>
              <p className="text-red-500 text-sm mt-1">Controleer je e-mailadres en probeer het opnieuw.</p>
            </div>
          )}

          {orders && orders.length > 0 && (
            <div className="space-y-6">
              <p className="text-sm text-gray-500">{orders.length} bestelling(en) gevonden</p>

              {orders.map((order) => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  {/* Header */}
                  <div className="bg-gray-50 px-6 py-4 flex items-center justify-between flex-wrap gap-2">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wider">Bestelling</p>
                      <p className="font-mono font-bold text-gray-900">#{order.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">{formatDate(order.date)}</p>
                      <p className="font-bold text-gray-900">{formatPrice(order.total)}</p>
                    </div>
                  </div>

                  {/* Status tracker */}
                  <div className="px-6 py-6">
                    {order.status === 'cancelled' ? (
                      <div className="flex items-center gap-3 bg-red-50 rounded-xl p-4">
                        <XCircle className="w-6 h-6 text-red-500" />
                        <div>
                          <p className="font-semibold text-red-700">Geannuleerd</p>
                          <p className="text-sm text-red-500">Deze bestelling is geannuleerd.</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Stappen */}
                        <div className="flex items-center justify-between mb-6">
                          {STEPS.map((step, i) => {
                            const isActive = i + 1 <= order.step
                            const isCurrent = i + 1 === order.step
                            const StepIcon = step.icon
                            return (
                              <div key={step.label} className="flex items-center flex-1">
                                <div className="flex flex-col items-center flex-1">
                                  <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                                      isActive
                                        ? isCurrent
                                          ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                                          : 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-400'
                                    }`}
                                  >
                                    <StepIcon className="w-5 h-5" />
                                  </div>
                                  <span className={`text-xs font-medium text-center ${isActive ? 'text-blue-700' : 'text-gray-400'}`}>
                                    {step.label}
                                  </span>
                                </div>
                                {i < STEPS.length - 1 && (
                                  <div className={`h-0.5 flex-1 mx-2 mb-6 ${i + 1 < order.step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                                )}
                              </div>
                            )
                          })}
                        </div>

                        {/* Status beschrijving */}
                        <div className="bg-blue-50 rounded-xl p-4 flex items-start gap-3">
                          <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-semibold text-blue-800">{order.statusLabel}</p>
                            <p className="text-sm text-blue-600 mt-0.5">{order.statusDescription}</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Producten */}
                  <div className="px-6 pb-5">
                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Producten</p>
                    <div className="space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-700">{item.name}</span>
                          <span className="text-gray-500">{item.quantity}x</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* FAQ */}
          {!orders && !error && (
            <div className="space-y-6 mt-8">
              <h2 className="text-xl font-bold text-gray-900">Veelgestelde vragen</h2>
              <div className="space-y-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-1">Hoe lang duurt de levering?</h3>
                  <p className="text-sm text-gray-600">De gemiddelde levertijd is 7-14 werkdagen na verzending.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-1">Mijn bestelling staat op &quot;Onderweg&quot;, maar ik heb niks ontvangen</h3>
                  <p className="text-sm text-gray-600">Internationale verzendingen kunnen soms vertraging oplopen. Als je na 21 werkdagen nog niets hebt ontvangen, neem dan contact met ons op.</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                  <h3 className="font-semibold text-gray-900 mb-1">Ik heb geen bevestigingsmail ontvangen</h3>
                  <p className="text-sm text-gray-600">Controleer je spam/ongewenste e-mail map. Nog steeds niet gevonden? Neem contact op via info@pawsnlshop.com.</p>
                </div>
              </div>

              <div className="text-center pt-4">
                <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium text-sm inline-flex items-center gap-1">
                  Meer hulp nodig? Neem contact op
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
