'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useCart } from '@/components/cart/CartContext'
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react'
import { Suspense } from 'react'
import ReferralCard from '@/components/shop/ReferralCard'
import ConversionTracker from '@/components/ConversionTracker'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

function BevestigingContent() {
  const t = useTranslations('confirmation')
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const { clearCart } = useCart()
  const [cleared, setCleared] = useState(false)
  const [orderValue, setOrderValue] = useState(0)

  useEffect(() => {
    if (!cleared && sessionId) {
      clearCart()
      setCleared(true)
      fetch(`/api/order-value?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => setOrderValue(data.value))
        .catch(() => {})
    }
  }, [sessionId, cleared, clearCart])

  if (!sessionId) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <p className="text-gray-500">{t('noOrder')}</p>
        <Link href="/" className="btn-primary inline-block mt-4">{t('goHome')}</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {orderValue > 0 && <ConversionTracker value={orderValue} orderId={sessionId || undefined} />}

      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">{t('title')}</h1>
      <p className="text-lg text-gray-600 mb-8">{t('thankYou')}</p>

      <div className="card p-4 mb-8 inline-block">
        <p className="text-xs text-gray-500 mb-1">{t('referenceNumber')}</p>
        <p className="font-mono text-sm text-gray-900 font-medium">{sessionId.slice(0, 30)}...</p>
      </div>

      <div className="card p-6 mb-8 text-left">
        <h2 className="text-lg font-bold text-gray-900 mb-4">{t('whatHappensNow')}</h2>
        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{t('confirmationEmail')}</p>
              <p className="text-sm text-gray-500">{t('confirmationEmailDescription')}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Package className="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{t('shipping')}</p>
              <p className="text-sm text-gray-500">{t('shippingDescription')}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <ReferralCard sessionId={sessionId} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/producten" className="btn-primary inline-flex items-center gap-2">
          {t('continueShopping')}
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link href="/" className="btn-secondary">{t('goHome')}</Link>
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
