'use client'

import { useState } from 'react'
import { ChevronDown, ShoppingCart, Truck, RotateCcw, CreditCard, Package, Mail } from 'lucide-react'
import { useTranslations } from 'next-intl'

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="px-5 pb-5 text-gray-600 leading-relaxed">{answer}</p>
      </div>
    </div>
  )
}

export default function VeelgesteldeVragenPage() {
  const t = useTranslations('faq')

  const categories = [
    {
      name: t('catOrdering'),
      icon: ShoppingCart,
      faqs: [
        { question: t('orderQ1'), answer: t('orderA1') },
        { question: t('orderQ2'), answer: t('orderA2') },
      ],
    },
    {
      name: t('catShipping'),
      icon: Truck,
      faqs: [
        { question: t('shipQ1'), answer: t('shipA1') },
        { question: t('shipQ2'), answer: t('shipA2') },
        { question: t('shipQ3'), answer: t('shipA3') },
      ],
    },
    {
      name: t('catReturns'),
      icon: RotateCcw,
      faqs: [
        { question: t('returnQ1'), answer: t('returnA1') },
        { question: t('returnQ2'), answer: t('returnA2') },
      ],
    },
    {
      name: t('catPayment'),
      icon: CreditCard,
      faqs: [
        { question: t('payQ1'), answer: t('payA1') },
        { question: t('payQ2'), answer: t('payA2') },
      ],
    },
    {
      name: t('catProducts'),
      icon: Package,
      faqs: [
        { question: t('prodQ1'), answer: t('prodA1') },
        { question: t('prodQ2'), answer: t('prodA2') },
        { question: t('prodQ3'), answer: t('prodA3') },
      ],
    },
  ]

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-3">
            {t('badge')}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('heroTitle')}<span className="text-orange-500">{t('heroTitleHighlight')}</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {t('heroDescription')}
          </p>
        </div>
      </section>

      {/* FAQ inhoud */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-12">
          {categories.map((category) => (
            <div key={category.name}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <category.icon className="w-5 h-5 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{category.name}</h2>
              </div>
              <div className="space-y-3">
                {category.faqs.map((faq) => (
                  <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto text-center">
          <Mail className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {t('ctaTitle')}
          </h2>
          <p className="text-gray-600 mb-6">
            {t('ctaDescription')}
          </p>
          <a
            href="/contact"
            className="bg-orange-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-orange-600 transition-colors inline-block"
          >
            {t('ctaButton')}
          </a>
        </div>
      </section>
    </div>
  )
}
