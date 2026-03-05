import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('returnPolicy')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default async function RetourbeleidPage() {
  const t = await getTranslations('returnPolicy')

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
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

      {/* Inhoud */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-10">
            {/* Retourvoorwaarden */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('conditionsTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: t('conditionsP1') }} />
                <p>{t('conditionsP2')}</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>{t('conditionsItem1')}</li>
                  <li>{t('conditionsItem2')}</li>
                  <li>{t('conditionsItem3')}</li>
                </ul>
              </div>
            </div>

            {/* Retour aanvragen */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('requestTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  {t.rich('requestP1', {
                    email: (chunks) => (
                      <a href="mailto:info@pawsnlshop.com" className="text-orange-500 hover:underline font-medium">
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>{t('requestItem1')}</li>
                  <li>{t('requestItem2')}</li>
                  <li>{t('requestItem3')}</li>
                </ul>
                <p>{t('requestP2')}</p>
              </div>
            </div>

            {/* Retourkosten */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('costsTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('costsP1')}</p>
                <p>
                  {t.rich('costsP2', {
                    email: (chunks) => (
                      <a href="mailto:info@pawsnlshop.com" className="text-orange-500 hover:underline font-medium">
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </div>
            </div>

            {/* Terugbetaling */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('refundTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: t('refundP1') }} />
                <p>{t('refundP2')}</p>
              </div>
            </div>

            {/* Uitzonderingen */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('exceptionsTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('exceptionsP1')}</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>{t('exceptionsItem1')}</li>
                  <li>{t('exceptionsItem2')}</li>
                  <li>{t('exceptionsItem3')}</li>
                  <li>{t('exceptionsItem4')}</li>
                </ul>
                <p>{t('exceptionsP2')}</p>
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
