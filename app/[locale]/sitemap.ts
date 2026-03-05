import { supabase } from '@/lib/supabase'
import { MetadataRoute } from 'next'

const BASE = 'https://pawsnlshop.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: products } = await supabase
    .from('products')
    .select('slug, created_at')

  // Dutch product URLs
  const nlProductUrls = (products || []).map((p) => ({
    url: `${BASE}/producten/${p.slug}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
    alternates: {
      languages: {
        nl: `${BASE}/producten/${p.slug}`,
        en: `${BASE}/en/products/${p.slug}`,
      },
    },
  }))

  // English product URLs
  const enProductUrls = (products || []).map((p) => ({
    url: `${BASE}/en/products/${p.slug}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
    alternates: {
      languages: {
        nl: `${BASE}/producten/${p.slug}`,
        en: `${BASE}/en/products/${p.slug}`,
      },
    },
  }))

  // Static pages mapping: [nlPath, enPath, changeFreq, priority]
  const staticPages: [string, string, 'daily' | 'weekly' | 'monthly', number][] = [
    ['', '', 'daily', 1.0],
    ['/producten', '/en/products', 'daily', 0.9],
    ['/producten?categorie=honden', '/en/products?categorie=honden', 'weekly', 0.8],
    ['/producten?categorie=katten', '/en/products?categorie=katten', 'weekly', 0.8],
    ['/producten?categorie=vogels', '/en/products?categorie=vogels', 'weekly', 0.7],
    ['/producten?categorie=knaagdieren', '/en/products?categorie=knaagdieren', 'weekly', 0.7],
    ['/producten?categorie=vissen', '/en/products?categorie=vissen', 'weekly', 0.7],
    ['/contact', '/en/contact', 'monthly', 0.5],
    ['/over-ons', '/en/about', 'monthly', 0.5],
    ['/veelgestelde-vragen', '/en/faq', 'monthly', 0.5],
    ['/bundels', '/en/bundles', 'monthly', 0.5],
    ['/verzendbeleid', '/en/shipping', 'monthly', 0.3],
    ['/retourbeleid', '/en/returns', 'monthly', 0.3],
    ['/privacybeleid', '/en/privacy', 'monthly', 0.3],
    ['/klachtenprocedure', '/en/complaints', 'monthly', 0.3],
    ['/track', '/en/track', 'monthly', 0.3],
  ]

  const staticUrls = staticPages.flatMap(([nlPath, enPath, changeFrequency, priority]) => [
    {
      url: `${BASE}${nlPath}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
      alternates: {
        languages: {
          nl: `${BASE}${nlPath}`,
          en: `${BASE}${enPath}`,
        },
      },
    },
    {
      url: `${BASE}${enPath}`,
      lastModified: new Date(),
      changeFrequency,
      priority: Math.max(0.1, priority - 0.1),
      alternates: {
        languages: {
          nl: `${BASE}${nlPath}`,
          en: `${BASE}${enPath}`,
        },
      },
    },
  ])

  return [
    ...staticUrls,
    ...nlProductUrls,
    ...enProductUrls,
  ]
}
