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
    <section className="py-16 md:py-24 px-5 sm:px-6 bg-apple-black">
      <div className="max-w-2xl mx-auto text-center">
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/10">
              <Gift className="w-6 h-6 text-white" />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={100} duration={700}>
          <h2 className="text-[28px] md:text-[40px] font-semibold tracking-tight mb-4 text-apple-offwhite">
            {t('title')}
          </h2>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={200} duration={700}>
          <p className="text-[17px] mb-10 text-[#86868b] leading-relaxed">
            {t('description')}
          </p>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={300} duration={700}>
          {success ? (
            <div className="flex items-center justify-center gap-3 font-medium text-[17px] py-4 text-apple-offwhite">
              <CheckCircle className="w-6 h-6 text-[#34c759]" />
              <span>{t('successMessage')}</span>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto items-center"
            >
              <div className="relative flex-1 w-full">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#86868b]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('emailPlaceholder')}
                  required
                  className="w-full outline-none text-[15px] py-3 pl-12 pr-5 rounded-full bg-white/[0.08] border border-white/20 text-apple-offwhite placeholder:text-[#86868b] focus:border-apple-blue focus:ring-2 focus:ring-apple-blue/30 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 whitespace-nowrap font-medium text-[15px] py-3 px-6 rounded-full bg-apple-blue text-white hover:opacity-90 disabled:opacity-50 transition-opacity"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Gift className="w-5 h-5" />
                )}
                {loading ? t('sending') : t('submitButton')}
              </button>
            </form>
          )}

          {error && (
            <p className="text-sm mt-4 text-[#ff3b30]">{error}</p>
          )}

          <p className="text-sm mt-5 text-[#48484a]">
            {t('noSpam')}
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
