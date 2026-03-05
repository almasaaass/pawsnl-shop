'use client'

import { Play, Eye, TrendingUp, ExternalLink } from 'lucide-react'
import { useInView } from '@/hooks/useInView'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

interface TikTokVideo {
  id: string
  productSlug: string
  productName: string
  thumbnail: string
  views: string
  hook: string
  format: string
}

// Top viral content formats per product — matched to actual Supabase slugs
const VIRAL_VIDEOS: TikTokVideo[] = [
  {
    id: '1',
    productSlug: 'automatische-kattenlaser-eindeloos-speelplezier',
    productName: 'Automatische Kattenlaser',
    thumbnail: '/tiktok/laser-toy.jpg',
    views: '1.8M',
    hook: 'Dit speelgoed houdt je kat de hele dag bezig',
    format: 'Problem → Solution',
  },
  {
    id: '2',
    productSlug: 'rups-speeltje-onvoorspelbaar-verslavend-voor-katten',
    productName: 'Rups Speeltje',
    thumbnail: '/tiktok/caterpillar.jpg',
    views: '5.1M',
    hook: 'Kijk hoe mijn kat reageert op deze rups',
    format: 'Pet Reaction',
  },
  {
    id: '3',
    productSlug: 'stille-kattenfontein-altijd-vers-gefilterd-water',
    productName: 'Stille Kattenfontein',
    thumbnail: '/tiktok/water-fountain.jpg',
    views: '3.2M',
    hook: 'Dierenarts zei dat mijn kat meer moest drinken',
    format: 'Vet Authority',
  },
  {
    id: '4',
    productSlug: 'kattenrugzak-met-kijkvenster-veilig-comfortabel-op-pad',
    productName: 'Kattenrugzak',
    thumbnail: '/tiktok/cat-backpack.jpg',
    views: '6.8M',
    hook: 'Ik nam mijn kat mee de stad in... iedereen keek',
    format: 'Storytelling',
  },
  {
    id: '5',
    productSlug: 'led-halsband-usb-zichtbaar-tot-500m-in-het-donker',
    productName: 'LED Halsband',
    thumbnail: '/tiktok/led-collar.jpg',
    views: '2.4M',
    hook: 'Nooit meer je hond kwijt in het donker',
    format: 'Before/After',
  },
  {
    id: '6',
    productSlug: 'zelfreinigende-kattenborstel-minder-haaruitval',
    productName: 'Zelfreinigende Borstel',
    thumbnail: '/tiktok/brush.jpg',
    views: '4.7M',
    hook: 'Zoveel haar... maar kijk hoe satisfying dit is',
    format: 'Satisfying',
  },
]

export default function TikTokShowcase() {
  const t = useTranslations('tiktokShowcase')
  const { ref, isInView } = useInView({ threshold: 0.1 })

  return (
    <section ref={ref} className="bg-charcoal py-16 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-10 ${isInView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48 6.3 6.3 0 001.86-4.49V8.87a8.28 8.28 0 004.84 1.56V6.96a4.84 4.84 0 01-1.12-.27z" />
            </svg>
            <span className="text-white font-semibold text-sm tracking-wide">{t('badge')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            {t('title')}
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            {t('subtitle')}
          </p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-accent-400" />
              <span className="text-accent-400 font-bold text-sm">{t('totalViews')}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-trust-400" />
              <span className="text-trust-400 font-bold text-sm">{t('trending')}</span>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {VIRAL_VIDEOS.map((video, i) => (
            <Link
              key={video.id}
              href={{ pathname: '/producten/[slug]', params: { slug: video.productSlug } }}
              className={`group relative block ${isInView ? `animate-fade-in-up stagger-${Math.min(i + 1, 8)}` : 'opacity-0'}`}
            >
              <div className="relative aspect-[9/16] bg-gray-800 rounded-2xl overflow-hidden">
                {/* Placeholder gradient — replace with actual thumbnails */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent-500/20 via-charcoal to-trust-500/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all">
                    <Play className="w-6 h-6 text-white ml-1" fill="white" />
                  </div>
                </div>

                {/* View count */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Eye className="w-3 h-3 text-white" />
                  <span className="text-white text-xs font-bold">{video.views}</span>
                </div>

                {/* Format badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-accent-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {video.format}
                  </span>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <p className="text-white text-xs font-medium line-clamp-2 mb-1">
                    {video.hook}
                  </p>
                  <p className="text-gray-300 text-[10px] truncate">
                    {video.productName}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className={`text-center mt-8 ${isInView ? 'animate-fade-in-up stagger-7' : 'opacity-0'}`}>
          <a
            href="https://www.tiktok.com/@pawsnl"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-charcoal font-semibold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48 6.3 6.3 0 001.86-4.49V8.87a8.28 8.28 0 004.84 1.56V6.96a4.84 4.84 0 01-1.12-.27z" />
            </svg>
            {t('followCta')}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
