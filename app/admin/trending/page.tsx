'use client'

import { useState, useEffect } from 'react'
import { TrendingUp, Search, Copy, Check, Filter, Flame, Snowflake, Sun, Leaf, CloudRain, Star } from 'lucide-react'
import Link from 'next/link'

interface TrendingProduct {
  id: number
  name: string
  category: 'honden' | 'katten' | 'vogels' | 'knaagdieren'
  trendScore: number
  season: 'lente' | 'zomer' | 'herfst' | 'winter' | 'altijd'
  tiktokHashtags: string[]
  searchTerms: string[]
  estimatedMargin: 'laag' | 'midden' | 'hoog'
  difficulty: 'makkelijk' | 'gemiddeld' | 'moeilijk'
  tip: string
}

const CATEGORIES = [
  { value: '', label: 'Alle', emoji: '🐾' },
  { value: 'honden', label: 'Honden', emoji: '🐶' },
  { value: 'katten', label: 'Katten', emoji: '🐱' },
  { value: 'vogels', label: 'Vogels', emoji: '🐦' },
  { value: 'knaagdieren', label: 'Knaagdieren', emoji: '🐹' },
]

const SEASONS = [
  { value: '', label: 'Alle seizoenen', icon: Star },
  { value: 'lente', label: 'Lente', icon: Leaf },
  { value: 'zomer', label: 'Zomer', icon: Sun },
  { value: 'herfst', label: 'Herfst', icon: CloudRain },
  { value: 'winter', label: 'Winter', icon: Snowflake },
]

const MARGIN_COLORS = {
  laag: 'bg-red-100 text-red-700',
  midden: 'bg-amber-100 text-amber-700',
  hoog: 'bg-emerald-100 text-emerald-700',
}

const DIFFICULTY_COLORS = {
  makkelijk: 'bg-green-100 text-green-700',
  gemiddeld: 'bg-yellow-100 text-yellow-700',
  moeilijk: 'bg-red-100 text-red-700',
}

export default function TrendingPage() {
  const [products, setProducts] = useState<TrendingProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [category, setCategory] = useState('')
  const [season, setSeason] = useState('')
  const [copiedId, setCopiedId] = useState<number | null>(null)

  useEffect(() => {
    fetchProducts()
  }, [category, season])

  async function fetchProducts() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category) params.set('category', category)
      if (season) params.set('season', season)
      const res = await fetch(`/api/admin/trending?${params}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setProducts(data.products)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  function copyHashtags(product: TrendingProduct) {
    navigator.clipboard.writeText(product.tiktokHashtags.join(' '))
    setCopiedId(product.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function getScoreColor(score: number) {
    if (score >= 85) return 'bg-emerald-500'
    if (score >= 70) return 'bg-amber-500'
    return 'bg-red-500'
  }

  function getScoreLabel(score: number) {
    if (score >= 85) return 'Hot'
    if (score >= 70) return 'Trending'
    return 'Opkomend'
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Flame className="w-6 h-6 text-orange-500" />
          Winning Products Finder
        </h1>
        <p className="text-gray-500 mt-1">
          Ontdek trending huisdierproducten met hoge marges en TikTok-potentie
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex items-center gap-2 mb-3 text-sm font-medium text-gray-700">
          <Filter className="w-4 h-4" />
          Filters
        </div>

        {/* Categorie filter */}
        <div className="mb-4">
          <p className="text-xs text-gray-400 mb-2">Categorie</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  category === cat.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Seizoen filter */}
        <div>
          <p className="text-xs text-gray-400 mb-2">Seizoen</p>
          <div className="flex flex-wrap gap-2">
            {SEASONS.map((s) => (
              <button
                key={s.value}
                onClick={() => setSeason(s.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  season === s.value
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                <s.icon className="w-3.5 h-3.5" />
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resultaten teller */}
      <p className="text-sm text-gray-400 mb-4">
        {products.length} producten gevonden
      </p>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16 text-gray-400">
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-emerald-500 rounded-full mx-auto mb-4" />
          <p>Laden...</p>
        </div>
      )}

      {/* Product cards */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{p.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {CATEGORIES.find((c) => c.value === p.category)?.emoji} {p.category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${MARGIN_COLORS[p.estimatedMargin]}`}>
                      Marge: {p.estimatedMargin}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${DIFFICULTY_COLORS[p.difficulty]}`}>
                      {p.difficulty}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-xs font-bold text-white px-2 py-0.5 rounded-full ${getScoreColor(p.trendScore)}`}>
                    {getScoreLabel(p.trendScore)}
                  </span>
                </div>
              </div>

              {/* Trend score bar */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Trend score</span>
                  <span className="font-medium text-gray-600">{p.trendScore}/100</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${getScoreColor(p.trendScore)}`}
                    style={{ width: `${p.trendScore}%` }}
                  />
                </div>
              </div>

              {/* Seizoen */}
              <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                {(() => {
                  const s = SEASONS.find((s) => s.value === p.season) ?? SEASONS[0]
                  return (
                    <>
                      <s.icon className="w-3.5 h-3.5" />
                      <span>Seizoen: <strong>{p.season}</strong></span>
                    </>
                  )
                })()}
              </div>

              {/* Tip */}
              <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 mb-3">
                <p className="text-xs text-amber-800">
                  <strong>Tip:</strong> {p.tip}
                </p>
              </div>

              {/* TikTok hashtags */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">TikTok hashtags</span>
                  <button
                    onClick={() => copyHashtags(p)}
                    className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
                  >
                    {copiedId === p.id ? (
                      <><Check className="w-3 h-3 text-emerald-500" /> Gekopieerd!</>
                    ) : (
                      <><Copy className="w-3 h-3" /> Kopieer</>
                    )}
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.tiktokHashtags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actie knop */}
              <Link
                href={`/admin/importeren?q=${encodeURIComponent(p.searchTerms[0])}`}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white text-sm font-medium py-2.5 rounded-xl hover:bg-gray-700 transition-colors"
              >
                <Search className="w-4 h-4" />
                Zoek op CJ
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
