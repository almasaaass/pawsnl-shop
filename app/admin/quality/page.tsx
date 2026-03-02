'use client'

import { useState, useEffect } from 'react'
import { Shield, AlertTriangle, AlertCircle, CheckCircle, RefreshCw, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface QualityIssue {
  type: 'error' | 'warning'
  field: string
  message: string
}

interface ProductAudit {
  id: string
  name: string
  slug: string
  category: string
  price: number
  comparePrice: number | null
  images: string[]
  stock: number
  issues: QualityIssue[]
}

interface Summary {
  total: number
  perfect: number
  withIssues: number
  totalIssues: number
  errors: number
  warnings: number
}

export default function QualityPage() {
  const [products, setProducts] = useState<ProductAudit[]>([])
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'issues' | 'perfect'>('issues')

  useEffect(() => {
    fetchAudit()
  }, [])

  async function fetchAudit() {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/quality')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setProducts(data.products)
      setSummary(data.summary)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = products.filter((p) => {
    if (filter === 'issues') return p.issues.length > 0
    if (filter === 'perfect') return p.issues.length === 0
    return true
  })

  const scorePercent = summary
    ? Math.round((summary.perfect / summary.total) * 100)
    : 0

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-blue-600" />
          Product Quality Check
        </h1>
        <p className="text-gray-500 mt-1">
          Controleer of alle producten complete en correcte informatie hebben
        </p>
      </div>

      {/* Score overview */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-xs text-gray-400">Totaal producten</p>
            <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5">
            <p className="text-xs text-emerald-600">Perfect</p>
            <p className="text-2xl font-bold text-emerald-600">{summary.perfect}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-5">
            <p className="text-xs text-red-500">Fouten</p>
            <p className="text-2xl font-bold text-red-600">{summary.errors}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-amber-100 p-5">
            <p className="text-xs text-amber-500">Waarschuwingen</p>
            <p className="text-2xl font-bold text-amber-600">{summary.warnings}</p>
          </div>
        </div>
      )}

      {/* Quality score bar */}
      {summary && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Quality Score</span>
            <span className={`text-sm font-bold ${
              scorePercent >= 80 ? 'text-emerald-600' : scorePercent >= 50 ? 'text-amber-600' : 'text-red-600'
            }`}>
              {scorePercent}%
            </span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all ${
                scorePercent >= 80 ? 'bg-emerald-500' : scorePercent >= 50 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${scorePercent}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {summary.perfect} van {summary.total} producten zijn foutloos
          </p>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'issues', label: 'Met problemen', count: summary?.withIssues },
          { key: 'all', label: 'Allemaal', count: summary?.total },
          { key: 'perfect', label: 'Perfect', count: summary?.perfect },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as any)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              filter === tab.key
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {tab.label} ({tab.count ?? 0})
          </button>
        ))}
        <button
          onClick={fetchAudit}
          disabled={loading}
          className="ml-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Opnieuw checken
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-16 text-gray-400">
          <div className="animate-spin w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full mx-auto mb-4" />
          <p>Producten controleren...</p>
        </div>
      )}

      {/* Product list */}
      {!loading && filtered.map((p) => (
        <div
          key={p.id}
          className={`bg-white rounded-2xl shadow-sm border p-5 mb-3 ${
            p.issues.length === 0
              ? 'border-emerald-100'
              : p.issues.some(i => i.type === 'error')
                ? 'border-red-100'
                : 'border-amber-100'
          }`}
        >
          <div className="flex items-start gap-4">
            {/* Thumbnail */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.images[0] ? `/api/image-proxy?url=${encodeURIComponent(p.images[0])}` : ''}
              alt={p.name}
              className="w-16 h-16 rounded-xl object-cover flex-shrink-0 bg-orange-50"
              onError={(e) => {
                e.currentTarget.src = ''
                e.currentTarget.alt = '🐾'
              }}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {p.issues.length === 0 ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                ) : p.issues.some(i => i.type === 'error') ? (
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                )}
                <h3 className="font-medium text-gray-900 truncate">{p.name}</h3>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex-shrink-0">
                  {p.category}
                </span>
              </div>

              {/* Issues */}
              {p.issues.length > 0 && (
                <div className="mt-2 space-y-1">
                  {p.issues.map((issue, i) => (
                    <div
                      key={i}
                      className={`text-xs flex items-center gap-1.5 ${
                        issue.type === 'error' ? 'text-red-600' : 'text-amber-600'
                      }`}
                    >
                      {issue.type === 'error' ? (
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                      )}
                      <span className="font-medium">{issue.field}:</span>
                      {issue.message}
                    </div>
                  ))}
                </div>
              )}

              {p.issues.length === 0 && (
                <p className="text-xs text-emerald-600 mt-1">Alles in orde!</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-shrink-0">
              <Link
                href={`/producten/${p.slug}`}
                target="_blank"
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Bekijk
              </Link>
            </div>
          </div>
        </div>
      ))}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <p className="font-medium text-gray-500">Geen problemen gevonden!</p>
        </div>
      )}
    </div>
  )
}
