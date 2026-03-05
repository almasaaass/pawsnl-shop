import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'PawsNL <info@pawsnlshop.com>'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@pawsnlshop.com'

function formatPrice(euros: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(euros)
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

// ─── Orderbevestiging (naar klant) ──────────────────────────────────────────

interface OrderItem {
  name: string
  quantity: number
  price: number
  variant_label?: string
}

interface OrderEmailData {
  customerName: string
  customerEmail: string
  orderId: string
  items: OrderItem[]
  total: number
  shippingAddress: {
    street: string
    city: string
    postal_code: string
    country: string
  }
  locale?: string
}

function buildOrderItemsHtml(items: OrderItem[]) {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">
            ${item.name}${item.variant_label ? `<br><span style="font-size:13px;color:#888;">${item.variant_label}</span>` : ''}
          </td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}x</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;">${formatPrice(item.price)}</td>
        </tr>`
    )
    .join('')
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  const itemsHtml = buildOrderItemsHtml(data.items)
  const isEn = data.locale === 'en'

  const html = `
  <!DOCTYPE html>
  <html lang="${isEn ? 'en' : 'nl'}">
  <head><meta charset="UTF-8"></head>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#0D9488;padding:30px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;">PawsNL</h1>
              <p style="color:#ccfbf1;margin:8px 0 0;font-size:15px;">${isEn ? 'Thank you for your order!' : 'Bedankt voor je bestelling!'}</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="font-size:16px;color:#333;margin-top:0;">${isEn ? 'Hi' : 'Hoi'} ${escapeHtml(data.customerName)},</p>
              <p style="font-size:15px;color:#555;line-height:1.6;">
                ${isEn
                  ? 'Thank you for your order at PawsNL! We have received your order and are preparing it. You will receive a separate email once your package is on its way.'
                  : 'Bedankt voor je bestelling bij PawsNL! We hebben je bestelling ontvangen en maken deze klaar. Je ontvangt een aparte e-mail zodra je pakket onderweg is.'}
              </p>

              <!-- Order summary -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                <tr>
                  <td colspan="3" style="padding-bottom:12px;">
                    <strong style="font-size:15px;color:#111;">${isEn ? 'Your order' : 'Jouw bestelling'}</strong>
                  </td>
                </tr>
                ${itemsHtml}
                <tr>
                  <td colspan="2" style="padding:14px 0 0;font-weight:bold;font-size:15px;">${isEn ? 'Total' : 'Totaal'}</td>
                  <td style="padding:14px 0 0;text-align:right;font-weight:bold;font-size:15px;color:#0D9488;">${formatPrice(data.total)}</td>
                </tr>
              </table>

              <!-- Shipping address -->
              <div style="background:#f9fafb;border-radius:8px;padding:20px;margin:24px 0;">
                <strong style="font-size:14px;color:#555;text-transform:uppercase;letter-spacing:0.5px;">${isEn ? 'Shipping address' : 'Bezorgadres'}</strong>
                <p style="margin:8px 0 0;font-size:15px;color:#333;line-height:1.7;">
                  ${escapeHtml(data.customerName)}<br>
                  ${escapeHtml(data.shippingAddress.street)}<br>
                  ${data.shippingAddress.postal_code} ${data.shippingAddress.city}<br>
                  ${data.shippingAddress.country}
                </p>
              </div>

              <!-- Delivery info -->
              <div style="background:#f0fdfa;border-left:4px solid #0D9488;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
                <strong style="color:#115E59;font-size:14px;">${isEn ? 'Estimated delivery: 7-14 business days' : 'Verwachte levertijd: 5-10 werkdagen'}</strong>
              </div>

              <p style="font-size:14px;color:#777;margin:24px 0 0;">
                ${isEn
                  ? 'Questions about your order? Send us a message at <a href="https://pawsnlshop.com/en/contact" style="color:#0D9488;">pawsnlshop.com/en/contact</a>.'
                  : 'Vragen over je bestelling? Stuur ons een bericht via <a href="https://pawsnlshop.com/contact" style="color:#0D9488;">pawsnlshop.com/contact</a>.'}
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:13px;color:#9ca3af;">
                &copy; 2026 PawsNL &middot; ${isEn ? 'Pet products for UK & Australia' : 'Dierenproducten voor Nederland & België'}
              </p>
            </td>
          </tr>

        </table>
      </td></tr>
    </table>
  </body>
  </html>`

  return resend.emails.send({
    from: FROM,
    to: data.customerEmail,
    subject: isEn ? 'Order confirmed — PawsNL' : 'Bestelling bevestigd — PawsNL',
    html,
  })
}

// ─── Nieuwe bestelling notificatie (naar admin) ───────────────────────

export async function sendAdminNewOrder(data: OrderEmailData) {
  const itemsHtml = buildOrderItemsHtml(data.items)

  const html = `
  <!DOCTYPE html>
  <html lang="nl">
  <head><meta charset="UTF-8"></head>
  <body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:30px;">
    <div style="background:#fff;max-width:520px;margin:0 auto;border-radius:10px;padding:30px;border:1px solid #e5e7eb;">
      <h2 style="color:#0D9488;margin-top:0;">Nieuwe bestelling!</h2>
      <p><strong>Klant:</strong> ${escapeHtml(data.customerName)} (${escapeHtml(data.customerEmail)})</p>
      <p><strong>Adres:</strong> ${escapeHtml(data.shippingAddress.street)}, ${escapeHtml(data.shippingAddress.postal_code)} ${escapeHtml(data.shippingAddress.city)}</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
        ${itemsHtml}
        <tr>
          <td colspan="2" style="padding:12px 0 0;font-weight:bold;">Totaal</td>
          <td style="padding:12px 0 0;text-align:right;font-weight:bold;color:#0D9488;">${formatPrice(data.total)}</td>
        </tr>
      </table>
      <a href="https://pawsnlshop.com/admin/bestellingen" style="display:inline-block;background:#0D9488;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:bold;margin-top:12px;">Bekijk in admin</a>
    </div>
  </body>
  </html>`

  return resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `Nieuwe bestelling — ${formatPrice(data.total)}`,
    html,
  })
}

// ─── Contactformulier (naar admin) ────────────────────────────────────────────

interface ContactEmailData {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactFormToAdmin(data: ContactEmailData) {
  const html = `
  <!DOCTYPE html>
  <html lang="nl">
  <head><meta charset="UTF-8"></head>
  <body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:30px;">
    <div style="background:#fff;max-width:520px;margin:0 auto;border-radius:10px;padding:30px;border:1px solid #e5e7eb;">
      <h2 style="color:#2563eb;margin-top:0;">Nieuw contactbericht</h2>
      <p><strong>Naam:</strong> ${escapeHtml(data.name)}</p>
      <p><strong>E-mail:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
      <p><strong>Onderwerp:</strong> ${escapeHtml(data.subject)}</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
      <p style="white-space:pre-wrap;color:#333;">${escapeHtml(data.message)}</p>
    </div>
  </body>
  </html>`

  return resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `Contact: ${data.subject}`,
    html,
  })
}

// ─── Lead Magnet email (gratis gids) ─────────────────────────────────────

export async function sendLeadMagnetEmail(email: string) {
  const pdfUrl = 'https://pawsnlshop.com/gids-gelukkig-huisdier.pdf'

  const html = `
  <!DOCTYPE html>
  <html lang="nl">
  <head><meta charset="UTF-8"></head>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#f97316,#f59e0b);padding:30px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;">PawsNL</h1>
              <p style="color:#fff3cd;margin:8px 0 0;font-size:15px;">Je gratis gids is hier!</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="font-size:16px;color:#333;margin-top:0;">Hoi!</p>
              <p style="font-size:15px;color:#555;line-height:1.6;">
                Bedankt voor je aanmelding! Hier is je gratis exemplaar van
                <strong>"De Ultieme Gids voor een Blij Huisdier"</strong>.
              </p>

              <!-- Download button -->
              <div style="text-align:center;margin:32px 0;">
                <a href="${pdfUrl}" style="display:inline-block;background:#f97316;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:bold;font-size:16px;">
                  Download je gratis gids
                </a>
              </div>

              <!-- Tips preview -->
              <div style="background:#fff7ed;border-left:4px solid #f97316;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
                <strong style="color:#9a3412;font-size:14px;">Wat je leert:</strong>
                <ul style="margin:8px 0 0;padding-left:20px;color:#555;font-size:14px;line-height:1.8;">
                  <li>De #1 fout die huisdiereigenaren maken</li>
                  <li>Voedingstips voor een langer & gezonder leven</li>
                  <li>Hoe gedragsproblemen te voorkomen</li>
                  <li>De beste producten voor elke levensfase</li>
                </ul>
              </div>

              <p style="font-size:14px;color:#555;line-height:1.6;">
                We sturen je ook af en toe tips en exclusieve aanbiedingen.
                Je kunt je op elk moment uitschrijven.
              </p>

              <!-- Shop CTA -->
              <div style="text-align:center;margin:24px 0 0;">
                <a href="https://pawsnlshop.com/producten" style="display:inline-block;background:#0D9488;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:bold;font-size:14px;">
                  Bekijk onze producten
                </a>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:13px;color:#9ca3af;">
                &copy; 2026 PawsNL &middot; Dierenproducten voor Nederland & België
              </p>
            </td>
          </tr>

        </table>
      </td></tr>
    </table>
  </body>
  </html>`

  return resend.emails.send({
    from: FROM,
    to: email,
    subject: `Je gratis gids — De Ultieme Gids voor een Blij Huisdier`,
    html,
  })
}

// ─── Tracking email (naar klant) ─────────────────────────────────────────────

interface TrackingEmailData {
  customerName: string
  customerEmail: string
  trackingNumber: string
  items: OrderItem[]
}

export async function sendTrackingEmail(data: TrackingEmailData) {
  const itemsList = data.items
    .map((item) => `<li style="padding:4px 0;color:#333;">${item.name} (${item.quantity}x)</li>`)
    .join('')

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pawsnlshop.com'
  const trackingUrl = `${appUrl}/track`

  const html = `
  <!DOCTYPE html>
  <html lang="nl">
  <head><meta charset="UTF-8"></head>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#2563eb;padding:30px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;">PawsNL</h1>
              <p style="color:#bfdbfe;margin:8px 0 0;font-size:15px;">Je pakket is onderweg!</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="font-size:16px;color:#333;margin-top:0;">Hoi ${escapeHtml(data.customerName)},</p>
              <p style="font-size:15px;color:#555;line-height:1.6;">
                Goed nieuws! Je bestelling is verzonden en is onderweg naar jou.
              </p>

              <!-- Status info -->
              <div style="background:#eff6ff;border-left:4px solid #2563eb;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
                <strong style="color:#1e40af;font-size:14px;">Status: Onderweg</strong>
                <p style="margin:8px 0 0;font-size:14px;color:#1e40af;">Verwachte levertijd: 5-10 werkdagen</p>
              </div>

              <div style="text-align:center;margin:24px 0;">
                <a href="${trackingUrl}" style="display:inline-block;background:#2563eb;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:bold;font-size:16px;">
                  Volg je bestelling
                </a>
              </div>

              <!-- Items -->
              <div style="background:#f9fafb;border-radius:8px;padding:20px;margin:24px 0;">
                <strong style="font-size:14px;color:#555;">Jouw producten:</strong>
                <ul style="margin:8px 0 0;padding-left:20px;font-size:15px;line-height:1.8;">
                  ${itemsList}
                </ul>
              </div>

              <div style="background:#f0fdfa;border-left:4px solid #0D9488;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
                <strong style="color:#115E59;font-size:14px;">Verwachte levertijd: 5-10 werkdagen</strong>
              </div>

              <p style="font-size:14px;color:#777;margin:24px 0 0;">
                Vragen? Neem contact op via <a href="https://pawsnlshop.com/contact" style="color:#2563eb;">pawsnlshop.com/contact</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:13px;color:#9ca3af;">
                &copy; 2026 PawsNL &middot; Dierenproducten voor Nederland & België
              </p>
            </td>
          </tr>

        </table>
      </td></tr>
    </table>
  </body>
  </html>`

  return resend.emails.send({
    from: FROM,
    to: data.customerEmail,
    subject: `Je pakket is onderweg — PawsNL`,
    html,
  })
}

// ─── Abandoned cart email (naar klant) ────────────────────────────────────────

interface AbandonedCartData {
  customerEmail: string
  customerName: string
  items: OrderItem[]
  total: number
  emailNumber: 1 | 2 | 3
}

export async function sendAbandonedCartEmail(data: AbandonedCartData) {
  const itemsHtml = data.items
    .map((item) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">${item.name}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}x</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;">${formatPrice(item.price)}</td>
      </tr>`)
    .join('')

  const subjects: Record<number, string> = {
    1: 'Je hebt iets vergeten bij PawsNL!',
    2: 'Je winkelwagen wacht op je...',
    3: 'Laatste kans: 10% korting op je winkelwagen!',
  }

  const messages: Record<number, string> = {
    1: `<p style="font-size:15px;color:#555;line-height:1.6;">
          We zagen dat je iets moois in je winkelwagen had, maar je bestelling nog niet hebt afgerond.
          Geen zorgen — je producten wachten nog op je!
        </p>`,
    2: `<p style="font-size:15px;color:#555;line-height:1.6;">
          Je winkelwagen staat er nog! De producten die je had geselecteerd zijn populair
          en kunnen snel uitverkocht raken. Rond je bestelling af voordat het te laat is.
        </p>`,
    3: `<p style="font-size:15px;color:#555;line-height:1.6;">
          Dit is je laatste herinnering! Als extra motivatie krijg je <strong>10% korting</strong>
          op je bestelling. Gebruik code <strong style="color:#0D9488;">WELKOM10</strong> bij het afrekenen.
        </p>
        <div style="background:#f0fdfa;border-left:4px solid #0D9488;padding:16px 20px;border-radius:0 8px 8px 0;margin:16px 0;">
          <strong style="color:#115E59;font-size:16px;">WELKOM10</strong>
          <p style="margin:4px 0 0;font-size:13px;color:#555;">10% korting — geldig tot morgen</p>
        </div>`,
  }

  const name = escapeHtml(data.customerName || 'daar')

  const html = `
  <!DOCTYPE html>
  <html lang="nl">
  <head><meta charset="UTF-8"></head>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
          <tr>
            <td style="background:#0D9488;padding:30px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;">PawsNL</h1>
              <p style="color:#ccfbf1;margin:8px 0 0;font-size:15px;">${subjects[data.emailNumber]}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="font-size:16px;color:#333;margin-top:0;">Hoi ${name},</p>
              ${messages[data.emailNumber]}

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                <tr>
                  <td colspan="3" style="padding-bottom:12px;">
                    <strong style="font-size:15px;color:#111;">Jouw winkelwagen</strong>
                  </td>
                </tr>
                ${itemsHtml}
                <tr>
                  <td colspan="2" style="padding:14px 0 0;font-weight:bold;font-size:15px;">Totaal</td>
                  <td style="padding:14px 0 0;text-align:right;font-weight:bold;font-size:15px;color:#0D9488;">${formatPrice(data.total)}</td>
                </tr>
              </table>

              <div style="text-align:center;margin:32px 0;">
                <a href="https://pawsnlshop.com/winkelwagen" style="display:inline-block;background:#0D9488;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:bold;font-size:16px;">
                  Bestelling afronden
                </a>
              </div>

              <p style="font-size:14px;color:#777;">
                Vragen? Neem contact op via <a href="https://pawsnlshop.com/contact" style="color:#0D9488;">pawsnlshop.com/contact</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:13px;color:#9ca3af;">
                &copy; 2026 PawsNL &middot; Dierenproducten voor Nederland & België
              </p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>`

  return resend.emails.send({
    from: FROM,
    to: data.customerEmail,
    subject: subjects[data.emailNumber],
    html,
  })
}

// ─── Post-purchase email (na bestelling) ──────────────────────────────────────

interface PostPurchaseData {
  customerEmail: string
  customerName: string
  emailType: 'tips' | 'review' | 'crosssell'
}

export async function sendPostPurchaseEmail(data: PostPurchaseData) {
  const name = escapeHtml(data.customerName || 'daar')

  const content: Record<string, { subject: string; body: string }> = {
    tips: {
      subject: 'Tips voor jouw nieuwe product — PawsNL',
      body: `
        <p style="font-size:16px;color:#333;margin-top:0;">Hoi ${name},</p>
        <p style="font-size:15px;color:#555;line-height:1.6;">
          Bedankt dat je bij PawsNL hebt besteld! Hier zijn een paar tips om het meeste
          uit je nieuwe aankoop te halen:
        </p>
        <div style="background:#fff7ed;border-left:4px solid #f97316;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
          <strong style="color:#9a3412;font-size:14px;">Onze tips:</strong>
          <ul style="margin:8px 0 0;padding-left:20px;color:#555;font-size:14px;line-height:1.8;">
            <li>Laat je huisdier wennen aan het nieuwe product — geef het een paar dagen</li>
            <li>Combineer nieuw speelgoed met hun favoriete snack voor een positieve associatie</li>
            <li>Wissel regelmatig van speelgoed om verveling te voorkomen</li>
          </ul>
        </div>`,
    },
    review: {
      subject: 'Hoe bevalt je aankoop? — PawsNL',
      body: `
        <p style="font-size:16px;color:#333;margin-top:0;">Hoi ${name},</p>
        <p style="font-size:15px;color:#555;line-height:1.6;">
          Je hebt nu al een tijdje genoten van je PawsNL producten. We horen graag hoe het bevalt!
        </p>
        <p style="font-size:15px;color:#555;line-height:1.6;">
          Jouw review helpt andere dierenliefhebbers om de juiste keuze te maken.
          Deel je ervaring en help ons verbeteren.
        </p>
        <div style="text-align:center;margin:24px 0;">
          <a href="https://pawsnlshop.com/contact" style="display:inline-block;background:#f97316;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:bold;font-size:16px;">
            Deel je ervaring
          </a>
        </div>`,
    },
    crosssell: {
      subject: 'Misschien vind je dit ook leuk — PawsNL',
      body: `
        <p style="font-size:16px;color:#333;margin-top:0;">Hoi ${name},</p>
        <p style="font-size:15px;color:#555;line-height:1.6;">
          Gebaseerd op je eerdere aankoop hebben we een paar producten die je misschien ook leuk vindt.
          Bekijk onze nieuwste collectie en ontdek meer voor je huisdier.
        </p>
        <div style="text-align:center;margin:24px 0;">
          <a href="https://pawsnlshop.com/producten?utm_source=email&utm_medium=postpurchase&utm_campaign=crosssell" style="display:inline-block;background:#0D9488;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:bold;font-size:16px;">
            Bekijk producten
          </a>
        </div>`,
    },
  }

  const { subject, body } = content[data.emailType]

  const html = `
  <!DOCTYPE html>
  <html lang="nl">
  <head><meta charset="UTF-8"></head>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
          <tr>
            <td style="background:#0D9488;padding:30px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;">PawsNL</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              ${body}
              <p style="font-size:14px;color:#777;margin:24px 0 0;">
                Vragen? Neem contact op via <a href="https://pawsnlshop.com/contact" style="color:#0D9488;">pawsnlshop.com/contact</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:13px;color:#9ca3af;">
                &copy; 2026 PawsNL &middot; Dierenproducten voor Nederland & België
              </p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>`

  return resend.emails.send({
    from: FROM,
    to: data.customerEmail,
    subject,
    html,
  })
}

// ─── Welkomstsequentie (na aanmelding) ─────────────────────────────────────────

interface WelcomeEmailData {
  email: string
  emailNumber: 1 | 2 | 3 | 4 | 5
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const emails: Record<number, { subject: string; body: string }> = {
    1: {
      subject: 'Welkom bij PawsNL! 🐾',
      body: `
        <p style="font-size:16px;color:#333;margin-top:0;">Hoi!</p>
        <p style="font-size:15px;color:#555;line-height:1.6;">
          Welkom bij de PawsNL familie! We zijn blij dat je er bent. Bij PawsNL vind je
          de leukste producten voor jouw hond of kat — van speelgoed tot verzorging.
        </p>
        <p style="font-size:15px;color:#555;line-height:1.6;">
          Als welkomstcadeau krijg je <strong>10% korting</strong> op je eerste bestelling
          met code <strong style="color:#0D9488;">WELKOM10</strong>.
        </p>
        <div style="background:#f0fdfa;border-left:4px solid #0D9488;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
          <strong style="color:#115E59;font-size:18px;">WELKOM10</strong>
          <p style="margin:4px 0 0;font-size:13px;color:#555;">10% korting op je eerste bestelling</p>
        </div>
        <div style="text-align:center;margin:24px 0;">
          <a href="https://pawsnlshop.com/producten?utm_source=email&utm_medium=welcome&utm_campaign=welcome1" style="display:inline-block;background:#0D9488;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:bold;font-size:16px;">
            Bekijk onze producten
          </a>
        </div>`,
    },
    2: {
      subject: '5 tips voor een gelukkig huisdier',
      body: `
        <p style="font-size:16px;color:#333;margin-top:0;">Hoi!</p>
        <p style="font-size:15px;color:#555;line-height:1.6;">
          Als dierenliefhebber wil je het beste voor je huisdier. Hier zijn 5 tips die elke baasje moet weten:
        </p>
        <div style="background:#fff7ed;border-left:4px solid #f97316;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
          <ol style="margin:0;padding-left:20px;color:#555;font-size:14px;line-height:2;">
            <li><strong>Mentale stimulatie</strong> — Een snuffle mat of puzzelspeelgoed houdt je huisdier scherp</li>
            <li><strong>Dagelijkse routine</strong> — Huisdieren houden van voorspelbaarheid</li>
            <li><strong>Goede verzorging</strong> — Regelmatig borstelen en nagels knippen</li>
            <li><strong>Beweging</strong> — Elke dag minimaal 30 minuten actief</li>
            <li><strong>Socialisatie</strong> — Contact met andere dieren en mensen</li>
          </ol>
        </div>`,
    },
    3: {
      subject: 'Onze populairste producten van deze maand',
      body: `
        <p style="font-size:16px;color:#333;margin-top:0;">Hoi!</p>
        <p style="font-size:15px;color:#555;line-height:1.6;">
          Benieuwd wat andere dierenliefhebbers kopen? Dit zijn onze bestsellers deze maand:
        </p>
        <div style="background:#f9fafb;border-radius:8px;padding:20px;margin:24px 0;">
          <ul style="margin:0;padding-left:20px;color:#555;font-size:14px;line-height:2;">
            <li>🐕 <strong>Snuffle Mat</strong> — Mentale stimulatie voor je hond</li>
            <li>🐈 <strong>Automatische Kattenlaser</strong> — Eindeloos speelplezier</li>
            <li>🐕 <strong>Anti-Trek Tuigje</strong> — Ontspannen wandelen</li>
            <li>🐈 <strong>Kattentunnel 3-weg</strong> — Verstoppen en rennen</li>
          </ul>
        </div>
        <div style="text-align:center;margin:24px 0;">
          <a href="https://pawsnlshop.com/producten?utm_source=email&utm_medium=welcome&utm_campaign=welcome3" style="display:inline-block;background:#0D9488;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:bold;font-size:16px;">
            Bekijk alle producten
          </a>
        </div>`,
    },
    4: {
      subject: 'Wist je dit over je huisdier?',
      body: `
        <p style="font-size:16px;color:#333;margin-top:0;">Hoi!</p>
        <p style="font-size:15px;color:#555;line-height:1.6;">
          Hier zijn 3 verrassende feiten over huisdieren:
        </p>
        <div style="background:#f0f9ff;border-left:4px solid #3b82f6;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
          <ul style="margin:0;padding-left:20px;color:#555;font-size:14px;line-height:2;">
            <li>🧠 Honden die puzzelspeelgoed gebruiken hebben <strong>30% minder stress</strong></li>
            <li>🐾 Katten die interactief speelgoed hebben zijn <strong>gemiddeld 2 jaar gezonder</strong></li>
            <li>💤 Een goede slaapplek verbetert de <strong>algehele gezondheid</strong> van je huisdier</li>
          </ul>
        </div>
        <p style="font-size:15px;color:#555;line-height:1.6;">
          Bij PawsNL hebben we producten die hierop inspelen. Ontdek ze in onze winkel.
        </p>`,
    },
    5: {
      subject: 'Je 10% korting verloopt bijna!',
      body: `
        <p style="font-size:16px;color:#333;margin-top:0;">Hoi!</p>
        <p style="font-size:15px;color:#555;line-height:1.6;">
          Dit is een vriendelijke herinnering: je welkomstkorting van <strong>10%</strong>
          verloopt binnenkort! Gebruik code <strong style="color:#0D9488;">WELKOM10</strong>
          bij je eerste bestelling.
        </p>
        <div style="background:#fef3c7;border-left:4px solid #f59e0b;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
          <strong style="color:#92400e;font-size:16px;">Laatste kans: WELKOM10</strong>
          <p style="margin:4px 0 0;font-size:13px;color:#555;">10% korting — verloopt over 3 dagen</p>
        </div>
        <div style="text-align:center;margin:24px 0;">
          <a href="https://pawsnlshop.com/producten?utm_source=email&utm_medium=welcome&utm_campaign=welcome5" style="display:inline-block;background:#f97316;color:#ffffff;text-decoration:none;padding:14px 32px;border-radius:10px;font-weight:bold;font-size:16px;">
            Nu shoppen met 10% korting
          </a>
        </div>`,
    },
  }

  const { subject, body } = emails[data.emailNumber]

  const html = `
  <!DOCTYPE html>
  <html lang="nl">
  <head><meta charset="UTF-8"></head>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:'Segoe UI',Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;width:100%;">
          <tr>
            <td style="background:#0D9488;padding:30px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;">PawsNL</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              ${body}
              <p style="font-size:14px;color:#777;margin:24px 0 0;">
                Vragen? Neem contact op via <a href="https://pawsnlshop.com/contact" style="color:#0D9488;">pawsnlshop.com/contact</a>.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:13px;color:#9ca3af;">
                &copy; 2026 PawsNL &middot; <a href="https://pawsnlshop.com" style="color:#9ca3af;">pawsnlshop.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
  </html>`

  return resend.emails.send({
    from: FROM,
    to: data.email,
    subject,
    html,
  })
}

// ─── Viral Alert (naar admin) ────────────────────────────────────────────────

interface ViralAlertData {
  videoId: string
  productName: string
  tiktokUrl: string | null
  views: number
}

export async function sendViralAlert(data: ViralAlertData) {
  const html = `
  <!DOCTYPE html>
  <html lang="nl">
  <head><meta charset="UTF-8"></head>
  <body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:30px;">
    <div style="background:#fff;max-width:520px;margin:0 auto;border-radius:10px;padding:30px;border:1px solid #e5e7eb;">
      <div style="text-align:center;margin-bottom:20px;">
        <span style="font-size:48px;">🔥</span>
      </div>
      <h2 style="color:#dc2626;margin-top:0;text-align:center;">Video gaat viraal!</h2>
      <p style="font-size:15px;color:#555;text-align:center;line-height:1.6;">
        Je TikTok video voor <strong>${data.productName}</strong> heeft
        <strong style="color:#dc2626;">${data.views.toLocaleString('nl-NL')}</strong> views bereikt!
      </p>

      <div style="background:#fef2f2;border-left:4px solid #dc2626;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
        <strong style="color:#991b1b;font-size:14px;">Actie nodig:</strong>
        <ul style="margin:8px 0 0;padding-left:20px;color:#555;font-size:14px;line-height:1.8;">
          <li>Controleer de voorraad van dit product</li>
          <li>Overweeg meer budget voor ads</li>
          <li>Post een follow-up video</li>
        </ul>
      </div>

      ${data.tiktokUrl ? `
      <div style="text-align:center;margin:24px 0;">
        <a href="${data.tiktokUrl}" style="display:inline-block;background:#000;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:bold;">
          Bekijk op TikTok
        </a>
      </div>` : ''}

      <a href="https://pawsnlshop.com/admin/tiktok-pipeline" style="display:inline-block;background:#0D9488;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:bold;margin-top:12px;">
        Naar Video Pipeline
      </a>
    </div>
  </body>
  </html>`

  return resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `🔥 VIRAAL — ${data.productName} heeft ${data.views.toLocaleString('nl-NL')} views!`,
    html,
  })
}

// ─── Dagelijks rapport (naar admin) ──────────────────────────────────────────

interface DailyReportData {
  date: string
  revenueToday: number
  ordersToday: number
  revenueWeek: number
  ordersWeek: number
  revenueMonth: number
  totalCustomers: number
  totalOrders: number
  recentOrders: { customer_name: string; total: number; status: string }[]
}

export async function sendDailyReport(data: DailyReportData) {
  const recentOrdersHtml = data.recentOrders
    .slice(0, 5)
    .map(
      (o) => `
      <tr>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">${escapeHtml(o.customer_name)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;">${formatPrice(o.total)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;color:#0D9488;">${o.status}</td>
      </tr>`
    )
    .join('')

  const html = `
  <!DOCTYPE html>
  <html lang="nl">
  <head><meta charset="UTF-8"></head>
  <body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:30px;">
    <div style="background:#fff;max-width:560px;margin:0 auto;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb;">

      <div style="background:#0D9488;padding:24px 30px;">
        <h1 style="color:#fff;margin:0;font-size:22px;">PawsNL — Dagelijks Rapport</h1>
        <p style="color:#ccfbf1;margin:4px 0 0;">${data.date}</p>
      </div>

      <div style="padding:30px;">
        <!-- Stats vandaag -->
        <h3 style="color:#111;margin-top:0;">Vandaag</h3>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:#f0fdfa;border-radius:8px;padding:16px;text-align:center;width:48%;">
              <div style="font-size:28px;font-weight:bold;color:#0D9488;">${formatPrice(data.revenueToday)}</div>
              <div style="font-size:13px;color:#666;">Omzet</div>
            </td>
            <td width="4%"></td>
            <td style="background:#eff6ff;border-radius:8px;padding:16px;text-align:center;width:48%;">
              <div style="font-size:28px;font-weight:bold;color:#2563eb;">${data.ordersToday}</div>
              <div style="font-size:13px;color:#666;">Bestellingen</div>
            </td>
          </tr>
        </table>

        <!-- Stats week -->
        <h3 style="color:#111;margin-top:24px;">Deze week</h3>
        <p style="margin:0;color:#555;">
          <strong>${formatPrice(data.revenueWeek)}</strong> omzet &middot;
          <strong>${data.ordersWeek}</strong> bestellingen
        </p>

        <!-- Stats totalen -->
        <h3 style="color:#111;margin-top:20px;">Totalen</h3>
        <p style="margin:0;color:#555;">
          <strong>${formatPrice(data.revenueMonth)}</strong> totale omzet &middot;
          <strong>${data.totalOrders}</strong> bestellingen &middot;
          <strong>${data.totalCustomers}</strong> klanten
        </p>

        <!-- Recente bestellingen -->
        ${
          data.recentOrders.length > 0
            ? `
        <h3 style="color:#111;margin-top:24px;">Recente bestellingen</h3>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${recentOrdersHtml}
        </table>`
            : ''
        }

        <a href="https://pawsnlshop.com/admin" style="display:inline-block;background:#0D9488;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:bold;margin-top:24px;">Naar admin dashboard</a>
      </div>
    </div>
  </body>
  </html>`

  return resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `PawsNL dagelijks rapport — ${data.date}`,
    html,
  })
}
