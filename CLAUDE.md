# PawsNL — Claude Code Context

## Wat is dit?
Nederlandse dropshipping webshop voor dierenproducten. Next.js 14 + Supabase + Stripe. Eigenaar: almasaaass.

## Live URLs
- **Shop:** https://pawsnlshop.com
- **Admin:** https://pawsnlshop.com/admin (wachtwoord: PawsNL2024!)
- **GitHub:** https://github.com/almasaaass/pawsnl-shop

## Stack
- Next.js 14 (App Router, TypeScript, Tailwind)
- Supabase (PostgreSQL, RLS)
- Stripe (Checkout, Webhooks)
- Vercel (hosting + cron jobs)
- Resend (emails)
- Telegram Bot (telefoon assistent)
- CJdropshipping (leverancier)
- Recharts (analytics grafieken)

## Credentials (in .env.local + Vercel)
- Supabase URL: https://mumuorbsfiklktwqtveb.supabase.co
- Stripe: test mode (sk_test_...)
- Resend: re_L6THoFsY_...
- Admin email: surecalltelecom@gmail.com
- Telegram bot token: 8777741653:AAH...
- CJ API key: CJ5198246@api@dfff508709394ed5a6078a3534e23dad
- Anthropic API key: sk-ant-api03-... (HEEFT CREDITS NODIG — console.anthropic.com)

## Wat is al gebouwd (alle 5 fases)

### Fase 1 — Webshop
- Homepage met hero, featured products, categorie overzicht, reviews, trust badges
- Producten pagina met filters (categorie, prijs, zoeken)
- Product detail pagina
- Winkelwagen (localStorage)
- Stripe checkout (NL/BE/DE, gratis verzending boven €35)
- Bevestigingspagina
- Contact, Over ons pagina
- Admin paneel (/admin) met dashboard, producten, bestellingen, klanten

### Fase 2 — Producten
- 8 echte CJdropshipping producten geïmporteerd
- Script: scripts/import-cj-products.mjs
- Prijzen handmatig aanpassen via Admin → Producten (CJ geeft beperkte prijsdata)

### Fase 3 — Emails (Resend)
- Orderbevestiging naar klant na betaling
- Admin notificatie bij nieuwe bestelling
- Contactformulier email naar admin
- Dagelijks rapport cron job (elke dag 08:00) via /api/cron/daily-report
- lib/email.ts bevat alle email templates

### Fase 4 — TikTok Generator
- Admin → TikTok Scripts (/admin/tiktok)
- Genereert 7 scripts/week op basis van producten
- Formats: POV, Problem/Solution, Educational, Review, Trending, Unboxing, Top 3
- Copy + download per script

### Fase 5 — Analytics
- Admin → Analytics (/admin/analytics)
- Recharts grafieken: omzet 30 dagen, bestellingen/dag, top producten, pie chart per categorie

### Telegram Bot
- Bot naam: ingesteld door gebruiker via BotFather
- Werkt: /stats, /bestellingen, /voorraad
- Vrije vragen werken ALLEEN als Anthropic account credits heeft
- Fix: ga naar console.anthropic.com → Billing → Add credits ($5)
- Webhook: https://pawsnlshop.com/api/telegram

### CJdropshipping Import
- Admin → Importeren (/admin/importeren)
- Zoek producten en importeer met 1 klik
- lib/cj.ts bevat de CJ API client
- Auth: apiKey (niet email/wachtwoord)

## Volgende stappen (nog te doen)
1. ~~**Eigen domein**~~ ✅ pawsnlshop.com gekoppeld aan Vercel (Mijndomein)
2. ~~**Prijzen fixen**~~ ✅ Concurrentieprijzen onderzocht en aangepast
3. ~~**iDEAL toevoegen**~~ ✅ Stripe payment_method_types: ['card', 'ideal']
4. ~~**Resend domein verifiëren**~~ ✅ pawsnlshop.com geverifieerd, emails vanuit info@pawsnlshop.com
5. ~~**Meer producten importeren**~~ ✅ 21 producten (9 honden, 6 katten, 3 vogels, 3 knaagdieren)
6. **Productfoto's** — CJ API fix is gedaan (v2 endpoint), foto's nog ophalen
7. **TikTok account aanmaken** en beginnen met content posten
8. **Thuiswinkel Waarborg** keurmerk aanvragen
9. **Kiyoh reviews** widget toevoegen

## Bestandsstructuur (belangrijk)
```
app/
  api/
    telegram/route.ts     — Telegram bot webhook
    webhook/route.ts      — Stripe betaling verwerking
    checkout/route.ts     — Stripe checkout aanmaken
    contact/route.ts      — Contactformulier
    cron/daily-report/    — Dagelijks rapport
    admin/
      cj/route.ts         — CJdropshipping zoeken + importeren
      analytics/route.ts  — Analytics data
      tiktok/route.ts     — TikTok script generator
      stats/route.ts      — Dashboard statistieken
      orders/             — Bestellingen beheer
      products/           — Producten beheer
      customers/          — Klanten
  admin/
    tiktok/page.tsx       — TikTok generator UI
    analytics/page.tsx    — Analytics dashboard
    importeren/page.tsx   — CJ product importer
lib/
  email.ts    — Alle email functies (Resend)
  cj.ts       — CJdropshipping API client
  supabase.ts — Supabase clients
  stripe.ts   — Stripe client
  types.ts    — TypeScript types
scripts/
  import-cj-products.mjs  — CJ product import script
  seed-products.mjs        — Demo producten seed
vercel.json — Cron job configuratie (08:00 dagrapport)
```

## Deployen
```bash
npx vercel --prod
```

## Database (Supabase)
Tabellen: products, orders, customers
RLS: producten publiek leesbaar, orders/klanten alleen via service role

## Bekende issues
- Telegram vrije vragen werken niet zonder Anthropic credits
- CJ prijsdata is beperkt voor nieuwe accounts (alles €1.74) — handmatig aanpassen
- Admin importpagina: opnieuw inloggen als "Unauthorized" fout verschijnt

## Skills Library (claude-skills)

Geïntegreerde skill packages in `skills/` voor strategisch advies, marketing, engineering en meer.

### Beschikbare Skills

| Domein | Map | Gebruik voor |
|--------|-----|-------------|
| **Marketing** | `skills/marketing-skill/` | Content creatie, SEO, demand gen, campagne analytics |
| **Business Growth** | `skills/business-growth/` | Customer success, sales, revenue operations |
| **Finance** | `skills/finance/` | Financiële analyse, budgettering, forecasting |
| **Product** | `skills/product-team/` | RICE scoring, OKRs, user stories, UX research |
| **Engineering** | `skills/engineering/` | Code scaffolding, fullstack, AI/ML, data tools |
| **Engineering Team** | `skills/engineering-team/` | Team workflows, code review standaarden |
| **C-Level** | `skills/c-level-advisor/` | CEO/CTO strategisch advies |
| **Project Management** | `skills/project-management/` | Jira/Confluence, sprint planning |
| **RA/QM** | `skills/ra-qm-team/` | Compliance, ISO, kwaliteitsmanagement |
| **Standards** | `skills/standards/` | Communicatie, kwaliteit, git, security standaarden |
| **Templates** | `skills/templates/` | Herbruikbare templates |
| **Agents** | `skills/agents/` | Agent orchestratie (marketing, C-level, product) |

### Slash Commands

| Command | Functie |
|---------|---------|
| `/git/cm` | Commit zonder push |
| `/git/cp` | Commit en push |
| `/git/pr` | Pull request aanmaken |
| `/review` | Quality checks uitvoeren |
| `/security-scan` | Security validatie |

### Hoe te gebruiken

- **Marketing advies:** Verwijs naar `skills/marketing-skill/` voor content strategie, SEO, social media
- **Financieel:** Gebruik `skills/finance/` voor omzet analyse, pricing strategie
- **Groei strategie:** Raadpleeg `skills/business-growth/` voor customer acquisition, sales
- **Technisch:** Gebruik `skills/engineering/` en `skills/standards/` voor code kwaliteit
- **Slash commands:** Type `/` in Claude Code voor git workflows en reviews
