'use client'

import { useEffect, useState } from 'react'
import { TrendingUp, ShoppingBag, Users, Package, Clock } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Order, ORDER_STATUS_LABELS } from '@/lib/types'
import Link from 'next/link'

interface Stats {
  omzet_vandaag: number
  omzet_week: number
  omzet_maand: number
  orders_vandaag: number
  orders_totaal: number
  klanten_totaal: number
  producten_totaal: number
  recente_orders: Order[]
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.json())
      .then((data) => {
        setStats(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const statCards = [
    {
      label: 'Revenue today',
      value: formatPrice(stats?.omzet_vandaag ?? 0),
      icon: TrendingUp,
      color: 'text-green-500',
      bg: 'bg-green-50',
    },
    {
      label: 'Revenue this week',
      value: formatPrice(stats?.omzet_week ?? 0),
      icon: TrendingUp,
      color: 'text-blue-500',
      bg: 'bg-blue-50',
    },
    {
      label: 'Revenue this month',
      value: formatPrice(stats?.omzet_maand ?? 0),
      icon: TrendingUp,
      color: 'text-purple-500',
      bg: 'bg-purple-50',
    },
    {
      label: 'Orders today',
      value: stats?.orders_vandaag ?? 0,
      icon: ShoppingBag,
      color: 'text-orange-500',
      bg: 'bg-orange-50',
    },
    {
      label: 'Total orders',
      value: stats?.orders_totaal ?? 0,
      icon: ShoppingBag,
      color: 'text-orange-400',
      bg: 'bg-orange-50',
    },
    {
      label: 'Customers',
      value: stats?.klanten_totaal ?? 0,
      icon: Users,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50',
    },
    {
      label: 'Products',
      value: stats?.producten_totaal ?? 0,
      icon: Package,
      color: 'text-teal-500',
      bg: 'bg-teal-50',
    },
  ]

  const statusColors: Record<string, string> = {
    pending: 'badge-gray',
    paid: 'badge-green',
    shipped: 'badge-orange',
    delivered: 'badge-green',
    cancelled: 'bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center gap-1.5',
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back to PawsNL admin</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-10">
        {statCards.slice(0, 4).map((card) => (
          <div key={card.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{card.label}</p>
              <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-4.5 h-4.5 ${card.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {statCards.slice(4).map((card) => (
          <div key={card.label} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500">{card.label}</p>
              <div className={`w-9 h-9 rounded-xl ${card.bg} flex items-center justify-center`}>
                <card.icon className={`w-4.5 h-4.5 ${card.color}`} />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-500" />
            <h2 className="font-bold text-gray-900">Recent orders</h2>
          </div>
          <Link href="/admin/bestellingen" className="text-sm text-orange-500 hover:text-orange-600 font-medium">
            All orders →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-50 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {(stats?.recente_orders ?? []).length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-8 text-center text-gray-400 text-sm">
                    No orders yet
                  </td>
                </tr>
              ) : (
                (stats?.recente_orders ?? []).map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-gray-500">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{order.customer_name}</p>
                        <p className="text-xs text-gray-500">{order.customer_email}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {formatPrice(order.total)}
                    </td>
                    <td className="px-5 py-4">
                      <span className={statusColors[order.status] ?? 'badge-gray'}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
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
