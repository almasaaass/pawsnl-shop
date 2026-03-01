'use client'

import { useEffect, useState } from 'react'
import { Product } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { Plus, Pencil, Trash2, Search, X, Check } from 'lucide-react'
import Image from 'next/image'

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  price: '',
  compare_price: '',
  images: '',
  category: 'honden',
  stock: '',
  featured: false,
}

export default function AdminProductenPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    loadProducts()
  }, [])

  async function loadProducts() {
    setIsLoading(true)
    const res = await fetch('/api/admin/products')
    const data = await res.json()
    setProducts(data)
    setIsLoading(false)
  }

  function openCreate() {
    setEditingProduct(null)
    setFormData(emptyForm)
    setShowModal(true)
  }

  function openEdit(product: Product) {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: String(product.price),
      compare_price: product.compare_price ? String(product.compare_price) : '',
      images: product.images.join(', '),
      category: product.category,
      stock: String(product.stock),
      featured: product.featured,
    })
    setShowModal(true)
  }

  async function handleSave() {
    setIsSaving(true)
    const body = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      description: formData.description,
      price: parseFloat(formData.price),
      compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
      images: formData.images.split(',').map((s) => s.trim()).filter(Boolean),
      category: formData.category,
      stock: parseInt(formData.stock) || 0,
      featured: formData.featured,
    }

    const url = editingProduct ? `/api/admin/products/${editingProduct.id}` : '/api/admin/products'
    const method = editingProduct ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (res.ok) {
      setShowModal(false)
      loadProducts()
    } else {
      alert('Fout bij opslaan. Probeer opnieuw.')
    }
    setIsSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Weet je zeker dat je dit product wilt verwijderen?')) return
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    loadProducts()
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Producten</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} producten in totaal</p>
        </div>
        <button onClick={openCreate} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nieuw product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Zoek producten..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-11"
        />
      </div>

      {/* Tabel */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Categorie</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Prijs</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Voorraad</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Uitgelicht</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center">
                    <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">
                    Geen producten gevonden
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {product.images[0] ? (
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-lg">🐾</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="badge-gray capitalize text-xs">{product.category}</span>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {formatPrice(product.price)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={product.stock > 0 ? 'text-green-600 font-medium' : 'text-red-500'}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {product.featured ? (
                        <Check className="w-5 h-5 text-green-500" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300" />
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white rounded-t-2xl">
              <h2 className="text-xl font-bold text-gray-900">
                {editingProduct ? 'Product bewerken' : 'Nieuw product'}
              </h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Naam *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input"
                    placeholder="Product naam"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="input"
                    placeholder="auto-gegenereerd"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Beschrijving *</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input resize-none"
                  placeholder="Product beschrijving..."
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Prijs (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="input"
                    placeholder="19.99"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Vergelijkprijs (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compare_price}
                    onChange={(e) => setFormData({ ...formData, compare_price: e.target.value })}
                    className="input"
                    placeholder="24.99"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Voorraad *</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="input"
                    placeholder="50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Afbeeldingen (URLs, komma-gescheiden)</label>
                <textarea
                  rows={2}
                  value={formData.images}
                  onChange={(e) => setFormData({ ...formData, images: e.target.value })}
                  className="input resize-none"
                  placeholder="https://voorbeeld.com/foto1.jpg, https://voorbeeld.com/foto2.jpg"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Categorie *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input"
                  >
                    <option value="honden">Honden</option>
                    <option value="katten">Katten</option>
                    <option value="vogels">Vogels</option>
                    <option value="knaagdieren">Knaagdieren</option>
                    <option value="vissen">Vissen</option>
                    <option value="reptielen">Reptielen</option>
                  </select>
                </div>
                <div className="flex items-end pb-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 text-orange-500 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Uitgelicht op homepage</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white rounded-b-2xl">
              <button onClick={() => setShowModal(false)} className="btn-secondary">
                Annuleren
              </button>
              <button onClick={handleSave} disabled={isSaving} className="btn-primary">
                {isSaving ? 'Opslaan...' : editingProduct ? 'Wijzigingen opslaan' : 'Product aanmaken'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
