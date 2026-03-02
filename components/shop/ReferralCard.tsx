'use client'

import { useState } from 'react'
import { Copy, Check, Share2, Gift } from 'lucide-react'

interface ReferralCardProps {
  sessionId: string
}

export default function ReferralCard({ sessionId }: ReferralCardProps) {
  const [copied, setCopied] = useState(false)

  // Generate referral code from session ID
  const referralCode = btoa(sessionId.slice(0, 20)).replace(/[+/=]/g, '').slice(0, 8).toUpperCase()
  const referralLink = `https://pawsshop.nl/?ref=${referralCode}`

  const shareText = `Hey! Ik heb net iets leuks besteld bij PawsNL voor mijn huisdier 🐾 Via deze link krijgen we allebei €5 korting: ${referralLink}`

  function copyLink() {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)

    // Track referral share
    fetch('/api/referral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referralCode, action: 'share' }),
    }).catch(() => {})
  }

  function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')

    fetch('/api/referral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referralCode, action: 'whatsapp' }),
    }).catch(() => {})
  }

  return (
    <div className="card p-6 text-left">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
          <Gift className="w-6 h-6 text-purple-500" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-gray-900 mb-1">
            Deel & verdien €5 korting!
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Deel je unieke link met een vriend. Als zij bestellen, krijgen jullie allebei €5 korting op de volgende bestelling!
          </p>

          {/* Referral link */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 font-mono truncate">
              {referralLink}
            </div>
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors flex-shrink-0"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Gekopieerd!' : 'Kopieer'}
            </button>
          </div>

          {/* Share buttons */}
          <div className="flex gap-2">
            <button
              onClick={shareWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Deel via WhatsApp
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'PawsNL korting', text: shareText, url: referralLink })
                } else {
                  copyLink()
                }
              }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Meer opties</span>
            </button>
          </div>

          {/* How it works */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Hoe werkt het?</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="text-xs text-gray-500">
                <div className="text-lg mb-1">1️⃣</div>
                Deel je link
              </div>
              <div className="text-xs text-gray-500">
                <div className="text-lg mb-1">2️⃣</div>
                Vriend bestelt
              </div>
              <div className="text-xs text-gray-500">
                <div className="text-lg mb-1">3️⃣</div>
                Beiden €5 korting!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
