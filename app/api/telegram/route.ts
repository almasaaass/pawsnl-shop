import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN!
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY!
const ALLOWED_CHAT_ID = process.env.TELEGRAM_CHAT_ID

async function sendTelegram(chatId: number | string, text: string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' }),
  })
}

async function sendTyping(chatId: number | string) {
  await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendChatAction`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, action: 'typing' }),
  })
}

function eur(n: number) {
  return `€${Number(n).toFixed(2).replace('.', ',')}`
}

async function getShopStats() {
  try {
    const supabase = createAdminClient()
    const now = new Date()
    const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const startMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const [{ data: orders }, { data: customers }] = await Promise.all([
      supabase.from('orders').select('total, created_at').eq('status', 'paid'),
      supabase.from('customers').select('id'),
    ])

    const all = orders ?? []
    return {
      revenueToday: all.filter((o) => o.created_at >= startToday).reduce((s, o) => s + Number(o.total), 0),
      revenueMonth: all.filter((o) => o.created_at >= startMonth).reduce((s, o) => s + Number(o.total), 0),
      revenueTotal: all.reduce((s, o) => s + Number(o.total), 0),
      ordersToday: all.filter((o) => o.created_at >= startToday).length,
      ordersTotal: all.length,
      customersTotal: customers?.length ?? 0,
    }
  } catch {
    return null
  }
}

async function askClaude(userMessage: string, context: string): Promise<string> {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: `You are the smart AI assistant for PawsNL, a dropshipping web store for pet products. You always speak English and give short, practical answers (max 150 words). This is a mobile chat — be concise.

${context}

You can give advice on marketing, TikTok, product selection, pricing strategy, suppliers and shop management.`,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Anthropic API error: ${res.status} — ${err}`)
  }

  const data = await res.json()
  return data.content?.[0]?.text ?? 'No response received.'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const message = body?.message
    if (!message) return NextResponse.json({ ok: true })

    const chatId = message.chat?.id
    const text: string = (message.text ?? '').trim()
    const username = message.from?.first_name ?? 'there'

    if (!text) return NextResponse.json({ ok: true })

    // Access control
    if (ALLOWED_CHAT_ID && String(chatId) !== ALLOWED_CHAT_ID) {
      await sendTelegram(chatId, `⛔ No access. Your chat ID is: \`${chatId}\``)
      return NextResponse.json({ ok: true })
    }

    const cmd = text.toLowerCase()

    // ─── Commands ──────────────────────────────────────────────────────────

    if (cmd === '/start' || cmd === '/help') {
      await sendTelegram(chatId, `🐾 *PawsNL Bot* — Hello ${username}!

I'm your AI shop assistant. Ask me anything about your shop, or use:

📊 */stats* — Revenue & figures
📦 */orders* — Recent orders
🛒 */stock* — Stock check

Or just type a question like:
• "Which products should I add?"
• "Give me a TikTok idea for today"
• "How do I improve my conversion?"`)
      return NextResponse.json({ ok: true })
    }

    if (cmd === '/stats') {
      const stats = await getShopStats()
      if (!stats) {
        await sendTelegram(chatId, '❌ Could not retrieve statistics.')
        return NextResponse.json({ ok: true })
      }
      await sendTelegram(chatId, `📊 *PawsNL Stats*

💰 Today: *${eur(stats.revenueToday)}* (${stats.ordersToday} orders)
📅 This month: *${eur(stats.revenueMonth)}*
🏆 Total: *${eur(stats.revenueTotal)}*
👥 Customers: ${stats.customersTotal}
📦 Total orders: ${stats.ordersTotal}`)
      return NextResponse.json({ ok: true })
    }

    if (cmd === '/orders') {
      const supabase = createAdminClient()
      const { data } = await supabase
        .from('orders')
        .select('customer_name, total, created_at, items')
        .order('created_at', { ascending: false })
        .limit(5)

      if (!data?.length) {
        await sendTelegram(chatId, '📦 No orders yet.')
        return NextResponse.json({ ok: true })
      }

      const lines = data.map((o, i) => {
        const datum = new Date(o.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
        const items = Array.isArray(o.items) ? o.items.map((it: any) => `${it.name} ×${it.quantity}`).join(', ') : ''
        return `${i + 1}. *${o.customer_name}* — ${eur(Number(o.total))} (${datum})${items ? `\n   _${items}_` : ''}`
      })

      await sendTelegram(chatId, `📦 *Recent orders*\n\n${lines.join('\n\n')}`)
      return NextResponse.json({ ok: true })
    }

    if (cmd === '/stock') {
      const supabase = createAdminClient()
      const { data } = await supabase.from('products').select('name, stock').order('stock').limit(10)
      const lines = (data ?? []).map((p) => `• ${p.name}: *${p.stock}*${p.stock < 5 ? ' ⚠️' : ''}`)
      await sendTelegram(chatId, `🛒 *Stock (lowest first)*\n\n${lines.join('\n')}`)
      return NextResponse.json({ ok: true })
    }

    // ─── Free question → Claude ─────────────────────────────────────────────────

    await sendTyping(chatId)

    // Quickly fetch stats as context
    const stats = await getShopStats()
    const context = stats
      ? `Current shop data: revenue today ${eur(stats.revenueToday)}, this month ${eur(stats.revenueMonth)}, total ${eur(stats.revenueTotal)}, ${stats.ordersTotal} orders, ${stats.customersTotal} customers.`
      : 'Shop data temporarily unavailable.'

    let reply: string
    try {
      reply = await askClaude(text, context)
    } catch (aiError: any) {
      // Fallback if Anthropic API is not available
      if (aiError?.message?.includes('credit') || aiError?.message?.includes('billing')) {
        reply = `🤖 I can't answer your question right now — the AI has insufficient credits.\n\n👉 Go to console.anthropic.com → Billing → Add credits to activate this.\n\nIn the meantime, use the commands:\n📊 /stats · 📦 /orders · 🛒 /stock`
      } else {
        reply = `❌ AI error: ${aiError?.message ?? 'Unknown'}`
      }
    }
    await sendTelegram(chatId, reply)

    return NextResponse.json({ ok: true })

  } catch (error: any) {
    console.error('Telegram webhook error:', error)
    // Try to report error to user (best effort)
    try {
      const body = await request.clone().json().catch(() => ({}))
      const chatId = body?.message?.chat?.id
      if (chatId) {
        await sendTelegram(chatId, `❌ Error: ${error?.message ?? 'Unknown error'}`)
      }
    } catch {}
    return NextResponse.json({ ok: true })
  }
}

// Webhook registration
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('setup') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/telegram`
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`)
  return NextResponse.json(await res.json())
}
