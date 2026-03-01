'use client'

import { useEffect, useState } from 'react'
import { Order, ORDER_STATUS_LABELS, OrderStatus } from '@/lib/types'
import { formatPrice, formatDate } from '@/lib/utils'
import { Search, ChevronDown } from 'lucide-react'

const statusColors: Record<OrderStatus, string> = {
  pending: 'badge-gray',
  paid: 'badge-green',
  shipped: 'badge-orange',
  delivered: 'bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1.5',
  cancelled: 'bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1.5',
}

export default function AdminBestellingenPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    setIsLoading(true)
    const res = await fetch('/api/admin/orders')
    const data = await res.json()
    setOrders(data)
    setIsLoading(false)
  }

  async function updateStatus(orderId: string, newStatus: OrderStatus) {
    setUpdatingId(orderId)
    await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    await loadOrders()
    setUpdatingId(null)
  }

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bestellingen</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} bestellingen in totaal</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Zoek op naam, e-mail of order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-11"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          className="input sm:w-48"
        >
          <option value="all">Alle statussen</option>
          {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Klant</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Datum</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Totaal</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
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
                    Geen bestellingen gevonden
                  </td>
                </tr>
              ) : (
                filtered.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-gray-500">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{order.customer_name}</p>
                        <p className="text-xs text-gray-400">{order.customer_email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={statusColors[order.status]}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="relative inline-block">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                          disabled={updatingId === order.id}
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3 py-2 rounded-lg cursor-pointer border-none outline-none appearance-none pr-8 transition-colors"
                        >
                          {Object.entries(ORDER_STATUS_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                        <ChevronDown className="w-3 h-3 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                      </div>
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
