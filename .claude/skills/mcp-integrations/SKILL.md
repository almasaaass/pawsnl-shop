---
name: mcp-integrations
description: When the user wants to use, configure, or troubleshoot MCP (Model Context Protocol) servers for the pawsnl-shop project. Also use when the user mentions "MCP," "Supabase MCP," "Stripe MCP," "Playwright MCP," "browser automation," "database queries via MCP," "payment management," "competitor research," or wants to add new MCP integrations like social media posting, analytics, or ad management. Covers all five configured servers plus future expansion options.
metadata:
  version: 1.0.0
---

# MCP Integrations Guide — PawsNL

You are an expert in Model Context Protocol (MCP) server integrations for the pawsnl-shop dropshipping webshop. Your goal is to help use the configured MCP servers effectively and expand the integration ecosystem when needed.

## Project Context

PawsNL is a Dutch pet products dropshipping webshop running on:
- **Next.js 14** (App Router, TypeScript, Tailwind)
- **Supabase** (PostgreSQL, RLS)
- **Stripe** (Checkout, Webhooks, iDEAL)
- **CJdropshipping** (supplier)
- **Resend** (transactional emails)
- **Vercel** (hosting + cron jobs)

MCP configuration lives in `/.mcp.json` at the project root.

---

## Currently Configured MCP Servers

Five MCP servers are configured and ready to use. The configuration is in `/.mcp.json`.

---

### 1. Supabase MCP

**Package:** `@supabase/mcp-server-supabase@latest`
**Auth:** Uses `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from environment.

#### What It Does

Provides direct access to the PawsNL Supabase PostgreSQL database. Enables querying, inserting, updating, and managing data across all tables without writing API routes or using the Supabase dashboard.

#### Key Capabilities

- **SQL Queries** -- Run arbitrary SQL against the database
- **Table Management** -- List tables, describe schemas, inspect columns and constraints
- **Row Operations** -- Insert, update, delete, and upsert rows
- **RLS Inspection** -- View and manage Row Level Security policies
- **Migration Support** -- Apply schema migrations
- **Storage** -- Manage Supabase Storage buckets and files
- **Edge Functions** -- Deploy and manage Edge Functions

#### PawsNL Database Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `products` | Product catalog | `id`, `name`, `slug`, `description`, `price`, `compare_at_price`, `category`, `images`, `featured`, `in_stock` |
| `orders` | Customer orders | `id`, `status`, `customer_email`, `customer_name`, `items`, `total`, `stripe_session_id`, `cj_order_id`, `shipping_address` |
| `customers` | Customer records | `id`, `email`, `name`, `total_orders`, `total_spent` |

#### Example Use Cases

**Check today's orders:**
```
Use the Supabase MCP to query:
SELECT id, customer_name, customer_email, total, status, created_at
FROM orders
WHERE created_at >= CURRENT_DATE
ORDER BY created_at DESC;
```

**Find top-selling products this month:**
```
Use the Supabase MCP to run:
SELECT p.name, p.category, COUNT(*) as order_count, SUM(o.total) as revenue
FROM orders o, jsonb_array_elements(o.items) AS item
JOIN products p ON p.id = (item->>'product_id')::uuid
WHERE o.created_at >= date_trunc('month', CURRENT_DATE)
  AND o.status != 'cancelled'
GROUP BY p.name, p.category
ORDER BY order_count DESC
LIMIT 10;
```

**Update product price:**
```
Use Supabase MCP to update the products table:
UPDATE products SET price = 24.99, compare_at_price = 34.99
WHERE slug = 'honden-wandelharnas';
```

**Check out-of-stock products:**
```
SELECT name, slug, category FROM products WHERE in_stock = false;
```

**Get customer lifetime value:**
```
SELECT email, name, total_orders, total_spent,
       ROUND(total_spent / NULLIF(total_orders, 0), 2) as avg_order_value
FROM customers
ORDER BY total_spent DESC
LIMIT 20;
```

#### Important Notes

- The MCP uses the **service_role key**, which bypasses RLS. Be careful with destructive operations.
- Products table has public read access via RLS; orders and customers are private (service_role only).
- Always use parameterized values when the MCP supports it.
- Index columns for WHERE/ORDER BY: `category`, `featured`, `slug`, `created_at` (products); `status`, `customer_email`, `created_at`, `cj_order_id` (orders).

---

### 2. Stripe MCP

**Package:** `@stripe/mcp`
**Auth:** Uses `STRIPE_SECRET_KEY` from environment.

#### What It Does

Provides direct access to the Stripe API for managing payments, customers, refunds, and billing. Eliminates the need to use the Stripe dashboard or write API calls manually.

#### Key Capabilities

- **Payments** -- List, retrieve, and manage payment intents and charges
- **Customers** -- Create, update, list, and search Stripe customers
- **Refunds** -- Issue full or partial refunds on charges
- **Checkout Sessions** -- Inspect completed checkout sessions
- **Products & Prices** -- Manage Stripe product catalog and pricing
- **Invoices** -- Create and manage invoices
- **Disputes** -- View and respond to payment disputes
- **Balance** -- Check account balance and transactions
- **Webhooks** -- List and inspect webhook endpoints

#### Example Use Cases

**Check recent payments:**
```
Use Stripe MCP to list the 10 most recent payment intents with status 'succeeded'.
```

**Issue a refund:**
```
Use Stripe MCP to create a refund for payment intent pi_3ABC... for the full amount.
Reason: customer requested return.
```

**Partial refund:**
```
Use Stripe MCP to create a partial refund of 15.00 EUR on charge ch_1XYZ...
```

**Look up a customer by email:**
```
Use Stripe MCP to search for a customer with email klant@voorbeeld.nl
```

**Check account balance:**
```
Use Stripe MCP to retrieve the current account balance (available and pending).
```

**List disputes:**
```
Use Stripe MCP to list any open disputes that need response.
```

#### Important Notes

- PawsNL is currently in **Stripe test mode** (sk_test_ key). Switch to live keys for production.
- Payment methods enabled: `card` and `ideal` (Dutch iDEAL payments).
- Stripe webhook endpoint: `/api/webhook/route.ts` handles `checkout.session.completed` events.
- Checkout creates sessions via `/api/checkout/route.ts`.
- Free shipping threshold: orders above EUR 35.

---

### 3. Shopify Dev MCP

**Package:** `@anthropic-ai/shopify-mcp-server@latest`
**Auth:** None required (documentation/reference server).

#### What It Does

Provides access to Shopify API documentation, GraphQL schema exploration, and Shopify Functions development guidance. Useful as a reference tool when comparing features, understanding e-commerce patterns, or evaluating a potential migration.

#### Key Capabilities

- **API Documentation** -- Browse Shopify Admin API and Storefront API docs
- **GraphQL Schema** -- Explore Shopify's GraphQL schema, types, and queries
- **Shopify Functions** -- Guidance on building Shopify Functions (discounts, shipping, validation)
- **Webhook Reference** -- Shopify webhook topics and payload structures
- **Best Practices** -- E-commerce patterns and Shopify conventions

#### Example Use Cases

**Compare Shopify vs current Supabase product schema:**
```
Use Shopify Dev MCP to look up the Product type in the Admin API GraphQL schema.
Compare the fields with our Supabase products table to identify gaps.
```

**Research discount implementations:**
```
Use Shopify Dev MCP to explore how Shopify Functions handle automatic discounts.
We want to implement a similar "buy 2 get 10% off" feature in PawsNL.
```

**Webhook payload reference:**
```
Use Shopify Dev MCP to show the payload structure for orders/create webhook.
We can use this as a reference for our own order webhook design.
```

#### Important Notes

- This is a **read-only reference server**. It does not connect to any Shopify store.
- Useful for feature comparison and borrowing implementation patterns.
- PawsNL does not use Shopify as a backend; this is purely for research and reference.

---

### 4. Playwright MCP

**Package:** `@anthropic-ai/mcp-server-playwright`
**Auth:** None required.

#### What It Does

Provides browser automation capabilities through Playwright. Enables visiting websites, interacting with pages, taking screenshots, and extracting data. Primary use case for PawsNL: competitor research and product analysis.

#### Key Capabilities

- **Navigation** -- Open URLs, click links, fill forms, navigate between pages
- **Screenshots** -- Capture full-page or element-level screenshots
- **Data Extraction** -- Read text content, extract structured data from pages
- **Form Interaction** -- Fill search boxes, submit forms, interact with filters
- **Multi-page Flows** -- Navigate through paginated results or multi-step processes

#### Example Use Cases

**Research competitor pricing:**
```
Use Playwright MCP to visit dierbenodigdheden.nl and navigate to their
dog harness category. Extract product names and prices for the top 10 results.
Compare with our products table pricing.
```

**Check competitor product pages:**
```
Use Playwright MCP to visit bol.com and search for "honden speelgoed".
Take a screenshot of the search results and extract the top 5 product names,
prices, and review counts.
```

**Monitor CJdropshipping listings:**
```
Use Playwright MCP to visit cjdropshipping.com, search for "pet toys",
and extract product details including pricing and shipping times for
the top 10 results.
```

**Audit our own site:**
```
Use Playwright MCP to visit pawsnlshop.com, navigate through the main pages
(homepage, products, a product detail page, cart flow), and take screenshots
to review the user experience.
```

#### Important Notes

- Browser sessions are ephemeral; each new use starts fresh (no cookies or login state persisted).
- Respect robots.txt and rate limits when scraping competitor sites.
- Some sites may block automated access; be prepared for CAPTCHAs or access restrictions.
- Best for visual inspection and quick data extraction, not large-scale scraping.

---

### 5. Fetch MCP

**Package:** `@anthropic-ai/mcp-server-fetch`
**Auth:** None required.

#### What It Does

Fetches web content and converts it to a readable format. Lighter weight than Playwright -- useful for APIs, product pages, blog posts, and structured data retrieval where browser rendering is not needed.

#### Key Capabilities

- **URL Fetching** -- Retrieve content from any public URL
- **HTML to Markdown** -- Automatically converts HTML pages to readable markdown
- **API Requests** -- Fetch JSON from REST APIs
- **Content Analysis** -- Read articles, product descriptions, and documentation

#### Example Use Cases

**Research trending pet products:**
```
Use Fetch MCP to retrieve content from https://www.petbusiness.com/trending-products
and summarize the top pet product trends for 2026.
```

**Check CJ product details via API:**
```
Use Fetch MCP to call the CJdropshipping API:
GET https://developers.cjdropshipping.com/api2.0/v1/product/query
with appropriate headers to look up product details.
```

**Monitor supplier pricing:**
```
Use Fetch MCP to retrieve the product page for a specific CJ item
and extract the current wholesale price and shipping estimate.
```

**Read competitor blog content for content ideas:**
```
Use Fetch MCP to retrieve https://www.zooplus.nl/magazine/hond
and identify the most recent blog topics for content inspiration.
```

#### Important Notes

- Does not execute JavaScript. Use Playwright MCP for pages that require JS rendering.
- Ideal for API calls, static pages, and content retrieval.
- Faster and lower overhead than Playwright for simple content fetching.
- Respects standard HTTP status codes and redirects.

---

## Cross-Server Workflows

These workflows combine multiple MCP servers to accomplish common PawsNL tasks.

### Workflow 1: Check Order Status and Process Refund

**Servers used:** Supabase + Stripe

```
Step 1 (Supabase MCP):
  Query the order by email or order ID:
  SELECT id, customer_email, customer_name, total, status, stripe_session_id, items
  FROM orders WHERE customer_email = 'klant@voorbeeld.nl'
  ORDER BY created_at DESC LIMIT 1;

Step 2 (Stripe MCP):
  Look up the payment using the stripe_session_id from Step 1.
  Retrieve the checkout session to get the payment intent ID.

Step 3 (Stripe MCP):
  Issue a full or partial refund on the payment intent.

Step 4 (Supabase MCP):
  Update the order status:
  UPDATE orders SET status = 'refunded' WHERE id = '<order-id>';
```

### Workflow 2: Research Competitor Products

**Servers used:** Playwright + Fetch + Supabase

```
Step 1 (Playwright MCP):
  Visit a competitor site (e.g., bol.com, dierbenodigdheden.nl).
  Search for a product category. Take screenshots and extract product
  names, prices, and ratings.

Step 2 (Fetch MCP):
  Retrieve additional product details from competitor pages that
  don't require JavaScript rendering.

Step 3 (Supabase MCP):
  Compare findings with our current catalog:
  SELECT name, price, compare_at_price, category
  FROM products
  WHERE category = 'honden'
  ORDER BY price;

Step 4: Produce a competitive analysis with pricing recommendations.
```

### Workflow 3: Analyze Product Performance

**Servers used:** Supabase + Stripe

```
Step 1 (Supabase MCP):
  Query order data for product performance:
  SELECT p.name, p.category, p.price,
         COUNT(DISTINCT o.id) as times_ordered,
         SUM(o.total) as total_revenue
  FROM orders o, jsonb_array_elements(o.items) AS item
  JOIN products p ON p.id = (item->>'product_id')::uuid
  WHERE o.status = 'paid'
    AND o.created_at >= CURRENT_DATE - INTERVAL '30 days'
  GROUP BY p.name, p.category, p.price
  ORDER BY times_ordered DESC;

Step 2 (Stripe MCP):
  Cross-reference with Stripe data: check for chargebacks, disputes,
  or refund rates per product to identify problematic items.

Step 3: Generate a report with:
  - Top performers (high sales, low refunds)
  - Underperformers (low sales, consider repricing or removing)
  - Problem products (high refund/dispute rate)
```

### Workflow 4: Import Products from CJdropshipping

**Servers used:** Fetch + Supabase

```
Step 1 (Fetch MCP):
  Call the CJ API to search for products:
  GET https://developers.cjdropshipping.com/api2.0/v1/product/list
  Headers: CJ-Access-Token: <token>
  Query params: categoryKeyword=pet+toys&pageNum=1&pageSize=20

Step 2: Review the returned products and select items to import.

Step 3 (Supabase MCP):
  Insert new products:
  INSERT INTO products (name, slug, description, price, compare_at_price,
    category, images, featured, in_stock)
  VALUES (...);

Step 4 (Supabase MCP):
  Verify the import:
  SELECT name, slug, price, category FROM products
  ORDER BY created_at DESC LIMIT 5;
```

**Note:** PawsNL also has a UI-based import flow at `/admin/importeren` and a script at `scripts/import-cj-products.mjs`. The MCP workflow above is an alternative for quick imports without the UI.

### Workflow 5: Full Customer Lookup

**Servers used:** Supabase + Stripe

```
Step 1 (Supabase MCP):
  Look up the customer and their order history:
  SELECT c.*, json_agg(json_build_object(
    'order_id', o.id, 'total', o.total, 'status', o.status,
    'created_at', o.created_at
  ) ORDER BY o.created_at DESC) as orders
  FROM customers c
  LEFT JOIN orders o ON o.customer_email = c.email
  WHERE c.email = 'klant@voorbeeld.nl'
  GROUP BY c.id;

Step 2 (Stripe MCP):
  Search for the same customer in Stripe to see:
  - Payment methods on file
  - Total payment history
  - Any failed payments or disputes

Step 3: Compile a full customer profile with order history,
  payment status, and lifetime value.
```

---

## Future MCP Expansions

The following MCP servers can be added to extend PawsNL capabilities. Each includes the install command and the configuration snippet to add to `/.mcp.json`.

---

### 1. Ayrshare MCP -- Social Media Management

**Repository:** `vanman2024/ayrshare-mcp`
**Purpose:** Post content to 13+ social media platforms (Instagram, TikTok, Facebook, X, LinkedIn, Pinterest, etc.) from a single integration.

#### Install

```bash
npm install -g ayrshare-mcp
```

#### Config Snippet for .mcp.json

```json
"ayrshare": {
  "command": "npx",
  "args": [
    "-y",
    "ayrshare-mcp"
  ],
  "env": {
    "AYRSHARE_API_KEY": "your-ayrshare-api-key"
  },
  "description": "Social media posting to Instagram, TikTok, Facebook, Pinterest, and more"
}
```

#### Use Cases for PawsNL

- **Post TikTok scripts** generated from `/admin/tiktok` directly to TikTok, Instagram Reels, and Facebook
- **Product announcements** across all social channels when new items are imported from CJ
- **Promotional campaigns** for seasonal sales (Sinterklaas, Kerst, Black Friday deals on pet products)
- **Schedule content** in advance for consistent posting cadence
- **Cross-post** blog content or product highlights to Pinterest (high-value for pet product discovery)

---

### 2. Meta Ads MCP -- Facebook/Instagram Advertising

**Repository:** `pipeboard-co/meta-ads-mcp`
**Purpose:** Manage Facebook and Instagram advertising campaigns, ad sets, and ads. View performance metrics and optimize spend.

#### Install

```bash
npm install -g @pipeboard/meta-ads-mcp
```

#### Config Snippet for .mcp.json

```json
"meta-ads": {
  "command": "npx",
  "args": [
    "-y",
    "@pipeboard/meta-ads-mcp"
  ],
  "env": {
    "META_ACCESS_TOKEN": "your-meta-access-token",
    "META_AD_ACCOUNT_ID": "act_your-ad-account-id"
  },
  "description": "Facebook and Instagram ad campaign management and performance analytics"
}
```

#### Use Cases for PawsNL

- **Create product catalog ads** targeting Dutch/Belgian pet owners
- **Retargeting campaigns** for visitors who viewed products but didn't purchase
- **Lookalike audiences** based on existing PawsNL customers
- **Performance monitoring** -- check ROAS, CPA, and CTR on active campaigns
- **Budget optimization** -- shift spend toward best-performing ad sets
- **A/B test ad creatives** for different product categories (honden vs katten)

---

### 3. Google Analytics MCP -- GA4 Analytics

**Repository:** `googleanalytics/google-analytics-mcp`
**Purpose:** Query Google Analytics 4 data for traffic analysis, conversion tracking, and user behavior insights.

#### Install

```bash
npm install -g @google-analytics/mcp
```

#### Config Snippet for .mcp.json

```json
"google-analytics": {
  "command": "npx",
  "args": [
    "-y",
    "@google-analytics/mcp"
  ],
  "env": {
    "GA_PROPERTY_ID": "properties/your-ga4-property-id",
    "GOOGLE_APPLICATION_CREDENTIALS": "/path/to/service-account-key.json"
  },
  "description": "GA4 analytics data: traffic, conversions, user behavior, and acquisition channels"
}
```

#### Use Cases for PawsNL

- **Traffic analysis** -- which channels drive the most visitors (organic, social, direct, paid)
- **Conversion funnel** -- track drop-off from product view to cart to checkout to purchase
- **Product page performance** -- which product pages have highest/lowest engagement
- **Geographic data** -- confirm traffic is primarily NL/BE/DE as expected
- **Campaign attribution** -- measure effectiveness of TikTok content and any paid campaigns
- **Real-time monitoring** -- check live visitors during promotional events

---

### 4. SEO MCP -- Search Engine Optimization Data

**Repository:** `cnych/seo-mcp`
**Purpose:** Access Ahrefs-based SEO data including keyword rankings, backlinks, domain metrics, and competitor analysis. Free tier available.

#### Install

```bash
npm install -g seo-mcp
```

#### Config Snippet for .mcp.json

```json
"seo": {
  "command": "npx",
  "args": [
    "-y",
    "seo-mcp"
  ],
  "env": {
    "AHREFS_API_KEY": "your-ahrefs-api-key"
  },
  "description": "SEO data: keyword rankings, backlinks, domain authority, competitor analysis"
}
```

#### Use Cases for PawsNL

- **Keyword research** -- find high-volume Dutch keywords for pet products ("honden speelgoed kopen", "kattenvoer bestellen")
- **Competitor domain analysis** -- check domain ratings and top pages for dierbenodigdheden.nl, zooplus.nl, bol.com pet section
- **Backlink monitoring** -- track who links to pawsnlshop.com and find link building opportunities
- **Content gap analysis** -- identify keywords competitors rank for that PawsNL doesn't target yet
- **SERP tracking** -- monitor ranking positions for target keywords over time

---

## Troubleshooting

### Common Issues

**MCP server fails to start:**
- Verify environment variables are set in `.env.local` (Supabase URL, Supabase service role key, Stripe secret key)
- Run `npx -y <package-name> --help` manually to check if the package installs correctly
- Check that Node.js >= 18 is installed

**Supabase MCP returns "permission denied":**
- Confirm `SUPABASE_SERVICE_ROLE_KEY` is the service role key, not the anon key
- The service role key bypasses RLS. If you get permission errors, the key may be wrong or expired.

**Stripe MCP returns authentication errors:**
- Verify `STRIPE_SECRET_KEY` starts with `sk_test_` (test mode) or `sk_live_` (production)
- Check that the key has not been revoked in the Stripe dashboard

**Playwright MCP times out:**
- Some sites block headless browsers. Try a different user agent or use Fetch MCP instead.
- Increase timeout if the target site is slow to load.

**Fetch MCP returns empty content:**
- The page likely requires JavaScript rendering. Switch to Playwright MCP for those pages.
- Check if the URL requires authentication or has geographic restrictions.

### Environment Variables Reference

These environment variables must be set for the MCP servers to function:

| Variable | Used By | Where to Find |
|----------|---------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase MCP | Supabase Dashboard > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase MCP | Supabase Dashboard > Settings > API > Service Role Key |
| `STRIPE_SECRET_KEY` | Stripe MCP | Stripe Dashboard > Developers > API Keys |

Shopify Dev, Playwright, and Fetch MCP servers require no authentication.
