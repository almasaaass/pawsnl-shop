// Centralized list of TikTok trending products
// Used by both server and client components

export const TRENDING_SLUGS: Record<string, { views: string }> = {
  'automatische-kattenlaser-eindeloos-speelplezier': { views: '1.8M' },
  'stille-kattenfontein-altijd-vers-gefilterd-water': { views: '3.2M' },
  'kattenrugzak-met-kijkvenster-veilig-comfortabel-op-pad': { views: '6.8M' },
  'rups-speeltje-onvoorspelbaar-verslavend-voor-katten': { views: '5.1M' },
  'zelfreinigende-kattenborstel-minder-haaruitval': { views: '4.7M' },
  'kattentunnel-3-weg-verstoppen-rennen-spelen': { views: '2.1M' },
  'led-halsband-usb-zichtbaar-tot-500m-in-het-donker': { views: '2.4M' },
  'elektrische-kattenmassage-pure-ontspanning': { views: '1.5M' },
  'slangen-speeltje-interactief-automatisch': { views: '3.8M' },
  'koelvest-voor-honden-verkoeling-op-warme-dagen': { views: '1.2M' },
  'honden-pootjesreiniger-2-in-1': { views: '2.9M' },
  'draagbare-honden-waterfles-drinken-onderweg': { views: '1.6M' },
}

export function isTrendingOnTikTok(slug: string): boolean {
  return slug in TRENDING_SLUGS
}

export function getTrendingViews(slug: string): string | null {
  return TRENDING_SLUGS[slug]?.views ?? null
}
