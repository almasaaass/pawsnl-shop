'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/components/cart/CartContext'
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

function BevestigingContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCart()
  const [cleared, setCleared] = useState(false)

  useEffect(() => {
    if (!cleared && sessionId) {
      clearCart()
      setCleared(true)
    }
  }, [sessionId, cleared, clearCart])

  if (!sessionId) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">Geen bestelling gevonden.</p>
        <Link href="/" className="btn-primary inline-block mt-4">Naar homepage</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {/* Succes icoon */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Bestelling geplaatst!</h1>
      <p className="text-lg text-gray-600 mb-8">
        Bedankt voor je bestelling bij PawsNL. Je ontvangt een bevestigingsmail.
      </p>

      {/* Order ID */}
      <div className="card p-4 mb-8 inline-block">
        <p className="text-xs text-gray-500 mb-1">Referentienummer</p>
        <p className="font-mono text-sm text-gray-900 font-medium">{sessionId.slice(0, 30)}...</p>
      </div>

      {/* Volgende stappen */}
      <div className="card p-6 mb-8 text-left">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Wat nu?</h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Bevestigingsmail</p>
              <p className="text-sm text-gray-500">
                Je ontvangt een bevestiging per e-mail met alle orderdetails.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Verzending</p>
              <p className="text-sm text-gray-500">
                We verzenden je bestelling binnen 1-2 werkdagen. Je ontvangt een track & trace
                code zodra je pakket onderweg is.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/producten" className="btn-primary inline-flex items-center gap-2">
          Verder winkelen
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/" className="btn-secondary">
          Naar homepage
        </Link>
      </div>
    </div>
  )
}

export default function BevestigingPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <BevestigingContent />
    </Suspense>
  )
}
