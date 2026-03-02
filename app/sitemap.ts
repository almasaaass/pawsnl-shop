import { supabase } from '@/lib/supabase'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: products } = await supabase
    .from('products')
    .select('slug, created_at')

  const productUrls = (products || []).map((p) => ({
    url: `https://pawsshop.nl/producten/${p.slug}`,
    lastModified: new Date(p.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    { url: 'https://pawsshop.nl', lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: 'https://pawsshop.nl/producten', lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: 'https://pawsshop.nl/producten?categorie=honden', changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://pawsshop.nl/producten?categorie=katten', changeFrequency: 'weekly', priority: 0.8 },
    { url: 'https://pawsshop.nl/producten?categorie=vogels', changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://pawsshop.nl/producten?categorie=knaagdieren', changeFrequency: 'weekly', priority: 0.7 },
    { url: 'https://pawsshop.nl/contact', changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://pawsshop.nl/over-ons', changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://pawsshop.nl/veelgestelde-vragen', changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://pawsshop.nl/verzendbeleid', changeFrequency: 'monthly', priority: 0.3 },
    { url: 'https://pawsshop.nl/retourbeleid', changeFrequency: 'monthly', priority: 0.3 },
    { url: 'https://pawsshop.nl/privacybeleid', changeFrequency: 'monthly', priority: 0.3 },
    ...productUrls,
  ]
}
