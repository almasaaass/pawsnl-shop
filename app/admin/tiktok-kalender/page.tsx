'use client'

import { useState } from 'react'
import {
  Calendar,
  Hash,
  Users,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Film,
  Star,
  TrendingUp,
  Camera,
  Smile,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type VideoType = 'UGC' | 'Stock footage' | 'Product-only' | 'Meme'

interface CalendarDay {
  dag: number
  videoType: VideoType
  product: string
  hook: string
  hashtags: string[]
}

// ─── Content Distribution Constants ───────────────────────────────────────────

const TYPE_COLORS: Record<VideoType, string> = {
  UGC: 'bg-violet-100 text-violet-700 border-violet-200',
  'Stock footage': 'bg-blue-100 text-blue-700 border-blue-200',
  'Product-only': 'bg-amber-100 text-amber-700 border-amber-200',
  Meme: 'bg-pink-100 text-pink-700 border-pink-200',
}

const TYPE_BORDER: Record<VideoType, string> = {
  UGC: 'border-l-violet-500',
  'Stock footage': 'border-l-blue-500',
  'Product-only': 'border-l-amber-500',
  Meme: 'border-l-pink-500',
}

const TYPE_ICONS: Record<VideoType, React.ReactNode> = {
  UGC: <Camera className="w-3.5 h-3.5" />,
  'Stock footage': <Film className="w-3.5 h-3.5" />,
  'Product-only': <Star className="w-3.5 h-3.5" />,
  Meme: <Smile className="w-3.5 h-3.5" />,
}

// ─── 30-Day Calendar Data ─────────────────────────────────────────────────────
// Mix: 40% UGC (12 days), 30% Stock (9 days), 20% Product-only (6 days), 10% Meme (3 days)

const KALENDER: CalendarDay[] = [
  {
    dag: 1,
    videoType: 'UGC',
    product: 'Snuffle Mat',
    hook: '"Mijn hond was altijd té snel klaar met eten — totdat ik dit probeerde 🐶"',
    hashtags: ['#snufflemat', '#hondentips', '#pawsnl', '#hond', '#dierenwinkel', '#slowfeeder', '#hondenvideo'],
  },
  {
    dag: 2,
    videoType: 'Product-only',
    product: 'Floppy Fish',
    hook: '"De vis die mijn kat GEK maakt (en ik ook bijna) 🐟"',
    hashtags: ['#kattenspeelgoed', '#floppyfish', '#pawsnl', '#kat', '#katten', '#cattoy', '#kattenliefde'],
  },
  {
    dag: 3,
    videoType: 'Stock footage',
    product: 'Lick Mat',
    hook: '"Wist je dat 10 minuten likken je hond kalmeert zoals yoga jou kalmeert? 🧘"',
    hashtags: ['#lickmat', '#hond', '#hondentips', '#pawsnl', '#rustgevend', '#angstighond', '#dierenliefde'],
  },
  {
    dag: 4,
    videoType: 'UGC',
    product: 'Pootjesreiniger',
    hook: '"Stoppen met modderige vloeren! Dit deed ik en het werkt echt ✅"',
    hashtags: ['#pootjesreiniger', '#hond', '#hondenroutine', '#pawsnl', '#schoonhuis', '#hondenverzorging', '#tipsvoorhondenbaasjes'],
  },
  {
    dag: 5,
    videoType: 'Meme',
    product: 'Floppy Fish',
    hook: '"POV: je koopt een visspeeltje voor je kat maar jij bent degene die erop gaat letten 😂"',
    hashtags: ['#kattenmeme', '#kat', '#pawsnl', '#relatable', '#kattenbaasje', '#funnypets', '#dierenhumor'],
  },
  {
    dag: 6,
    videoType: 'UGC',
    product: 'Raam Hangmat',
    hook: '"Mijn kat slaapt nu 18 uur per dag — en ik ben JALOERS 😴"',
    hashtags: ['#kattenhangmat', '#raamhangmat', '#kat', '#pawsnl', '#kattenliefde', '#windowcat', '#katten'],
  },
  {
    dag: 7,
    videoType: 'Stock footage',
    product: 'LED Halsband',
    hook: '"Dit is waarom je hond \'s avonds wél zichtbaar moet zijn 🌙"',
    hashtags: ['#ledhalsband', '#hond', '#nachtlopen', '#pawsnl', '#hondenveiligheid', '#glowinthedarK', '#hondentips'],
  },
  {
    dag: 8,
    videoType: 'Product-only',
    product: 'Snuffle Mat',
    hook: '"3 redenen waarom dierenartsen de snuffle mat aanbevelen (nr 2 verraste mij)"',
    hashtags: ['#snufflemat', '#dierenarts', '#hond', '#pawsnl', '#mentaleactiviteit', '#hondentips', '#hersenspelletjes'],
  },
  {
    dag: 9,
    videoType: 'UGC',
    product: 'Koelvest',
    hook: '"Het was 32 graden buiten en mijn hond liep gewoon door — hier is mijn geheim ☀️"',
    hashtags: ['#koelvest', '#hond', '#zomer', '#pawsnl', '#hondenverzorging', '#warmeweer', '#hondentips'],
  },
  {
    dag: 10,
    videoType: 'Stock footage',
    product: 'Lick Mat',
    hook: '"Smeer dit erop en je hond staat 20 minuten stil tijdens het bad 🛁"',
    hashtags: ['#lickmat', '#hondenbad', '#badtijd', '#pawsnl', '#hondentips', '#trickster', '#hond'],
  },
  {
    dag: 11,
    videoType: 'UGC',
    product: 'Kattentunnel',
    hook: '"Ik gaf mijn kat een €200 krabpaal maar dit ding van €15 wint altijd 😅"',
    hashtags: ['#kattentunnel', '#kat', '#pawsnl', '#goedkoop', '#kattenspeelgoed', '#katten', '#kattenliefde'],
  },
  {
    dag: 12,
    videoType: 'Stock footage',
    product: 'Raam Hangmat',
    hook: '"Katten hebben dit nodig voor hun mentale gezondheid — geef jij het ze al?"',
    hashtags: ['#raamhangmat', '#kattengezondheid', '#kat', '#pawsnl', '#kattenliefde', '#verrijking', '#katten'],
  },
  {
    dag: 13,
    videoType: 'Meme',
    product: 'Snuffle Mat',
    hook: '"Hond 1 minuut voor eten: PANIEK. Hond met snuffle mat: filosoof 🧠"',
    hashtags: ['#hondenmeme', '#snufflemat', '#pawsnl', '#relatable', '#hond', '#dierenhumor', '#hondenbaasje'],
  },
  {
    dag: 14,
    videoType: 'UGC',
    product: 'Pootjesreiniger',
    hook: '"Test: Vuile hondenpoten in de pootjesreiniger — resultaat na 10 seconden"',
    hashtags: ['#pootjesreiniger', '#review', '#hond', '#pawsnl', '#eerlijk', '#test', '#hondenverzorging'],
  },
  {
    dag: 15,
    videoType: 'Product-only',
    product: 'LED Halsband',
    hook: '"5 kleuren, 3 lichtmodi en NOOIT meer je hond kwijt in het donker 🔦"',
    hashtags: ['#ledhalsband', '#hond', '#pawsnl', '#hondenproduct', '#review', '#nacht', '#hondenveiligheid'],
  },
  {
    dag: 16,
    videoType: 'UGC',
    product: 'Floppy Fish',
    hook: '"Dag 1 vs Dag 7 met de Floppy Fish: mijn kat is er nog steeds naar"',
    hashtags: ['#floppyfish', '#kat', '#pawsnl', '#week1', '#update', '#kattenspeelgoed', '#katten'],
  },
  {
    dag: 17,
    videoType: 'Stock footage',
    product: 'Koelvest',
    hook: '"Hittestress bij honden is gevaarlijker dan je denkt — dit is het signaal 🚨"',
    hashtags: ['#hittestress', '#hond', '#koelvest', '#pawsnl', '#hondengezondheid', '#zomer', '#hondentips'],
  },
  {
    dag: 18,
    videoType: 'UGC',
    product: 'Kattentunnel',
    hook: '"Ik liet mijn kat kiezen tussen tunnel en krabpaal — dit won 🏆"',
    hashtags: ['#kattentunnel', '#kat', '#pawsnl', '#kattenspeelgoed', '#katten', '#test', '#kattenliefde'],
  },
  {
    dag: 19,
    videoType: 'Product-only',
    product: 'Lick Mat',
    hook: '"Top 3 lick mat recepten die elke hond dol op is (nr 1 is té makkelijk)"',
    hashtags: ['#lickmat', '#recept', '#hond', '#pawsnl', '#hondentraktatie', '#diy', '#hondentips'],
  },
  {
    dag: 20,
    videoType: 'UGC',
    product: 'Snuffle Mat',
    hook: '"Mijn hyperactieve hond in de avond vs na 10 min snuffle mat 😱"',
    hashtags: ['#snufflemat', '#hyperactivehond', '#hond', '#pawsnl', '#kalmering', '#hondentips', '#energiebom'],
  },
  {
    dag: 21,
    videoType: 'Meme',
    product: 'Raam Hangmat',
    hook: '"Kat: ik heb overal plek om te slapen. Kat: [kiest de raamhangmat]"',
    hashtags: ['#raamhangmat', '#kattenmeme', '#kat', '#pawsnl', '#relatable', '#katten', '#dierenhumor'],
  },
  {
    dag: 22,
    videoType: 'Stock footage',
    product: 'Pootjesreiniger',
    hook: '"Hoeveel bacteriën brengt je hond per dag mee naar binnen? (het antwoord is vies)"',
    hashtags: ['#hondenhygiene', '#pootjesreiniger', '#pawsnl', '#feitje', '#hond', '#schoon', '#hondentips'],
  },
  {
    dag: 23,
    videoType: 'UGC',
    product: 'LED Halsband',
    hook: '"Avondwandeling met glowy hond: mensen dachten dat ik een UFO had 🛸"',
    hashtags: ['#ledhalsband', '#avondwandeling', '#hond', '#pawsnl', '#funny', '#nacht', '#hondenliefde'],
  },
  {
    dag: 24,
    videoType: 'Product-only',
    product: 'Floppy Fish',
    hook: '"Binnen 3 seconden actief: zo werkt de Floppy Fish motion sensor 🐟"',
    hashtags: ['#floppyfish', '#kattenspeelgoed', '#pawsnl', '#kat', '#review', '#motiontoy', '#katten'],
  },
  {
    dag: 25,
    videoType: 'UGC',
    product: 'Koelvest',
    hook: '"Ik testte het koelvest bij 30+ graden — dit is wat er echt gebeurde"',
    hashtags: ['#koelvest', '#hond', '#pawsnl', '#eerlijkereview', '#zomer', '#hondenverzorging', '#test'],
  },
  {
    dag: 26,
    videoType: 'Stock footage',
    product: 'Kattentunnel',
    hook: '"Waarom spelen essentieel is voor de gezondheid van je kat (niet alleen fun)"',
    hashtags: ['#kattenspeelgoed', '#kattenliefde', '#kattentunnel', '#pawsnl', '#kattengezondheid', '#kat', '#verrijking'],
  },
  {
    dag: 27,
    videoType: 'UGC',
    product: 'Snuffle Mat',
    hook: '"Puppy\'s eerste keer met de snuffle mat — pure chaos en geluk 🐾"',
    hashtags: ['#puppy', '#snufflemat', '#pawsnl', '#pup', '#firsttime', '#hond', '#babydog'],
  },
  {
    dag: 28,
    videoType: 'Stock footage',
    product: 'LED Halsband',
    hook: '"Elk jaar overlopen honden in het donker — dit is hoe je dat voorkomt"',
    hashtags: ['#hondenveiligheid', '#ledhalsband', '#pawsnl', '#bewustwording', '#hond', '#nacht', '#tips'],
  },
  {
    dag: 29,
    videoType: 'UGC',
    product: 'Lick Mat',
    hook: '"Badangst bij honden: de lick mat truc die écht werkt (getest door trainer)"',
    hashtags: ['#lickmat', '#badangst', '#hond', '#pawsnl', '#hondentraining', '#tips', '#hondentips'],
  },
  {
    dag: 30,
    videoType: 'Product-only',
    product: 'Koelvest',
    hook: '"Zomer-editie: de 5 must-haves voor jouw hond bij warm weer ☀️"',
    hashtags: ['#zomertips', '#hond', '#koelvest', '#pawsnl', '#hondenverzorging', '#warmeweer', '#musthave'],
  },
]

// ─── Influencers Data ─────────────────────────────────────────────────────────

interface Influencer {
  handle: string
  niche: string
  volgers: string
  platform: string
  geschikt: string
}

const INFLUENCERS: Influencer[] = [
  { handle: '@dutchpawlife', niche: 'Honden lifestyle', volgers: '8K–15K', platform: 'TikTok + IG', geschikt: 'UGC, reviews' },
  { handle: '@katten.nl.moments', niche: 'Katten dagboek', volgers: '5K–12K', platform: 'TikTok', geschikt: 'Product showcase' },
  { handle: '@pootjesavontuur', niche: 'Wandelen met hond', volgers: '10K–20K', platform: 'IG + TikTok', geschikt: 'LED Halsband, Koelvest' },
  { handle: '@fluffy_amsterdam', niche: 'Stadskat NL', volgers: '4K–9K', platform: 'TikTok', geschikt: 'Raam Hangmat, Tunnel' },
  { handle: '@dierenliefdenl', niche: 'Mixed pets', volgers: '15K–30K', platform: 'IG + TikTok', geschikt: 'Brand awareness' },
  { handle: '@hondenbaas_nl', niche: 'Honden training', volgers: '7K–18K', platform: 'TikTok', geschikt: 'Snuffle Mat, Lick Mat' },
  { handle: '@mijnkatmijnleven', niche: 'Kat humor', volgers: '6K–14K', platform: 'TikTok', geschikt: 'Meme content, Floppy Fish' },
  { handle: '@nederlandsedieren', niche: 'Educatief huisdier', volgers: '20K–40K', platform: 'YouTube + TikTok', geschikt: 'Stock-style content' },
  { handle: '@grotemuts_met_hond', niche: 'Grappig honden vlog', volgers: '3K–8K', platform: 'TikTok', geschikt: 'Meme, UGC' },
  { handle: '@kattenreddernl', niche: 'Rescue katten', volgers: '8K–22K', platform: 'IG + TikTok', geschikt: 'Hartverwarmende content' },
  { handle: '@hondenblog_nl', niche: 'Tips & advies hond', volgers: '5K–12K', platform: 'TikTok + Blog', geschikt: 'Informatieve videos' },
  { handle: '@tweekatten_amsterdam', niche: 'Katten duo vlog', volgers: '4K–10K', platform: 'TikTok', geschikt: 'Speelgoed tests' },
  { handle: '@pup.adventures.nl', niche: 'Puppy vlog NL', volgers: '6K–16K', platform: 'IG + TikTok', geschikt: 'Puppy producten' },
  { handle: '@hondentrainer_daily', niche: 'Trainingstips', volgers: '9K–25K', platform: 'TikTok', geschikt: 'Educatief + product' },
  { handle: '@kattenmama_rotterdam', niche: 'Huiskat momenten', volgers: '3K–7K', platform: 'TikTok', geschikt: 'Authentieke UGC' },
  { handle: '@dutchpetparent', niche: 'Lifestyle huisdier NL', volgers: '12K–28K', platform: 'IG + TikTok', geschikt: 'Bredere campagnes' },
  { handle: '@hondjevandeweek', niche: 'Community honden', volgers: '7K–20K', platform: 'TikTok', geschikt: 'UGC insturen campagne' },
  { handle: '@grappigstekatten', niche: 'Kat compilaties', volgers: '5K–15K', platform: 'TikTok', geschikt: 'Viral meme content' },
  { handle: '@hondenvoeding_nl', niche: 'Voeding & gezondheid', volgers: '4K–11K', platform: 'TikTok + Blog', geschikt: 'Lick Mat, Snuffle Mat' },
  { handle: '@stadshond_nl', niche: 'Hond in de stad', volgers: '6K–13K', platform: 'TikTok', geschikt: 'Pootjesreiniger, LED Halsband' },
]

// ─── Recommended Hashtags ─────────────────────────────────────────────────────

const HASHTAG_GROEPEN = [
  {
    label: 'Brand & winkel',
    kleur: 'violet',
    tags: ['#pawsnl', '#pawsshop', '#pawsshopnl', '#nederlandsedierenwinkel', '#dierenwinkel'],
  },
  {
    label: 'Honden algemeen',
    kleur: 'amber',
    tags: ['#hond', '#honden', '#hondenleven', '#hondenliefde', '#hondenbaasje', '#hondentips', '#hondenverzorging', '#hondenvideo'],
  },
  {
    label: 'Katten algemeen',
    kleur: 'purple',
    tags: ['#kat', '#katten', '#kattenliefde', '#kattenbaasje', '#kattenleven', '#kattenvideo', '#kattenmeme'],
  },
  {
    label: 'Producten',
    kleur: 'blue',
    tags: ['#snufflemat', '#lickmat', '#floppyfish', '#ledhalsband', '#koelvest', '#raamhangmat', '#pootjesreiniger', '#kattentunnel'],
  },
  {
    label: 'TikTok bereik NL',
    kleur: 'green',
    tags: ['#tiktok', '#tiktokdieren', '#tiktokhuisdieren', '#foryoupage', '#fyp', '#viral', '#nederland', '#nederlandstiktok'],
  },
  {
    label: 'Niche & educatief',
    kleur: 'rose',
    tags: ['#hondentraining', '#kattenverrijking', '#slowfeeder', '#kattengezondheid', '#hondengezondheid', '#mentaleactiviteit'],
  },
]

const KLEUR_MAP: Record<string, string> = {
  violet: 'bg-violet-50 text-violet-700 border border-violet-200',
  amber: 'bg-amber-50 text-amber-700 border border-amber-200',
  purple: 'bg-purple-50 text-purple-700 border border-purple-200',
  blue: 'bg-blue-50 text-blue-700 border border-blue-200',
  green: 'bg-green-50 text-green-700 border border-green-200',
  rose: 'bg-rose-50 text-rose-700 border border-rose-200',
}

// ─── UGC Tips ─────────────────────────────────────────────────────────────────

const UGC_TIPS = [
  { titel: 'Wees echt', omschrijving: 'UGC werkt omdat het authentiek is. Film met je telefoon, geen studio-look. Ruwe beelden converteren beter.' },
  { titel: 'Hook in 1-2 seconden', omschrijving: 'TikTok scrolt razendsnel. Je hook moet direct triggeren: vraag, schok, of grappige situatie.' },
  { titel: 'Zet ondertiteling aan', omschrijving: '85% kijkt zonder geluid. Gebruik TikTok auto-captions of voeg zelf tekst toe. Verplicht!' },
  { titel: 'Product altijd zichtbaar', omschrijving: 'Laat het product minimaal 50% van de video in beeld zijn. Soft sell: product IN de actie, niet ernaast.' },
  { titel: 'Varieer per dag', omschrijving: 'Mix UGC, Stock, Product-only en Meme. Dit houdt je feed gevarieerd en trekt verschillende doelgroepen.' },
  { titel: 'Creator brief meesturen', omschrijving: 'Geef micro-influencers een korte brief: product info, dos/don\'ts, jouw branding. Niet meer dan 1 A4.' },
  { titel: 'Hergebruik content', omschrijving: 'UGC van creators mag je (mits toestemming) herposten op je eigen account, in advertenties, op website.' },
  { titel: 'Vergoeding micro-influencers', omschrijving: 'Stuur producten gratis + geef 10% kortingscode. Voor grotere accounts (>10K): €50–€150 per post.' },
]

// ─── Sub Components ────────────────────────────────────────────────────────────

function DagRij({ item }: { item: CalendarDay }) {
  const [copied, setCopied] = useState(false)
  const [open, setOpen] = useState(false)

  function kopieer() {
    const tekst = `Dag ${item.dag} | ${item.videoType} | ${item.product}\nHook: ${item.hook}\nHashtags: ${item.hashtags.join(' ')}`
    navigator.clipboard.writeText(tekst)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`bg-white rounded-xl border border-gray-100 border-l-4 ${TYPE_BORDER[item.videoType]} shadow-sm overflow-hidden`}>
      {/* Row header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-3.5 flex items-center gap-4 hover:bg-gray-50 transition-colors"
      >
        {/* Dag badge */}
        <div className="flex-shrink-0 w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-700 text-sm">
          {item.dag}
        </div>

        {/* Type badge */}
        <span className={`flex-shrink-0 flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${TYPE_COLORS[item.videoType]}`}>
          {TYPE_ICONS[item.videoType]}
          {item.videoType}
        </span>

        {/* Product */}
        <span className="flex-1 text-sm font-semibold text-gray-800 min-w-0 truncate">{item.product}</span>

        {/* Hook preview */}
        <span className="hidden lg:block flex-1 text-sm text-gray-500 truncate min-w-0 max-w-xs">{item.hook}</span>

        {/* Actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0 ml-2">
          <button
            onClick={(e) => { e.stopPropagation(); kopieer() }}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
            title="Kopieer dag inhoud"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="px-5 pb-4 pt-3 border-t border-gray-100 space-y-3">
          {/* Hook */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Hook / Openingszin</p>
            <p className="text-sm text-gray-800 bg-gray-50 rounded-lg px-4 py-3 leading-relaxed border border-gray-100">
              {item.hook}
            </p>
          </div>
          {/* Hashtags */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Hashtags</p>
            <div className="flex flex-wrap gap-1.5">
              {item.hashtags.map((tag) => (
                <span key={tag} className="text-xs bg-violet-50 text-violet-700 border border-violet-100 px-2.5 py-1 rounded-full font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function TikTokKalenderPage() {
  const [filter, setFilter] = useState<VideoType | 'Alle'>('Alle')

  const gefilterd = filter === 'Alle' ? KALENDER : KALENDER.filter((d) => d.videoType === filter)

  // Stats
  const ugcCount = KALENDER.filter((d) => d.videoType === 'UGC').length
  const stockCount = KALENDER.filter((d) => d.videoType === 'Stock footage').length
  const productCount = KALENDER.filter((d) => d.videoType === 'Product-only').length
  const memeCount = KALENDER.filter((d) => d.videoType === 'Meme').length

  return (
    <div className="max-w-5xl mx-auto space-y-10">

      {/* ── Header ────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-pink-500" />
          TikTok Content Kalender
        </h1>
        <p className="text-gray-500 mt-1">
          30-dagenplan voor PawsNL — mix van UGC, Stock footage, Product-only en Meme content
        </p>
      </div>

      {/* ── Stats strip ────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'UGC', count: ugcCount, pct: '40%', kleur: 'violet', icon: <Camera className="w-4 h-4" /> },
          { label: 'Stock footage', count: stockCount, pct: '30%', kleur: 'blue', icon: <Film className="w-4 h-4" /> },
          { label: 'Product-only', count: productCount, pct: '20%', kleur: 'amber', icon: <Star className="w-4 h-4" /> },
          { label: 'Meme', count: memeCount, pct: '10%', kleur: 'pink', icon: <Smile className="w-4 h-4" /> },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center bg-${s.kleur}-100 text-${s.kleur}-600`}>
              {s.icon}
            </div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="font-bold text-gray-900">{s.count} <span className="font-normal text-gray-400 text-xs">dagen ({s.pct})</span></p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Calendar section ───────────────────────────────────── */}
      <div>
        {/* Filter bar */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <span className="text-sm text-gray-500 font-medium mr-1">Filter:</span>
          {(['Alle', 'UGC', 'Stock footage', 'Product-only', 'Meme'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors border ${
                filter === type
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-900'
              }`}
            >
              {type}
            </button>
          ))}
          <span className="ml-auto text-xs text-gray-400">{gefilterd.length} van 30 dagen</span>
        </div>

        {/* Column headers */}
        <div className="hidden sm:grid grid-cols-[2.5rem_7rem_1fr_2fr] gap-4 px-5 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
          <span>Dag</span>
          <span>Type</span>
          <span>Product</span>
          <span className="hidden lg:block">Hook preview</span>
        </div>

        {/* Calendar rows */}
        <div className="space-y-2">
          {gefilterd.map((item) => (
            <DagRij key={item.dag} item={item} />
          ))}
        </div>
      </div>

      {/* ── Micro-influencers section ──────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Users className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-bold text-gray-900">NL Huisdier Micro-influencers</h2>
          <span className="text-xs text-gray-400 ml-1">(generieke voorbeelden — niet echte accounts)</span>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-3 mb-4 text-sm text-blue-800">
          <strong>Strategie:</strong> Micro-influencers (1K–30K) hebben hogere engagement en goedkopere deals dan grote accounts.
          Stuur gratis product + unieke kortingscode (bijv. <code className="bg-blue-100 px-1 rounded">NAAM10</code>) — track conversies via Stripe.
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Handle</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Niche</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Volgers</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Platform</th>
                <th className="text-left py-2.5 px-4 text-xs font-semibold text-gray-400 uppercase tracking-wide">Geschikt voor</th>
              </tr>
            </thead>
            <tbody>
              {INFLUENCERS.map((inf, i) => (
                <tr key={inf.handle} className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                  <td className="py-2.5 px-4 font-mono text-blue-700 font-medium text-xs">{inf.handle}</td>
                  <td className="py-2.5 px-4 text-gray-700">{inf.niche}</td>
                  <td className="py-2.5 px-4">
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full font-medium">{inf.volgers}</span>
                  </td>
                  <td className="py-2.5 px-4 text-gray-500 text-xs">{inf.platform}</td>
                  <td className="py-2.5 px-4 text-gray-600 text-xs">{inf.geschikt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── UGC Creator Tips ───────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h2 className="text-lg font-bold text-gray-900">UGC Creator Tips</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {UGC_TIPS.map((tip, i) => (
            <div key={tip.titel} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm flex gap-3">
              <div className="flex-shrink-0 w-7 h-7 bg-amber-100 text-amber-700 rounded-lg flex items-center justify-center text-xs font-bold">
                {i + 1}
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">{tip.titel}</p>
                <p className="text-sm text-gray-500 mt-0.5 leading-relaxed">{tip.omschrijving}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Aanbevolen Hashtags ────────────────────────────────── */}
      <div>
        <div className="flex items-center gap-2 mb-5">
          <Hash className="w-5 h-5 text-violet-500" />
          <h2 className="text-lg font-bold text-gray-900">Aanbevolen Hashtags per Categorie</h2>
        </div>

        <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-3 mb-4 text-sm text-gray-600">
          <strong>Richtlijn:</strong> Gebruik 5–8 hashtags per video. Combineer altijd 1–2 brand-hashtags + 2–3 niche-hashtags + 1–2 brede hashtags.
          Vermijd &gt;10 hashtags — dat kan de distributie beperken.
        </div>

        <div className="space-y-4">
          {HASHTAG_GROEPEN.map((groep) => (
            <div key={groep.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{groep.label}</p>
              <div className="flex flex-wrap gap-2">
                {groep.tags.map((tag) => (
                  <span key={tag} className={`text-xs px-2.5 py-1 rounded-full font-medium ${KLEUR_MAP[groep.kleur]}`}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Best practices footer ──────────────────────────────── */}
      <div className="bg-gradient-to-br from-pink-500 via-rose-500 to-orange-400 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5" />
          <h3 className="font-bold text-lg">TikTok Best Practices voor PawsNL</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-3 text-sm text-pink-50">
          {[
            ['Beste posttijden', '07:00–09:00, 12:00–14:00, 19:00–21:00 (NL tijd)'],
            ['Frequentie', 'Minimaal 1x per dag posten — consistentie wint van perfectie'],
            ['Video lengte', '15–30 sec voor memes & product-only, 30–60 sec voor UGC & educatief'],
            ['Trending audio', 'Gebruik TikTok trending sounds — verhoogt organisch bereik tot 3x'],
            ['Reageer op comments', 'Eerste uur na posten ALLE comments beantwoorden voor algoritme boost'],
            ['Stitch & Duet', 'Reageer op populaire huisdier-videos via Stitch — gratis bereik'],
            ['CTA in video', 'Zeg altijd "link in bio" en zet Linktree op je profiel met shop-link'],
            ['Analytics checken', 'Elke maandag: bekijk wat werkte, schaal de formats die het doen'],
          ].map(([titel, tekst]) => (
            <div key={titel} className="flex gap-2 items-start">
              <span className="flex-shrink-0 w-1.5 h-1.5 bg-white rounded-full mt-1.5" />
              <div>
                <span className="font-semibold text-white">{titel}: </span>
                <span>{tekst}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom spacing */}
      <div className="h-4" />
    </div>
  )
}
