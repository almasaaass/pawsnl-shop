'use client'

import { useState, useEffect, useCallback } from 'react'
import { X, Gift, Mail, CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

const STORAGE_KEY = 'pawsnl-exit-intent-closed'

export default function ExitIntentPopup() {
  const t = useTranslations('exitPopup')
  const [show, setShow] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    if (e.clientY <= 5) {
      const closed = localStorage.getItem(STORAGE_KEY)
      if (!closed) {
        setShow(true)
      }
    }
  }, [])

  useEffect(() => {
    const closed = localStorage.getItem(STORAGE_KEY)
    if (closed) return

    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave)
    }, 10000)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [handleMouseLeave])

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
        body: JSON.stringify({ email, source: 'exit-intent' }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || t('errorGeneric'))
        return
      }

      setSuccess(true)
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      setError(t('errorRetry'))
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
        <button
          onClick={close}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors z-10"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>

        <div className="bg-gradient-to-br from-accent-500 to-accent-600 px-6 py-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-1">{t('waitTitle')}</h2>
          <p className="text-accent-100 text-lg font-semibold">{t('discountOffer')}</p>
        </div>

        <div className="p-6">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-trust-100 rounded-full flex items-center justify-center mx-auto mb-3 animate-scale-in">
                <CheckCircle className="w-6 h-6 text-trust-500" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">{t('discountSentTitle')}</h3>
              <p className="text-sm text-gray-500">{t('discountSentDescription')}</p>
              <button onClick={close} className="btn-primary mt-4 text-sm">{t('continueShopping')}</button>
            </div>
          ) : (
            <>
              <p className="text-sm text-gray-600 text-center mb-4">{t('emailDescription')}</p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    required
                    className="input pl-10"
                  />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 text-base">
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Gift className="w-4 h-4" />
                  )}
                  {loading ? t('sending') : t('submitButton')}
                </button>
              </form>

              <button onClick={close} className="w-full text-center text-xs text-gray-400 mt-3 hover:text-gray-500">
                {t('noThanks')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
