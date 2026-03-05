import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('privacyPolicy')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default async function PrivacybeleidPage() {
  const t = await getTranslations('privacyPolicy')

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

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-10">
            {/* Wie zijn wij */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('whoTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('whoP1')}</p>
                <ul className="list-none space-y-1 ml-2">
                  <li><strong>{t('companyName')}</strong> {t('companyNameValue')}</li>
                  <li><strong>{t('address')}</strong> {t('addressValue')}</li>
                  <li><strong>{t('kvk')}</strong> {t('kvkValue')}</li>
                  <li><strong>{t('btw')}</strong> {t('btwValue')}</li>
                  <li><strong>{t('phone')}</strong> {t('phoneValue')}</li>
                  <li><strong>{t('email')}</strong>{' '}
                    <a href="mailto:info@pawsnlshop.com" className="text-orange-500 hover:underline font-medium">
                      info@pawsnlshop.com
                    </a>
                  </li>
                  <li><strong>{t('website')}</strong>{' '}
                    <a href="https://pawsnlshop.com" className="text-orange-500 hover:underline font-medium">
                      pawsnlshop.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Welke gegevens verzamelen wij */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('dataCollectedTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('dataCollectedP1')}</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>{t('dataItem1')}</li>
                  <li>{t('dataItem2')}</li>
                  <li>{t('dataItem3')}</li>
                  <li>{t('dataItem4')}</li>
                  <li>{t('dataItem5')}</li>
                  <li>{t('dataItem6')}</li>
                </ul>
              </div>
            </div>

            {/* Waarvoor gebruiken wij je gegevens */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('dataUsageTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('dataUsageP1')}</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>{t('usageOrder')}</strong> — {t('usageOrderDesc')}</li>
                  <li><strong>{t('usageService')}</strong> — {t('usageServiceDesc')}</li>
                  <li><strong>{t('usageLegal')}</strong> — {t('usageLegalDesc')}</li>
                  <li><strong>{t('usageMarketing')}</strong> — {t('usageMarketingDesc')}</li>
                </ul>
              </div>
            </div>

            {/* Beveiliging */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('securityTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('securityP1')}</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>{t('securitySSL')}</strong> — {t('securitySSLDesc')}</li>
                  <li><strong>{t('securityStripe')}</strong> — {t('securityStripeDesc')}</li>
                  <li><strong>{t('securityAccess')}</strong> — {t('securityAccessDesc')}</li>
                </ul>
              </div>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('cookiesTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('cookiesP1')}</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>{t('cookiesFunctional')}</strong> — {t('cookiesFunctionalDesc')}</li>
                  <li><strong>{t('cookiesAnalytical')}</strong> — {t('cookiesAnalyticalDesc')}</li>
                </ul>
                <p>{t('cookiesP2')}</p>
              </div>
            </div>

            {/* Delen met derden */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('thirdPartyTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('thirdPartyP1')}</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>{t('thirdStripe')}</strong> — {t('thirdStripeDesc')}</li>
                  <li><strong>{t('thirdCarriers')}</strong> — {t('thirdCarriersDesc')}</li>
                  <li><strong>{t('thirdResend')}</strong> — {t('thirdResendDesc')}</li>
                </ul>
              </div>
            </div>

            {/* Jouw rechten */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('rightsTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('rightsP1')}</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>{t('rightAccess')}</strong> — {t('rightAccessDesc')}</li>
                  <li><strong>{t('rightRectification')}</strong> — {t('rightRectificationDesc')}</li>
                  <li><strong>{t('rightErasure')}</strong> — {t('rightErasureDesc')}</li>
                  <li><strong>{t('rightPortability')}</strong> — {t('rightPortabilityDesc')}</li>
                  <li><strong>{t('rightObjection')}</strong> — {t('rightObjectionDesc')}</li>
                </ul>
                <p>
                  {t.rich('rightsP2', {
                    email: (chunks) => (
                      <a href="mailto:info@pawsnlshop.com" className="text-orange-500 hover:underline font-medium">
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </div>
            </div>

            {/* Bewaartermijn */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('retentionTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('retentionP1')}</p>
              </div>
            </div>

            {/* Wijzigingen */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('changesTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('changesP1')}</p>
                <p className="text-sm text-gray-400">{t('lastUpdated')}</p>
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
