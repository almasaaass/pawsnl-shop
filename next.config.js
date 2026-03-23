const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cbu01.alicdn.com',
      },
      {
        protocol: 'https',
        hostname: '*.cjdropshipping.com',
      },
      {
        protocol: 'https',
        hostname: 'cc-west-usa.oss-us-west-1.aliyuncs.com',
      },
      {
        protocol: 'https',
        hostname: 'mumuorbsfiklktwqtveb.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.aliexpress.com',
      },
      {
        protocol: 'https',
        hostname: '*.alicdn.com',
      },
    ],
  },
}

module.exports = withNextIntl(nextConfig)
