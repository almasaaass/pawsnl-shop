'use client'

import { useState } from 'react'
import { Mail, Gift, CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function NewsletterSection() {
  const t = useTranslations('newsletter')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

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
    <section className="py-20 md:py-28 px-6" style={{ backgroundColor: '#1d1d1f' }}>
      <div className="max-w-3xl mx-auto text-center">
        {/* Icon */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="flex items-center justify-center mb-6">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              <Gift className="w-6 h-6" style={{ color: '#ffffff' }} />
            </div>
          </div>
        </ScrollReveal>

        {/* Headline */}
        <ScrollReveal animation="fade-up" delay={100} duration={700}>
          <h2
            className="text-3xl md:text-5xl font-semibold tracking-tight mb-4"
            style={{ color: '#f5f5f7', letterSpacing: '-0.015em' }}
          >
            {t('title')}
          </h2>
        </ScrollReveal>

        {/* Subtitle */}
        <ScrollReveal animation="fade-up" delay={200} duration={700}>
          <p
            className="text-lg md:text-xl mb-10"
            style={{ color: '#a1a1a6', lineHeight: 1.5 }}
          >
            {t('description')}
          </p>
        </ScrollReveal>

        {/* Form or Success */}
        <ScrollReveal animation="fade-up" delay={300} duration={700}>
          {success ? (
            <div
              className="flex items-center justify-center gap-3 font-medium text-lg py-4"
              style={{ color: '#f5f5f7' }}
            >
              <CheckCircle className="w-6 h-6" style={{ color: '#34c759' }} />
              <span>{t('successMessage')}</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto items-center"
            >
              <div className="relative flex-1 w-full">
                <Mail
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: '#86868b' }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  required
                  className="w-full outline-none text-base transition-all duration-300 focus:ring-2"
                  style={{
                    padding: '14px 20px 14px 48px',
                    borderRadius: '980px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: '#f5f5f7',
                    fontSize: '17px',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#0071e3'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0, 113, 227, 0.3)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 whitespace-nowrap font-medium text-base transition-all duration-300 hover:opacity-80 disabled:opacity-50"
                style={{
                  backgroundColor: '#0071e3',
                  color: '#ffffff',
                  padding: '14px 28px',
                  borderRadius: '980px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '17px',
                }}
              >
                {loading ? (
                  <div
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                  />
                ) : (
                  <Gift className="w-5 h-5" />
                )}
                {loading ? t('sending') : t('submitButton')}
              </button>
            </form>
          )}

          {error && (
            <p className="text-sm mt-4" style={{ color: '#ff3b30' }}>
              {error}
            </p>
          )}

          <p
            className="text-sm mt-5"
            style={{ color: '#6e6e73' }}
          >
            {t('noSpam')}
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
