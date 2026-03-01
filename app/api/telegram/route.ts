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
    const startVandaag = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
    const startMaand = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

    const [{ data: orders }, { data: klanten }] = await Promise.all([
      supabase.from('orders').select('total, created_at').eq('status', 'paid'),
      supabase.from('customers').select('id'),
    ])

    const all = orders ?? []
    return {
      omzetVandaag: all.filter((o) => o.created_at >= startVandaag).reduce((s, o) => s + Number(o.total), 0),
      omzetMaand: all.filter((o) => o.created_at >= startMaand).reduce((s, o) => s + Number(o.total), 0),
      omzetTotaal: all.reduce((s, o) => s + Number(o.total), 0),
      ordersVandaag: all.filter((o) => o.created_at >= startVandaag).length,
      bestellingenTotaal: all.length,
      klantenTotaal: klanten?.length ?? 0,
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
      system: `Je bent de slimme AI-assistent van PawsNL, een Nederlandse dropshipping webshop voor dierenproducten. Je spreekt altijd Nederlands en geeft korte, praktische antwoorden (max 150 woorden). Dit is een chat op mobiel — wees beknopt.

${context}

Je kunt advies geven over marketing, TikTok, productkeuze, prijsstrategie, leveranciers en shopbeheer.`,
      messages: [{ role: 'user', content: userMessage }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Anthropic API fout: ${res.status} — ${err}`)
  }

  const data = await res.json()
  return data.content?.[0]?.text ?? 'Geen antwoord ontvangen.'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const message = body?.message
    if (!message) return NextResponse.json({ ok: true })

    const chatId = message.chat?.id
    const text: string = (message.text ?? '').trim()
    const username = message.from?.first_name ?? 'daar'

    if (!text) return NextResponse.json({ ok: true })

    // Toegangscontrole
    if (ALLOWED_CHAT_ID && String(chatId) !== ALLOWED_CHAT_ID) {
      await sendTelegram(chatId, `⛔ Geen toegang. Jouw chat ID is: \`${chatId}\``)
      return NextResponse.json({ ok: true })
    }

    const cmd = text.toLowerCase()

    // ─── Commando's ──────────────────────────────────────────────────────────

    if (cmd === '/start' || cmd === '/help') {
      await sendTelegram(chatId, `🐾 *PawsNL Bot* — Hallo ${username}!

Ik ben je AI shop-assistent. Stel me alles over je shop, of gebruik:

📊 */stats* — Omzet & cijfers
📦 */bestellingen* — Laatste orders
🛒 */voorraad* — Voorraad check

Of typ gewoon een vraag zoals:
• "Welke producten moet ik toevoegen?"
• "Geef me een TikTok idee voor vandaag"
• "Hoe verbeter ik mijn conversie?"`)
      return NextResponse.json({ ok: true })
    }

    if (cmd === '/stats') {
      const stats = await getShopStats()
      if (!stats) {
        await sendTelegram(chatId, '❌ Kon statistieken niet ophalen.')
        return NextResponse.json({ ok: true })
      }
      await sendTelegram(chatId, `📊 *PawsNL Stats*

💰 Vandaag: *${eur(stats.omzetVandaag)}* (${stats.ordersVandaag} orders)
📅 Deze maand: *${eur(stats.omzetMaand)}*
🏆 Totaal: *${eur(stats.omzetTotaal)}*
👥 Klanten: ${stats.klantenTotaal}
📦 Orders totaal: ${stats.bestellingenTotaal}`)
      return NextResponse.json({ ok: true })
    }

    if (cmd === '/bestellingen') {
      const supabase = createAdminClient()
      const { data } = await supabase
        .from('orders')
        .select('customer_name, total, created_at, items')
        .order('created_at', { ascending: false })
        .limit(5)

      if (!data?.length) {
        await sendTelegram(chatId, '📦 Nog geen bestellingen.')
        return NextResponse.json({ ok: true })
      }

      const lines = data.map((o, i) => {
        const datum = new Date(o.created_at).toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })
        const items = Array.isArray(o.items) ? o.items.map((it: any) => `${it.name} ×${it.quantity}`).join(', ') : ''
        return `${i + 1}. *${o.customer_name}* — ${eur(Number(o.total))} (${datum})${items ? `\n   _${items}_` : ''}`
      })

      await sendTelegram(chatId, `📦 *Laatste bestellingen*\n\n${lines.join('\n\n')}`)
      return NextResponse.json({ ok: true })
    }

    if (cmd === '/voorraad') {
      const supabase = createAdminClient()
      const { data } = await supabase.from('products').select('name, stock').order('stock').limit(10)
      const lines = (data ?? []).map((p) => `• ${p.name}: *${p.stock}*${p.stock < 5 ? ' ⚠️' : ''}`)
      await sendTelegram(chatId, `🛒 *Voorraad (laagste eerst)*\n\n${lines.join('\n')}`)
      return NextResponse.json({ ok: true })
    }

    // ─── Vrije vraag → Claude ─────────────────────────────────────────────────

    await sendTyping(chatId)

    // Haal snel stats op als context
    const stats = await getShopStats()
    const context = stats
      ? `Huidige shopdata: omzet vandaag ${eur(stats.omzetVandaag)}, deze maand ${eur(stats.omzetMaand)}, totaal ${eur(stats.omzetTotaal)}, ${stats.bestellingenTotaal} bestellingen, ${stats.klantenTotaal} klanten.`
      : 'Shopdata tijdelijk niet beschikbaar.'

    let reply: string
    try {
      reply = await askClaude(text, context)
    } catch (aiError: any) {
      // Fallback als Anthropic API niet beschikbaar is
      if (aiError?.message?.includes('credit') || aiError?.message?.includes('billing')) {
        reply = `🤖 Ik kan je vraag nu niet beantwoorden — de AI heeft onvoldoende credits.\n\n👉 Ga naar console.anthropic.com → Billing → Add credits om dit te activeren.\n\nGebruik ondertussen de commando's:\n📊 /stats · 📦 /bestellingen · 🛒 /voorraad`
      } else {
        reply = `❌ AI fout: ${aiError?.message ?? 'Onbekend'}`
      }
    }
    await sendTelegram(chatId, reply)

    return NextResponse.json({ ok: true })

  } catch (error: any) {
    console.error('Telegram webhook error:', error)
    // Probeer fout te melden aan gebruiker (best effort)
    try {
      const body = await request.clone().json().catch(() => ({}))
      const chatId = body?.message?.chat?.id
      if (chatId) {
        await sendTelegram(chatId, `❌ Fout: ${error?.message ?? 'Onbekende fout'}`)
      }
    } catch {}
    return NextResponse.json({ ok: true })
  }
}

// Webhook registratie
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('setup') !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/telegram`
  const res = await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`)
  return NextResponse.json(await res.json())
}
