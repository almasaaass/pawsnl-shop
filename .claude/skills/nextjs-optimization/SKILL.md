# Next.js 14 E-commerce Optimization

## Performance Rules
- Use Server Components by default. Only use `'use client'` for interactivity (useState, onClick, etc.)
- Use `next/image` with `width`, `height`, `sizes`, and `priority` (for above-the-fold images)
- Set `format: 'webp'` in `next.config.js` images config
- Use `loading="lazy"` for below-fold images, `priority` for hero/LCP images
- Wrap slow data fetches in `<Suspense>` with skeleton fallbacks
- Use `generateStaticParams()` for product pages that can be pre-rendered
- Use `revalidate` in fetch options for ISR (e.g., product data: 3600s, homepage: 60s)
- Avoid importing large libraries client-side; use dynamic imports: `const Component = dynamic(() => import('./Heavy'), { ssr: false })`

## Bundle Size
- Never import full icon libraries. Use `import { Icon } from 'lucide-react'` (tree-shakes)
- Lazy-load modals, dropdowns, and anything not visible on first paint
- Check bundle with `ANALYZE=true next build` using `@next/bundle-analyzer`

## Core Web Vitals Targets
- LCP < 2.5s (optimize hero image, use `priority`)
- CLS < 0.1 (always set width/height on images, reserve space for dynamic content)
- INP < 200ms (debounce search inputs, avoid blocking the main thread)

## Caching
- Static pages: Cache-Control `public, max-age=31536000, immutable` (Next.js handles this)
- API routes: Use `Cache-Control: s-maxage=60, stale-while-revalidate=300` where appropriate
- Supabase queries: Cache with `next: { revalidate: 3600 }` in fetch options

## E-commerce Specific
- Product pages: Use `generateMetadata()` for dynamic SEO (title, description, og:image)
- Structured data: Add JSON-LD `Product` schema on every product page
- Prefetch product links on hover with `<Link prefetch>`
- Cart: Use localStorage + React context (no server round-trips)
