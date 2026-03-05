'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

export default function ContactPage() {
  const t = useTranslations('contact')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error()
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('heroTitle')}</h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          {t('heroDescription')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contactgegevens */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">{t('contactDetails')}</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{t('emailLabel')}</p>
                  <a
                    href="mailto:info@pawsnlshop.com"
                    className="text-gray-500 hover:text-orange-500 transition-colors text-sm"
                  >
                    info@pawsnlshop.com
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{t('phoneLabel')}</p>
                  <a
                    href="tel:+31681473561"
                    className="text-gray-500 hover:text-orange-500 transition-colors text-sm"
                  >
                    06 - 814 73 561
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{t('addressLabel')}</p>
                  <p className="text-gray-500 text-sm">
                    Weverstraat 227<br />4204CB Gorinchem
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{t('hoursLabel')}</p>
                  <p className="text-gray-500 text-sm whitespace-pre-line">
                    {t('hoursValue')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-orange-50 border-orange-100">
            <p className="text-sm text-gray-700">
              <strong className="text-orange-600">{t('quickResponse')}</strong> {t('quickResponseText')}
            </p>
          </div>
        </div>

        {/* Formulier */}
        <div className="lg:col-span-2">
          {status === 'success' ? (
            <div className="card p-10 text-center">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('successTitle')}</h2>
              <p className="text-gray-500 mb-6">
                {t('successDescription')}
              </p>
              <button onClick={() => { setStatus('idle'); setFormData({ name: '', email: '', subject: '', message: '' }) }} className="btn-primary">
                {t('sendAnother')}
              </button>
            </div>
          ) : (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">{t('formTitle')}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('nameLabel')}
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input"
                      placeholder={t('namePlaceholder')}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      {t('emailFieldLabel')}
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                      placeholder={t('emailPlaceholder')}
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('subjectLabel')}
                  </label>
                  <select
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="input"
                  >
                    <option value="">{t('subjectPlaceholder')}</option>
                    <option value="order-inquiry">{t('subjectOrder')}</option>
                    <option value="return">{t('subjectReturn')}</option>
                    <option value="product-question">{t('subjectProduct')}</option>
                    <option value="complaint">{t('subjectComplaint')}</option>
                    <option value="other">{t('subjectOther')}</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
                    {t('messageLabel')}
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="input resize-none"
                    placeholder={t('messagePlaceholder')}
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                    {t('errorMessage')}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="btn-primary flex items-center gap-2"
                >
                  {status === 'loading' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('sending')}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t('submitButton')}
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
