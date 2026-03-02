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
  cj_pid?: string | null
  cj_vid?: string | null
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
  cj_order_id?: string | null
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
  { slug: 'honden', label: 'Honden', emoji: '🐕', icon: 'Dog' },
  { slug: 'katten', label: 'Katten', emoji: '🐈', icon: 'Cat' },
  { slug: 'vogels', label: 'Vogels', emoji: '🐦', icon: 'Bird' },
  { slug: 'knaagdieren', label: 'Knaagdieren', emoji: '🐹', icon: 'Rabbit' },
  { slug: 'vissen', label: 'Vissen', emoji: '🐠', icon: 'Fish' },
  { slug: 'reptielen', label: 'Reptielen', emoji: '🦎', icon: 'Snail' },
]
