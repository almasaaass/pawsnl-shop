import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase'
import { getCJProductDetail } from '@/lib/cj'
import { ProductVariant } from '@/lib/types'

function checkAuth() {
  try {
    const cookieStore = cookies()
    const auth = cookieStore.get('admin-auth')
    const adminSecret = process.env.ADMIN_SECRET
    if (!adminSecret) return false
    return auth?.value === adminSecret
  } catch {
    return false
  }
}

// CJ property name translations
const PROPERTY_TRANSLATIONS: Record<string, string> = {
  Color: 'Kleur',
  color: 'Kleur',
  Colour: 'Kleur',
  colour: 'Kleur',
  Size: 'Maat',
  size: 'Maat',
  Style: 'Stijl',
  style: 'Stijl',
  Material: 'Materiaal',
  material: 'Materiaal',
  Length: 'Lengte',
  length: 'Lengte',
  Type: 'Type',
  type: 'Type',
}

function translatePropertyName(name: string): string {
  return PROPERTY_TRANSLATIONS[name] || name
}

/**
 * Parse CJ variantProperty string into options object
 * CJ format: "Color:Red;Size:M" or "Color:Red" etc.
 */
function parseVariantProperty(prop: string): Record<string, string> {
  const options: Record<string, string> = {}
  if (!prop) return options

  const parts = prop.split(';').filter(Boolean)
  for (const part of parts) {
    const [key, ...valueParts] = part.split(':')
    if (key && valueParts.length > 0) {
      options[translatePropertyName(key.trim())] = valueParts.join(':').trim()
    }
  }
  return options
}

// Common CJ color translations
const COLOR_TRANSLATIONS: Record<string, string> = {
  pink: 'Roze', red: 'Rood', blue: 'Blauw', green: 'Groen',
  black: 'Zwart', white: 'Wit', orange: 'Oranje', yellow: 'Geel',
  purple: 'Paars', grey: 'Grijs', gray: 'Grijs', brown: 'Bruin',
  'dark blue': 'Donkerblauw', 'light blue': 'Lichtblauw',
  'light green': 'Lichtgroen', 'dark green': 'Donkergroen',
  beige: 'Beige', navy: 'Marineblauw', gold: 'Goud', silver: 'Zilver',
  'rose red': 'Rozerood', 'lake blue': 'Meerblauw',
}

function translateColor(color: string): string {
  return COLOR_TRANSLATIONS[color.toLowerCase()] || color.charAt(0).toUpperCase() + color.slice(1)
}

/**
 * Parse options from CJ SKU when variantProperty is empty
 * SKU format: "CJPREFIX-color-size-type" or "CJPREFIX-color-size"
 */
function parseOptionsFromSku(sku: string): Record<string, string> {
  const options: Record<string, string> = {}
  if (!sku) return options

  // Remove CJ prefix (e.g., CJJJCWGY00032-)
  const parts = sku.replace(/^CJ[A-Z0-9]+-/i, '').split('-').filter(Boolean)
  if (parts.length === 0) return options

  // Heuristic: detect colors and sizes
  const sizePatterns = /^(XXS|XS|S|M|L|XL|XXL|XXXL|2XL|3XL|4XL|5XL|\d+(\.\d+)?\s*(cm|mm|m|kg|g|ml|l))$/i
  const typePatterns = /^(battery|chargable|rechargeable|usb|manual|auto|electric)$/i

  const colors: string[] = []
  const sizes: string[] = []
  const types: string[] = []

  for (const part of parts) {
    if (sizePatterns.test(part)) {
      sizes.push(part.toUpperCase())
    } else if (typePatterns.test(part)) {
      types.push(part.charAt(0).toUpperCase() + part.slice(1))
    } else if (COLOR_TRANSLATIONS[part.toLowerCase()] || /^[a-z]+$/i.test(part)) {
      colors.push(translateColor(part))
    } else {
      // Unknown part - might be color or something else
      colors.push(part.charAt(0).toUpperCase() + part.slice(1))
    }
  }

  if (colors.length > 0) options['Kleur'] = colors.join(' ')
  if (sizes.length > 0) options['Maat'] = sizes.join(' ')
  if (types.length > 0) options['Type'] = types.join(' ')

  return options
}

export async function POST() {
  if (!checkAuth()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()

  // Get only products with cj_pid that don't have variants yet
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, cj_pid, cj_vid')
    .not('cj_pid', 'is', null)
    .is('variants', null)

  if (error || !products) {
    return NextResponse.json({ error: 'Kon producten niet ophalen' }, { status: 500 })
  }

  const results: { id: string; name: string; variantCount: number; status: string }[] = []

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  for (const product of products) {
    try {
      await sleep(1200) // CJ rate limit: 1 req/sec
      const cjProduct = await getCJProductDetail(product.cj_pid!)

      // Skip products with 0 or 1 variant
      if (!cjProduct.variants || cjProduct.variants.length <= 1) {
        results.push({ id: product.id, name: product.name, variantCount: cjProduct.variants?.length ?? 0, status: 'skipped' })
        continue
      }

      // Build variants array
      const variants: ProductVariant[] = cjProduct.variants.map((v, i) => {
        let options = parseVariantProperty(v.variantProperty)
        // Fallback: parse options from SKU if variantProperty was empty
        if (Object.keys(options).length === 0) {
          options = parseOptionsFromSku(v.variantSku)
        }
        return {
          id: `${product.id}-v${i}`,
          cj_vid: v.vid,
          sku: v.variantSku,
          options,
          price: undefined, // Use product base price
          compare_price: undefined,
          image: v.variantImage || undefined,
          stock: 999,
        }
      })

      // Determine option_types from first variant
      const optionTypes = Object.keys(variants[0]?.options ?? {})

      // Update product in database
      await supabase
        .from('products')
        .update({
          variants,
          option_types: optionTypes.length > 0 ? optionTypes : null,
        })
        .eq('id', product.id)

      results.push({ id: product.id, name: product.name, variantCount: variants.length, status: 'updated' })
    } catch (err: any) {
      results.push({ id: product.id, name: product.name, variantCount: 0, status: `error: ${err.message}` })
    }
  }

  return NextResponse.json({ results })
}
