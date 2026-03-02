'use client'

import { useState, useEffect } from 'react'

type CookiePrefs = {
  functional: true // always on
  analytics: boolean
  marketing: boolean
}

const COOKIE_KEY = 'pawsnl-cookie-consent'

function getStoredPrefs(): CookiePrefs | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(COOKIE_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

function savePrefs(prefs: CookiePrefs) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify(prefs))
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const prefs = getStoredPrefs()
    if (!prefs) {
      setVisible(true)
    }
  }, [])

  function dismiss() {
    setIsClosing(true)
    setTimeout(() => setVisible(false), 300)
  }

  function acceptAll() {
    const prefs: CookiePrefs = { functional: true, analytics: true, marketing: true }
    savePrefs(prefs)
    dismiss()
  }

  function acceptSelected() {
    const prefs: CookiePrefs = { functional: true, analytics, marketing }
    savePrefs(prefs)
    dismiss()
  }

  function declineAll() {
    const prefs: CookiePrefs = { functional: true, analytics: false, marketing: false }
    savePrefs(prefs)
    dismiss()
  }

  if (!visible) return null

  return (
    <div className={`fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6 ${
      isClosing ? 'animate-slide-down-out' : 'animate-slide-up-in'
    }`}>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
        {/* Main message */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            Wij gebruiken cookies
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Wij gebruiken functionele cookies om de website goed te laten werken.
            Daarnaast willen we graag analytische en marketing cookies plaatsen om
            jouw ervaring te verbeteren. Je kunt zelf kiezen welke cookies je
            accepteert.{' '}
            <a
              href="/privacybeleid#cookies"
              className="text-accent-500 hover:underline font-medium"
            >
              Lees ons cookiebeleid
            </a>
          </p>
        </div>

        {/* Details toggle — animated */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showDetails ? 'max-h-80 opacity-100 mb-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="space-y-3 bg-gray-50 rounded-xl p-4">
            {/* Functioneel - always on */}
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked
                disabled
                className="mt-1 h-4 w-4 rounded border-gray-300 text-accent-500 accent-accent-500"
              />
              <div>
                <span className="text-sm font-semibold text-gray-900">Functioneel</span>
                <span className="ml-2 text-xs text-gray-400">(altijd aan)</span>
                <p className="text-xs text-gray-500 mt-0.5">
                  Noodzakelijk voor het functioneren van de website, zoals winkelwagen en inloggen.
                </p>
              </div>
            </label>

            {/* Analytisch */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={analytics}
                onChange={(e) => setAnalytics(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-accent-500 accent-accent-500"
              />
              <div>
                <span className="text-sm font-semibold text-gray-900">Analytisch</span>
                <p className="text-xs text-gray-500 mt-0.5">
                  Helpen ons begrijpen hoe bezoekers de website gebruiken, zodat we deze kunnen verbeteren.
                </p>
              </div>
            </label>

            {/* Marketing */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-gray-300 text-accent-500 accent-accent-500"
              />
              <div>
                <span className="text-sm font-semibold text-gray-900">Marketing</span>
                <p className="text-xs text-gray-500 mt-0.5">
                  Worden gebruikt om advertenties relevanter te maken en om de effectiviteit van campagnes te meten.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          {!showDetails ? (
            <>
              <button
                onClick={declineAll}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Alleen noodzakelijk
              </button>
              <button
                onClick={() => setShowDetails(true)}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-accent-600 bg-accent-50 hover:bg-accent-100 rounded-xl transition-colors"
              >
                Voorkeuren aanpassen
              </button>
              <button
                onClick={acceptAll}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-accent-500 hover:bg-accent-600 rounded-xl transition-colors"
              >
                Alles accepteren
              </button>
            </>
          ) : (
            <>
              <button
                onClick={declineAll}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Alleen noodzakelijk
              </button>
              <button
                onClick={acceptSelected}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-accent-500 hover:bg-accent-600 rounded-xl transition-colors"
              >
                Selectie opslaan
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
