'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Video,
  Plus,
  Play,
  Send,
  RefreshCw,
  Trash2,
  Eye,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
  Flame,
  Edit3,
} from 'lucide-react'

interface TikTokVideo {
  id: string
  product_id: string | null
  product_name: string
  product_url: string
  script: string | null
  caption: string | null
  hashtags: string[]
  creatify_task_id: string | null
  video_url: string | null
  thumbnail_url: string | null
  blotato_post_id: string | null
  tiktok_post_url: string | null
  views: number
  viral_alert_sent: boolean
  status: string
  failed_reason: string | null
  scheduled_at: string | null
  posted_at: string | null
  created_at: string
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  images: string[]
}

interface Config {
  creatify: boolean
  blotato: boolean
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Concept', color: 'text-gray-600', bg: 'bg-gray-100' },
  generating: { label: 'Genereren...', color: 'text-blue-600', bg: 'bg-blue-100' },
  ready: { label: 'Klaar', color: 'text-green-600', bg: 'bg-green-100' },
  posted: { label: 'Gepost', color: 'text-purple-600', bg: 'bg-purple-100' },
  viral: { label: 'Viraal!', color: 'text-red-600', bg: 'bg-red-100' },
  failed: { label: 'Mislukt', color: 'text-red-600', bg: 'bg-red-50' },
}

const SITE_URL = 'https://pawsnlshop.com'

export default function TikTokPipelinePage() {
  const [videos, setVideos] = useState<TikTokVideo[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [config, setConfig] = useState<Config>({ creatify: false, blotato: false })
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Form state
  const [formProductId, setFormProductId] = useState('')
  const [formScript, setFormScript] = useState('')
  const [formCaption, setFormCaption] = useState('')
  const [formHashtags, setFormHashtags] = useState('')

  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/tiktok-pipeline')
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setVideos(data.videos)
      setConfig(data.config)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Laden mislukt')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/products')
      const data = await res.json()
      setProducts(data.products ?? data ?? [])
    } catch {
      // Niet fataal
    }
  }, [])

  useEffect(() => {
    fetchVideos()
    fetchProducts()
  }, [fetchVideos, fetchProducts])

  const showMessage = (msg: string, isError = false) => {
    if (isError) {
      setError(msg)
      setTimeout(() => setError(null), 5000)
    } else {
      setSuccess(msg)
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  // ─── Video aanmaken ─────────────────────────────────────────────────────

  const handleCreate = async () => {
    if (!formProductId) {
      showMessage('Selecteer een product', true)
      return
    }

    const product = products.find((p) => p.id === formProductId)
    if (!product) return

    setActionLoading('create')
    try {
      const res = await fetch('/api/admin/tiktok-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          product_id: product.id,
          product_name: product.name,
          product_url: `${SITE_URL}/producten/${product.slug}`,
          script: formScript || null,
          caption: formCaption || product.name,
          hashtags: formHashtags
            ? formHashtags.split(',').map((h) => h.trim())
            : ['pawsnl', 'huisdier', 'tiktok'],
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      showMessage('Video concept aangemaakt!')
      setShowForm(false)
      resetForm()
      fetchVideos()
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Aanmaken mislukt', true)
    } finally {
      setActionLoading(null)
    }
  }

  // ─── Video genereren via Creatify ───────────────────────────────────────

  const handleGenerate = async (videoId: string) => {
    setActionLoading(videoId)
    try {
      const res = await fetch('/api/admin/tiktok-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate', video_id: videoId }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      showMessage('Video generatie gestart!')
      fetchVideos()
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Genereren mislukt', true)
    } finally {
      setActionLoading(null)
    }
  }

  // ─── Video posten via Blotato ───────────────────────────────────────────

  const handlePost = async (videoId: string) => {
    setActionLoading(videoId)
    try {
      const res = await fetch('/api/admin/tiktok-pipeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'post', video_id: videoId }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      showMessage('Video gepost op TikTok!')
      fetchVideos()
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Posten mislukt', true)
    } finally {
      setActionLoading(null)
    }
  }

  // ─── Video updaten ──────────────────────────────────────────────────────

  const handleUpdate = async (videoId: string, updates: Record<string, unknown>) => {
    try {
      const res = await fetch('/api/admin/tiktok-pipeline', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: videoId, ...updates }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      showMessage('Video bijgewerkt!')
      setEditingId(null)
      fetchVideos()
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Updaten mislukt', true)
    }
  }

  // ─── Video verwijderen ──────────────────────────────────────────────────

  const handleDelete = async (videoId: string) => {
    if (!confirm('Weet je zeker dat je deze video wilt verwijderen?')) return

    setActionLoading(videoId)
    try {
      const res = await fetch(`/api/admin/tiktok-pipeline?id=${videoId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      showMessage('Video verwijderd')
      fetchVideos()
    } catch (err) {
      showMessage(err instanceof Error ? err.message : 'Verwijderen mislukt', true)
    } finally {
      setActionLoading(null)
    }
  }

  const resetForm = () => {
    setFormProductId('')
    setFormScript('')
    setFormCaption('')
    setFormHashtags('')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    )
  }

  const statusCounts = videos.reduce(
    (acc, v) => {
      acc[v.status] = (acc[v.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )

  const totalViews = videos.reduce((sum, v) => sum + v.views, 0)

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Video className="w-8 h-8 text-teal-600" />
            TikTok Video Pipeline
          </h1>
          <p className="text-gray-500 mt-1">Genereer, post en monitor TikTok video&apos;s</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => { fetchVideos(); showMessage('Vernieuwd!') }}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium flex items-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Vernieuwen
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-xl font-medium flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" /> Nieuwe Video
          </button>
        </div>
      </div>

      {/* Config warnings */}
      {(!config.creatify || !config.blotato) && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-amber-800">API configuratie onvolledig</p>
            <ul className="text-sm text-amber-700 mt-1 space-y-1">
              {!config.creatify && (
                <li>CREATIFY_API_ID + CREATIFY_API_KEY niet ingesteld — video generatie uitgeschakeld</li>
              )}
              {!config.blotato && (
                <li>BLOTATO_API_KEY niet ingesteld — auto-posting uitgeschakeld</li>
              )}
            </ul>
            <p className="text-xs text-amber-600 mt-2">
              Je kunt wel video concepts aanmaken. Configureer de API keys in Vercel → Environment Variables.
            </p>
          </div>
        </div>
      )}

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
          <XCircle className="w-5 h-5 flex-shrink-0" /> {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 flex-shrink-0" /> {success}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
          <div key={key} className={`${cfg.bg} rounded-xl p-4 text-center`}>
            <div className={`text-2xl font-bold ${cfg.color}`}>{statusCounts[key] || 0}</div>
            <div className="text-sm text-gray-600">{cfg.label}</div>
          </div>
        ))}
      </div>

      {/* Total views */}
      {totalViews > 0 && (
        <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-xl p-6 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eye className="w-8 h-8" />
            <div>
              <div className="text-3xl font-bold">{totalViews.toLocaleString('nl-NL')}</div>
              <div className="text-pink-100">Totale TikTok views</div>
            </div>
          </div>
          <Flame className="w-12 h-12 text-yellow-300 opacity-50" />
        </div>
      )}

      {/* Nieuwe video formulier */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 shadow-sm">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-teal-600" /> Nieuwe Video
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product *</label>
              <select
                value={formProductId}
                onChange={(e) => setFormProductId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Selecteer een product...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Script (optioneel)</label>
              <textarea
                value={formScript}
                onChange={(e) => setFormScript(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 h-24"
                placeholder="Video script tekst... (Creatify genereert ook automatisch)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
                <input
                  type="text"
                  value={formCaption}
                  onChange={(e) => setFormCaption(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="TikTok caption tekst"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hashtags (komma-gescheiden)</label>
                <input
                  type="text"
                  value={formHashtags}
                  onChange={(e) => setFormHashtags(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="pawsnl, huisdier, hond"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleCreate}
                disabled={actionLoading === 'create'}
                className="px-6 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50 flex items-center gap-2"
              >
                {actionLoading === 'create' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                Concept Aanmaken
              </button>
              <button
                onClick={() => { setShowForm(false); resetForm() }}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
              >
                Annuleren
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Videos tabel */}
      {videos.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-600 mb-2">Nog geen video&apos;s</h2>
          <p className="text-gray-400 mb-6">
            Maak je eerste TikTok video concept aan om te beginnen.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Eerste Video Aanmaken
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {videos.map((video) => {
            const statusCfg = STATUS_CONFIG[video.status] || STATUS_CONFIG.draft
            const isLoading = actionLoading === video.id

            return (
              <div
                key={video.id}
                className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-bold text-gray-900 truncate">{video.product_name}</h3>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusCfg.bg} ${statusCfg.color}`}>
                        {statusCfg.label}
                      </span>
                      {video.views > 0 && (
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {video.views.toLocaleString('nl-NL')}
                        </span>
                      )}
                    </div>

                    {video.caption && (
                      <p className="text-sm text-gray-600 mb-1 truncate">{video.caption}</p>
                    )}

                    {video.hashtags?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {video.hashtags.map((h, i) => (
                          <span key={i} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                            #{h.replace(/^#/, '')}
                          </span>
                        ))}
                      </div>
                    )}

                    {video.failed_reason && (
                      <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> {video.failed_reason}
                      </p>
                    )}

                    <div className="text-xs text-gray-400 mt-2">
                      Aangemaakt: {new Date(video.created_at).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {video.posted_at && (
                        <> &middot; Gepost: {new Date(video.posted_at).toLocaleDateString('nl-NL', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}</>
                      )}
                    </div>
                  </div>

                  {/* Right: actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Genereer knop — alleen voor draft */}
                    {video.status === 'draft' && (
                      <button
                        onClick={() => handleGenerate(video.id)}
                        disabled={isLoading || !config.creatify}
                        title={!config.creatify ? 'Creatify niet geconfigureerd' : 'Genereer video'}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                      </button>
                    )}

                    {/* Post knop — alleen voor ready */}
                    {video.status === 'ready' && (
                      <button
                        onClick={() => handlePost(video.id)}
                        disabled={isLoading || !config.blotato}
                        title={!config.blotato ? 'Blotato niet geconfigureerd' : 'Post naar TikTok'}
                        className="p-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      </button>
                    )}

                    {/* Video bekijken */}
                    {video.video_url && (
                      <a
                        href={video.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100"
                        title="Video bekijken"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                    )}

                    {/* TikTok link */}
                    {video.tiktok_post_url && (
                      <a
                        href={video.tiktok_post_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
                        title="Bekijk op TikTok"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}

                    {/* Edit */}
                    {(['draft', 'failed', 'ready', 'posted'].includes(video.status)) && (
                      <button
                        onClick={() => setEditingId(editingId === video.id ? null : video.id)}
                        className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100"
                        title="Bewerken"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Verwijderen */}
                    <button
                      onClick={() => handleDelete(video.id)}
                      disabled={isLoading}
                      className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 disabled:opacity-40"
                      title="Verwijderen"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Inline edit */}
                {editingId === video.id && (
                  <EditForm
                    video={video}
                    onSave={(updates) => handleUpdate(video.id, updates)}
                    onCancel={() => setEditingId(null)}
                  />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Inline edit component ──────────────────────────────────────────────────

function EditForm({
  video,
  onSave,
  onCancel,
}: {
  video: TikTokVideo
  onSave: (updates: Record<string, unknown>) => void
  onCancel: () => void
}) {
  const [script, setScript] = useState(video.script || '')
  const [caption, setCaption] = useState(video.caption || '')
  const [hashtags, setHashtags] = useState(video.hashtags?.join(', ') || '')
  const [videoUrl, setVideoUrl] = useState(video.video_url || '')
  const [tiktokUrl, setTiktokUrl] = useState(video.tiktok_post_url || '')

  const newStatus = videoUrl && tiktokUrl ? 'posted' : videoUrl ? 'ready' : 'draft'

  return (
    <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
      {/* Video URL — handmatig invullen */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <label className="block text-xs font-bold text-blue-700 mb-1">
          Video URL (plak hier je InVideo/A2E/CapCut link)
        </label>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm bg-white"
          placeholder="https://... (video download link)"
        />
        <p className="text-xs text-blue-500 mt-1">
          Status wordt automatisch &quot;Klaar&quot; als je een URL invult
        </p>
      </div>

      {/* TikTok URL — na handmatig posten */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">
          TikTok URL (na handmatig uploaden)
        </label>
        <input
          type="url"
          value={tiktokUrl}
          onChange={(e) => setTiktokUrl(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          placeholder="https://www.tiktok.com/@pawsnl/video/..."
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Script</label>
        <textarea
          value={script}
          onChange={(e) => setScript(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm h-20"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Caption</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Hashtags</label>
          <input
            type="text"
            value={hashtags}
            onChange={(e) => setHashtags(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
          />
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <button
          onClick={() =>
            onSave({
              script: script || null,
              caption: caption || null,
              hashtags: hashtags ? hashtags.split(',').map((h) => h.trim()) : [],
              video_url: videoUrl || null,
              tiktok_post_url: tiktokUrl || null,
              status: newStatus,
            })
          }
          className="px-4 py-1.5 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700"
        >
          Opslaan
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200"
        >
          Annuleren
        </button>
        {newStatus !== 'draft' && (
          <span className="text-xs text-green-600 ml-2">
            Status wordt: {newStatus === 'ready' ? 'Klaar' : 'Gepost'}
          </span>
        )}
      </div>
    </div>
  )
}
