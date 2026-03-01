import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string
  name: string
  price: number
  compare_price: number | null
  description: string
  category: string
  images: string[]
}

interface TikTokScript {
  day: string
  format: string
  product: string
  category: string
  hook: string
  script: string
  cta: string
  hashtags: string[]
  filmtips: string[]
  duration: string
}

// ─── Script formats ───────────────────────────────────────────────────────────

type ScriptFormat = 'pov' | 'educational' | 'review' | 'problem_solution' | 'trending' | 'unboxing' | 'top3'

const DAYS = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag']

const FORMATS: ScriptFormat[] = [
  'pov',
  'problem_solution',
  'educational',
  'review',
  'trending',
  'unboxing',
  'top3',
]

// ─── Hooks per categorie ──────────────────────────────────────────────────────

function getHooks(product: Product): string[] {
  const { name, category, compare_price, price } = product
  const discount = compare_price ? Math.round(((compare_price - price) / compare_price) * 100) : 0

  const hooksMap: Record<string, string[]> = {
    honden: [
      `Dit veranderde mijn leven als hondenbaasje voor altijd 🐶`,
      `Mijn hond FLIPT uit elke keer dat ik dit pak 😂`,
      `Als jouw hond dit nog niet heeft, mis je écht iets`,
      `Hoe ik het trekken aan de riem in 3 dagen stopte ✅`,
      `Dit is waarom mijn hond de beste verzorgd is in de buurt 💅`,
    ],
    katten: [
      `Mijn kat gebruikt dit de hele dag — en ik snap waarom 🐱`,
      `Dit catproduct heeft mijn leven veranderd (geen grap)`,
      `POV: je kat wil NOOIT meer stoppen met spelen`,
      `Dit is het enige kattenspeelgoed dat mijn kat wél leuk vindt`,
      `Waarom iedere kattenbaasje dit in huis zou moeten hebben`,
    ],
    vogels: [
      `Mijn vogel werd zoveel gelukkiger na dit ding 🐦`,
      `Dit vergat ik 3 jaar te kopen als vogelbaasje...`,
    ],
    knaagdieren: [
      `Mijn hamster heeft nu het luxe leven dat hij verdient 🐹`,
      `Dit maakte mijn knaagdier 10x gelukkiger`,
    ],
    vissen: [
      `Mijn aquarium ziet er nu uit als een professionele setup 🐟`,
      `Dit heeft mijn vissen echt blij gemaakt`,
    ],
  }

  const discountHooks = discount >= 20
    ? [`${discount}% korting op dit product — maar niet voor lang ⚡`]
    : []

  return [...(hooksMap[category] ?? hooksMap.honden), ...discountHooks]
}

// ─── Script generator per format ─────────────────────────────────────────────

function generateScript(product: Product, format: ScriptFormat, dayIndex: number): TikTokScript {
  const hooks = getHooks(product)
  const hook = hooks[dayIndex % hooks.length]
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0
  const priceStr = `€${product.price.toFixed(2).replace('.', ',')}`
  const url = 'pawsshop.nl'

  const animalEmoji: Record<string, string> = {
    honden: '🐶', katten: '🐱', vogels: '🐦', knaagdieren: '🐹', vissen: '🐟',
  }
  const emoji = animalEmoji[product.category] ?? '🐾'

  const scripts: Record<ScriptFormat, { script: string; filmtips: string[]; duration: string }> = {

    pov: {
      script: `[Tekst op scherm: "${hook}"]

Serieus, luister even.

Ik heb de ${product.name} gekocht voor mijn ${product.category.slice(0, -2)} en ik ga je precies laten zien waarom dit een gamechanger is.

[Laat het product zien vanuit je hand]

Kijk. Dit is 'm. ${product.name}.

[Demonstreer het product 10-15 seconden]

Zie je dit? Mijn ${product.category.slice(0, -2)} went er binnen 5 minuten aan. En dat is normaal — want dit is echt goed ontworpen.

Voor ${priceStr}${discount > 0 ? ` (was ${product.compare_price ? '€' + product.compare_price.toFixed(2).replace('.', ',') : ''})` : ''} is dit echt een no-brainer.

Link in bio! ⬆️`,
      filmtips: [
        'Film in portretmodus (9:16) met goede belichting',
        'Begin met close-up van het product in je hand',
        'Laat je huisdier reageren op het product',
        'Voeg trending geluid toe uit TikTok bibliotheek',
      ],
      duration: '30-45 seconden',
    },

    problem_solution: {
      script: `[Begin met probleem — kijk gefrustreerd in camera]

Okaaay. Ik was het ZAT.

[Vertel het probleem in 5-10 sec]
${product.category === 'honden'
  ? 'Mijn hond trok altijd aan de riem, blafte continu, of verveelde zich de hele dag. Niemand vertelde me wat ik moest doen.'
  : 'Mijn kat was altijd chagrijnig, verveeld, of dronk te weinig water. Tot ik dit vond.'}

[Dramatische pauze — houd product op]

TOT. IK. DIT. VOND.

[Laat product zien — enthousiastisch]

De ${product.name}. Dit lost het probleem letterlijk op.

[Demonstreer 10-15 seconden]

En nu? Geen probleem meer. Echt niet. Mijn ${product.category.slice(0, -2)} is zo veel gelukkiger ${emoji}

Staat in de link in mijn bio voor maar ${priceStr}!`,
      filmtips: [
        'Maak een "before/after" sfeer — begin chagrijnig, eindig blij',
        'Gebruik split-screen effect als je dat kunt',
        'Film je huisdier tijdens gebruik van het product',
        'Trending geluid: zoek op "problem solution" in TikTok',
      ],
      duration: '30-60 seconden',
    },

    educational: {
      script: `[Tekst op scherm: "3 dingen die ik wens dat ik wist als ${product.category.slice(0, -2)}baasje"]

Nummer 1 ${emoji}

[Vertel tip 1 — gerelateerd aan het product]
${product.category === 'honden'
  ? 'Honden hebben dagelijks mentale én fysieke stimulatie nodig. Zonder dat worden ze destructief.'
  : 'Katten drinken van nature liever bewegend water. Stagnant water drinken ze minder — en dat veroorzaakt nierproblemen.'}

Nummer 2 🎯

[Vertel tip 2]
De meeste baasjes besteden te weinig aan goede verzorging. Maar goedkoop = duurkoop bij je huisdier.

Nummer 3 ✅

[Introduceer product als oplossing]
Daarom gebruik ik de ${product.name}. Dit lost precies dat probleem op — voor ${priceStr}.

Sla dit op voor later! 🔖 En link in bio.`,
      filmtips: [
        'Gebruik tekst-overlays op elk punt (1, 2, 3)',
        'Spreek duidelijk en snel — TikTok publiek haakt af bij te veel pauzes',
        'Zet captions aan in TikTok voor meer bereik',
        'Thumbnail: gebruik het getal "3" of een emoji',
      ],
      duration: '45-60 seconden',
    },

    review: {
      script: `[Houd product op naar camera]

Eerlijke review van de ${product.name} — na 2 weken gebruik.

[Laat product van alle kanten zien]

Ik heb dit product ${product.compare_price ? `voor ${priceStr} gekocht (normaal €${product.compare_price.toFixed(2).replace('.', ',')})` : `voor ${priceStr} gekocht`} en hier is wat ik vind:

DE GOEDE DINGEN: ${emoji}
[Noem 3 positieve punten]
✅ Mijn ${product.category.slice(0, -2)} is er dol op
✅ Makkelijk te gebruiken
✅ Goede kwaliteit voor de prijs

VERBETERPUNTEN:
[Noem eerlijk 1 klein minpuntje — maakt je geloofwaardiger]
⚠️ De verpakking had handiger gekund

Mijn verdict: 9/10 — absoluut een aanrader voor elk ${product.category.slice(0, -2)}baasje!

Link in bio 🔗`,
      filmtips: [
        'Gebruik thumbs up/down gebaren voor de review',
        'Film van dichtbij tijdens de productdetails',
        'Wees eerlijk — authentieke reviews doen het beter op TikTok',
        'Voeg "sterren" animatie toe in bewerking',
      ],
      duration: '45-60 seconden',
    },

    trending: {
      script: `[Open met trending geluid — begin direct met actie]

Dingen die leven veranderden in ${new Date().getFullYear()}:

[Lijst opbouwen — snel knippen]
🧴 Mijn nieuwe huidverzorging...
📱 Mijn nieuwe telefoon...
🐾 De ${product.name} voor mijn ${product.category.slice(0, -2)}...

[Close-up van blij huisdier met product]

Dat laatste is veruit het beste. Geen discussie. ${emoji}

Mijn ${product.category.slice(0, -2)} is er GEK op en ik betaalde maar ${priceStr}.

Link in mijn bio als je het wilt weten 🔗`,
      filmtips: [
        'Kies een trending geluid dat op dit moment viral gaat',
        'Film in hoog tempo — snel knippen per item',
        'Gebruik CapCut-templaten voor dit soort "lijst" video\'s',
        'Voeg sticker-animaties toe voor extra engagement',
      ],
      duration: '15-30 seconden',
    },

    unboxing: {
      script: `[Film de doos/verpakking — opwinding in stem]

Mijn nieuwe bestelling is binnen! Laten we unboxen 📦

[Open de verpakking langzaam en duidelijk]

Okaaay, dit is 'm. De ${product.name}.

[Haal product eruit — laat zien]

Oh wow, de kwaliteit ziet er goed uit! Kijk naar dit...

[Detailopnames — textures, materialen, afmetingen]

En dan nu de echte test — wat vindt mijn ${product.category.slice(0, -2)} ervan? ${emoji}

[Film de reactie van je huisdier]

[Positieve reactie]: JA! Geslaagd! Dit was ${priceStr} heel goed besteed.

Wil je ook? Link in mijn bio! ⬆️`,
      filmtips: [
        'Film alles in één take voor authenticiteit',
        'Zorg voor goede belichting — daglicht werkt het beste',
        'Film de reactie van je huisdier — dat is de beste content',
        'Voeg "unboxing" en "haul" toe aan je hashtags',
      ],
      duration: '45-90 seconden',
    },

    top3: {
      script: `[Tekst op scherm: "Top 3 producten voor ${product.category.slice(0, -2)}baasjes in ${new Date().getFullYear()}"]

Nummer 3 ${emoji}
[Noem een ander product uit dezelfde categorie]

Nummer 2 🥈
[Noem een tweede product]

Maar nummer 1? Dit wint altijd.

[Dramatische intro van het product]

De ${product.name}.

[Demonstreer 15-20 seconden enthousiast]

Voor ${priceStr} is dit het beste wat je kunt kopen voor je ${product.category.slice(0, -2)}.

Alle producten staan via de link in mijn bio 🔗 Sla dit op! 🔖`,
      filmtips: [
        'Gebruik countdown-animatie (3-2-1) in CapCut',
        'Zorg dat product #1 de meeste schermtijd krijgt',
        'Sluit af met een duidelijke CTA naar je bio-link',
        'Sla trending "countdown" geluiden op in je TikTok favorieten',
      ],
      duration: '30-60 seconden',
    },
  }

  const s = scripts[format]

  const hashtagsBase = ['#huisdier', '#dierenliefhebber', '#pawsnl', '#petlover']
  const hashtagsCat: Record<string, string[]> = {
    honden: ['#hond', '#hondenbaasje', '#hondentiktok', '#dogmom', '#dogdad', '#hondenverzorging'],
    katten: ['#kat', '#kattenbaasje', '#cattok', '#catsoftiktok', '#kattenliefde'],
    vogels: ['#vogel', '#vogelbaasje', '#birdtok'],
    knaagdieren: ['#hamster', '#knaagdier', '#hamsterlife'],
    vissen: ['#aquarium', '#vissen', '#fishkeeper'],
  }
  const hashtagsFormat: Record<ScriptFormat, string[]> = {
    pov: ['#pov', '#povvideo'],
    problem_solution: ['#probleem', '#oplossing', '#tip'],
    educational: ['#leertiktok', '#tips', '#didyouknow'],
    review: ['#review', '#ehrlijkereview', '#productreview'],
    trending: ['#trending', '#fyp', '#viral'],
    unboxing: ['#unboxing', '#haul', '#nieuw'],
    top3: ['#top3', '#musthave', '#aanbeveling'],
  }

  const hashtags = [
    ...hashtagsBase,
    ...(hashtagsCat[product.category] ?? []),
    ...hashtagsFormat[format],
    '#fyp',
  ]

  const formatNames: Record<ScriptFormat, string> = {
    pov: 'POV Video',
    problem_solution: 'Probleem & Oplossing',
    educational: 'Educatief (Top 3 tips)',
    review: 'Eerlijke Review',
    trending: 'Trending Format',
    unboxing: 'Unboxing Video',
    top3: 'Top 3 Producten',
  }

  return {
    day: DAYS[dayIndex],
    format: formatNames[format],
    product: product.name,
    category: product.category,
    hook,
    script: s.script,
    cta: `🔗 Link in bio → ${url}`,
    hashtags,
    filmtips: s.filmtips,
    duration: s.duration,
  }
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET() {
  const cookieStore = cookies()
  const authCookie = cookieStore.get('admin-auth')
  if (authCookie?.value !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, compare_price, description, category, images')
    .order('created_at', { ascending: false })

  if (!products || products.length === 0) {
    return NextResponse.json({ error: 'Geen producten gevonden' }, { status: 404 })
  }

  // Kies 7 producten — verspreid over categorieën zoveel mogelijk
  const shuffled = [...products].sort(() => Math.random() - 0.5)
  const selected: Product[] = []
  const usedCategories = new Set<string>()

  // Eerst: 1 per categorie
  for (const p of shuffled) {
    if (!usedCategories.has(p.category) && selected.length < 7) {
      selected.push(p)
      usedCategories.add(p.category)
    }
  }

  // Aanvullen tot 7 als er minder categorieën zijn
  for (const p of shuffled) {
    if (selected.length >= 7) break
    if (!selected.find((s) => s.id === p.id)) selected.push(p)
  }

  const scripts: TikTokScript[] = selected.slice(0, 7).map((product, i) =>
    generateScript(product, FORMATS[i % FORMATS.length], i)
  )

  return NextResponse.json({ scripts, generatedAt: new Date().toISOString() })
}
