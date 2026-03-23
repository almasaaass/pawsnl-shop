import { supabase } from '@/lib/supabase'
import { Product, CATEGORIES } from '@/lib/types'
import ProductCard from '@/components/shop/ProductCard'
import ProductFilters from '@/components/shop/ProductFilters'
import { SlidersHorizontal, PawPrint, ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'
import SortDropdown from '@/components/shop/SortDropdown'
import { isTrendingOnTikTok } from '@/lib/trending'

export const revalidate = 60

export const metadata = {
  title: 'Alle Producten | PawsNL',
  description: 'Bekijk ons volledige assortiment dierenproducten voor honden, katten en meer.',
}

interface PageProps {
  searchParams: {
    categorie?: string
    min_prijs?: string
    max_prijs?: string
    zoek?: string
    sort?: string
    trending?: string
  }
}

async function getProducts(filters: PageProps['searchParams']): Promise<Product[]> {
  let query = supabase.from('products').select('*')

  if (filters.categorie) {
    query = query.eq('category', filters.categorie)
  }
  if (filters.min_prijs) {
    query = query.gte('price', parseFloat(filters.min_prijs))
  }
  if (filters.max_prijs) {
    query = query.lte('price', parseFloat(filters.max_prijs))
  }
  if (filters.zoek) {
    query = query.ilike('name', `%${filters.zoek}%`)
  }

  switch (filters.sort) {
    case 'prijs-laag':
      query = query.order('price', { ascending: true })
      break
    case 'prijs-hoog':
      query = query.order('price', { ascending: false })
      break
    case 'naam':
      query = query.order('name', { ascending: true })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  const products = data || []

  // Push out-of-stock products to the end of the list
  products.sort((a, b) => {
    const aInStock = (a.stock ?? 0) > 0 ? 0 : 1
    const bInStock = (b.stock ?? 0) > 0 ? 0 : 1
    return aInStock - bInStock
  })

  return products
}

export default async function ProductenPage({ searchParams }: PageProps) {
  const allProducts = await getProducts(searchParams)
  // Apply trending filter client-side since it's not a DB field
  const products = searchParams.trending === '1'
    ? allProducts.filter(p => isTrendingOnTikTok(p.slug))
    : allProducts
  const activeCategory = searchParams.categorie || ''
  const categoryLabel = CATEGORIES.find((c) => c.slug === activeCategory)?.label

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-6 flex items-center gap-1.5">
        <Link href="/" className="hover:text-accent-500 transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        {activeCategory ? (
          <>
            <Link href="/producten" className="hover:text-accent-500 transition-colors">Producten</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-charcoal font-medium capitalize">{categoryLabel || activeCategory}</span>
          </>
        ) : (
          <span className="text-charcoal font-medium">Producten</span>
        )}
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-charcoal mb-1">
            {categoryLabel || 'Alle producten'}
          </h1>
          <p className="text-gray-500">
            {products.length} {products.length === 1 ? 'product' : 'producten'} gevonden
          </p>
        </div>
        <SortDropdown currentSort={searchParams.sort || ''} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter sidebar */}
        <aside className="lg:w-64 flex-shrink-0">
          <div className="card p-5 sticky top-24">
            <div className="flex items-center gap-2 mb-5 font-semibold text-charcoal">
              <SlidersHorizontal className="w-4 h-4 text-accent-500" />
              <span>Filters</span>
            </div>
            <ProductFilters
              categories={CATEGORIES}
              activeCategory={activeCategory}
              minPrijs={searchParams.min_prijs}
              maxPrijs={searchParams.max_prijs}
            />
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-20">
              <PawPrint className="w-12 h-12 text-accent-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-charcoal mb-2">Geen producten gevonden</h3>
              <p className="text-gray-500">Probeer andere filters of zoektermen.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
