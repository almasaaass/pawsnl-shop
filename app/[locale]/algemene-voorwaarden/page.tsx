import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('terms')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default async function AlgemeneVoorwaardenPage() {
  const t = await getTranslations('terms')

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

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-10">
            {/* Artikel 1 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('art1Title')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('art1P1')}</p>
                <p>{t('art1P2')}</p>
                <p>{t('art1P3')}</p>
              </div>
            </div>

            {/* Artikel 2 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('art2Title')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <ul className="list-none space-y-1 ml-2">
                  <li><strong>{t('tradeName')}</strong> {t('tradeNameValue')}</li>
                  <li><strong>{t('registeredAddress')}</strong> {t('registeredAddressValue')}</li>
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

            {/* Artikel 3 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('art3Title')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: t('art3P1') }} />
                <p>{t('art3P2')}</p>
                <p>{t('art3P3')}</p>
                <p>{t('art3P4')}</p>
              </div>
            </div>

            {/* Artikel 4 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('art4Title')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('art4P1')}</p>
                <p>{t('art4P2')}</p>
              </div>
            </div>

            {/* Artikel 5 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('art5Title')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: t('art5P1') }} />
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>{t('art5Item1')}</li>
                  <li>{t('art5Item2')}</li>
                  <li>{t('art5Item3')}</li>
                  <li>{t('art5Item4')}</li>
                  <li>{t('art5Item5')}</li>
                </ul>
                <p>{t('art5P2')}</p>
              </div>
            </div>

            {/* Artikel 6 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('art6Title')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: t('art6P1') }} />
                <p>{t('art6P2')}</p>
                <p>{t('art6P3')}</p>
              </div>
            </div>

            {/* Artikel 7 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('art7Title')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: t('art7P1') }} />
                <p>
                  {t.rich('art7P2', {
                    email: (chunks) => (
                      <a href="mailto:info@pawsnlshop.com" className="text-orange-500 hover:underline font-medium">
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
                <p>{t('art7P3')}</p>
                <p>{t('art7P4')}</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>{t('art7Item1')}</li>
                  <li>{t('art7Item2')}</li>
                  <li>{t('art7Item3')}</li>
                </ul>
              </div>
            </div>

            {/* Artikel 8 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('art8Title')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  {t.rich('art8P1', {
                    strong: (chunks) => <strong>{chunks}</strong>,
                    email: (chunks) => (
                      <a href="mailto:info@pawsnlshop.com" className="text-orange-500 hover:underline font-medium">
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
                <p dangerouslySetInnerHTML={{ __html: t('art8P2') }} />
                <p>
                  {t.rich('art8P3', {
                    odr: (chunks) => (
                      <a
                        href="https://ec.europa.eu/consumers/odr"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:underline font-medium"
                      >
                        {chunks}
                      </a>
                    ),
                  })}
                </p>
              </div>
            </div>

            {/* Artikel 9 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('art9Title')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('art9P1')}</p>
                <p>{t('art9P2')}</p>
                <p>{t('art9P3')}</p>
              </div>
            </div>

            {/* Artikel 10 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('art10Title')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: t('art10P1') }} />
                <p>{t('art10P2')}</p>
              </div>
            </div>

            {/* Slotbepalingen */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('art11Title')}</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>{t('art11P1')}</p>
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
