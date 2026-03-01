import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = 'PawsNL <info@pawsshop.nl>'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'admin@pawsshop.nl'

function formatPrice(euros: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(euros)
}

// ─── Order bevestiging (naar klant) ──────────────────────────────────────────

interface OrderItem {
  name: string
  quantity: number
  price: number
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
}

function buildOrderItemsHtml(items: OrderItem[]) {
  return items
    .map(
      (item) => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;">${item.name}</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:center;">${item.quantity}×</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0f0;text-align:right;">${formatPrice(item.price)}</td>
        </tr>`
    )
    .join('')
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  const itemsHtml = buildOrderItemsHtml(data.items)

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
            <td style="background:#16a34a;padding:30px 40px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:28px;">🐾 PawsNL</h1>
              <p style="color:#bbf7d0;margin:8px 0 0;font-size:15px;">Bedankt voor je bestelling!</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="font-size:16px;color:#333;margin-top:0;">Hoi ${data.customerName},</p>
              <p style="font-size:15px;color:#555;line-height:1.6;">
                Super dat je bij PawsNL hebt besteld! We hebben je bestelling goed ontvangen en gaan er direct mee aan de slag. Je ontvangt een aparte e-mail zodra je pakket onderweg is.
              </p>

              <!-- Order summary -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
                <tr>
                  <td colspan="3" style="padding-bottom:12px;">
                    <strong style="font-size:15px;color:#111;">Jouw bestelling</strong>
                  </td>
                </tr>
                ${itemsHtml}
                <tr>
                  <td colspan="2" style="padding:14px 0 0;font-weight:bold;font-size:15px;">Totaal</td>
                  <td style="padding:14px 0 0;text-align:right;font-weight:bold;font-size:15px;color:#16a34a;">${formatPrice(data.total)}</td>
                </tr>
              </table>

              <!-- Shipping address -->
              <div style="background:#f9fafb;border-radius:8px;padding:20px;margin:24px 0;">
                <strong style="font-size:14px;color:#555;text-transform:uppercase;letter-spacing:0.5px;">Bezorgadres</strong>
                <p style="margin:8px 0 0;font-size:15px;color:#333;line-height:1.7;">
                  ${data.customerName}<br>
                  ${data.shippingAddress.street}<br>
                  ${data.shippingAddress.postal_code} ${data.shippingAddress.city}<br>
                  ${data.shippingAddress.country}
                </p>
              </div>

              <!-- Delivery info -->
              <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
                <strong style="color:#166534;font-size:14px;">📦 Verwachte bezorging: 3-7 werkdagen</strong>
              </div>

              <p style="font-size:14px;color:#777;margin:24px 0 0;">
                Vragen over je bestelling? Stuur ons een bericht via <a href="https://pawsshop.nl/contact" style="color:#16a34a;">pawsshop.nl/contact</a>.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:24px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="margin:0;font-size:13px;color:#9ca3af;">
                © 2024 PawsNL · Dé webshop voor jouw huisdier 🐶🐱
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
    subject: `✅ Bestelling ontvangen — PawsNL`,
    html,
  })
}

// ─── Nieuwe bestelling notificatie (naar admin) ───────────────────────────────

export async function sendAdminNewOrder(data: OrderEmailData) {
  const itemsHtml = buildOrderItemsHtml(data.items)

  const html = `
  <!DOCTYPE html>
  <html lang="nl">
  <head><meta charset="UTF-8"></head>
  <body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:30px;">
    <div style="background:#fff;max-width:520px;margin:0 auto;border-radius:10px;padding:30px;border:1px solid #e5e7eb;">
      <h2 style="color:#16a34a;margin-top:0;">💰 Nieuwe bestelling!</h2>
      <p><strong>Klant:</strong> ${data.customerName} (${data.customerEmail})</p>
      <p><strong>Adres:</strong> ${data.shippingAddress.street}, ${data.shippingAddress.postal_code} ${data.shippingAddress.city}</p>
      <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
        ${itemsHtml}
        <tr>
          <td colspan="2" style="padding:12px 0 0;font-weight:bold;">Totaal</td>
          <td style="padding:12px 0 0;text-align:right;font-weight:bold;color:#16a34a;">${formatPrice(data.total)}</td>
        </tr>
      </table>
      <a href="https://pawsshop.nl/admin/bestellingen" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:bold;margin-top:12px;">Bekijk in admin</a>
    </div>
  </body>
  </html>`

  return resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `💰 Nieuwe bestelling — ${formatPrice(data.total)}`,
    html,
  })
}

// ─── Contactformulier (naar admin) ────────────────────────────────────────────

interface ContactEmailData {
  naam: string
  email: string
  onderwerp: string
  bericht: string
}

export async function sendContactFormToAdmin(data: ContactEmailData) {
  const html = `
  <!DOCTYPE html>
  <html lang="nl">
  <head><meta charset="UTF-8"></head>
  <body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:30px;">
    <div style="background:#fff;max-width:520px;margin:0 auto;border-radius:10px;padding:30px;border:1px solid #e5e7eb;">
      <h2 style="color:#2563eb;margin-top:0;">📩 Nieuw contactbericht</h2>
      <p><strong>Naam:</strong> ${data.naam}</p>
      <p><strong>E-mail:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
      <p><strong>Onderwerp:</strong> ${data.onderwerp}</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;">
      <p style="white-space:pre-wrap;color:#333;">${data.bericht}</p>
    </div>
  </body>
  </html>`

  return resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `📩 Contact: ${data.onderwerp}`,
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
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;">${o.customer_name}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;">${formatPrice(o.total)}</td>
        <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right;color:#16a34a;">${o.status}</td>
      </tr>`
    )
    .join('')

  const html = `
  <!DOCTYPE html>
  <html lang="nl">
  <head><meta charset="UTF-8"></head>
  <body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:30px;">
    <div style="background:#fff;max-width:560px;margin:0 auto;border-radius:10px;overflow:hidden;border:1px solid #e5e7eb;">

      <div style="background:#16a34a;padding:24px 30px;">
        <h1 style="color:#fff;margin:0;font-size:22px;">🐾 PawsNL — Dagrapport</h1>
        <p style="color:#bbf7d0;margin:4px 0 0;">${data.date}</p>
      </div>

      <div style="padding:30px;">
        <!-- Stats today -->
        <h3 style="color:#111;margin-top:0;">Vandaag</h3>
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="background:#f0fdf4;border-radius:8px;padding:16px;text-align:center;width:48%;">
              <div style="font-size:28px;font-weight:bold;color:#16a34a;">${formatPrice(data.revenueToday)}</div>
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
          <strong>${formatPrice(data.revenueWeek)}</strong> omzet ·
          <strong>${data.ordersWeek}</strong> bestellingen
        </p>

        <!-- Stats month -->
        <h3 style="color:#111;margin-top:20px;">Totalen</h3>
        <p style="margin:0;color:#555;">
          <strong>${formatPrice(data.revenueMonth)}</strong> totale omzet ·
          <strong>${data.totalOrders}</strong> bestellingen ·
          <strong>${data.totalCustomers}</strong> klanten
        </p>

        <!-- Recent orders -->
        ${
          data.recentOrders.length > 0
            ? `
        <h3 style="color:#111;margin-top:24px;">Recente bestellingen</h3>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${recentOrdersHtml}
        </table>`
            : ''
        }

        <a href="https://pawsshop.nl/admin" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:6px;font-weight:bold;margin-top:24px;">Naar admin dashboard</a>
      </div>
    </div>
  </body>
  </html>`

  return resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `📊 PawsNL dagrapport — ${data.date}`,
    html,
  })
}
