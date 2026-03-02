import { supabase } from '@/lib/supabase'
import { Product, CATEGORIES } from '@/lib/types'
import ProductCard from '@/components/shop/ProductCard'
import ProductFilters from '@/components/shop/ProductFilters'
import { SlidersHorizontal, PawPrint } from 'lucide-react'

export const revalidate = 60

export const metadata = {
  title: 'Alle Producten',
  description: 'Bekijk ons volledige assortiment dierenbenodigdheden voor honden, katten en meer.',
}

interface PageProps {
  searchParams: {
    categorie?: string
    min_prijs?: string
    max_prijs?: string
    zoek?: string
  }
}

async function getProducts(filters: PageProps['searchParams']): Promise<Product[]> {
  let query = supabase.from('products').select('*').order('created_at', { ascending: false })

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

  const { data, error } = await query

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data || []
}

export default async function ProductenPage({ searchParams }: PageProps) {
  const products = await getProducts(searchParams)
  const activeCategory = searchParams.categorie || ''

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-charcoal mb-2">Alle Producten</h1>
        <p className="text-gray-500">
          {products.length} {products.length === 1 ? 'product' : 'producten'} gevonden
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters sidebar */}
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
