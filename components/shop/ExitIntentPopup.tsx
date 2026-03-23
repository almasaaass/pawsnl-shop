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
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xl ${
        isClosing ? 'animate-fade-in [animation-direction:reverse]' : 'animate-fade-in'
      }`}
    >
      <div
        className={`relative bg-white/95 backdrop-blur-2xl rounded-[20px] max-w-[400px] w-full overflow-hidden ${
          isClosing ? 'animate-scale-in [animation-direction:reverse]' : 'animate-scale-in'
        }`}
        style={{
          boxShadow: '0 24px 80px rgba(0,0,0,0.14), 0 0 1px rgba(0,0,0,0.12)',
        }}
      >
        {/* Close button */}
        <button
          onClick={close}
          className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#f5f5f7] transition-colors duration-200 z-10"
        >
          <X className="w-4 h-4 text-[#86868b]" />
        </button>

        {/* Content area — flat white, no gradient */}
        <div className="px-8 pt-10 pb-2 text-center">
          <div className="w-14 h-14 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-5">
            <Gift className="w-7 h-7 text-[#1d1d1f]" />
          </div>

          <h2 className="text-[28px] font-bold text-[#1d1d1f] tracking-[-0.03em] leading-tight mb-2">
            {t('waitTitle')}
          </h2>
          <p className="text-[17px] font-semibold text-[#1d1d1f] tracking-[-0.01em]">
            {t('discountOffer')}
          </p>
        </div>

        <div className="px-8 pb-8 pt-4">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-[#e8faf0] rounded-full flex items-center justify-center mx-auto mb-3 animate-scale-in">
                <CheckCircle className="w-6 h-6 text-[#34c759]" />
              </div>
              <h3 className="font-bold text-[#1d1d1f] text-[17px] mb-1">{t('discountSentTitle')}</h3>
              <p className="text-[13px] text-[#86868b] leading-relaxed">{t('discountSentDescription')}</p>
              <button
                onClick={close}
                className="mt-5 inline-flex items-center justify-center bg-accent-500 hover:bg-accent-600 text-white text-[14px] font-medium px-6 py-2.5 rounded-full transition-colors duration-200"
              >
                {t('continueShopping')}
              </button>
            </div>
          ) : (
            <>
              <p className="text-[13px] text-[#86868b] text-center mb-5 leading-relaxed">
                {t('emailDescription')}
              </p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#86868b]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('emailPlaceholder')}
                    required
                    className="w-full bg-[#f5f5f7] border-0 rounded-full py-3 pl-11 pr-4 text-[14px] text-[#1d1d1f] placeholder-[#86868b] outline-none focus:ring-2 focus:ring-[#0071e3] focus:ring-offset-0 transition-all duration-200"
                  />
                </div>

                {error && (
                  <p className="text-[13px] text-[#ff3b30] text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 disabled:bg-[#d2d2d7] disabled:text-white text-white text-[15px] font-medium py-3 rounded-full transition-colors duration-200"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Gift className="w-4 h-4" />
                  )}
                  {loading ? t('sending') : t('submitButton')}
                </button>
              </form>

              <button
                onClick={close}
                className="w-full text-center text-[12px] text-[#86868b] mt-4 hover:text-[#1d1d1f] transition-colors duration-200"
              >
                {t('noThanks')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
