# PawsNL n8n Automation Guide

> Configuratiegids voor het automatiseren van de PawsNL dierenwebshop met n8n.
> Alle technische termen staan in het Engels; toelichtingen in het Nederlands.

**Stack:** Next.js 14 (Vercel) | Supabase (PostgreSQL) | Stripe (iDEAL + cards) | CJ Dropshipping | Resend | Telegram | Domain: `pawsshop.nl`

---

## Inhoudsopgave

1. [Quick Start](#1-quick-start)
2. [PawsNL Specifieke Credentials](#2-pawsnl-specifieke-credentials)
3. [API Endpoints voor n8n](#3-api-endpoints-voor-n8n)
4. [Workflow Configuratie (18 workflows)](#4-workflow-configuratie)
5. [Prioriteit Activatievolgorde](#5-prioriteit-activatievolgorde)
6. [Telegram Integratie](#6-telegram-integratie)
7. [Environment Variables Checklist](#7-environment-variables-checklist)

---

## 1. Quick Start

### n8n installeren met Docker

Eenvoudigste methode -- een enkel Docker-commando:

```bash
docker run -d \
  --name n8n \
  --restart unless-stopped \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  -e N8N_HOST=n8n.pawsshop.nl \
  -e N8N_PORT=5678 \
  -e N8N_PROTOCOL=https \
  -e WEBHOOK_URL=https://n8n.pawsshop.nl/ \
  -e GENERIC_TIMEZONE=Europe/Amsterdam \
  -e TZ=Europe/Amsterdam \
  n8nio/n8n
```

> **Let op:** Stel `WEBHOOK_URL` in op jouw publieke n8n-domein. Zonder dit werken
> webhooks niet correct. Zet een reverse proxy (Nginx/Caddy) voor TLS.

### Workflows importeren

De 18 workflow JSON-bestanden staan in:

```
/Users/fariha/Documents/thesis/dropshipping-skill/automations/n8n-workflows/
```

Importeren via n8n UI:

1. Open `https://n8n.pawsshop.nl` in je browser.
2. Ga naar **Workflows > Import from File**.
3. Selecteer alle `.json`-bestanden uit bovenstaande map.
4. Pas per workflow de credentials en endpoints aan volgens deze gids (sectie 4).

**Beschikbare workflows (18):**

| # | Bestandsnaam | Categorie |
|---|-------------|-----------|
| 1 | `order-processing.json` | Order Processing |
| 2 | `shipping-tracker.json` | Shipping & Tracking |
| 3 | `email-welcome-series.json` | Email Marketing |
| 4 | `email-cart-abandonment.json` | Email Marketing |
| 5 | `email-post-purchase.json` | Email Marketing |
| 6 | `email-winback.json` | Email Marketing |
| 7 | `daily-kpi-dashboard.json` | Analytics |
| 8 | `weekly-report-generator.json` | Analytics |
| 9 | `profit-tracker.json` | Finance |
| 10 | `social-media-autopilot.json` | Social Media |
| 11 | `product-trend-scanner.json` | Product Research |
| 12 | `inventory-monitor.json` | Inventory |
| 13 | `ad-creative-pipeline.json` | Advertising |
| 14 | `competitor-monitor.json` | Competitive Intelligence |
| 15 | `influencer-outreach.json` | Marketing |
| 16 | `return-processor.json` | Customer Service |
| 17 | `customer-ticket-handler.json` | Customer Service |
| 18 | `review-collector.json` | Reviews & Social Proof |

---

## 2. PawsNL Specifieke Credentials

Stel de volgende credentials in via **n8n > Settings > Credentials**:

| Credential | Type in n8n | Waarde/Locatie | Hoe te vinden |
|-----------|-------------|---------------|---------------|
| **Supabase URL** | HTTP Header Auth / Custom | `https://<project-id>.supabase.co` | Supabase Dashboard > Settings > API > Project URL |
| **Supabase Service Role Key** | HTTP Header Auth | `eyJhbGciOiJIUzI1NiIs...` | Supabase Dashboard > Settings > API > `service_role` key (secret, nooit in de browser gebruiken) |
| **Supabase Anon Key** | HTTP Header Auth | `eyJhbGciOiJIUzI1NiIs...` | Supabase Dashboard > Settings > API > `anon` public key |
| **Stripe Secret Key** | HTTP Header Auth | `sk_live_51...` of `sk_test_51...` | Stripe Dashboard > Developers > API Keys > Secret key |
| **Stripe Webhook Secret** | Custom | `whsec_...` | Stripe Dashboard > Developers > Webhooks > Signing secret |
| **CJ Dropshipping API Key** | HTTP Header Auth (`CJ-Access-Token`) | `CJ5198246@api@...` | CJ Developer Portal > [developers.cjdropshipping.com](https://developers.cjdropshipping.com) > Application Management > Access Token |
| **Resend API Key** | HTTP Header Auth (`Authorization: Bearer`) | `re_...` | Resend Dashboard > [resend.com/api-keys](https://resend.com/api-keys) |
| **Telegram Bot Token** | Telegram API credential | `123456:ABC-DEF...` | BotFather op Telegram > `/newbot` of bestaande bot > token kopieer |
| **Telegram Chat ID** | Parameter in nodes | `-100...` (groep) of numeriek (persoonlijk) | Stuur een bericht naar de bot, dan `https://api.telegram.org/bot<TOKEN>/getUpdates` > `chat.id` |
| **ADMIN_SECRET** | HTTP Header Auth (`Authorization: Bearer`) | Jouw admin wachtwoord | Vercel Dashboard > Settings > Environment Variables > `ADMIN_SECRET` |
| **CRON_SECRET** | HTTP Header Auth (`Authorization: Bearer`) | Jouw cron geheim | Vercel Dashboard > Settings > Environment Variables > `CRON_SECRET` |

### Credential-aanmaak in n8n

**Supabase (als HTTP Header Auth):**
- Name: `Supabase Service Role`
- Header Name: `apikey`
- Header Value: `<SUPABASE_SERVICE_ROLE_KEY>`

**CJ Dropshipping (als HTTP Header Auth):**
- Name: `CJ Dropshipping API Token`
- Header Name: `CJ-Access-Token`
- Header Value: `<CJ_API_KEY>`

**Resend (als HTTP Header Auth):**
- Name: `Resend API`
- Header Name: `Authorization`
- Header Value: `Bearer <RESEND_API_KEY>`

**PawsNL Admin (als HTTP Header Auth):**
- Name: `PawsNL Admin API`
- Header Name: `Authorization`
- Header Value: `Bearer <ADMIN_SECRET>`

---

## 3. API Endpoints voor n8n

### 3.1 Webhook Endpoint (nieuw -- moet nog aangemaakt worden)

> Dit endpoint wordt het centrale aanspreekpunt voor n8n om acties op de PawsNL
> webshop uit te voeren. Maak een nieuw bestand aan:
> `app/api/webhooks/n8n/route.ts`

**Endpoint:** `POST https://pawsshop.nl/api/webhooks/n8n`

**Authenticatie:** `Authorization: Bearer {ADMIN_SECRET}`

**Ondersteunde acties:**

#### `update_tracking` -- Tracking nummer bijwerken

```json
{
  "action": "update_tracking",
  "order_id": "uuid-van-order",
  "tracking_number": "JNTCU0123456789",
  "carrier": "CJ Packet"
}
```

#### `update_status` -- Orderstatus wijzigen

```json
{
  "action": "update_status",
  "order_id": "uuid-van-order",
  "status": "shipped"
}
```

Geldige statussen: `pending`, `paid`, `processing`, `shipped`, `delivered`, `cancelled`, `refunded`

#### `disable_product` -- Product deactiveren (bijv. uit voorraad)

```json
{
  "action": "disable_product",
  "product_id": "uuid-van-product",
  "reason": "out_of_stock"
}
```

#### `send_email` -- E-mail versturen via Resend

```json
{
  "action": "send_email",
  "to": "klant@voorbeeld.nl",
  "subject": "Jouw bestelling is onderweg!",
  "html": "<h1>Goed nieuws!</h1><p>Je pakket is verzonden...</p>"
}
```

#### `get_stats` -- Dashboard statistieken ophalen

```json
{
  "action": "get_stats"
}
```

Retourneert: `omzet_vandaag`, `omzet_week`, `omzet_maand`, `orders_vandaag`, `orders_totaal`, `klanten_totaal`, `producten_totaal`, `recente_orders`

---

### 3.2 Admin Endpoints (bestaand)

Alle admin endpoints vereisen de cookie `admin-auth` (voor browser) of de header `Authorization: Bearer {ADMIN_SECRET}` (voor n8n).

| Methode | Endpoint | Beschrijving |
|---------|---------|-------------|
| `GET` | `/api/admin/products` | Alle producten ophalen (gesorteerd op `created_at` desc) |
| `POST` | `/api/admin/products` | Nieuw product aanmaken |
| `PUT` | `/api/admin/products/{id}` | Product bijwerken |
| `DELETE` | `/api/admin/products/{id}` | Product verwijderen |
| `GET` | `/api/admin/orders` | Alle bestellingen ophalen (gesorteerd op `created_at` desc) |
| `PUT` | `/api/admin/orders/{id}` | Bestelling bijwerken (`status`, `tracking_number`) |
| `GET` | `/api/admin/customers` | Alle klanten ophalen (gesorteerd op `total_spent` desc) |
| `GET` | `/api/admin/stats` | Dashboard statistieken |

#### n8n HTTP Request node voorbeeld -- Orders ophalen

```
Method: GET
URL: https://pawsshop.nl/api/admin/orders
Headers:
  Authorization: Bearer {ADMIN_SECRET}
```

#### n8n HTTP Request node voorbeeld -- Tracking bijwerken

```
Method: PUT
URL: https://pawsshop.nl/api/admin/orders/{{ $json.order_id }}
Headers:
  Authorization: Bearer {ADMIN_SECRET}
  Content-Type: application/json
Body:
{
  "status": "shipped",
  "tracking_number": "{{ $json.tracking_number }}"
}
```

---

### 3.3 Cron Endpoints (nieuw -- moet nog aangemaakt worden)

> Deze endpoints worden door Vercel Cron Jobs of n8n Schedule triggers
> aangeroepen voor periodieke taken.

| Endpoint | Schedule | Beschrijving |
|---------|----------|-------------|
| `POST /api/cron/daily-report` | Dagelijks 20:00 CET | Dagelijkse KPI-rapportage genereren en naar Telegram sturen |
| `POST /api/cron/stock-sync` | Elk uur | Voorraad synchroniseren met CJ Dropshipping |
| `POST /api/cron/tracking-sync` | Elke 4 uur | Tracking nummers ophalen bij CJ en orders bijwerken |
| `POST /api/cron/abandoned-carts` | Elk uur | Verlaten winkelwagens detecteren en recovery-mails versturen |

**Authenticatie voor alle cron endpoints:**

```
Authorization: Bearer {CRON_SECRET}
```

---

### 3.4 Directe Supabase Toegang

n8n heeft een ingebouwde **Supabase node**. Gebruik de service role key voor volledige toegang.

**n8n Supabase credential instellen:**
- Supabase URL: `https://<project-id>.supabase.co`
- Service Role Key: `<SUPABASE_SERVICE_ROLE_KEY>`

**Beschikbare tabellen:**

| Tabel | Belangrijkste kolommen | Gebruik in n8n |
|-------|----------------------|----------------|
| `products` | `id`, `name`, `slug`, `description`, `price`, `compare_price`, `images`, `category`, `stock`, `featured`, `created_at` | Producten ophalen/bijwerken, voorraad monitoren |
| `orders` | `id`, `customer_id`, `total`, `status`, `tracking_number`, `created_at` | Orders verwerken, tracking bijwerken, rapportages |
| `customers` | `id`, `email`, `name`, `total_spent`, `created_at` | Klantgegevens voor email flows, segmentatie |
| `email_signups` | `id`, `email`, `created_at` | Nieuwsbrief-aanmeldingen, welcome series triggeren |

**Voorbeeld n8n Supabase query -- Betaalde orders van vandaag:**

```
Operation: Select
Table: orders
Filters:
  status = paid
  created_at >= {{ $today.toISO() }}
Order by: created_at DESC
```

---

## 4. Workflow Configuratie

Hieronder staat per workflow precies wat aangepast moet worden voor PawsNL.

---

### 4.1 Order Processing (`order-processing.json`)

**Oorspronkelijk:** Shopify webhook + multi-supplier routing (CJ + AliExpress + Generic)

**PawsNL aanpassingen:**

| Onderdeel | Origineel | PawsNL |
|-----------|----------|--------|
| Trigger | Shopify webhook `shopify-order-created` | Stripe webhook via `https://pawsshop.nl/api/webhooks/n8n` of Supabase `orders` insert trigger |
| Supplier routing | CJ + AliExpress + Generic | **Alleen CJ Dropshipping** -- verwijder AliExpress en Generic branches |
| CJ API endpoint | `https://developers.cjdropshipping.com/api2.0/shopping/order/createOrder` | Behouden -- dit is correct |
| CJ Auth header | `CJ-Access-Token: {token}` | Gebruik credential `CJ Dropshipping API Token` |
| Order tracker | Google Sheets | Vervang door **Supabase `orders` tabel** update |
| Slack notifications | Slack `#orders` channel | Vervang door **Telegram** (zie sectie 6) |
| Customer email | SMTP `orders@yourstore.com` | **Resend** `info@pawsshop.nl` |
| Manual review queue | Google Sheets | Supabase nieuwe tabel of Telegram alert |

**CJ API format voor PawsNL orders:**

```json
{
  "orderNumber": "PAWS-{order_id}",
  "shippingCountryCode": "NL",
  "shippingProvince": "",
  "shippingCity": "{{ $json.shipping_city }}",
  "shippingAddress": "{{ $json.shipping_address }}",
  "shippingCustomerName": "{{ $json.customer_name }}",
  "shippingZip": "{{ $json.shipping_zip }}",
  "shippingPhone": "{{ $json.customer_phone }}",
  "products": [
    {
      "vid": "{{ $json.cj_variant_id }}",
      "quantity": 1,
      "shippingName": "CJPacket"
    }
  ],
  "remark": "PawsNL Order"
}
```

---

### 4.2 Shipping Tracker (`shipping-tracker.json`)

**Oorspronkelijk:** Elke 4 uur Google Sheets lezen + 17Track API

**PawsNL aanpassingen:**

| Onderdeel | Origineel | PawsNL |
|-----------|----------|--------|
| Data source | Google Sheets `Order Tracker` | **Supabase** `orders` tabel: `SELECT * FROM orders WHERE status = 'shipped' AND tracking_number IS NOT NULL` |
| Tracking API | 17Track | Behouden, of gebruik CJ tracking API: `https://developers.cjdropshipping.com/api2.0/shopping/order/getOrderDetail` |
| Customer emails | SMTP `shipping@yourstore.com` | **Resend** `info@pawsshop.nl` |
| Shipping alerts | Slack `#shipping-alerts` | **Telegram** |
| Tracking log | Google Sheets | **Supabase** |
| Email taal | Engels | **Nederlands** (zie emailtemplates hieronder) |
| Timezone | `America/New_York` | **`Europe/Amsterdam`** |

**Tracking emailtemplates (Nederlands):**

- **Bezorgd:** "Goed nieuws! Je bestelling #{order_id} is bezorgd!"
- **Onderweg naar bezorgadres:** "Je pakket is bijna bij je! Bestelling #{order_id} wordt vandaag bezorgd."
- **Vertraging:** "Update over je bestelling #{order_id} -- we zijn ermee bezig"
- **Stilstaand:** "Update over de verzending van bestelling #{order_id}"

---

### 4.3 Email Welcome Series (`email-welcome-series.json`)

**Oorspronkelijk:** 3-email series met SendGrid + OpenAI content generatie

**PawsNL aanpassingen:**

| Onderdeel | Origineel | PawsNL |
|-----------|----------|--------|
| Trigger | Webhook `new-subscriber` | Supabase trigger op `email_signups` insert of `https://pawsshop.nl/api/webhooks/n8n` |
| Email provider | SendGrid | **Resend** via HTTP Request node |
| From address | `$env.STORE_EMAIL` | `info@pawsshop.nl` |
| Discount code | `WELCOME10` | **`WELKOM10`** (10% korting) |
| Taal | Engels | **Nederlands** |
| Brand voice | Generic e-commerce | **Vriendelijk, huisdier-themed, Nederlands** |
| Best sellers fetch | `$env.STORE_API_URL/products/best-sellers` | `https://pawsshop.nl/api/admin/products` (filter op `featured = true`) |
| Logging | Google Sheets | **Supabase** of behoud Sheets voor overzicht |
| Timezone | `America/New_York` | **`Europe/Amsterdam`** |

**Resend HTTP Request node configuratie:**

```
Method: POST
URL: https://api.resend.com/emails
Headers:
  Authorization: Bearer {RESEND_API_KEY}
  Content-Type: application/json
Body:
{
  "from": "PawsNL <info@pawsshop.nl>",
  "to": ["{{ $json.subscriber_email }}"],
  "subject": "{{ $json.email_subject }}",
  "html": "{{ $json.email_body }}"
}
```

**Email series timing voor PawsNL:**

| Email | Moment | Onderwerp (NL) | Korting |
|-------|--------|----------------|---------|
| 1 | Direct na aanmelding | "Welkom bij PawsNL! Hier is je cadeau..." | `WELKOM10` (10%) |
| 2 | +2 dagen | "Dit zijn onze favorieten voor jouw huisdier" | Geen |
| 3 | +5 dagen | "Tips voor een gelukkig huisdier" | Geen |

---

### 4.4 Email Cart Abandonment (`email-cart-abandonment.json`)

**Oorspronkelijk:** 3-email series (1h, 24h, 72h) met SendGrid + OpenAI

**PawsNL aanpassingen:**

| Onderdeel | Origineel | PawsNL |
|-----------|----------|--------|
| Trigger | Webhook `cart-abandoned` | Cron endpoint of Supabase query op verlaten sessies |
| Email provider | SendGrid | **Resend** |
| From address | `$env.STORE_EMAIL` | `info@pawsshop.nl` |
| Taal | Engels | **Nederlands** |
| Discount code (Email 3) | `COMEBACK15` | **`TERUGKOM15`** (15% korting) |
| Cart recovery URL | `$env.STORE_URL/cart/{cart_id}` | `https://pawsshop.nl/winkelwagen?recover={cart_id}` |
| Cart status check | HTTP Request naar store API | Supabase query |
| Timezone | `America/New_York` | **`Europe/Amsterdam`** |

**Email series voor PawsNL:**

| Email | Moment | Onderwerp (NL) | Incentive |
|-------|--------|----------------|-----------|
| 1 | +1 uur | "Heb je iets vergeten? Je winkelwagen wacht op je!" | Geen |
| 2 | +24 uur | "Nog beschikbaar! Andere klanten zijn ook enthousiast" | Gratis verzending |
| 3 | +72 uur | "Laatste kans: 15% korting op je winkelwagen" | `TERUGKOM15` (15%) |

---

### 4.5 Email Post-Purchase (`email-post-purchase.json`)

**Oorspronkelijk:** 4-email series (bevestiging, verzending, review, cross-sell)

**PawsNL aanpassingen:**

| Onderdeel | Origineel | PawsNL |
|-----------|----------|--------|
| Trigger | Webhook `order-confirmed` | Stripe webhook `checkout.session.completed` of Supabase `orders` trigger |
| Email provider | SendGrid | **Resend** |
| From address | `$env.STORE_EMAIL` | `info@pawsshop.nl` |
| Taal | Engels | **Nederlands** |
| Levertijd mededeling | "7-14 business days" | **"5-12 werkdagen naar Nederland, 7-15 werkdagen naar Belgie en Duitsland"** |
| Review link | `$env.STORE_URL/review/{order_id}` | `https://pawsshop.nl/review/{order_id}` |
| Cross-sell discount | 5% returning customer | `VIP25` is te hoog voor standaard; gebruik **10% terugkerende klant** |
| Timezone | `America/New_York` | **`Europe/Amsterdam`** |

---

### 4.6 Email Winback (`email-winback.json`)

**PawsNL aanpassingen:**

| Onderdeel | PawsNL waarde |
|-----------|---------------|
| Email provider | **Resend** via `info@pawsshop.nl` |
| Taal | **Nederlands** |
| Inactiviteitsperiode | 60 dagen geen bestelling |
| Korting | **`TERUGKOM15`** (15%) of **`VIP25`** (25% voor high-value klanten met >3 bestellingen) |
| Data source | Supabase: `SELECT * FROM customers WHERE last_order_date < NOW() - INTERVAL '60 days'` |

---

### 4.7 Daily KPI Dashboard (`daily-kpi-dashboard.json`)

**Oorspronkelijk:** Shopify + Meta Ads + TikTok Ads + Google Sheets costs

**PawsNL aanpassingen:**

| Onderdeel | Origineel | PawsNL |
|-----------|----------|--------|
| Revenue source | Shopify Admin API | **Supabase** `orders` tabel (`status = 'paid'`) |
| Ad data (Meta) | Meta Ads API | **Handmatig invoeren** (nog geen Meta API) -- gebruik Google Sheets of vaste waarde |
| Ad data (TikTok) | TikTok Ads API | **Handmatig invoeren** (nog geen TikTok API) |
| Daily costs | Google Sheets `DailyCosts` | Google Sheets behouden of Supabase tabel |
| Dashboard output | Slack + Email | **Telegram** + Email via Resend |
| Currency | USD `$` | **EUR** |
| Stats endpoint | Shopify | `https://pawsshop.nl/api/admin/stats` |
| Timezone | `America/New_York` | **`Europe/Amsterdam`** |
| Trigger time | 20:00 EST | **20:00 CET**: `0 20 * * *` (Amsterdam timezone) |

**Supabase query voor dagelijkse omzet:**

```sql
SELECT
  COUNT(*) as orders_vandaag,
  COALESCE(SUM(total), 0) as omzet_vandaag
FROM orders
WHERE status = 'paid'
  AND created_at >= CURRENT_DATE
  AND created_at < CURRENT_DATE + INTERVAL '1 day';
```

---

### 4.8 Profit Tracker (`profit-tracker.json`)

**Oorspronkelijk:** Shopify webhook + Google Sheets COGS lookup + Meta Ads spend

**PawsNL aanpassingen:**

| Onderdeel | Origineel | PawsNL |
|-----------|----------|--------|
| Order trigger | Shopify webhook | Stripe webhook of Supabase trigger |
| COGS lookup | Google Sheets `ProductCOGS` | Google Sheets behouden (eenvoudig te onderhouden) of Supabase `products` tabel met `cost_price` kolom |
| Platform fees | Shopify 2% + payment 2.9% + $0.30 | **Stripe NL**: iDEAL 0.29 EUR/transactie, Cards 1.5% EU + 0.25 EUR |
| Ad spend | Meta Ads API | Handmatig of Google Sheets |
| VAT rate | 20% (UK/EU) | **21% BTW** (Nederland) |
| Currency | USD | **EUR** |
| Reconciliation | 23:00 EST | **23:00 CET** |
| Alerts | Slack | **Telegram** |

**Stripe fee berekening voor PawsNL:**

```javascript
// iDEAL transactie
const idealFee = 0.29; // vast tarief per transactie

// Kaartbetaling (EU-kaarten)
const cardFeeRate = 0.015; // 1.5%
const cardFixedFee = 0.25;
const cardFee = (orderTotal * cardFeeRate) + cardFixedFee;

// Gebruik iDEAL als standaard (meestgebruikt in NL)
const platformFees = idealFee;
```

---

### 4.9 Social Media Autopilot (`social-media-autopilot.json`)

**Oorspronkelijk:** Product page scraping + OpenAI content generatie voor 5 platforms

**PawsNL aanpassingen:**

| Onderdeel | Origineel | PawsNL |
|-----------|----------|--------|
| Product source | URL scraping | **Supabase** `products` tabel direct queryen |
| Content taal | Engels | **Nederlands** |
| Niche/categorie | Generic dropshipping | **Dierenproducten / Huisdier artikelen** |
| Platforms | TikTok, Instagram, Facebook, Twitter/X, Pinterest | **TikTok (primair), Instagram, Facebook** -- Pinterest en X later toevoegen |
| Hashtags | Generic | PawsNL specifieke sets (zie hieronder) |
| Posting tool | Blotato API | Handmatig plaatsen of Later/Buffer API |
| Timezone | `America/New_York` | **`Europe/Amsterdam`** |
| Daily trigger | 09:00 EST | **10:00 CET** (optimaal voor NL publiek) |

**PawsNL Hashtag sets:**

```
# Basis (altijd gebruiken):
#pawsnl #pawsshop #dierenwinkel #huisdier #huisdierproducten

# Honden:
#hond #honden #hondenliefde #hondenvaninstagram #puppylove #hondenvoer
#hondenspeelgoed #hondenbed #wandelenmetjehond #dogsofinstagram

# Katten:
#kat #katten #kattenliefde #kattenvaninstagram #kattenfoto #poesje
#kattenvoer #kattenspeelgoed #catsofinstagram

# Algemeen dieren NL:
#dierenwelzijn #dierenliefde #huisdieren #gezelschapsdier #dierenverzorging
#petshop #dierenproducten #huisdiergeluk

# Locatie:
#nederland #nederlandsedierenwinkel #onlinedierenwinkel #dierenwinkelnl
```

**OpenAI system prompt aanpassing:**

Vervang alle system prompts in de content generatie nodes met:

```
Je bent een ervaren social media content creator voor PawsNL, een Nederlandse
online dierenwinkel. Schrijf in het Nederlands, gebruik een warme en
vriendelijke toon. Focus op huisdierliefhebbers in Nederland en Belgie.
Gebruik emoji's passend bij het platform. Verwijs naar pawsshop.nl.
```

---

### 4.10 Overige Workflows

#### Inventory Monitor (`inventory-monitor.json`)

- Data source: **Supabase** `products` tabel (`stock` kolom)
- CJ stock check: `https://developers.cjdropshipping.com/api2.0/product/stock`
- Low stock threshold: **5 stuks** (pas aan in de Code node)
- Alerts: **Telegram** (niet Slack)

#### Product Trend Scanner (`product-trend-scanner.json`)

- Niche: **Huisdierproducten, dierenbenodigdheden**
- Zoektermen (NL): "trending huisdier producten", "populair hondenspeelgoed", "kattenaccessoires 2026"
- Market: **NL, BE, DE**

#### Ad Creative Pipeline (`ad-creative-pipeline.json`)

- Taal: **Nederlands**
- Valuta: **EUR**
- Platform focus: **TikTok Ads, Meta Ads (Instagram/Facebook)**
- Brand guidelines: Vrolijk, dier-vriendelijk, oranje/groen kleurenschema PawsNL

#### Competitor Monitor (`competitor-monitor.json`)

- Concurrenten: Zooplus.nl, Pets Place, DRD Knaagdierwinkel, Brekz.nl
- Market: **Nederland**

#### Influencer Outreach (`influencer-outreach.json`)

- Niche: **Huisdier-influencers NL/BE**
- Taal: **Nederlands**
- Minimum volgers: **5.000** (micro-influencers)

#### Return Processor (`return-processor.json`)

- Retourbeleid: **30 dagen**
- Retouradres: Configureer in workflow
- Email via: **Resend** `info@pawsshop.nl`
- Taal: **Nederlands**

#### Customer Ticket Handler (`customer-ticket-handler.json`)

- Taal: **Nederlands**
- FAQ-items PawsNL:
  - Gratis verzending boven **EUR 35**
  - Levertijd: **5-12 werkdagen** (NL), **7-15 werkdagen** (BE/DE)
  - Retourbeleid: **30 dagen**
  - Verzendlanden: **NL, BE, DE**
  - Betaalmethoden: **iDEAL, creditcard, Bancontact**
- Alerts: **Telegram**

#### Review Collector (`review-collector.json`)

- Trigger: 7 dagen na levering
- Email via: **Resend** `info@pawsshop.nl`
- Taal: **Nederlands**
- Incentive: 10% korting met code `REVIEW10`

#### Weekly Report Generator (`weekly-report-generator.json`)

- Trigger: **Maandagochtend 09:00 CET**
- Data source: **Supabase** orders
- Output: **Telegram** + email via Resend
- Currency: **EUR**
- Timezone: **Europe/Amsterdam**

---

## 5. Prioriteit Activatievolgorde

### Week 1 -- Kernprocessen (must-have)

| Prioriteit | Workflow | Reden |
|-----------|---------|-------|
| 1 | `order-processing` | Bestellingen automatisch doorsturen naar CJ Dropshipping |
| 2 | `shipping-tracker` | Klanten automatisch op de hoogte houden van verzendstatus |
| 3 | `email-welcome-series` | Nieuwe aanmeldingen direct welkomstmail met `WELKOM10` |
| 4 | `email-cart-abandonment` | Verloren omzet terughalen (gemiddeld 10-15% recovery) |
| 5 | `daily-kpi-dashboard` | Dagelijks overzicht van omzet en KPIs via Telegram |

### Week 2 -- Groei en inzichten

| Prioriteit | Workflow | Reden |
|-----------|---------|-------|
| 6 | `social-media-autopilot` | Automatisch content genereren voor TikTok/Instagram/Facebook |
| 7 | `email-post-purchase` | Klanttevredenheid verhogen, reviews verzamelen |
| 8 | `profit-tracker` | Per bestelling winst inzichtelijk, verliesgevende producten detecteren |

### Week 3 -- Uitbreiding

| Prioriteit | Workflow | Reden |
|-----------|---------|-------|
| 9 | `inventory-monitor` | Voorraadwaarschuwingen, automatisch producten deactiveren |
| 10 | `review-collector` | Social proof opbouwen |
| 11 | `email-winback` | Inactieve klanten reactiveren met `TERUGKOM15` |
| 12 | `weekly-report-generator` | Wekelijks management overzicht |
| 13 | `return-processor` | Retourverzoeken gestructureerd afhandelen |
| 14 | `customer-ticket-handler` | Eerste lijn klantenservice automatiseren |
| 15 | `product-trend-scanner` | Nieuwe productideeen vinden |
| 16 | `competitor-monitor` | Concurrentieanalyse |
| 17 | `influencer-outreach` | Influencer marketing opstarten |
| 18 | `ad-creative-pipeline` | Ad content automatiseren als advertentiebudget groeit |

---

## 6. Telegram Integratie

PawsNL gebruikt Telegram als primair notificatiekanaal in plaats van Slack.

### Configuratie in n8n

De generieke templates gebruiken Slack nodes. Vervang deze door een **HTTP Request node** naar de Telegram Bot API.

#### Telegram HTTP Request node instellen

```
Method: POST
URL: https://api.telegram.org/bot{{ $env.TELEGRAM_BOT_TOKEN }}/sendMessage
Headers:
  Content-Type: application/json
Body:
{
  "chat_id": "{{ $env.TELEGRAM_CHAT_ID }}",
  "text": "{{ $json.message }}",
  "parse_mode": "HTML"
}
```

#### Voorbeeld: Order notificatie

```json
{
  "chat_id": "{{ $env.TELEGRAM_CHAT_ID }}",
  "text": "<b>Nieuwe bestelling!</b>\n\nOrder: #{{ $json.order_id }}\nKlant: {{ $json.customer_email }}\nBedrag: EUR {{ $json.total }}\nProducten: {{ $json.items_count }} stuks\n\nTijd: {{ $json.created_at }}",
  "parse_mode": "HTML"
}
```

#### Voorbeeld: Dagelijks KPI rapport

```json
{
  "chat_id": "{{ $env.TELEGRAM_CHAT_ID }}",
  "text": "<b>Dagelijks Rapport PawsNL</b>\nDatum: {{ $json.date }}\n\nOmzet vandaag: EUR {{ $json.omzet_vandaag }}\nBestellingen: {{ $json.orders_vandaag }}\nGemiddelde orderwaarde: EUR {{ $json.avg_order_value }}\n\nOmzet deze week: EUR {{ $json.omzet_week }}\nOmzet deze maand: EUR {{ $json.omzet_maand }}\n\nKlanten totaal: {{ $json.klanten_totaal }}\nProducten actief: {{ $json.producten_totaal }}",
  "parse_mode": "HTML"
}
```

#### Voorbeeld: Foutmelding

```json
{
  "chat_id": "{{ $env.TELEGRAM_CHAT_ID }}",
  "text": "Workflow FOUT\n\nWorkflow: {{ $json.workflow_name }}\nNode: {{ $json.node_name }}\nFout: {{ $json.error_message }}\nTijd: {{ $json.timestamp }}\n\nActie vereist!",
  "parse_mode": "HTML"
}
```

### Telegram formattering

Telegram ondersteunt HTML in berichten. Gebruik:

| Opmaak | HTML |
|--------|------|
| **Vet** | `<b>tekst</b>` |
| *Cursief* | `<i>tekst</i>` |
| `Code` | `<code>tekst</code>` |
| Link | `<a href="url">tekst</a>` |
| Lijn | `\n` (newline) |

### Bot token en chat ID vinden

1. **Bot token:** Open Telegram, zoek `@BotFather`, stuur `/myBots`, selecteer je bot, kopieer het token.
2. **Chat ID:** Stuur een bericht naar je bot. Open `https://api.telegram.org/bot<TOKEN>/getUpdates` in je browser. Zoek `"chat":{"id":...}` -- dat is je chat ID.
3. Voor een **groepschat:** Voeg de bot toe aan de groep, stuur een bericht in de groep, controleer `getUpdates` opnieuw. Groep-IDs beginnen met `-`.

---

## 7. Environment Variables Checklist

Volledige lijst van alle environment variables die nodig zijn. Stel deze in op zowel
Vercel (voor de webshop) als in n8n (via Settings > Variables of Docker env).

### Vercel Environment Variables (`.env.local`)

```bash
# --- Supabase ---
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...                 # Publieke anon key
SUPABASE_SERVICE_ROLE_KEY=eyJ...                      # Secret service role key

# --- Stripe ---
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51...      # Publieke Stripe key
STRIPE_SECRET_KEY=sk_live_51...                       # Secret Stripe key
STRIPE_WEBHOOK_SECRET=whsec_...                       # Webhook signing secret

# --- App ---
NEXT_PUBLIC_APP_URL=https://pawsshop.nl               # Productie URL

# --- Admin ---
ADMIN_SECRET=<sterk-wachtwoord-minimaal-32-tekens>    # Bearer token voor admin API + n8n
CRON_SECRET=<ander-sterk-wachtwoord>                  # Bearer token voor cron endpoints

# --- Resend ---
RESEND_API_KEY=re_...                                 # Resend API key

# --- Telegram ---
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz  # Telegram Bot token
TELEGRAM_CHAT_ID=-100...                              # Telegram chat/groep ID

# --- CJ Dropshipping ---
CJ_API_KEY=CJ5198246@api@...                         # CJ Access Token
```

### n8n Environment Variables

Stel deze in via Docker `-e` flags of in de n8n UI onder **Settings > Variables**:

```bash
# --- n8n Core ---
N8N_HOST=n8n.pawsshop.nl
N8N_PORT=5678
N8N_PROTOCOL=https
WEBHOOK_URL=https://n8n.pawsshop.nl/
GENERIC_TIMEZONE=Europe/Amsterdam
TZ=Europe/Amsterdam

# --- PawsNL Store ---
STORE_URL=https://pawsshop.nl
STORE_API_URL=https://pawsshop.nl/api
STORE_EMAIL=info@pawsshop.nl
ADMIN_SECRET=<zelfde-als-in-vercel>
CRON_SECRET=<zelfde-als-in-vercel>

# --- Supabase ---
SUPABASE_URL=https://<project-id>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# --- Stripe ---
STRIPE_SECRET_KEY=sk_live_51...

# --- CJ Dropshipping ---
CJ_API_KEY=CJ5198246@api@...

# --- Resend ---
RESEND_API_KEY=re_...

# --- Telegram ---
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=-100...

# --- Email ---
NOTIFICATION_TO_EMAIL=fariha@pawsshop.nl              # Jouw persoonlijke email voor alerts

# --- Optioneel (voor toekomstige workflows) ---
# OPENAI_API_KEY=sk-...                               # Voor AI-content generatie in workflows
# META_AD_ACCOUNT_ID=act_...                           # Meta Ads (zodra API gekoppeld)
# TIKTOK_ADVERTISER_ID=...                             # TikTok Ads (zodra API gekoppeld)
# GOOGLE_SHEET_ID=...                                  # Voor handmatige COGS/kosten tracking
```

### Beveiligingstips

- Gebruik **verschillende waarden** voor `ADMIN_SECRET` en `CRON_SECRET`.
- Genereer sterke secrets met: `openssl rand -base64 32`
- Bewaar nooit secrets in git. Gebruik altijd environment variables.
- De `SUPABASE_SERVICE_ROLE_KEY` omzeilt Row Level Security. Gebruik deze **uitsluitend** server-side.
- Roteer de CJ API key periodiek via het CJ Developer Portal.

---

## Kortingscodes Referentie

| Code | Korting | Gebruik |
|------|---------|---------|
| `WELKOM10` | 10% | Welcome email series -- nieuwe aanmeldingen |
| `TERUGKOM15` | 15% | Cart abandonment (3e email) + Win-back campagne |
| `VIP25` | 25% | VIP klanten (>3 bestellingen), speciale acties |
| `REVIEW10` | 10% | Review request -- incentive voor product reviews |

---

## Klantenservice Snelreferentie (voor Customer Ticket Handler)

| Onderwerp | Antwoord (NL) |
|-----------|---------------|
| **Gratis verzending** | Gratis verzending bij bestellingen boven EUR 35 |
| **Levertijd NL** | 5-12 werkdagen |
| **Levertijd BE/DE** | 7-15 werkdagen |
| **Retourbeleid** | 30 dagen retourrecht na ontvangst |
| **Verzendlanden** | Nederland, Belgie, Duitsland |
| **Betaalmethoden** | iDEAL, creditcard (Visa/Mastercard), Bancontact |
| **Contact** | info@pawsshop.nl |
| **Tracking** | Wordt per email verstuurd zodra het pakket is verzonden |

---

*Laatst bijgewerkt: maart 2026*
*Versie: 1.0*
*Auteur: PawsNL Development*
