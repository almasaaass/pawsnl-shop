'use client'

import { useState, useEffect, useCallback } from 'react'
import { Camera, Download, RefreshCw, Sparkles, Film, Image as ImageIcon, Zap, Eye, Rocket, CheckCircle, XCircle, Loader2, Upload } from 'lucide-react'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_price: number | null
  images: string[]
  category: string
  stock: number
}

type Template = 'infographic' | 'social' | 'feature' | 'banner'

const TEMPLATE_INFO: Record<Template, { label: string; size: string; desc: string }> = {
  infographic: { label: 'Infographic', size: '1080×1350', desc: 'Instagram portrait — ideal for feed posts' },
  social: { label: 'Social Post', size: '1080×1080', desc: 'Square — TikTok, Instagram, Facebook' },
  feature: { label: 'Feature Card', size: '1080×1080', desc: 'Dark theme with features' },
  banner: { label: 'Banner', size: '1200×628', desc: 'Facebook/LinkedIn ad banner' },
}

const CATEGORY_LABELS: Record<string, string> = {
  honden: '🐶 Dogs',
  katten: '🐱 Cats',
  vogels: '🐦 Birds',
  knaagdieren: '🐹 Small pets',
  vissen: '🐟 Fish',
}

function eur(n: number) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' }).format(n)
}

function generateVideoScript(product: Product): string {
  const category = product.category
  const pet = category === 'dogs' ? 'dog' : category === 'cats' ? 'cat' : category === 'birds' ? 'bird' : category === 'small pets' ? 'small pet' : 'pet'

  return `🎬 VIDEO SCRIPT: ${product.name}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📱 Format: TikTok/Reels (9:16, 15-30 sec)
🎯 Goal: Product sales via link in bio

━━━ HOOK (0-3 sec) ━━━
[Close-up of the product]
On-screen text: "Your ${pet} NEEDS this 👀"
Voice-over: "Every ${pet} owner NEEDS this..."

━━━ PROBLEM (3-7 sec) ━━━
[Show the problem this product solves]
Text: "Sound familiar? 😩"
Voice-over: "You know the feeling..."

━━━ SOLUTION (7-15 sec) ━━━
[Show the product in use]
Text: "${product.name} ✨"
Voice-over: "That's why the ${product.name} is so popular!"

━━━ PROOF (15-22 sec) ━━━
[Show happy ${pet} with the product]
Text: "Look how happy! 🥰"
Voice-over: "And look how happy your ${pet} is with it!"

━━━ CTA (22-30 sec) ━━━
[Product + website]
Text: "Now ${eur(product.price)} ${product.compare_price ? `(was ${eur(product.compare_price)})` : ''}"
Text: "🔗 Link in bio → pawsnlshop.com"
Voice-over: "Order now via link in bio. Free shipping!"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 CAPTION:
${product.name} for your ${pet}! 🐾✨
${product.compare_price ? `From ${eur(product.compare_price)} now only ${eur(product.price)}! 🏷️` : `Now ${eur(product.price)}! 🏷️`}

✅ Premium quality
✅ Free shipping from €35
✅ 30-day returns

🔗 Order via link in bio!

#pawsshop #${pet}life #${pet}sofinstagram #pets #${pet}love #${pet}products #petstore #petproducts #petshop ${category === 'dogs' ? '#dogtok #doglife' : category === 'cats' ? '#cattok #catlife' : '#pettok'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎵 MUSIC SUGGESTIONS:
- Trending sound (check TikTok Creative Center)
- Upbeat lo-fi beats
- "Oh no" sound for problem → solution format
`
}

// ─── Batch Status Types ─────────────────────────────────────────────────────

interface BatchResult {
  name: string
  status: 'success' | 'failed' | 'pending' | 'processing'
  urls?: string[]
  error?: string
}

interface AgentStats {
  bucketExists: boolean
  totalProducts: number
  productsWithGenerated: number
  productsWithoutImages: number
}

export default function FotoStudioPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Product | null>(null)
  const [template, setTemplate] = useState<Template>('infographic')
  const [features, setFeatures] = useState('')
  const [badge, setBadge] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [showVideo, setShowVideo] = useState(false)
  const [videoScript, setVideoScript] = useState('')
  const [generating, setGenerating] = useState(false)

  // Batch processing state
  const [batchRunning, setBatchRunning] = useState(false)
  const [batchResults, setBatchResults] = useState<BatchResult[]>([])
  const [batchProgress, setBatchProgress] = useState({ current: 0, total: 0 })
  const [agentStats, setAgentStats] = useState<AgentStats | null>(null)
  const [publishingSingle, setPublishingSingle] = useState(false)

  // Tab state
  const [activeTab, setActiveTab] = useState<'studio' | 'agent'>('studio')

  useEffect(() => {
    fetch('/api/admin/products')
      .then((r) => r.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Load agent stats
  const loadAgentStats = useCallback(() => {
    fetch('/api/admin/photo-agent')
      .then(r => r.json())
      .then(data => {
        if (!data.error) setAgentStats(data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (activeTab === 'agent') {
      loadAgentStats()
    }
  }, [activeTab, loadAgentStats])

  function getProxyUrl(url: string) {
    if (!url) return ''
    try {
      const parsed = new URL(url)
      const cjHosts = ['cc-west-usa.oss-us-west-1.aliyuncs.com', 'cbu01.alicdn.com', 'cf.cjdropshipping.com', 'img.cjdropshipping.com', 'oss-cf.cjdropshipping.com']
      if (cjHosts.some(h => parsed.hostname.includes(h))) {
        return `/api/image-proxy?url=${encodeURIComponent(url)}`
      }
      return url
    } catch {
      return url
    }
  }

  function generatePreview() {
    if (!selected) return
    setGenerating(true)
    const params = new URLSearchParams({
      template,
      name: selected.name,
      price: eur(selected.price),
      image: selected.images[0] ? getProxyUrl(selected.images[0]) : '',
      category: selected.category,
    })
    if (selected.compare_price) params.set('comparePrice', eur(selected.compare_price))
    if (features) params.set('features', features)
    if (badge) params.set('badge', badge)
    if (selected.compare_price && selected.compare_price > selected.price) {
      params.set('discount', String(Math.round(((selected.compare_price - selected.price) / selected.compare_price) * 100)))
    }

    const url = `/api/admin/generate-image?${params.toString()}`
    setPreviewUrl(url)
    setTimeout(() => setGenerating(false), 1500)
  }

  function downloadImage() {
    if (!previewUrl) return
    const a = document.createElement('a')
    a.href = previewUrl
    a.download = `pawsshop-${selected?.slug ?? 'product'}-${template}.png`
    a.click()
  }

  function generateAllImages() {
    if (!selected) return
    const templates: Template[] = ['infographic', 'social', 'feature', 'banner']
    templates.forEach((t) => {
      const params = new URLSearchParams({
        template: t,
        name: selected.name,
        price: eur(selected.price),
        image: selected.images[0] ? getProxyUrl(selected.images[0]) : '',
        category: selected.category,
      })
      if (selected.compare_price) params.set('comparePrice', eur(selected.compare_price))
      if (features) params.set('features', features)
      if (badge) params.set('badge', badge)
      if (selected.compare_price && selected.compare_price > selected.price) {
        params.set('discount', String(Math.round(((selected.compare_price - selected.price) / selected.compare_price) * 100)))
      }

      const a = document.createElement('a')
      a.href = `/api/admin/generate-image?${params.toString()}`
      a.download = `pawsshop-${selected.slug}-${t}.png`
      a.click()
    })
  }

  function openVideoScript() {
    if (!selected) return
    setVideoScript(generateVideoScript(selected))
    setShowVideo(true)
  }

  // ─── Publish to webshop (single product) ───────────────────────────────

  async function publishSingle() {
    if (!selected) return
    setPublishingSingle(true)
    try {
      const res = await fetch('/api/admin/photo-agent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: selected.id,
          mode: 'single',
          template: template,
          features: features || undefined,
          badge: badge || undefined,
        }),
      })
      const data = await res.json()
      if (data.success) {
        alert(`✅ ${selected.name} has been published to the webshop!\n\nImage URL: ${data.url}`)
        // Refresh products
        const refreshRes = await fetch('/api/admin/products')
        const refreshData = await refreshRes.json()
        setProducts(Array.isArray(refreshData) ? refreshData : [])
        // Update selected
        const updated = refreshData.find((p: Product) => p.id === selected.id)
        if (updated) setSelected(updated)
      } else {
        alert(`❌ Error: ${data.error}`)
      }
    } catch (err: any) {
      alert(`❌ Error: ${err.message}`)
    } finally {
      setPublishingSingle(false)
    }
  }

  // ─── Batch Agent ──────────────────────────────────────────────────────────

  async function runBatchAgent() {
    setBatchRunning(true)
    setBatchResults(products.map(p => ({ name: p.name, status: 'pending' })))
    setBatchProgress({ current: 0, total: products.length })

    // Process products one by one for better progress tracking
    const results: BatchResult[] = []
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      setBatchProgress({ current: i + 1, total: products.length })

      // Update status to processing
      setBatchResults(prev => {
        const updated = [...prev]
        updated[i] = { name: product.name, status: 'processing' }
        return updated
      })

      try {
        const res = await fetch('/api/admin/photo-agent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: product.id,
            mode: 'single',
            template: 'social', // Use social as hero image
            features: features || undefined,
            badge: badge || undefined,
          }),
        })

        const data = await res.json()
        const result: BatchResult = data.success
          ? { name: product.name, status: 'success', urls: [data.url] }
          : { name: product.name, status: 'failed', error: data.error }

        results.push(result)
        setBatchResults(prev => {
          const updated = [...prev]
          updated[i] = result
          return updated
        })
      } catch (err: any) {
        const result: BatchResult = { name: product.name, status: 'failed', error: err.message }
        results.push(result)
        setBatchResults(prev => {
          const updated = [...prev]
          updated[i] = result
          return updated
        })
      }
    }

    setBatchRunning(false)
    loadAgentStats()

    // Refresh products list
    try {
      const refreshRes = await fetch('/api/admin/products')
      const refreshData = await refreshRes.json()
      setProducts(Array.isArray(refreshData) ? refreshData : [])
    } catch {}
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-6 h-6 animate-spin text-orange-500" />
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Camera className="w-7 h-7 text-orange-500" />
            Photo Studio
          </h1>
          <p className="text-gray-500 mt-1">
            Generate professional product photos and publish to your webshop
          </p>
        </div>
        <div className="text-sm text-gray-400">
          {products.length} products
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        <button
          onClick={() => setActiveTab('studio')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'studio'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Camera className="w-4 h-4" />
          Studio
        </button>
        <button
          onClick={() => setActiveTab('agent')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'agent'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Rocket className="w-4 h-4" />
          Auto Agent
        </button>
      </div>

      {activeTab === 'agent' ? (
        /* ─── AUTO AGENT TAB ─────────────────────────────────────── */
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Total products</p>
              <p className="text-2xl font-bold text-gray-900">{agentStats?.totalProducts ?? products.length}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">With studio photo</p>
              <p className="text-2xl font-bold text-green-600">{agentStats?.productsWithGenerated ?? 0}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Without photos</p>
              <p className="text-2xl font-bold text-red-600">{agentStats?.productsWithoutImages ?? 0}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Storage bucket</p>
              <p className="text-2xl font-bold">
                {agentStats?.bucketExists ? (
                  <span className="text-green-600">✅ Active</span>
                ) : (
                  <span className="text-gray-400">⏳ Being created</span>
                )}
              </p>
            </div>
          </div>

          {/* Agent Controls */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-orange-500" />
                  Photo Agent — Batch Processing
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Automatically generates professional Social Post photos for ALL products
                  and publishes them to the webshop. Each photo gets PawsNL branding, price,
                  discount and trust badges.
                </p>
              </div>
            </div>

            {/* Config */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Features for all products (optional)
                </label>
                <input
                  type="text"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="Premium quality|Free shipping|30-day returns"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Badge for all products (optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="Auto (Bestseller/Sale)"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  />
                  <div className="flex gap-1">
                    {['Bestseller', 'New'].map((b) => (
                      <button
                        key={b}
                        onClick={() => setBadge(b)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                          badge === b ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Run button */}
            <button
              onClick={runBatchAgent}
              disabled={batchRunning}
              className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-300 disabled:to-orange-400 text-white font-bold py-4 rounded-xl transition-all text-lg shadow-lg shadow-orange-200"
            >
              {batchRunning ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processing... ({batchProgress.current}/{batchProgress.total})
                </>
              ) : (
                <>
                  <Rocket className="w-5 h-5" />
                  Start Photo Agent — Process all {products.length} products
                </>
              )}
            </button>

            {/* Progress bar */}
            {batchRunning && (
              <div className="mt-4">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-600 rounded-full transition-all duration-500"
                    style={{ width: `${batchProgress.total > 0 ? (batchProgress.current / batchProgress.total) * 100 : 0}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-2 text-center">
                  {batchProgress.current} of {batchProgress.total} products processed
                </p>
              </div>
            )}
          </div>

          {/* Batch Results */}
          {batchResults.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Results</h3>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-600 font-medium">
                    ✅ {batchResults.filter(r => r.status === 'success').length} succeeded
                  </span>
                  <span className="text-red-500 font-medium">
                    ❌ {batchResults.filter(r => r.status === 'failed').length} failed
                  </span>
                  <span className="text-gray-400">
                    ⏳ {batchResults.filter(r => r.status === 'pending' || r.status === 'processing').length} pending
                  </span>
                </div>
              </div>
              <div className="max-h-[400px] overflow-y-auto">
                {batchResults.map((result, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 px-4 py-2.5 border-b border-gray-50 ${
                      result.status === 'processing' ? 'bg-orange-50' : ''
                    }`}
                  >
                    {result.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : result.status === 'failed' ? (
                      <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    ) : result.status === 'processing' ? (
                      <Loader2 className="w-4 h-4 text-orange-500 animate-spin flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-gray-200 flex-shrink-0" />
                    )}
                    <span className="text-sm text-gray-700 flex-1 truncate">{result.name}</span>
                    {result.status === 'success' && (
                      <span className="text-xs text-green-600 font-medium">Published</span>
                    )}
                    {result.status === 'failed' && (
                      <span className="text-xs text-red-500 truncate max-w-[200px]">{result.error}</span>
                    )}
                    {result.status === 'processing' && (
                      <span className="text-xs text-orange-500 font-medium">Processing...</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* ─── STUDIO TAB ─────────────────────────────────────────── */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Product selection */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Select product</h2>
              </div>
              <div className="max-h-[70vh] overflow-y-auto">
                {products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelected(p)
                      setPreviewUrl('')
                      setShowVideo(false)
                      setFeatures('')
                      setBadge('')
                    }}
                    className={`w-full flex items-center gap-3 p-3 text-left transition-colors border-b border-gray-50 ${
                      selected?.id === p.id ? 'bg-orange-50 border-l-4 border-l-orange-500' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      {p.images[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={getProxyUrl(p.images[0])}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg bg-orange-50">🐾</div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">
                        {CATEGORY_LABELS[p.category] ?? p.category} · {eur(p.price)}
                        {p.images.length === 0 && ' · ⚠️ No photo'}
                      </p>
                    </div>
                    <div className="text-xs text-gray-300">{p.images.length}📷</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Generator */}
          <div className="lg:col-span-2">
            {!selected ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <ImageIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a product</h3>
                <p className="text-gray-500">Choose a product from the list to generate photos and video scripts.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Product info bar */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                    {selected.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={getProxyUrl(selected.images[0])} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl bg-orange-50">🐾</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900">{selected.name}</h3>
                    <p className="text-sm text-gray-500">
                      {CATEGORY_LABELS[selected.category]} · {eur(selected.price)}
                      {selected.compare_price ? ` (was ${eur(selected.compare_price)})` : ''}
                      · {selected.images.length} photo{selected.images.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={openVideoScript}
                      className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
                    >
                      <Film className="w-4 h-4" />
                      Video Script
                    </button>
                    <button
                      onClick={generateAllImages}
                      className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
                    >
                      <Zap className="w-4 h-4" />
                      Download All
                    </button>
                    <button
                      onClick={publishSingle}
                      disabled={publishingSingle}
                      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors"
                    >
                      {publishingSingle ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Upload className="w-4 h-4" />
                      )}
                      Publish
                    </button>
                  </div>
                </div>

                {/* Template selector */}
                <div className="grid grid-cols-4 gap-3">
                  {(Object.entries(TEMPLATE_INFO) as [Template, typeof TEMPLATE_INFO[Template]][]).map(([key, info]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setTemplate(key)
                        setPreviewUrl('')
                      }}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${
                        template === key
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="font-semibold text-sm text-gray-900">{info.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{info.size}</p>
                      <p className="text-xs text-gray-500 mt-1">{info.desc}</p>
                    </button>
                  ))}
                </div>

                {/* Customization */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
                  <h3 className="font-semibold text-gray-900">Customise</h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Features (separated by |)
                    </label>
                    <input
                      type="text"
                      value={features}
                      onChange={(e) => setFeatures(e.target.value)}
                      placeholder="Premium quality|Free shipping|30-day returns"
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Badge text (optional)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={badge}
                        onChange={(e) => setBadge(e.target.value)}
                        placeholder="Bestseller"
                        className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                      <div className="flex gap-1">
                        {['Bestseller', 'New', 'Limited', 'Sale'].map((b) => (
                          <button
                            key={b}
                            onClick={() => setBadge(b)}
                            className={`text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                              badge === b ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={generatePreview}
                    disabled={generating}
                    className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white font-semibold py-3 rounded-xl transition-colors"
                  >
                    {generating ? (
                      <><RefreshCw className="w-4 h-4 animate-spin" /> Generating...</>
                    ) : (
                      <><Sparkles className="w-4 h-4" /> Generate preview</>
                    )}
                  </button>
                </div>

                {/* Preview */}
                {previewUrl && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Preview — {TEMPLATE_INFO[template].label} ({TEMPLATE_INFO[template].size})
                      </h3>
                      <div className="flex gap-2">
                        <button
                          onClick={downloadImage}
                          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download PNG
                        </button>
                        <button
                          onClick={publishSingle}
                          disabled={publishingSingle}
                          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                        >
                          {publishingSingle ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Upload className="w-4 h-4" />
                          )}
                          Publish to Webshop
                        </button>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 flex justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="max-w-full max-h-[600px] rounded-xl shadow-lg"
                      />
                    </div>
                  </div>
                )}

                {/* Video Script Modal */}
                {showVideo && (
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Film className="w-4 h-4 text-purple-500" />
                        Video Script — {selected.name}
                      </h3>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(videoScript)
                        }}
                        className="text-sm text-orange-500 hover:text-orange-600 font-medium"
                      >
                        📋 Copy
                      </button>
                    </div>
                    <div className="p-5">
                      <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono bg-gray-50 p-5 rounded-xl max-h-[500px] overflow-y-auto leading-relaxed">
                        {videoScript}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
