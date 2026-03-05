import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/bevestiging'],
    },
    sitemap: 'https://pawsnlshop.com/sitemap.xml',
  }
}
