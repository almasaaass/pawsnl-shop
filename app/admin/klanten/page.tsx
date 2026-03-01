'use client'

import { useEffect, useState } from 'react'
import { Customer } from '@/lib/types'
import { formatPrice } from '@/lib/utils'
import { Search, Users } from 'lucide-react'

export default function AdminKlantenPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetch('/api/admin/customers')
      .then((r) => r.json())
      .then((data) => {
        setCustomers(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalRevenue = customers.reduce((sum, c) => sum + c.total_spent, 0)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Klanten</h1>
        <p className="text-gray-500 text-sm mt-1">{customers.length} klanten in totaal</p>
      </div>

      {/* Samenvatting */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="card p-5">
          <p className="text-sm text-gray-500 mb-1">Totaal klanten</p>
          <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500 mb-1">Totale omzet klanten</p>
          <p className="text-2xl font-bold text-gray-900">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="card p-5">
          <p className="text-sm text-gray-500 mb-1">Gem. besteding per klant</p>
          <p className="text-2xl font-bold text-gray-900">
            {formatPrice(customers.length > 0 ? totalRevenue / customers.length : 0)}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Zoek op naam of e-mail..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="input pl-11"
        />
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Klant</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aantal orders</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Totaal besteed</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Gem. per order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center">
                    <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-10 text-center">
                    <Users className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-400 text-sm">Geen klanten gevonden</p>
                  </td>
                </tr>
              ) : (
                filtered.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-orange-600 font-bold text-sm">
                            {customer.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{customer.name}</p>
                          <p className="text-xs text-gray-400">{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-gray-900">
                      {customer.orders_count}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {formatPrice(customer.total_spent)}
                    </td>
                    <td className="px-5 py-4 text-gray-500">
                      {formatPrice(
                        customer.orders_count > 0
                          ? customer.total_spent / customer.orders_count
                          : 0
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
