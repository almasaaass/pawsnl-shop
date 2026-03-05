# E-commerce Design System — PawsNL

## Brand Identity
- **Primary color:** Emerald/green (#16a34a) — trust, nature, pets
- **Accent:** Warm amber (#f59e0b) — for CTAs, sales, urgency
- **Neutral:** Gray scale for text and backgrounds
- **Font:** System font stack (clean, fast loading)
- **Tone:** Friendly, warm, Dutch-casual ("jij" not "u")

## Design Principles
1. **Mobile-first**: 70%+ of Dutch shoppers browse on mobile
2. **Trust signals**: Show reviews, delivery info, payment icons (iDEAL, Visa, Mastercard)
3. **Speed over animation**: Fast loading beats fancy transitions
4. **White space**: Don't cram — let products breathe
5. **Consistency**: Same card style, button style, spacing everywhere

## Product Card Pattern
```
┌─────────────────────┐
│     [Product Image]  │  ← aspect-square, object-cover
│                      │
├─────────────────────┤
│ Category label       │  ← text-xs, text-gray-400
│ Product Name That    │  ← font-medium, line-clamp-2
│ Can Be Two Lines     │
│                      │
│ €29,95  €39,95       │  ← price bold green, compare strikethrough
│                      │
│ [★★★★★ (24)]        │  ← star rating if available
│                      │
│ [ Voeg toe aan kar ] │  ← full-width button
└─────────────────────┘
```

## Page Patterns

### Homepage
1. Hero with value proposition + CTA
2. Trust bar (gratis verzending, retourneren, iDEAL)
3. Featured products (4-8 items)
4. Category grid
5. USP section (why PawsNL)
6. Social proof / reviews
7. Newsletter signup

### Product Page
1. Image gallery (left) + Product info (right)
2. Name, price, compare price, stock badge
3. Add to cart button (sticky on mobile)
4. Product description (collapsible sections)
5. Delivery info
6. Related products

### Category Page
1. Category header with description
2. Filter sidebar (mobile: slide-out)
3. Sort options
4. Product grid (2 cols mobile, 3-4 cols desktop)
5. Pagination or infinite scroll

## Spacing System (Tailwind)
- Section padding: `py-12 md:py-16`
- Card padding: `p-4 md:p-5`
- Grid gap: `gap-4 md:gap-6`
- Container: `max-w-7xl mx-auto px-4`

## Button Hierarchy
- **Primary**: `bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl`
- **Secondary**: `border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl`
- **Accent/CTA**: `bg-amber-500 text-white hover:bg-amber-600 rounded-xl`
- **Danger**: `bg-red-500 text-white hover:bg-red-600 rounded-xl`

## Responsive Breakpoints
- Mobile: default (< 640px)
- Tablet: `sm:` (640px+)
- Desktop: `md:` (768px+) and `lg:` (1024px+)
- Wide: `xl:` (1280px+)
