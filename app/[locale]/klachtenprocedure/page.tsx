import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('complaints')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default async function KlachtenprocedurePage() {
  const t = await getTranslations('complaints')

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
            {/* Stap 1 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('step1Title')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: t('step1P1') }} />
                <p>{t('step1P2')}</p>
                <ul className="list-none space-y-2 ml-2">
                  <li>
                    <strong>{t('step1Email')}</strong>{' '}
                    <a href="mailto:info@pawsnlshop.com" className="text-orange-500 hover:underline font-medium">
                      info@pawsnlshop.com
                    </a>
                  </li>
                  <li>
                    <strong>{t('step1Phone')}</strong>{' '}
                    <a href="tel:+31681473561" className="text-orange-500 hover:underline font-medium">
                      06 - 814 73 561
                    </a>{' '}
                    {t('step1PhoneHours')}
                  </li>
                </ul>
                <p>{t('step1P3')}</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>{t('step1Item1')}</li>
                  <li>{t('step1Item2')}</li>
                  <li>{t('step1Item3')}</li>
                  <li>{t('step1Item4')}</li>
                </ul>
              </div>
            </div>

            {/* Stap 2 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('step2Title')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: t('step2P1') }} />
              </div>
            </div>

            {/* Stap 3 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('step3Title')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: t('step3P1') }} />
                <p>{t('step3P2')}</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>{t('step3Item1')}</li>
                  <li>{t('step3Item2')}</li>
                  <li>{t('step3Item3')}</li>
                  <li>{t('step3Item4')}</li>
                </ul>
              </div>
            </div>

            {/* Stap 4 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('step4Title')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('step4P1')}</p>
                <div className="bg-orange-50 rounded-xl p-5 mt-4">
                  <p className="font-semibold text-gray-900 mb-2">
                    {t('odrTitle')}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    {t('odrDescription')}
                  </p>
                  <a
                    href="https://ec.europa.eu/consumers/odr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-orange-500 text-white text-sm font-bold py-2.5 px-6 rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    {t('odrButton')}
                  </a>
                </div>
              </div>
            </div>

            {/* Onze belofte */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('promiseTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('promiseP1')}</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>{t('promiseItem1')}</li>
                  <li>{t('promiseItem2')}</li>
                  <li>{t('promiseItem3')}</li>
                  <li>{t('promiseItem4')}</li>
                </ul>
              </div>
            </div>

            {/* Bedrijfsgegevens */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('companyTitle')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <ul className="list-none space-y-1 ml-2">
                  <li><strong>{t('companyNameLabel')}</strong> {t('companyNameValue')}</li>
                  <li><strong>{t('companyAddressLabel')}</strong> {t('companyAddressValue')}</li>
                  <li><strong>{t('companyKvkLabel')}</strong> {t('companyKvkValue')}</li>
                  <li><strong>{t('companyBtwLabel')}</strong> {t('companyBtwValue')}</li>
                  <li><strong>{t('companyPhoneLabel')}</strong> {t('companyPhoneValue')}</li>
                  <li><strong>{t('companyEmailLabel')}</strong>{' '}
                    <a href="mailto:info@pawsnlshop.com" className="text-orange-500 hover:underline font-medium">
                      info@pawsnlshop.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-orange-50 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">{t('ctaTitle')}</h3>
              <p className="text-gray-600 mb-4">
                {t('ctaDescription')}
              </p>
              <a
                href="mailto:info@pawsnlshop.com?subject=Klacht%20-%20Bestelnummer%20"
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
