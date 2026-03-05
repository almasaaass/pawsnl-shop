'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'

type CookiePrefs = {
  functional: true
  analytics: boolean
  marketing: boolean
}

const COOKIE_KEY = 'pawsshop-cookie-consent'

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
  const t = useTranslations('cookie')
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
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900 mb-2">{t('title')}</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {t('description')}{' '}
            <a href="/privacybeleid#cookies" className="text-accent-500 hover:underline font-medium">
              {t('readPolicy')}
            </a>
          </p>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
          showDetails ? 'max-h-80 opacity-100 mb-4' : 'max-h-0 opacity-0'
        }`}>
          <div className="space-y-3 bg-gray-50 rounded-xl p-4">
            <label className="flex items-start gap-3">
              <input type="checkbox" checked disabled className="mt-1 h-4 w-4 rounded border-gray-300 text-accent-500 accent-accent-500" />
              <div>
                <span className="text-sm font-semibold text-gray-900">{t('functional')}</span>
                <span className="ml-2 text-xs text-gray-400">{t('functionalAlwaysOn')}</span>
                <p className="text-xs text-gray-500 mt-0.5">{t('functionalDescription')}</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-accent-500 accent-accent-500" />
              <div>
                <span className="text-sm font-semibold text-gray-900">{t('analytics')}</span>
                <p className="text-xs text-gray-500 mt-0.5">{t('analyticsDescription')}</p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300 text-accent-500 accent-accent-500" />
              <div>
                <span className="text-sm font-semibold text-gray-900">{t('marketing')}</span>
                <p className="text-xs text-gray-500 mt-0.5">{t('marketingDescription')}</p>
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {!showDetails ? (
            <>
              <button onClick={declineAll} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                {t('onlyNecessary')}
              </button>
              <button onClick={() => setShowDetails(true)} className="flex-1 px-4 py-2.5 text-sm font-semibold text-accent-600 bg-accent-50 hover:bg-accent-100 rounded-xl transition-colors">
                {t('customize')}
              </button>
              <button onClick={acceptAll} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-accent-500 hover:bg-accent-600 rounded-xl transition-colors">
                {t('acceptAll')}
              </button>
            </>
          ) : (
            <>
              <button onClick={declineAll} className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                {t('onlyNecessary')}
              </button>
              <button onClick={acceptSelected} className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-accent-500 hover:bg-accent-600 rounded-xl transition-colors">
                {t('savePreferences')}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
