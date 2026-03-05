'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { ArrowUpDown } from 'lucide-react'

const SORT_OPTIONS = [
  { value: '', label: 'Nieuwste' },
  { value: 'prijs-laag', label: 'Prijs: laag → hoog' },
  { value: 'prijs-hoog', label: 'Prijs: hoog → laag' },
  { value: 'naam', label: 'Naam: A → Z' },
]

interface Props {
  currentSort?: string
}

export default function SortDropdown({ currentSort = '' }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleSort(value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set('sort', value)
    } else {
      params.delete('sort')
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <ArrowUpDown className="w-4 h-4 text-gray-400" />
      <select
        value={currentSort}
        onChange={(e) => handleSort(e.target.value)}
        className="text-sm bg-white border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-500 cursor-pointer"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
