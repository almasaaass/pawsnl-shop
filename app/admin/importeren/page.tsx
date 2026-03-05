'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Plus, Check, AlertCircle, ExternalLink, RefreshCw, Tag, TrendingUp, Link2, LinkIcon } from 'lucide-react'

interface CJProduct {
  pid: string
  productName: string
  sellPrice: number
  categoryName: string
  productImage: string
  suggestedPrice: number
  suggestedComparePrice: number | null
  suggestedCategory: string
  margin: number
  variants?: { vid: string; variantSku: string; variantProperty: string }[]
}

interface ShopProduct {
  id: string
  name: string
  category: string
  price: number
  images: string[]
  cj_pid: string | null
  cj_vid: string | null
}

const WINNING_KEYWORDS = [
  'dog harness no pull',
  'cat water fountain',
  'automatic cat laser toy',
  'pet gps tracker',
  'slow feeder dog bowl',
  'dog led collar',
  'self cleaning litter box',
  'pet camera treat dispenser',
  'cat window perch',
  'dog cooling mat',
  'lick mat dog',
  'automatic pet feeder',
]

const CATEGORY_LABELS: Record<string, string> = {
  honden: '🐶 Dogs',
  katten: '🐱 Cats',
  vogels: '🐦 Birds',
  knaagdieren: '🐹 Rodents',
  vissen: '🐟 Fish',
}

function eur(n: number) {
  return `€${Number(n).toFixed(2).replace('.', ',')}`
}

interface ImportModal {
  product: CJProduct
  nameNL: string
  descriptionNL: string
  category: string
  price: number
  comparePrice: number | null
}

export default function ImporterenPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-400">Loading...</div>}>
      <ImporterenContent />
    </Suspense>
  )
}

function ImporterenContent() {
  const [query, setQuery] = useState('')
  const [pidInput, setPidInput] = useState('')
  const [results, setResults] = useState<CJProduct[]>([])
  const [loading, setLoading] = useState(false)
  const [pidLoading, setPidLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [importModal, setImportModal] = useState<ImportModal | null>(null)
  const [importing, setImporting] = useState(false)
  const [imported, setImported] = useState<Set<string>>(new Set())
  const [linkModal, setLinkModal] = useState<{ cjProduct: CJProduct } | null>(null)
  const [shopProducts, setShopProducts] = useState<ShopProduct[]>([])
  const [shopLoading, setShopLoading] = useState(false)
  const [linking, setLinking] = useState(false)
  const [linked, setLinked] = useState<Set<string>>(new Set())
  const searchParams = useSearchParams()

  // Auto-search if ?q= is in URL (from trending page)
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      search(q)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function search(keyword?: string) {
    const q = keyword ?? query
    if (!q.trim()) return
    setLoading(true)
    setError(null)
    setResults([])
    try {
      const res = await fetch(`/api/admin/cj?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResults(data.products)
      if (keyword) setQuery(keyword)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function fetchByPid(value?: string) {
    const input = value ?? pidInput
    if (!input.trim()) return
    setPidLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/cj?pid=${encodeURIComponent(input.trim())}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setResults(data.products)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setPidLoading(false)
    }
  }

  function handlePidPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData('text')
    const isCJUrl = pasted.includes('cjdropshipping.com')
    const isSku = /^CJ[A-Z0-9]{6,}$/i.test(pasted.trim())
    const isPid = /^\d{10,}$/.test(pasted.trim())
    if (isCJUrl || isSku || isPid) {
      e.preventDefault()
      setPidInput(pasted.trim())
      setTimeout(() => fetchByPid(pasted.trim()), 100)
    }
  }

  function openImport(p: CJProduct) {
    setImportModal({
      product: p,
      nameNL: p.productName,
      descriptionNL: '',
      category: p.suggestedCategory,
      price: p.suggestedPrice,
      comparePrice: p.suggestedComparePrice,
    })
  }

  async function doImport() {
    if (!importModal) return
    setImporting(true)
    try {
      const res = await fetch('/api/admin/cj', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pid: importModal.product.pid,
          nameNL: importModal.nameNL,
          descriptionNL: importModal.descriptionNL,
          category: importModal.category,
          price: importModal.price,
          comparePrice: importModal.comparePrice,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setImported((prev) => { const next = new Set(Array.from(prev)); next.add(importModal.product.pid); return next })
      setImportModal(null)
    } catch (e: any) {
      alert(`Error importing: ${e.message}`)
    } finally {
      setImporting(false)
    }
  }

  async function openLink(cjProduct: CJProduct) {
    setLinkModal({ cjProduct })
    if (shopProducts.length === 0) {
      setShopLoading(true)
      try {
        const res = await fetch('/api/admin/products')
        const data = await res.json()
        if (Array.isArray(data)) setShopProducts(data)
      } catch {} finally {
        setShopLoading(false)
      }
    }
  }

  async function doLink(shopProductId: string) {
    if (!linkModal) return
    setLinking(true)
    try {
      const cj = linkModal.cjProduct
      // Fetch detail for first variant vid
      const detailRes = await fetch(`/api/admin/cj?pid=${encodeURIComponent(cj.pid)}`)
      const detailData = await detailRes.json()
      const vid = detailData.products?.[0]?.variants?.[0]?.vid ?? null

      const res = await fetch(`/api/admin/products/${shopProductId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cj_pid: cj.pid,
          cj_vid: vid,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error)
      }
      setLinked((prev) => { const next = new Set(Array.from(prev)); next.add(shopProductId); return next })
      // Update shopProducts state
      setShopProducts((prev) => prev.map((p) => p.id === shopProductId ? { ...p, cj_pid: cj.pid, cj_vid: vid } : p))
      setLinkModal(null)
    } catch (e: any) {
      alert(`Error linking: ${e.message}`)
    } finally {
      setLinking(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">📦 Import Products</h1>
        <p className="text-gray-500 mt-1">Search products on CJdropshipping and import them directly to your shop</p>
      </div>

      {/* PID / URL import */}
      <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-5 mb-4">
        <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <Link2 className="w-4 h-4 text-emerald-600" />
          Direct import via CJ Product URL
        </p>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={pidInput}
              onChange={(e) => setPidInput(e.target.value)}
              onPaste={handlePidPaste}
              onKeyDown={(e) => e.key === 'Enter' && fetchByPid()}
              placeholder="Paste CJ product URL (e.g. cjdropshipping.com/product/...)"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => fetchByPid()}
            disabled={pidLoading || !pidInput.trim()}
            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-emerald-700 transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${pidLoading ? 'animate-spin' : ''}`} />
            {pidLoading ? 'Fetching...' : 'Fetch'}
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Tip: copy the full URL from your browser of a product on cjdropshipping.com and paste it here</p>
      </div>

      {/* Search bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search()}
              placeholder="Search e.g. 'dog harness no pull'"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => search()}
            disabled={loading}
            className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-emerald-700 transition-colors disabled:opacity-60"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* Winning keywords */}
        <div className="mt-4">
          <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> Proven winning products:
          </p>
          <div className="flex flex-wrap gap-2">
            {WINNING_KEYWORDS.map((kw) => (
              <button
                key={kw}
                onClick={() => search(kw)}
                className="text-xs bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 text-gray-600 px-3 py-1.5 rounded-lg transition-colors"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-700">Error searching</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
            {error.includes('CJ_EMAIL') && (
              <p className="text-xs text-red-500 mt-2">
                Add <code className="bg-red-100 px-1 rounded">CJ_EMAIL</code> and{' '}
                <code className="bg-red-100 px-1 rounded">CJ_PASSWORD</code> to Vercel and restart the deploy.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Results */}
      {results.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((p) => (
            <div key={p.pid} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {/* Image */}
              <div className="aspect-square bg-gray-50 relative">
                {p.productImage ? (
                  <img src={p.productImage} alt={p.productName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                )}
                {/* Margin badge */}
                <div className={`absolute top-2 right-2 text-xs font-bold px-2 py-1 rounded-full ${
                  p.margin >= 60 ? 'bg-emerald-500 text-white' :
                  p.margin >= 45 ? 'bg-amber-500 text-white' :
                  'bg-gray-500 text-white'
                }`}>
                  {p.margin}% margin
                </div>
                {imported.has(p.pid) && (
                  <div className="absolute inset-0 bg-emerald-500/80 flex items-center justify-center">
                    <Check className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>

              <div className="p-4">
                <p className="text-xs text-gray-400 mb-1">{CATEGORY_LABELS[p.suggestedCategory] ?? p.categoryName}</p>
                <h3 className="font-medium text-gray-900 text-sm leading-snug mb-3 line-clamp-2">{p.productName}</h3>

                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span className="text-xs text-gray-400">Cost: </span>
                    <span className="text-sm font-medium text-gray-700">{eur(p.sellPrice)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-400">Selling: </span>
                    <span className="text-sm font-bold text-emerald-600">{eur(p.suggestedPrice)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openImport(p)}
                    disabled={imported.has(p.pid)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-gray-900 text-white text-sm font-medium py-2 rounded-xl hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {imported.has(p.pid) ? (
                      <><Check className="w-4 h-4" /> New</>
                    ) : (
                      <><Plus className="w-4 h-4" /> New</>
                    )}
                  </button>
                  <button
                    onClick={() => openLink(p)}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 text-white text-sm font-medium py-2 rounded-xl hover:bg-blue-700 transition-colors"
                  >
                    <LinkIcon className="w-4 h-4" /> Link
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {results.length === 0 && !loading && !error && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-medium text-gray-500">Click a search term above or type your own search query</p>
          <p className="text-sm mt-1">Tip: search in English for best results</p>
        </div>
      )}

      {/* Import modal */}
      {importModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Import product</h2>

              <div className="flex gap-3 mb-5">
                <img
                  src={importModal.product.productImage}
                  alt=""
                  className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                />
                <div>
                  <p className="text-xs text-gray-400">CJ cost price: <strong>{eur(importModal.product.sellPrice)}</strong></p>
                  <p className="text-xs text-gray-400 mt-0.5">PID: {importModal.product.pid}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={importModal.nameNL}
                    onChange={(e) => setImportModal({ ...importModal, nameNL: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={importModal.descriptionNL}
                    onChange={(e) => setImportModal({ ...importModal, descriptionNL: e.target.value })}
                    rows={4}
                    placeholder="Write a product description..."
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      value={importModal.category}
                      onChange={(e) => setImportModal({ ...importModal, category: e.target.value })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      {Object.entries(CATEGORY_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>{label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Selling price (€)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={importModal.price}
                      onChange={(e) => setImportModal({ ...importModal, price: parseFloat(e.target.value) })}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Compare price (€) <span className="text-gray-400 font-normal">— strikethrough price</span>
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={importModal.comparePrice ?? ''}
                    onChange={(e) => setImportModal({
                      ...importModal,
                      comparePrice: e.target.value ? parseFloat(e.target.value) : null,
                    })}
                    placeholder="Leave empty = no action"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Margin preview */}
                <div className="bg-gray-50 rounded-xl p-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Cost:</span>
                    <span className="font-medium">{eur(importModal.product.sellPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Selling:</span>
                    <span className="font-medium text-emerald-600">{eur(importModal.price)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 mt-2 pt-2">
                    <span className="text-gray-500">Profit per unit:</span>
                    <span className="font-bold text-emerald-600">
                      {eur(importModal.price - importModal.product.sellPrice)}
                      {' '}({Math.round(((importModal.price - importModal.product.sellPrice) / importModal.price) * 100)}%)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setImportModal(null)}
                  className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={doImport}
                  disabled={importing || !importModal.nameNL}
                  className="flex-1 bg-emerald-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-emerald-700 transition-colors disabled:opacity-60"
                >
                  {importing ? 'Importing...' : '✅ Import to shop'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Link modal */}
      {linkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-2">Link to existing product</h2>
              <p className="text-sm text-gray-500 mb-4">
                CJ product: <strong>{linkModal.cjProduct.productName}</strong>
                <br />
                <span className="text-xs text-gray-400">PID: {linkModal.cjProduct.pid}</span>
              </p>

              {shopLoading ? (
                <div className="text-center py-8 text-gray-400">Loading products...</div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {shopProducts.map((sp) => (
                    <button
                      key={sp.id}
                      onClick={() => doLink(sp.id)}
                      disabled={linking || !!sp.cj_pid}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-colors ${
                        sp.cj_pid
                          ? 'border-green-200 bg-green-50 opacity-60 cursor-not-allowed'
                          : linked.has(sp.id)
                          ? 'border-blue-300 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                    >
                      <img
                        src={sp.images?.[0] ?? ''}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0 bg-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{sp.name}</p>
                        <p className="text-xs text-gray-400">
                          {CATEGORY_LABELS[sp.category] ?? sp.category} &middot; {eur(sp.price)}
                        </p>
                      </div>
                      {sp.cj_pid ? (
                        <span className="text-xs text-green-600 font-medium flex-shrink-0">Already linked</span>
                      ) : linked.has(sp.id) ? (
                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      ) : (
                        <LinkIcon className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => setLinkModal(null)}
                className="w-full mt-4 border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
