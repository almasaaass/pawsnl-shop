import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('shippingPolicy')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default async function VerzendbeleidPage() {
  const t = await getTranslations('shippingPolicy')

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-3">
            {t('badge')}
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('heroTitle')}<span className="text-orange-500">{t('heroTitleHighlight')}</span>{t('heroTitleEnd')}
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {t('heroDescription')}
          </p>
        </div>
      </section>

      {/* Inhoud */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-10">
            {/* Verzendkosten */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('costsTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                    <p className="text-green-700 font-bold text-lg">{t('freeShippingLabel')}</p>
                    <p className="text-green-600 text-sm mt-1">{t('freeShippingNote')}</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
                    <p className="text-gray-900 font-bold text-lg">{t('paidShippingLabel')}</p>
                    <p className="text-gray-500 text-sm mt-1">{t('paidShippingNote')}</p>
                  </div>
                </div>
                <p>{t('costsP1')}</p>
              </div>
            </div>

            {/* Levertijd */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('deliveryTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: t('deliveryP1') }} />
                <p>{t('deliveryP2')}</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>{t('deliveryItem1')}</li>
                  <li>{t('deliveryItem2')}</li>
                  <li>{t('deliveryItem3')}</li>
                </ul>
              </div>
            </div>

            {/* Track & Trace */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('trackTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: t('trackP1') }} />
                <p>
                  {t.rich('trackP2', {
                    email: (chunks) => (
                      <a href="mailto:info@pawsnlshop.com" className="text-orange-500 hover:underline font-medium">
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </div>
            </div>

            {/* Bezorggebied */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('areaTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('areaP1')}</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>{t('areaNetherlands')}</strong></li>
                  <li><strong>{t('areaBelgium')}</strong></li>
                  <li><strong>{t('areaGermany')}</strong></li>
                </ul>
                <p>{t('areaP2')}</p>
              </div>
            </div>

            {/* Vertragingen */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('delaysTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('delaysP1')}</p>
                <p>{t('delaysP2')}</p>
              </div>
            </div>

            {/* Pakket niet ontvangen */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('notReceivedTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  {t.rich('notReceivedP1', {
                    email: (chunks) => (
                      <a href="mailto:info@pawsnlshop.com" className="text-orange-500 hover:underline font-medium">
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-orange-50 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('ctaTitle')}</h3>
              <p className="text-gray-600 mb-4">
                {t('ctaDescription')}
              </p>
              <a
                href="mailto:info@pawsnlshop.com"
                className="inline-block bg-orange-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-orange-600 transition-colors"
              >
                {t('ctaButton')}
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
