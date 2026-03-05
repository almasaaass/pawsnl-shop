'use client'

import { useState } from 'react'
import { RefreshCw, Copy, Check, Download, Sparkles, Clock, Hash, Film, ChevronDown, ChevronUp, Gift, Zap } from 'lucide-react'

interface TikTokScript {
  day: string
  format: string
  product: string
  category: string
  hook: string
  retain: string
  reward: string
  hashtags: string[]
  filmtips: { hook: string[]; retain: string[]; reward: string[] }
  duration: string
}

const CATEGORY_COLORS: Record<string, string> = {
  dogs: 'bg-amber-100 text-amber-800',
  cats: 'bg-purple-100 text-purple-800',
  birds: 'bg-sky-100 text-sky-800',
  rodents: 'bg-orange-100 text-orange-800',
  fish: 'bg-blue-100 text-blue-800',
}

const DAY_COLORS = [
  'border-l-pink-500',
  'border-l-violet-500',
  'border-l-blue-500',
  'border-l-emerald-500',
  'border-l-amber-500',
  'border-l-rose-500',
  'border-l-indigo-500',
]

function ScriptCard({ script, index }: { script: TikTokScript; index: number }) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(index === 0)

  const fullText = `📅 ${script.day} — ${script.format}
🛍️ Product: ${script.product}
⏱️ Duration: ${script.duration}

🔴 HOOK (0-3 sec):
${script.hook}

🔵 RETAIN (3-45 sec):
${script.retain}

🟢 REWARD (last 5 sec):
${script.reward}

#️⃣ HASHTAGS:
${script.hashtags.join(' ')}

🎬 FILMING TIPS:
Hook: ${script.filmtips.hook.map((t, i) => `${i + 1}. ${t}`).join('\n')}
Retain: ${script.filmtips.retain.map((t, i) => `${i + 1}. ${t}`).join('\n')}
Reward: ${script.filmtips.reward.map((t, i) => `${i + 1}. ${t}`).join('\n')}`

  function copyScript() {
    navigator.clipboard.writeText(fullText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function downloadScript() {
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tiktok-${script.day.toLowerCase()}-${script.product.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 border-l-4 ${DAY_COLORS[index % DAY_COLORS.length]} overflow-hidden`}>
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center font-bold text-gray-700">
            {index + 1}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-gray-900">{script.day}</span>
              <span className="text-gray-400">·</span>
              <span className="text-sm text-gray-500">{script.format}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[script.category] ?? 'bg-gray-100 text-gray-700'}`}>
                {script.category}
              </span>
            </div>
            <p className="text-sm text-gray-600 truncate mt-0.5">{script.product}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-4">
          <span className="text-xs text-gray-400 hidden sm:block">{script.duration}</span>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {/* Body */}
      {expanded && (
        <div className="px-5 pb-5 space-y-5 border-t border-gray-100 pt-4">

          {/* Phase indicator */}
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100 text-red-700">
              <Zap className="w-3 h-3" /> Hook 0-3s
            </span>
            <span className="text-gray-300">→</span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
              <Film className="w-3 h-3" /> Retain 3-45s
            </span>
            <span className="text-gray-300">→</span>
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-100 text-green-700">
              <Gift className="w-3 h-3" /> Reward 5s
            </span>
            <span className="ml-auto flex items-center gap-1 text-gray-400">
              <Clock className="w-3 h-3" /> {script.duration}
            </span>
          </div>

          {/* HOOK — Red */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Zap className="w-4 h-4 text-red-500" />
              <span className="text-xs font-semibold text-red-600 uppercase tracking-wide">Hook — Grab attention (0-3 sec)</span>
            </div>
            <p className="text-base font-medium text-gray-800 bg-red-50 rounded-xl px-4 py-3 border border-red-100">
              {script.hook}
            </p>
            <div className="mt-2 space-y-1">
              {script.filmtips.hook.map((tip, i) => (
                <p key={i} className="text-xs text-red-600 flex gap-1.5 items-start">
                  <span className="flex-shrink-0 w-4 h-4 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">{i + 1}</span>
                  {tip}
                </p>
              ))}
            </div>
          </div>

          {/* RETAIN — Blue */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Film className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Retain — Deliver value (3-45 sec)</span>
            </div>
            <pre className="text-sm text-gray-700 bg-blue-50 rounded-xl px-4 py-4 whitespace-pre-wrap font-sans leading-relaxed border border-blue-100">
              {script.retain}
            </pre>
            <div className="mt-2 space-y-1">
              {script.filmtips.retain.map((tip, i) => (
                <p key={i} className="text-xs text-blue-600 flex gap-1.5 items-start">
                  <span className="flex-shrink-0 w-4 h-4 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">{i + 1}</span>
                  {tip}
                </p>
              ))}
            </div>
          </div>

          {/* REWARD — Green */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Gift className="w-4 h-4 text-green-500" />
              <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">Reward — Payoff + CTA (last 5 sec)</span>
            </div>
            <div className="text-sm text-gray-700 bg-green-50 rounded-xl px-4 py-4 whitespace-pre-wrap leading-relaxed border border-green-100">
              {script.reward}
            </div>
            <div className="mt-2 space-y-1">
              {script.filmtips.reward.map((tip, i) => (
                <p key={i} className="text-xs text-green-600 flex gap-1.5 items-start">
                  <span className="flex-shrink-0 w-4 h-4 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5">{i + 1}</span>
                  {tip}
                </p>
              ))}
            </div>
          </div>

          {/* Hashtags */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Hash className="w-4 h-4 text-violet-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Hashtags</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {script.hashtags.map((tag) => (
                <span key={tag} className="text-xs bg-violet-50 text-violet-700 px-2.5 py-1 rounded-full border border-violet-100 font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={copyScript}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-700 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied!' : 'Copy script'}
            </button>
            <button
              onClick={downloadScript}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function TikTokPage() {
  const [scripts, setScripts] = useState<TikTokScript[]>([])
  const [loading, setLoading] = useState(false)
  const [generatedAt, setGeneratedAt] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function generateScripts() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/tiktok')
      if (!res.ok) throw new Error('Generation failed')
      const data = await res.json()
      setScripts(data.scripts)
      setGeneratedAt(data.generatedAt)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function downloadAll() {
    const all = scripts
      .map(
        (s, i) =>
          `${'='.repeat(60)}\n${i + 1}. ${s.day.toUpperCase()} — ${s.format}\n${'='.repeat(60)}\n\n` +
          `🛍️ Product: ${s.product}\n⏱️ Duration: ${s.duration}\n\n` +
          `🔴 HOOK (0-3 sec):\n${s.hook}\n\n` +
          `🔵 RETAIN (3-45 sec):\n${s.retain}\n\n` +
          `🟢 REWARD (last 5 sec):\n${s.reward}\n\n` +
          `#️⃣ HASHTAGS:\n${s.hashtags.join(' ')}\n\n` +
          `🎬 FILMING TIPS:\nHook: ${s.filmtips.hook.join(' | ')}\nRetain: ${s.filmtips.retain.join(' | ')}\nReward: ${s.filmtips.reward.join(' | ')}\n`
      )
      .join('\n\n')

    const blob = new Blob([`PawsNL — TikTok Scripts (Hook→Retain→Reward)\nGenerated: ${new Date().toLocaleDateString('en-GB')}\n\n${all}`], {
      type: 'text/plain;charset=utf-8',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pawsshop-tiktok-scripts-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-3xl mx-auto">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          🎵 TikTok Script Generator
        </h1>
        <p className="text-gray-500 mt-1">
          Hormozi Hook→Retain→Reward framework — 7 scripts per week
        </p>
      </div>

      {/* Framework explanation */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-red-50 border border-red-100 rounded-xl p-3 text-center">
          <Zap className="w-5 h-5 text-red-500 mx-auto mb-1" />
          <p className="text-xs font-bold text-red-700">HOOK</p>
          <p className="text-[11px] text-red-500">0-3 sec · Attention</p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center">
          <Film className="w-5 h-5 text-blue-500 mx-auto mb-1" />
          <p className="text-xs font-bold text-blue-700">RETAIN</p>
          <p className="text-[11px] text-blue-500">3-45 sec · Value</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-3 text-center">
          <Gift className="w-5 h-5 text-green-500 mx-auto mb-1" />
          <p className="text-xs font-bold text-green-700">REWARD</p>
          <p className="text-[11px] text-green-500">Last 5 sec · CTA</p>
        </div>
      </div>

      {/* Generate button */}
      <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 rounded-2xl p-6 mb-8 text-white shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold mb-1">Generate weekly plan</h2>
            <p className="text-pink-100 text-sm leading-relaxed">
              Each script follows the Hook→Retain→Reward framework with Hormozi-style openers, valuable content and strong CTAs.
            </p>
            {generatedAt && (
              <p className="text-pink-200 text-xs mt-2">
                Generated: {new Date(generatedAt).toLocaleString('en-GB')}
              </p>
            )}
          </div>
          <button
            onClick={generateScripts}
            disabled={loading}
            className="flex-shrink-0 flex items-center gap-2 bg-white text-pink-600 font-bold px-5 py-3 rounded-xl hover:bg-pink-50 transition-colors disabled:opacity-70 disabled:cursor-not-allowed shadow"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Generating...' : scripts.length ? 'New week' : 'Generate scripts'}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-6 text-sm">
          {error}
        </div>
      )}

      {/* Scripts */}
      {scripts.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-700">7 scripts for this week</h2>
            <button
              onClick={downloadAll}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download all
            </button>
          </div>

          <div className="space-y-4">
            {scripts.map((script, i) => (
              <ScriptCard key={i} script={script} index={i} />
            ))}
          </div>

          {/* Tips block */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h3 className="font-bold text-amber-900 mb-3">🚀 Hormozi Content Strategy</h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li>🔴 <strong>Hook:</strong> The first 3 seconds determine whether someone watches. Use pattern interrupts, questions or shocking facts.</li>
              <li>🔵 <strong>Retain:</strong> Deliver REAL value. Teach something, show something, or entertain. The longer they watch, the more the algorithm pushes you.</li>
              <li>🟢 <strong>Reward:</strong> Reward the viewer with a CTA + urgency. &quot;Link in bio&quot; + &quot;almost sold out&quot; = conversion.</li>
              <li>📅 <strong>Post every day</strong> — consistency is more important than perfection</li>
              <li>🕐 <strong>Best times:</strong> 7-9am, 12-2pm, and 7-9pm</li>
              <li>💬 <strong>Reply to all comments</strong> within 1 hour</li>
            </ul>
          </div>
        </>
      )}

      {/* Empty state */}
      {scripts.length === 0 && !loading && (
        <div className="text-center py-20 text-gray-400">
          <div className="text-6xl mb-4">🎵</div>
          <p className="text-lg font-medium text-gray-500">Click &quot;Generate scripts&quot; to get started</p>
          <p className="text-sm mt-1">You will get 7 scripts with Hook→Retain→Reward structure</p>
        </div>
      )}

    </div>
  )
}
