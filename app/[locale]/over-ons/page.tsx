import { Heart, Package, Star, Users } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata() {
  const t = await getTranslations('aboutUs')
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  }
}

export default async function OverOnsPage() {
  const t = await getTranslations('aboutUs')

  const stats = [
    { label: t('statProducts'), value: t('statProductsValue'), icon: Package },
    { label: t('statCategories'), value: t('statCategoriesValue'), icon: Heart },
    { label: t('statReturn'), value: t('statReturnValue'), icon: Star },
    { label: t('statShipping'), value: t('statShippingValue'), icon: Users },
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

      {/* Statistieken */}
      <section className="py-12 px-4 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <stat.icon className="w-8 h-8 text-orange-500 mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ons verhaal */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-5">{t('ourStoryTitle')}</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>{t('ourStoryP1')}</p>
                <p>{t('ourStoryP2')}</p>
                <p>{t('ourStoryP3')}</p>
              </div>
            </div>
            <div className="bg-orange-50 rounded-3xl p-8 text-center">
              <p className="text-8xl mb-4">&#x1F43E;</p>
              <blockquote className="text-lg italic text-gray-700">
                &ldquo;{t('quote')}&rdquo;
              </blockquote>
              <p className="text-sm text-gray-500 mt-3">{t('quoteAuthor')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Onze waarden */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">{t('valuesTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                emoji: '\uD83D\uDC9A',
                title: t('valueSustainabilityTitle'),
                text: t('valueSustainabilityText'),
              },
              {
                emoji: '\uD83D\uDD2C',
                title: t('valueQualityTitle'),
                text: t('valueQualityText'),
              },
              {
                emoji: '\u2764\uFE0F',
                title: t('valueAnimalWelfareTitle'),
                text: t('valueAnimalWelfareText'),
              },
            ].map((value) => (
              <div key={value.title} className="card p-6 text-center">
                <div className="text-4xl mb-4">{value.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Waarom PawsNL */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">{t('whyTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { emoji: '\uD83D\uDD0D', title: t('whySelectedTitle'), text: t('whySelectedText') },
              { emoji: '\uD83D\uDCB0', title: t('whyPricesTitle'), text: t('whyPricesText') },
              { emoji: '\uD83D\uDCE6', title: t('whyShippingTitle'), text: t('whyShippingText') },
            ].map((item) => (
              <div key={item.title} className="card p-6 text-center">
                <div className="text-4xl mb-4">{item.emoji}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-orange-500 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">{t('ctaTitle')}</h2>
        <p className="text-orange-100 mb-8 max-w-md mx-auto">
          {t('ctaDescription')}
        </p>
        <a
          href="/producten"
          className="bg-white text-orange-500 font-bold py-3 px-8 rounded-xl hover:bg-orange-50 transition-colors inline-block"
        >
          {t('ctaButton')}
        </a>
      </section>
    </div>
  )
}
