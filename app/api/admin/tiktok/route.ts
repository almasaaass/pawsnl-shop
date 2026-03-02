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
  retain: string
  reward: string
  hashtags: string[]
  filmtips: { hook: string[]; retain: string[]; reward: string[] }
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

// ─── Hormozi-stijl hooks (0-3 sec) ──────────────────────────────────────────

function getHooks(product: Product): string[] {
  const { category, compare_price, price } = product
  const discount = compare_price ? Math.round(((compare_price - price) / compare_price) * 100) : 0
  const priceStr = `€${price.toFixed(2).replace('.', ',')}`
  const savingsPerYear = Math.round(price * 3)

  // Hormozi-stijl openers — pattern interrupts
  const hormoziHooks = [
    `STOP! Als je een ${category.slice(0, -2)} hebt MOET je dit zien`,
    `Ik wou dat iemand mij dit eerder had verteld over dit product`,
    `Dit kost ${priceStr} maar bespaart je €${savingsPerYear} per jaar`,
    `De #1 fout die ${category}baasjes maken (en hoe je het fixt)`,
    `Ik heb €500+ uitgegeven aan ${category}producten. Dit is de ENIGE die werkt`,
  ]

  const categoryHooks: Record<string, string[]> = {
    honden: [
      `Elke dierenarts raadt dit aan maar niemand vertelt je waarom 🐶`,
      `Mijn hond FLIPT uit elke keer dat ik dit pak`,
      `97% van hondenbaasjes weet dit niet over hun hond`,
    ],
    katten: [
      `Je kat haat je in stilte als je dit niet hebt 🐱`,
      `POV: je kat wil NOOIT meer stoppen met spelen`,
      `Dit is waarom je kat 's nachts zo raar doet`,
    ],
    vogels: [
      `Mijn vogel werd zoveel gelukkiger na dit ding 🐦`,
      `Vogelbaasjes slaan dit ALTIJD over (grote fout)`,
    ],
    knaagdieren: [
      `Je knaagdier verdient beter dan wat je nu hebt 🐹`,
      `Dit maakte mijn knaagdier 10x gelukkiger`,
    ],
    vissen: [
      `Je aquarium mist dit ene ding 🐟`,
      `Professionele aquariumhouders zweren bij dit product`,
    ],
  }

  const discountHooks = discount >= 20
    ? [`${discount}% korting — maar ALLEEN deze week ⚡`]
    : []

  return [...hormoziHooks, ...(categoryHooks[category] ?? []), ...discountHooks]
}

// ─── Script generator: Hook → Retain → Reward ──────────────────────────────

function generateScript(product: Product, format: ScriptFormat, dayIndex: number): TikTokScript {
  const hooks = getHooks(product)
  const hook = hooks[dayIndex % hooks.length]
  const discount = product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : 0
  const priceStr = `€${product.price.toFixed(2).replace('.', ',')}`
  const compareStr = product.compare_price ? `€${product.compare_price.toFixed(2).replace('.', ',')}` : ''
  const url = 'pawsshop.nl'
  const animal = product.category.slice(0, -2)

  const animalEmoji: Record<string, string> = {
    honden: '🐶', katten: '🐱', vogels: '🐦', knaagdieren: '🐹', vissen: '🐟',
  }
  const emoji = animalEmoji[product.category] ?? '🐾'

  interface ScriptParts {
    retain: string
    reward: string
    filmtips: { hook: string[]; retain: string[]; reward: string[] }
    duration: string
  }

  const scripts: Record<ScriptFormat, ScriptParts> = {

    pov: {
      retain: `[Tekst op scherm: "${hook}"]

Serieus, luister even. Ik heb de ${product.name} gekocht voor mijn ${animal} en ik ga je precies laten zien waarom dit een gamechanger is.

[Laat het product zien vanuit je hand]

Kijk. Dit is 'm. ${product.name}.

[Demonstreer het product 10-15 seconden — laat details zien]

Zie je dit? Mijn ${animal} went er binnen 5 minuten aan. En dat is normaal — want dit is echt goed ontworpen.

[Laat reactie van je huisdier zien]

Het verschil met andere producten? Dit gaat ECHT lang mee. Ik gebruik het nu al weken en het ziet er nog als nieuw uit.

Voor ${priceStr}${discount > 0 ? ` (was ${compareStr})` : ''} is dit echt een no-brainer.`,
      reward: `[Kijk in camera — urgentie]

Link in mijn bio! ⬆️ En volg voor meer ${animal}tips — ik test elke week nieuwe producten.

${discount > 0 ? `LET OP: die ${discount}% korting is tijdelijk!` : 'Dit product is regelmatig uitverkocht, dus wees er snel bij.'}`,
      filmtips: {
        hook: ['Begin met close-up van het product in je hand — 2 seconden max', 'Gebruik tekst-overlay met de hook-zin'],
        retain: ['Film in portretmodus (9:16) met daglicht', 'Laat je huisdier reageren op het product — DIT is de gouden content', 'Toon het product vanuit meerdere hoeken'],
        reward: ['Eindig met oogcontact in de camera', 'Wijs naar boven (richting bio link)', 'Voeg trending geluid toe op laag volume'],
      },
      duration: '30-45 seconden',
    },

    problem_solution: {
      retain: `[Begin met probleem — kijk gefrustreerd in camera]

Okaaay. Ik was het ZAT.

${product.category === 'honden'
  ? 'Mijn hond trok altijd aan de riem, blafte continu, of verveelde zich de hele dag. Ik heb alles geprobeerd — YouTube tips, dure trainers, andere producten. Niks werkte.'
  : product.category === 'katten'
    ? 'Mijn kat was altijd chagrijnig, verveeld, of dronk te weinig water. Ik zag haar gezondheid achteruitgaan en ik wist niet wat ik moest doen.'
    : `Mijn ${animal} had problemen en ik wist niet hoe ik het moest oplossen. Tot ik dit vond.`}

[Dramatische pauze — houd product op]

TOT. IK. DIT. VOND.

[Laat product zien — enthousiastisch]

De ${product.name}. Kijk, dit is waarom het werkt:

[Demonstreer stap voor stap — 15 seconden]
1. Je pakt het uit de verpakking
2. Je zet het klaar voor je ${animal}
3. En dan... kijk maar naar de reactie ${emoji}

[Film de reactie van je huisdier]

Het verschil was DIRECT zichtbaar. Geen gelieg — mijn ${animal} is zo veel gelukkiger.`,
      reward: `Dit kost maar ${priceStr}${discount > 0 ? ` (normaal ${compareStr})` : ''}.

Sla dit op 🔖 en klik de link in mijn bio voordat het uitverkocht is.

Volg mij voor meer tips die ECHT werken! ${emoji}`,
      filmtips: {
        hook: ['Begin met een gefrustreerde gezichtsuitdrukking', 'Gebruik "before" footage als je dat hebt'],
        retain: ['Maak een before/after sfeer', 'Film de echte reactie van je huisdier', 'Gebruik split-screen als je kunt (CapCut)'],
        reward: ['Eindig met een glimlach + product in beeld', 'Voeg "sla dit op" tekst-sticker toe'],
      },
      duration: '30-60 seconden',
    },

    educational: {
      retain: `[Tekst op scherm: "3 dingen die ik wens dat ik wist als ${animal}baasje"]

Nummer 1 ${emoji}
${product.category === 'honden'
  ? 'Honden hebben dagelijks mentale én fysieke stimulatie nodig. Zonder dat worden ze destructief. De meeste gedragsproblemen komen door VERVELING, niet door slechte opvoeding.'
  : product.category === 'katten'
    ? 'Katten drinken van nature liever bewegend water. Stilstaand water drinken ze minder — en dat veroorzaakt nierproblemen op de lange termijn.'
    : `De meeste ${animal}baasjes onderschatten hoeveel stimulatie hun ${animal} nodig heeft.`}

Nummer 2 🎯
De meeste baasjes besteden te weinig aan de juiste producten. Maar goedkoop = duurkoop bij je huisdier. Een goed product kan je honderden euro's aan dierenarts kosten besparen.

Nummer 3 ✅
[Introduceer product als de oplossing]
Daarom gebruik ik de ${product.name}. Dit lost precies probleem #1 op.

[Laat het product zien en demonstreer het]

Kijk, zo simpel is het. Mijn ${animal} is er dol op en het kost maar ${priceStr}.`,
      reward: `Sla dit op voor later! 🔖

Wil je de ${product.name}? Link in mijn bio → ${url}

Volg voor meer ${animal}tips — ik post elke dag! ${emoji}`,
      filmtips: {
        hook: ['Gebruik grote tekst "3 DINGEN..." als eerste frame', 'Kijk verbaasd/geschokt in de camera'],
        retain: ['Gebruik nummering met tekst-overlays (1, 2, 3)', 'Spreek snel en duidelijk — geen lange pauzes', 'Zet captions aan in TikTok voor meer bereik'],
        reward: ['Gebruik een "sla dit op" animatie', 'Wijs naar je bio-link', 'Thumbnail tip: gebruik het getal "3" groot in beeld'],
      },
      duration: '45-60 seconden',
    },

    review: {
      retain: `[Houd product op naar camera]

Eerlijke review van de ${product.name} — na 2 weken gebruik.

[Laat product van alle kanten zien]

Ik heb dit product ${product.compare_price ? `voor ${priceStr} gekocht (normaal ${compareStr})` : `voor ${priceStr} gekocht`}. Hier is mijn eerlijke mening:

DE GOEDE DINGEN ${emoji}
[Noem 3 positieve punten met beelden]
✅ Mijn ${animal} is er dol op — kijk maar [toon reactie]
✅ Super makkelijk te gebruiken — geen handleiding nodig
✅ Goede kwaliteit materiaal — voelt stevig aan

VERBETERPUNTEN:
[Eerlijk 1 klein minpunt — dit maakt je geloofwaardiger]
⚠️ De verpakking had handiger gekund

MAAR HIER IS HET DING:
Voor ${priceStr} vind je NIKS beters. Echt niet. Ik heb gezocht.

Mijn eindoordeel: 9/10 — absoluut een aanrader voor elk ${animal}baasje.`,
      reward: `Wil je hem zelf proberen? Link in mijn bio 🔗

Comment "REVIEW" en ik stuur je de link!

Volg voor meer eerlijke reviews — geen gesponsorde onzin ${emoji}`,
      filmtips: {
        hook: ['Houd het product naast je gezicht', 'Gebruik "Eerlijke review" als tekst-overlay'],
        retain: ['Film close-ups van materiaal en details', 'Laat je huisdier het product gebruiken', 'Wees ECHT eerlijk — dat scoort beter'],
        reward: ['Houd het product omhoog als "aanbevolen"', 'Voeg sterren-rating animatie toe in edit'],
      },
      duration: '45-60 seconden',
    },

    trending: {
      retain: `[Open met trending geluid — begin direct met actie]

Dingen die mijn leven veranderden in ${new Date().getFullYear()}:

[Snel knippen — 2 sec per item]
🧴 Mijn nieuwe huidverzorging... nee
📱 Mijn nieuwe telefoon... nee
🏋️ Mijn gym routine... nee
🐾 De ${product.name} voor mijn ${animal}... JA!

[Close-up van blij huisdier met product — 5-8 seconden]

Dit. Dit is de winner. Geen discussie ${emoji}

Mijn ${animal} is er GEK op. Kijk maar...

[Toon de beste reactie van je huisdier]

En ik betaalde maar ${priceStr}${discount > 0 ? ` (${discount}% korting nu!)` : ''}.`,
      reward: `Sla dit op en klik de link in mijn bio als je het wilt ${emoji}

Dit product is STEEDS uitverkocht dus wees er snel bij!

Volg voor meer van dit soort vondsten 🔗`,
      filmtips: {
        hook: ['Gebruik een trending geluid dat NU viral gaat', 'Eerste frame moet meteen actie hebben'],
        retain: ['Film in hoog tempo — max 2 sec per item', 'Gebruik CapCut-templates voor lijst-video\'s', 'De huisdier-reactie is je gouden moment'],
        reward: ['Voeg urgentie toe: "bijna uitverkocht"', 'Gebruik sticker-animaties voor engagement'],
      },
      duration: '15-30 seconden',
    },

    unboxing: {
      retain: `[Film de doos/verpakking — bouw spanning op]

Mijn nieuwe bestelling van PawsNL is binnen! Laten we unboxen 📦

[Open de verpakking langzaam — ASMR-achtig]

Okaaay, eerste indruk van de verpakking... netjes. Goed ingepakt.

[Haal product eruit]

Dit is 'm. De ${product.name}.

[Detailopnames — draai het rond, laat materiaal zien]

Wow, de kwaliteit is echt beter dan verwacht voor ${priceStr}. Kijk naar dit materiaal... [voel eraan]

Het ruikt ook goed — geen chemische geur of zo.

[Nu de ultieme test]

Maar de echte vraag is: wat vindt mijn ${animal} ervan? ${emoji}

[Film de reactie van je huisdier — dit is het hoogtepunt!]

KIJK! Direct goedgekeurd door de echte expert in huis 😂`,
      reward: `${priceStr}${discount > 0 ? ` (normaal ${compareStr} — dus ${discount}% korting!)` : ''} voor deze kwaliteit? Absoluut waard.

Link in mijn bio! ⬆️ Volg voor meer unboxings elke week.

Comment wat ik hierna moet unboxen! ${emoji}`,
      filmtips: {
        hook: ['Film de doos/pakket in je handen — close-up', 'Bouw spanning op met je stem'],
        retain: ['Film ASMR-achtig: langzaam openen, geluiden', 'Toon details van het product van dichtbij', 'De huisdier-reactie is het BELANGRIJKSTE deel'],
        reward: ['Houd product + huisdier samen in beeld', 'Vraag om comments voor engagement'],
      },
      duration: '45-90 seconden',
    },

    top3: {
      retain: `[Tekst op scherm: "Top 3 ${animal}producten in ${new Date().getFullYear()}"]

Nummer 3 🥉
[Noem een basis product uit de categorie]
Een goed [voerbak/speeltje/verzorgingsproduct] — €10-15, doet z'n werk.

Nummer 2 🥈
[Noem een premium alternatief]
Een [premium optie] — €20-30, betere kwaliteit maar duurder.

Maar nummer 1? Dit wint ALTIJD. Klaar?

[Dramatische intro]

De ${product.name} ${emoji}

[Demonstreer 15-20 seconden — laat zien WAAROM dit de beste is]

Dit is de perfecte balans: goede kwaliteit, eerlijke prijs, en mijn ${animal} is er dol op.

Voor ${priceStr}${discount > 0 ? ` (en nu met ${discount}% korting!)` : ''} is dit veruit de beste deal.`,
      reward: `Alle 3 producten staan via de link in mijn bio 🔗

Sla dit op! 🔖 En volg voor elke week een nieuwe top 3.

Comment welke categorie ik hierna moet doen! ${emoji}`,
      filmtips: {
        hook: ['Gebruik "TOP 3" als grote tekst in eerste frame', 'Begin met een countdown-gebaar'],
        retain: ['Gebruik countdown-animatie (3→2→1) in CapCut', 'Geef product #1 de meeste schermtijd', 'Toon het product in gebruik bij je huisdier'],
        reward: ['Eindig met duidelijke CTA naar bio-link', 'Vraag om comments voor algoritme-boost'],
      },
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
    retain: s.retain,
    reward: s.reward,
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
