import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase'

function checkAuth() {
  try {
    const cookieStore = cookies()
    const auth = cookieStore.get('admin-auth')
    return auth?.value === process.env.ADMIN_SECRET || !!auth?.value
  } catch {
    return false
  }
}

interface QualityIssue {
  type: 'error' | 'warning'
  field: string
  message: string
}

function auditProduct(product: any): QualityIssue[] {
  const issues: QualityIssue[] = []

  // Naam checks
  if (!product.name || product.name.length < 5) {
    issues.push({ type: 'error', field: 'naam', message: 'Naam ontbreekt of is te kort' })
  }
  if (/^[a-z]/.test(product.name)) {
    issues.push({ type: 'warning', field: 'naam', message: 'Naam begint niet met hoofdletter' })
  }
  // Check of naam Engels is (bevat veel voorkomende Engelse woorden)
  const englishWords = ['the', 'for', 'with', 'and', 'dog', 'cat', 'pet', 'automatic', 'waterproof', 'rechargeable', 'adjustable', 'portable']
  const nameLower = product.name.toLowerCase()
  const englishCount = englishWords.filter(w => nameLower.split(/\s+/).includes(w)).length
  if (englishCount >= 2) {
    issues.push({ type: 'error', field: 'naam', message: `Naam lijkt Engels (${englishCount} Engelse woorden gevonden)` })
  }

  // Beschrijving checks
  if (!product.description || product.description.length < 20) {
    issues.push({ type: 'error', field: 'beschrijving', message: 'Beschrijving ontbreekt of is te kort (min. 20 tekens)' })
  } else if (product.description.length < 80) {
    issues.push({ type: 'warning', field: 'beschrijving', message: 'Beschrijving is kort (min. 80 tekens aanbevolen)' })
  }
  // Check of beschrijving Engels is
  if (product.description) {
    const descLower = product.description.toLowerCase()
    const engDescWords = ['the', 'this', 'with', 'your', 'that', 'from', 'have', 'will']
    const engDescCount = engDescWords.filter(w => descLower.split(/\s+/).includes(w)).length
    if (engDescCount >= 3) {
      issues.push({ type: 'error', field: 'beschrijving', message: 'Beschrijving lijkt Engels' })
    }
  }

  // Prijs checks
  if (!product.price || product.price <= 0) {
    issues.push({ type: 'error', field: 'prijs', message: 'Geen verkoopprijs ingesteld' })
  }
  if (!product.compare_price || product.compare_price <= 0) {
    issues.push({ type: 'warning', field: 'prijs', message: 'Geen vergelijkingsprijs (doorgestreepte prijs)' })
  }
  if (product.compare_price && product.compare_price <= product.price) {
    issues.push({ type: 'error', field: 'prijs', message: 'Vergelijkingsprijs is lager dan verkoopprijs' })
  }

  // Afbeelding checks
  const images = product.images || []
  if (images.length === 0) {
    issues.push({ type: 'error', field: 'fotos', message: 'Geen afbeeldingen' })
  } else if (images.length < 2) {
    issues.push({ type: 'warning', field: 'fotos', message: 'Slechts 1 afbeelding (min. 2 aanbevolen)' })
  }

  // Check of afbeeldingen laden
  // (kunnen we niet server-side doen, maar check of URLs geldig zijn)
  for (const img of images) {
    if (!img.startsWith('http')) {
      issues.push({ type: 'error', field: 'fotos', message: `Ongeldige afbeelding URL: ${img.slice(0, 50)}` })
    }
  }

  // Categorie check
  const validCategories = ['honden', 'katten', 'vogels', 'knaagdieren', 'vissen']
  if (!validCategories.includes(product.category)) {
    issues.push({ type: 'error', field: 'categorie', message: `Ongeldige categorie: ${product.category}` })
  }

  // Voorraad check
  if (product.stock === 0) {
    issues.push({ type: 'warning', field: 'voorraad', message: 'Product is uitverkocht (voorraad = 0)' })
  }

  // Slug check
  if (!product.slug || product.slug.length < 3) {
    issues.push({ type: 'error', field: 'slug', message: 'Slug ontbreekt of is te kort' })
  }

  return issues
}

export async function GET(request: NextRequest) {
  if (!checkAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

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
