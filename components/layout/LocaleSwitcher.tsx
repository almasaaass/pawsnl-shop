'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'

export default function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  function switchLocale() {
    const next = locale === 'nl' ? 'en' : 'nl'
    router.replace(pathname as any, { locale: next })
  }

  return (
    <button
      onClick={switchLocale}
      className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-accent-500 transition-colors px-2 py-1.5 rounded-lg hover:bg-gray-100"
      aria-label={locale === 'nl' ? 'Switch to English' : 'Naar Nederlands'}
    >
      {locale === 'nl' ? '🇬🇧 EN' : '🇳🇱 NL'}
    </button>
  )
}
