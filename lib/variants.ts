import { Product, ProductVariant } from './types'

/** Heeft dit product meerdere varianten? */
export function hasVariants(product: Product): boolean {
  return Array.isArray(product.variants) && product.variants.length > 1
}

/** Effectieve prijs: variant-prijs als beschikbaar, anders product-prijs */
export function getVariantPrice(product: Product, variant?: ProductVariant | null): number {
  return variant?.price ?? product.price
}

/** Effectieve vergelijkingsprijs */
export function getVariantComparePrice(product: Product, variant?: ProductVariant | null): number | null {
  if (variant && variant.compare_price !== undefined) return variant.compare_price
  return product.compare_price
}

/** Juiste CJ VID voor bestelling */
export function getEffectiveCjVid(product: Product, variant?: ProductVariant | null): string | null {
  return variant?.cj_vid ?? product.cj_vid ?? null
}

/** Leesbaar label: "Rood / M" */
export function variantLabel(variant?: ProductVariant | null): string {
  if (!variant) return ''
  return Object.values(variant.options).join(' / ')
}

/** Unieke cart key: productId of productId::variantId */
export function cartItemKey(productId: string, variant?: ProductVariant | null): string {
  if (!variant) return productId
  return `${productId}::${variant.id}`
}
