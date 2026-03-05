export interface ProductVariant {
  id: string
  cj_vid: string
  sku: string
  options: Record<string, string>  // { Kleur: "Rood", Maat: "M" }
  price?: number
  compare_price?: number | null
  image?: string
  stock?: number
}

export interface Product {
  id: string
  name: string
  name_en?: string | null
  slug: string
  description: string
  description_en?: string | null
  price: number
  compare_price: number | null
  images: string[]
  category: string
  stock: number
  featured: boolean
  cj_pid?: string | null
  cj_vid?: string | null
  variants?: ProductVariant[] | null
  option_types?: string[] | null
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
  variant_id?: string
  variant_label?: string
  cj_vid?: string
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
  selectedVariant?: ProductVariant | null
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

// ─── TikTok Video Pipeline ─────────────────────────────────────────────────

export type TikTokVideoStatus = 'draft' | 'generating' | 'ready' | 'posted' | 'viral' | 'failed'

export interface TikTokVideo {
  id: string
  product_id: string | null
  product_name: string
  product_url: string
  script: string | null
  caption: string | null
  hashtags: string[]

  creatify_task_id: string | null
  video_url: string | null
  thumbnail_url: string | null

  blotato_post_id: string | null
  tiktok_post_url: string | null

  views: number
  viral_alert_sent: boolean

  status: TikTokVideoStatus
  failed_reason: string | null

  scheduled_at: string | null
  posted_at: string | null
  created_at: string
}

export const TIKTOK_STATUS_LABELS: Record<TikTokVideoStatus, string> = {
  draft: 'Concept',
  generating: 'Genereren...',
  ready: 'Klaar',
  posted: 'Gepost',
  viral: 'Viraal!',
  failed: 'Mislukt',
}

export const CATEGORIES = [
  { slug: 'honden', label: 'Honden', emoji: '🐕', icon: 'Dog' },
  { slug: 'katten', label: 'Katten', emoji: '🐈', icon: 'Cat' },
  { slug: 'vogels', label: 'Vogels', emoji: '🐦', icon: 'Bird' },
  { slug: 'knaagdieren', label: 'Knaagdieren', emoji: '🐹', icon: 'Rabbit' },
  { slug: 'vissen', label: 'Vissen', emoji: '🐠', icon: 'Fish' },
  { slug: 'reptielen', label: 'Reptielen', emoji: '🦎', icon: 'Snail' },
]
