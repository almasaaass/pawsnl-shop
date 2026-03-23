'use client'

import { Play, Eye, ExternalLink } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import ScrollReveal from '@/components/ui/ScrollReveal'

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

  return (
    <section className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal animation="fade-up">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tight mb-3">
              {t('title')}
            </h2>
            <p className="text-[#6e6e73] text-lg max-w-xl mx-auto mb-6">
              {t('subtitle')}
            </p>
            <div className="flex items-center justify-center gap-8">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#86868b]" />
                <span className="text-[#1d1d1f] font-semibold text-sm">{t('totalViews')}</span>
              </div>
              <div className="text-[#e8e8ed]">|</div>
              <div className="flex items-center gap-2">
                <span className="text-[#1d1d1f] font-semibold text-sm">{t('trending')}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Video Grid */}
        <ScrollReveal
          animation="fade-up"
          stagger
          staggerDelay={80}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {VIRAL_VIDEOS.map((video) => (
            <Link
              key={video.id}
              href={{ pathname: '/producten/[slug]', params: { slug: video.productSlug } }}
              className="group relative block"
            >
              <div className="relative aspect-[9/16] bg-[#f5f5f7] rounded-[20px] overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
                {/* Placeholder background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#e8e8ed] to-[#d2d2d7]" />

                {/* Play button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
                    <Play className="w-5 h-5 text-[#1d1d1f] ml-0.5" fill="#1d1d1f" />
                  </div>
                </div>

                {/* View count */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  <Eye className="w-3 h-3 text-[#1d1d1f]" />
                  <span className="text-[#1d1d1f] text-xs font-semibold">{video.views}</span>
                </div>

                {/* Format badge */}
                <div className="absolute top-3 left-3">
                  <span className="bg-[#1d1d1f] text-white text-[10px] font-semibold px-2.5 py-1 rounded-full">
                    {video.format}
                  </span>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                  <p className="text-white text-xs font-medium line-clamp-2 mb-1">
                    {video.hook}
                  </p>
                  <p className="text-white/70 text-[11px] truncate">
                    {video.productName}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </ScrollReveal>

        {/* CTA */}
        <ScrollReveal animation="fade-up" delay={300}>
          <div className="text-center mt-12">
            <a
              href="https://www.tiktok.com/@pawsnl"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-[#1d1d1f] text-white font-medium py-3 px-7 rounded-full hover:bg-[#333336] transition-colors duration-200"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.48 6.3 6.3 0 001.86-4.49V8.87a8.28 8.28 0 004.84 1.56V6.96a4.84 4.84 0 01-1.12-.27z" />
              </svg>
              {t('followCta')}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
