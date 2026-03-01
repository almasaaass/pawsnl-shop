export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  compare_price: number | null
  images: string[]
  category: string
  stock: number
  featured: boolean
  created_at: string
}

export interface ShippingAddress {
  street: string
  city: string
  postal_code: string
  country: string
}

export interface OrderItem {
  product_id: string
  name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id: string
  customer_email: string
  customer_name: string
  shipping_address: ShippingAddress
  items: OrderItem[]
  total: number
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'
  stripe_session_id: string
  tracking_number: string | null
  created_at: string
}

export interface Customer {
  id: string
  email: string
  name: string
  orders_count: number
  total_spent: number
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Review {
  id: string
  author: string
  rating: number
  comment: string
  date: string
}

export type OrderStatus = Order['status']

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'In afwachting',
  paid: 'Betaald',
  shipped: 'Verzonden',
  delivered: 'Afgeleverd',
  cancelled: 'Geannuleerd',
}

export const CATEGORIES = [
  { slug: 'honden', label: 'Honden', emoji: '🐕' },
  { slug: 'katten', label: 'Katten', emoji: '🐈' },
  { slug: 'vogels', label: 'Vogels', emoji: '🐦' },
  { slug: 'knaagdieren', label: 'Knaagdieren', emoji: '🐹' },
  { slug: 'vissen', label: 'Vissen', emoji: '🐠' },
  { slug: 'reptielen', label: 'Reptielen', emoji: '🦎' },
]
