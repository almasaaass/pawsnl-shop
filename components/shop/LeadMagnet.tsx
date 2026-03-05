'use client'

import { useState, useEffect } from 'react'
import { X, Gift, Mail, CheckCircle } from 'lucide-react'

const STORAGE_KEY = 'pawsshop-lead-magnet-closed'

export default function LeadMagnet() {
  const [show, setShow] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const closed = localStorage.getItem(STORAGE_KEY)
    if (closed) return

    const timer = setTimeout(() => setShow(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  function close() {
    setIsClosing(true)
    setTimeout(() => {
      setShow(false)
      localStorage.setItem(STORAGE_KEY, 'true')
    }, 300)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'popup' }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Er ging iets mis.')
        return
      }

      setSuccess(true)
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      setError('Er ging iets mis. Probeer het opnieuw.')
    } finally {
      setLoading(false)
    }
  }

  if (!show) return null

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm ${
      isClosing ? 'animate-fade-in [animation-direction:reverse]' : 'animate-fade-in'
    }`}>
      <div className={`relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden ${
        isClosing ? 'animate-scale-in [animation-direction:reverse]' : 'animate-scale-in'
      }`}>
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors z-10"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        {/* Header gradient */}
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 px-6 py-8 text-center text-white">
          <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold mb-1">Gratis PDF Gids!</h2>
          <p className="text-orange-100 text-sm">
            De Ultieme Gids voor een Blij Huisdier
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-trust-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-scale-in">
                <CheckCircle className="w-6 h-6 text-trust-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">Check je inbox!</h3>
              <p className="text-sm text-gray-500">
                We hebben de gratis gids naar je e-mail gestuurd.
              </p>
              <button onClick={close} className="btn-primary mt-4 text-sm">
                Sluiten
              </button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 text-center mb-4">
                Ontvang onze gratis PDF met tips voor een gezond &amp; blij huisdier.
                Plus exclusieve aanbiedingen!
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Je e-mailadres"
                    required
                    className="input pl-10"
                  />
                </div>

                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Gift className="w-4 h-4" />
                  )}
                  {loading ? 'Versturen...' : 'Gratis ontvangen'}
                </button>
              </form>

              <p className="text-xs text-gray-400 text-center mt-3">
                We respecteren je privacy. Nooit spam.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
