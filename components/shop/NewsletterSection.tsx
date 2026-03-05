'use client'

import { useState } from 'react'
import { Mail, Gift, CheckCircle } from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import { useTranslations } from 'next-intl'

export default function NewsletterSection() {
  const t = useTranslations('newsletter')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const { ref, isInView } = useInView({ threshold: 0.2 })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'footer' }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || t('errorGeneric'))
        return
      }

      setSuccess(true)
      setEmail('')
    } catch {
      setError(t('errorRetry'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section ref={ref} className="section">
      <div className={`bg-gradient-to-br from-accent-50 to-warm-100 rounded-2xl border border-accent-100 p-8 md:p-12 ${
        isInView ? 'animate-fade-in-up' : 'opacity-0'
      }`}>
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-6 h-6 text-accent-500" />
          </div>

          <h2 className="text-2xl font-bold text-charcoal mb-2">{t('title')}</h2>
          <p className="text-gray-600 mb-6">{t('description')}</p>

          {success ? (
            <div className="flex items-center justify-center gap-2 text-trust-600 font-medium animate-scale-in">
              <CheckCircle className="w-5 h-5" />
              {t('successMessage')}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="relative flex-1">
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
              <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2 whitespace-nowrap">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Gift className="w-4 h-4" />
                )}
                {loading ? t('sending') : t('submitButton')}
              </button>
            </form>
          )}

          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
          <p className="text-xs text-gray-400 mt-4">{t('noSpam')}</p>
        </div>
      </div>
    </section>
  )
}
