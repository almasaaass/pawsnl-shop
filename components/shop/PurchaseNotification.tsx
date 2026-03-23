'use client'

import { useState, useEffect } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useTranslations, useLocale } from 'next-intl'

const NL_BE_CITIES = [
  'Amsterdam', 'Rotterdam', 'Den Haag', 'Utrecht', 'Eindhoven',
  'Groningen', 'Tilburg', 'Almere', 'Breda', 'Nijmegen',
  'Haarlem', 'Arnhem', 'Amersfoort', 'Apeldoorn', 'Leiden',
  'Antwerpen', 'Gent', 'Brugge', 'Leuven', 'Mechelen',
]

const UK_AU_CITIES = [
  'London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool',
  'Edinburgh', 'Glasgow', 'Bristol', 'Cardiff', 'Belfast',
  'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide',
  'Dublin', 'Cork', 'Galway', 'Oxford', 'Cambridge',
]

const NL_NAMES = [
  'Emma', 'Lotte', 'Sophie', 'Julia', 'Fleur',
  'Daan', 'Lucas', 'Liam', 'Noah', 'Sem',
  'Sanne', 'Lisa', 'Eva', 'Anna', 'Mila',
  'Tim', 'Tom', 'Max', 'Bram', 'Ruben',
]

const EN_NAMES = [
  'Sarah', 'Emma', 'Olivia', 'Chloe', 'Emily',
  'James', 'William', 'Oliver', 'Harry', 'George',
  'Charlotte', 'Amelia', 'Isla', 'Sophie', 'Mia',
  'Jack', 'Thomas', 'Charlie', 'Ben', 'Daniel',
]

const MINUTES = [2, 3, 5, 7, 8, 11, 14, 18, 22, 25]

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function PurchaseNotification() {
  const t = useTranslations('purchaseNotification')
  const locale = useLocale()
  const [visible, setVisible] = useState(false)
  const [notification, setNotification] = useState(() => {
    const names = locale === 'en' ? EN_NAMES : NL_NAMES
    const cities = locale === 'en' ? UK_AU_CITIES : NL_BE_CITIES
    return {
      name: getRandomItem(names),
      city: getRandomItem(cities),
      minutes: getRandomItem(MINUTES),
    }
  })

  useEffect(() => {
    const names = locale === 'en' ? EN_NAMES : NL_NAMES
    const cities = locale === 'en' ? UK_AU_CITIES : NL_BE_CITIES

    function showNotification() {
      setNotification({
        name: getRandomItem(names),
        city: getRandomItem(cities),
        minutes: getRandomItem(MINUTES),
      })
      setVisible(true)
      setTimeout(() => setVisible(false), 4000)
    }

    const initialDelay = 15000 + Math.random() * 10000
    let interval: ReturnType<typeof setInterval> | null = null
    const timeout = setTimeout(() => {
      showNotification()
      interval = setInterval(showNotification, 30000 + Math.random() * 30000)
    }, initialDelay)

    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [locale])

  return (
    <div
      className={`fixed bottom-4 left-4 z-50 max-w-xs transition-all duration-500 ${
        visible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'
      }`}
    >
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-trust-50 flex items-center justify-center flex-shrink-0">
          <ShoppingBag className="w-4 h-4 text-trust-600" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-charcoal">
            {t('from', { name: notification.name, city: notification.city })}
          </p>
          <p className="text-xs text-gray-500">
            {t('justOrdered', { minutes: notification.minutes })}
          </p>
        </div>
      </div>
    </div>
  )
}
