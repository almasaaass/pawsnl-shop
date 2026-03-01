'use client'

import { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    naam: '',
    email: '',
    onderwerp: '',
    bericht: '',
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
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Neem contact op</h1>
        <p className="text-lg text-gray-500 max-w-xl mx-auto">
          Heb je een vraag of opmerking? We helpen je graag!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Contactgegevens */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Contactgegevens</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">E-mail</p>
                  <a
                    href="mailto:info@pawsnl.nl"
                    className="text-gray-500 hover:text-orange-500 transition-colors text-sm"
                  >
                    info@pawsnl.nl
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Telefoon</p>
                  <a
                    href="tel:+31201234567"
                    className="text-gray-500 hover:text-orange-500 transition-colors text-sm"
                  >
                    020 - 123 45 67
                  </a>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Adres</p>
                  <p className="text-gray-500 text-sm">
                    Voorbeeldstraat 1<br />1234 AB Amsterdam
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Clock className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Openingstijden</p>
                  <p className="text-gray-500 text-sm">
                    Ma–Vr: 09:00 – 17:00<br />Za: 10:00 – 14:00
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-orange-50 border-orange-100">
            <p className="text-sm text-gray-700">
              <strong className="text-orange-600">Snelle reactie:</strong> We reageren doorgaans
              binnen 24 uur op werkdagen.
            </p>
          </div>
        </div>

        {/* Formulier */}
        <div className="lg:col-span-2">
          {status === 'success' ? (
            <div className="card p-10 text-center">
              <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Bericht ontvangen!</h2>
              <p className="text-gray-500 mb-6">
                Bedankt voor je bericht. We nemen zo snel mogelijk contact met je op.
              </p>
              <button onClick={() => { setStatus('idle'); setFormData({ naam: '', email: '', onderwerp: '', bericht: '' }) }} className="btn-primary">
                Nieuw bericht sturen
              </button>
            </div>
          ) : (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-5">Stuur ons een bericht</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="naam" className="block text-sm font-medium text-gray-700 mb-1.5">
                      Naam *
                    </label>
                    <input
                      id="naam"
                      type="text"
                      required
                      value={formData.naam}
                      onChange={(e) => setFormData({ ...formData, naam: e.target.value })}
                      className="input"
                      placeholder="Jan de Vries"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                      E-mailadres *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input"
                      placeholder="jan@voorbeeld.nl"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="onderwerp" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Onderwerp *
                  </label>
                  <select
                    id="onderwerp"
                    required
                    value={formData.onderwerp}
                    onChange={(e) => setFormData({ ...formData, onderwerp: e.target.value })}
                    className="input"
                  >
                    <option value="">Selecteer een onderwerp</option>
                    <option value="vraag-over-bestelling">Vraag over mijn bestelling</option>
                    <option value="retour">Retour aanmelden</option>
                    <option value="product-vraag">Productvraag</option>
                    <option value="klacht">Klacht</option>
                    <option value="overig">Overig</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="bericht" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Bericht *
                  </label>
                  <textarea
                    id="bericht"
                    required
                    rows={6}
                    value={formData.bericht}
                    onChange={(e) => setFormData({ ...formData, bericht: e.target.value })}
                    className="input resize-none"
                    placeholder="Schrijf hier je bericht..."
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">
                    Er is iets misgegaan. Probeer het opnieuw of stuur een e-mail.
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
                      Versturen...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Verstuur bericht
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
