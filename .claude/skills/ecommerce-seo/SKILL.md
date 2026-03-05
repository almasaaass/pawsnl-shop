# E-commerce SEO for Dutch Webshop

## Meta Tags (Every Page)
- Unique `<title>` per page: "Productnaam | PawsNL" (max 60 chars)
- Unique `<meta name="description">` per page (max 155 chars, include CTA)
- `<meta name="robots" content="index, follow">`
- `<link rel="canonical" href="https://pawsnlshop.com/...">`
- Open Graph tags: og:title, og:description, og:image, og:url, og:type
- Twitter Card tags: twitter:card, twitter:title, twitter:description, twitter:image

## Structured Data (JSON-LD)
Every product page MUST have:
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Productnaam",
  "image": ["url1", "url2"],
  "description": "...",
  "brand": { "@type": "Brand", "name": "PawsNL" },
  "offers": {
    "@type": "Offer",
    "price": "29.95",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "url": "https://pawsnlshop.com/producten/slug",
    "seller": { "@type": "Organization", "name": "PawsNL" }
  }
}
```

Homepage should have Organization + WebSite schema.
Category pages should have CollectionPage schema.

## Technical SEO
- Generate `sitemap.xml` dynamically (all products, categories, pages)
- Add `robots.txt` (allow all, reference sitemap)
- Use semantic HTML: `<main>`, `<nav>`, `<article>`, `<section>`, `<h1>`-`<h6>`
- Only ONE `<h1>` per page
- Internal linking: link from category pages to products, from products to related products
- Breadcrumbs with BreadcrumbList schema
- 404 page with helpful navigation

## Dutch Language SEO
- Write all content in Dutch
- Use Dutch keywords naturally in titles and descriptions
- Examples: "hondentuigje kopen", "kattenspeelgoed online", "huisdier producten"
- Alt text on images in Dutch
- hreflang tag: `<link rel="alternate" hreflang="nl" href="...">`

## Performance = SEO
- Google Core Web Vitals directly impact ranking
- LCP < 2.5s, CLS < 0.1, INP < 200ms
- Mobile-first: test on mobile viewport
- Compress images, use WebP/AVIF
