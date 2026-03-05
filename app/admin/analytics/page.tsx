'use client'

import { useEffect, useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { TrendingUp, ShoppingBag, Users, Package, Euro, ArrowUp, ArrowDown } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Totalen {
  omzetTotaal: number
  omzetVandaag: number
  omzetWeek: number
  omzetMaand: number
  bestellingenTotaal: number
  klantenTotaal: number
  gemiddeldeOrderwaarde: number
  productTotaal: number
}

// Note: Interface field names (omzetTotaal, etc.) are kept as-is since they
// match the API response shape. Only user-facing strings are translated.

interface DagData { date: string; omzet: number; bestellingen: number }
interface ProductData { name: string; category: string; verkocht: number; omzet: number }
interface CategorieData { name: string; omzet: number }

interface AnalyticsData {
  totalen: Totalen
  dagelijks: DagData[]
  topProducten: ProductData[]
  perCategorie: CategorieData[]
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function eur(n: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n)
}

function eurFull(n: number) {
  return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(n)
}

const PIE_COLORS = ['#16a34a', '#2563eb', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4']

const CATEGORY_LABELS: Record<string, string> = {
  honden: '🐶 Dogs',
  katten: '🐱 Cats',
  vogels: '🐦 Birds',
  knaagdieren: '🐹 Small pets',
  vissen: '🐟 Fish',
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label, value, sub, icon: Icon, color, trend,
}: {
  label: string
  value: string
  sub?: string
  icon: React.ElementType
  color: string
  trend?: 'up' | 'down' | null
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {sub && (
            <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
              {trend === 'up' && <ArrowUp className="w-3 h-3 text-emerald-500" />}
              {trend === 'down' && <ArrowDown className="w-3 h-3 text-red-500" />}
              {sub}
            </p>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  )
}

// ─── Custom tooltip ───────────────────────────────────────────────────────────

function OmzetTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-emerald-600 font-bold">{eurFull(payload[0]?.value ?? 0)}</p>
      {payload[1] && <p className="text-blue-500">{payload[1].value} {payload[1].value !== 1 ? 'orders' : 'order'}</p>}
    </div>
  )
}

function BarTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1 truncate max-w-[200px]">{label}</p>
      <p className="text-emerald-600 font-bold">{eurFull(payload[0]?.value ?? 0)}</p>
      {payload[1] && <p className="text-violet-500">{payload[1].value} sold</p>}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false) })
      .catch(() => { setError('Failed to load'); setLoading(false) })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return <p className="text-red-500">{error ?? 'Unknown error'}</p>
  }

  const { totalen, dagelijks, topProducten, perCategorie } = data

  // Show every 5th day as label on x-axis
  const xAxisData = dagelijks.map((d, i) => ({
    ...d,
    label: i % 5 === 0 || i === dagelijks.length - 1 ? d.date : '',
  }))

  const hasOrders = totalen.bestellingenTotaal > 0

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">📊 Analytics</h1>
        <p className="text-gray-500 mt-1">Revenue, orders and products at a glance</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Revenue today"
          value={eur(totalen.omzetVandaag)}
          sub={`This week: ${eur(totalen.omzetWeek)}`}
          icon={Euro}
          color="bg-emerald-500"
        />
        <StatCard
          label="Revenue this month"
          value={eur(totalen.omzetMaand)}
          sub={`Total: ${eur(totalen.omzetTotaal)}`}
          icon={TrendingUp}
          color="bg-blue-500"
        />
        <StatCard
          label="Orders"
          value={String(totalen.bestellingenTotaal)}
          sub={`Avg. order value: ${eurFull(totalen.gemiddeldeOrderwaarde)}`}
          icon={ShoppingBag}
          color="bg-violet-500"
        />
        <StatCard
          label="Customers"
          value={String(totalen.klantenTotaal)}
          sub={`${totalen.productTotaal} products active`}
          icon={Users}
          color="bg-amber-500"
        />
      </div>

      {hasOrders ? (
        <>
          {/* Revenue chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-1">Revenue last 30 days</h2>
            <p className="text-sm text-gray-400 mb-5">Daily revenue in euros</p>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={xAxisData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradOmzet" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `€${v}`}
                  width={50}
                />
                <Tooltip content={<OmzetTooltip />} />
                <Area
                  type="monotone"
                  dataKey="omzet"
                  stroke="#16a34a"
                  strokeWidth={2.5}
                  fill="url(#gradOmzet)"
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Orders chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-gray-900 mb-1">Orders per day</h2>
            <p className="text-sm text-gray-400 mb-5">Number of paid orders</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={xAxisData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  width={30}
                />
                <Tooltip content={<OmzetTooltip />} />
                <Bar dataKey="bestellingen" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top products + Pie */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Top products */}
            <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-1">Top products</h2>
              <p className="text-sm text-gray-400 mb-5">Based on generated revenue</p>
              {topProducten.length > 0 ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart
                    data={topProducten.map((p) => ({
                      name: p.name.length > 22 ? p.name.slice(0, 22) + '…' : p.name,
                      omzet: p.omzet,
                      verkocht: p.verkocht,
                    }))}
                    layout="vertical"
                    margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `€${v}`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#374151' }}
                      axisLine={false}
                      tickLine={false}
                      width={140}
                    />
                    <Tooltip content={<BarTooltip />} />
                    <Bar dataKey="omzet" fill="#16a34a" radius={[0, 4, 4, 0]} maxBarSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-400 text-sm">No sales data yet</p>
              )}
            </div>

            {/* Revenue per category */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-1">Per category</h2>
              <p className="text-sm text-gray-400 mb-5">Revenue distribution</p>
              {perCategorie.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={perCategorie}
                        dataKey="omzet"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={3}
                      >
                        {perCategorie.map((_, i) => (
                          <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(v) => eurFull(Number(v))} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-3 space-y-2">
                    {perCategorie.map((c, i) => (
                      <div key={c.name} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ background: PIE_COLORS[i % PIE_COLORS.length] }}
                          />
                          <span className="text-gray-600">{CATEGORY_LABELS[c.name] ?? c.name}</span>
                        </span>
                        <span className="font-semibold text-gray-800">{eur(c.omzet)}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-gray-400 text-sm">No sales data yet</p>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Empty state */
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
          <div className="text-5xl mb-4">📦</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders yet</h3>
          <p className="text-gray-400 text-sm max-w-sm mx-auto">
            Once customers start ordering you will see charts of your revenue, top products and more here.
          </p>
        </div>
      )}

    </div>
  )
}
