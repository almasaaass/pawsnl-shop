import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'
import { verifyAdmin } from '@/lib/auth'

interface QualityIssue {
  type: 'error' | 'warning'
  field: string
  message: string
}

function auditProduct(product: any): QualityIssue[] {
  const issues: QualityIssue[] = []

  // Name checks
  if (!product.name || product.name.length < 5) {
    issues.push({ type: 'error', field: 'name', message: 'Name is missing or too short' })
  }
  if (/^[a-z]/.test(product.name)) {
    issues.push({ type: 'warning', field: 'name', message: 'Name does not start with a capital letter' })
  }

  // Description checks
  if (!product.description || product.description.length < 20) {
    issues.push({ type: 'error', field: 'description', message: 'Description is missing or too short (min. 20 characters)' })
  } else if (product.description.length < 80) {
    issues.push({ type: 'warning', field: 'description', message: 'Description is short (min. 80 characters recommended)' })
  }

  // Price checks
  if (!product.price || product.price <= 0) {
    issues.push({ type: 'error', field: 'price', message: 'No selling price set' })
  }
  if (!product.compare_price || product.compare_price <= 0) {
    issues.push({ type: 'warning', field: 'price', message: 'No compare price (strikethrough price)' })
  }
  if (product.compare_price && product.compare_price <= product.price) {
    issues.push({ type: 'error', field: 'price', message: 'Compare price is lower than selling price' })
  }

  // Image checks
  const images = product.images || []
  if (images.length === 0) {
    issues.push({ type: 'error', field: 'images', message: 'No images' })
  } else if (images.length < 2) {
    issues.push({ type: 'warning', field: 'images', message: 'Only 1 image (min. 2 recommended)' })
  }

  // Check if image URLs are valid
  for (const img of images) {
    if (!img.startsWith('http')) {
      issues.push({ type: 'error', field: 'images', message: `Invalid image URL: ${img.slice(0, 50)}` })
    }
  }

  // Category check
  const validCategories = ['dogs', 'cats', 'birds', 'small-pets', 'fish', 'reptiles']
  if (!validCategories.includes(product.category)) {
    issues.push({ type: 'error', field: 'category', message: `Invalid category: ${product.category}` })
  }

  // Stock check
  if (product.stock === 0) {
    issues.push({ type: 'warning', field: 'stock', message: 'Product is sold out (stock = 0)' })
  }

  // Slug check
  if (!product.slug || product.slug.length < 3) {
    issues.push({ type: 'error', field: 'slug', message: 'Slug is missing or too short' })
  }

  return issues
}

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createAdminClient()
  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .order('category')
    .order('name')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const results = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category,
    price: p.price,
    comparePrice: p.compare_price,
    images: p.images || [],
    stock: p.stock,
    issues: auditProduct(p),
  }))

  const totalIssues = results.reduce((sum, p) => sum + p.issues.length, 0)
  const errors = results.reduce((sum, p) => sum + p.issues.filter(i => i.type === 'error').length, 0)
  const warnings = results.reduce((sum, p) => sum + p.issues.filter(i => i.type === 'warning').length, 0)
  const perfect = results.filter(p => p.issues.length === 0).length

  return NextResponse.json({
    products: results,
    summary: {
      total: products.length,
      perfect,
      withIssues: products.length - perfect,
      totalIssues,
      errors,
      warnings,
    },
  })
}
