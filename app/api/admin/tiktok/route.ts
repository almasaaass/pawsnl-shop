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

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const FORMATS: ScriptFormat[] = [
  'pov',
  'problem_solution',
  'educational',
  'review',
  'trending',
  'unboxing',
  'top3',
]

// ─── Hormozi-style hooks (0-3 sec) ──────────────────────────────────────────

function getHooks(product: Product): string[] {
  const { category, compare_price, price } = product
  const discount = compare_price ? Math.round(((compare_price - price) / compare_price) * 100) : 0
  const priceStr = `€${price.toFixed(2).replace('.', ',')}`
  const savingsPerYear = Math.round(price * 3)

  // Hormozi-style openers — pattern interrupts
  const hormoziHooks = [
    `STOP! If you have a ${category === 'fish' ? category : category.slice(0, -1)} you NEED to see this`,
    `I wish someone had told me about this product sooner`,
    `This costs ${priceStr} but saves you €${savingsPerYear} per year`,
    `The #1 mistake ${category} owners make (and how to fix it)`,
    `I've spent €500+ on ${category} products. This is the ONLY one that works`,
  ]

  const categoryHooks: Record<string, string[]> = {
    dogs: [
      `Every vet recommends this but nobody tells you why 🐶`,
      `My dog FREAKS OUT every time I grab this`,
      `97% of dog owners don't know this about their dog`,
    ],
    cats: [
      `Your cat secretly hates you if you don't have this 🐱`,
      `POV: your cat NEVER wants to stop playing`,
      `This is why your cat acts so weird at night`,
    ],
    birds: [
      `My bird became so much happier after this thing 🐦`,
      `Bird owners ALWAYS skip this (big mistake)`,
    ],
    rodents: [
      `Your rodent deserves better than what you have now 🐹`,
      `This made my rodent 10x happier`,
    ],
    fish: [
      `Your aquarium is missing this one thing 🐟`,
      `Professional aquarium keepers swear by this product`,
    ],
  }

  const discountHooks = discount >= 20
    ? [`${discount}% off — but ONLY this week ⚡`]
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
  const url = 'pawsnlshop.com'
  const animal = product.category.slice(0, -2)

  const animalEmoji: Record<string, string> = {
    dogs: '🐶', cats: '🐱', birds: '🐦', rodents: '🐹', fish: '🐟',
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
      retain: `[Text on screen: "${hook}"]

Seriously, listen up. I bought the ${product.name} for my ${animal} and I'm going to show you exactly why this is a gamechanger.

[Show the product from your hand]

Look. This is it. ${product.name}.

[Demonstrate the product 10-15 seconds — show details]

See this? My ${animal} gets used to it within 5 minutes. And that's normal — because this is really well designed.

[Show your pet's reaction]

The difference with other products? This REALLY lasts. I've been using it for weeks and it still looks brand new.

For ${priceStr}${discount > 0 ? ` (was ${compareStr})` : ''} this is truly a no-brainer.`,
      reward: `[Look into camera — urgency]

Link in my bio! ⬆️ And follow for more ${animal} tips — I test new products every week.

${discount > 0 ? `HEADS UP: that ${discount}% discount is temporary!` : 'This product regularly sells out, so be quick.'}`,
      filmtips: {
        hook: ['Start with close-up of the product in your hand — 2 seconds max', 'Use text overlay with the hook line'],
        retain: ['Film in portrait mode (9:16) with daylight', 'Let your pet react to the product — THIS is the golden content', 'Show the product from multiple angles'],
        reward: ['End with eye contact into the camera', 'Point upward (towards bio link)', 'Add trending sound at low volume'],
      },
      duration: '30-45 seconds',
    },

    problem_solution: {
      retain: `[Start with problem — look frustrated into camera]

Okaaay. I was SO done.

${product.category === 'dogs'
  ? 'My dog was always pulling on the leash, barking non-stop, or bored all day. I tried everything — YouTube tips, expensive trainers, other products. Nothing worked.'
  : product.category === 'cats'
    ? 'My cat was always grumpy, bored, or not drinking enough water. I could see her health declining and I didn\'t know what to do.'
    : `My ${animal} had problems and I didn't know how to fix it. Until I found this.`}

[Dramatic pause — hold up product]

UNTIL. I. FOUND. THIS.

[Show product — enthusiastic]

The ${product.name}. Look, this is why it works:

[Demonstrate step by step — 15 seconds]
1. You take it out of the packaging
2. You set it up for your ${animal}
3. And then... just watch the reaction ${emoji}

[Film your pet's reaction]

The difference was IMMEDIATELY visible. No lies — my ${animal} is so much happier.`,
      reward: `This only costs ${priceStr}${discount > 0 ? ` (normally ${compareStr})` : ''}.

Save this 🔖 and click the link in my bio before it sells out.

Follow me for more tips that ACTUALLY work! ${emoji}`,
      filmtips: {
        hook: ['Start with a frustrated facial expression', 'Use "before" footage if you have it'],
        retain: ['Create a before/after vibe', 'Film the real reaction of your pet', 'Use split-screen if you can (CapCut)'],
        reward: ['End with a smile + product in frame', 'Add a "save this" text sticker'],
      },
      duration: '30-60 seconds',
    },

    educational: {
      retain: `[Text on screen: "3 things I wish I knew as a ${animal} owner"]

Number 1 ${emoji}
${product.category === 'dogs'
  ? 'Dogs need daily mental AND physical stimulation. Without it they become destructive. Most behavioural problems come from BOREDOM, not bad training.'
  : product.category === 'cats'
    ? 'Cats naturally prefer to drink moving water. They drink less still water — and that causes kidney problems in the long run.'
    : `Most ${animal} owners underestimate how much stimulation their ${animal} needs.`}

Number 2 🎯
Most owners spend too little on the right products. But cheap = expensive when it comes to your pet. A good product can save you hundreds of euros in vet bills.

Number 3 ✅
[Introduce product as the solution]
That's why I use the ${product.name}. This solves exactly problem #1.

[Show and demonstrate the product]

See, it's that simple. My ${animal} loves it and it only costs ${priceStr}.`,
      reward: `Save this for later! 🔖

Want the ${product.name}? Link in my bio → ${url}

Follow for more ${animal} tips — I post every day! ${emoji}`,
      filmtips: {
        hook: ['Use large text "3 THINGS..." as the first frame', 'Look surprised/shocked into the camera'],
        retain: ['Use numbering with text overlays (1, 2, 3)', 'Speak quickly and clearly — no long pauses', 'Turn on captions in TikTok for more reach'],
        reward: ['Use a "save this" animation', 'Point to your bio link', 'Thumbnail tip: use the number "3" big on screen'],
      },
      duration: '45-60 seconds',
    },

    review: {
      retain: `[Hold product up to camera]

Honest review of the ${product.name} — after 2 weeks of use.

[Show product from all angles]

I bought this product ${product.compare_price ? `for ${priceStr} (normally ${compareStr})` : `for ${priceStr}`}. Here is my honest opinion:

THE GOOD STUFF ${emoji}
[Name 3 positive points with visuals]
✅ My ${animal} loves it — just look [show reaction]
✅ Super easy to use — no manual needed
✅ Good quality material — feels sturdy

AREAS FOR IMPROVEMENT:
[Honestly 1 small downside — this makes you more credible]
⚠️ The packaging could have been more practical

BUT HERE'S THE THING:
For ${priceStr} you won't find ANYTHING better. Seriously. I've looked.

My final verdict: 9/10 — absolutely recommended for every ${animal} owner.`,
      reward: `Want to try it yourself? Link in my bio 🔗

Comment "REVIEW" and I'll send you the link!

Follow for more honest reviews — no sponsored nonsense ${emoji}`,
      filmtips: {
        hook: ['Hold the product next to your face', 'Use "Honest review" as text overlay'],
        retain: ['Film close-ups of material and details', 'Let your pet use the product', 'Be REALLY honest — that performs better'],
        reward: ['Hold the product up as "recommended"', 'Add star rating animation in edit'],
      },
      duration: '45-60 seconds',
    },

    trending: {
      retain: `[Open with trending sound — start immediately with action]

Things that changed my life in ${new Date().getFullYear()}:

[Quick cuts — 2 sec per item]
🧴 My new skincare... no
📱 My new phone... no
🏋️ My gym routine... no
🐾 The ${product.name} for my ${animal}... YES!

[Close-up of happy pet with product — 5-8 seconds]

This. This is the winner. No debate ${emoji}

My ${animal} is OBSESSED. Just watch...

[Show the best reaction from your pet]

And I only paid ${priceStr}${discount > 0 ? ` (${discount}% off right now!)` : ''}.`,
      reward: `Save this and click the link in my bio if you want it ${emoji}

This product keeps SELLING OUT so be quick!

Follow for more finds like this 🔗`,
      filmtips: {
        hook: ['Use a trending sound that\'s going viral RIGHT NOW', 'First frame needs immediate action'],
        retain: ['Film at high speed — max 2 sec per item', 'Use CapCut templates for list videos', 'The pet reaction is your golden moment'],
        reward: ['Add urgency: "almost sold out"', 'Use sticker animations for engagement'],
      },
      duration: '15-30 seconds',
    },

    unboxing: {
      retain: `[Film the box/packaging — build suspense]

My new order from PawsNL has arrived! Let's unbox 📦

[Open the packaging slowly — ASMR-style]

Okaaay, first impression of the packaging... neat. Well packed.

[Take product out]

This is it. The ${product.name}.

[Detail shots — rotate it, show the material]

Wow, the quality is really better than expected for ${priceStr}. Look at this material... [feel it]

It also smells good — no chemical smell or anything.

[Now the ultimate test]

But the real question is: what does my ${animal} think? ${emoji}

[Film your pet's reaction — this is the highlight!]

LOOK! Instantly approved by the real expert in the house 😂`,
      reward: `${priceStr}${discount > 0 ? ` (normally ${compareStr} — so ${discount}% off!)` : ''} for this quality? Absolutely worth it.

Link in my bio! ⬆️ Follow for more unboxings every week.

Comment what I should unbox next! ${emoji}`,
      filmtips: {
        hook: ['Film the box/package in your hands — close-up', 'Build suspense with your voice'],
        retain: ['Film ASMR-style: open slowly, sounds', 'Show details of the product up close', 'The pet reaction is the MOST IMPORTANT part'],
        reward: ['Keep product + pet together in frame', 'Ask for comments for engagement'],
      },
      duration: '45-90 seconds',
    },

    top3: {
      retain: `[Text on screen: "Top 3 ${animal} products in ${new Date().getFullYear()}"]

Number 3 🥉
[Name a basic product from the category]
A good [food bowl/toy/grooming product] — €10-15, does the job.

Number 2 🥈
[Name a premium alternative]
A [premium option] — €20-30, better quality but pricier.

But number 1? This ALWAYS wins. Ready?

[Dramatic intro]

The ${product.name} ${emoji}

[Demonstrate 15-20 seconds — show WHY this is the best]

This is the perfect balance: good quality, fair price, and my ${animal} loves it.

For ${priceStr}${discount > 0 ? ` (and now with ${discount}% off!)` : ''} this is by far the best deal.`,
      reward: `All 3 products are available via the link in my bio 🔗

Save this! 🔖 And follow for a new top 3 every week.

Comment which category I should do next! ${emoji}`,
      filmtips: {
        hook: ['Use "TOP 3" as large text in the first frame', 'Start with a countdown gesture'],
        retain: ['Use countdown animation (3→2→1) in CapCut', 'Give product #1 the most screen time', 'Show the product being used by your pet'],
        reward: ['End with clear CTA to bio link', 'Ask for comments for algorithm boost'],
      },
      duration: '30-60 seconds',
    },
  }

  const s = scripts[format]

  const hashtagsBase = ['#pet', '#petlover', '#pawsshop', '#petsoftiktok']
  const hashtagsCat: Record<string, string[]> = {
    dogs: ['#dog', '#dogowner', '#dogtiktok', '#dogmom', '#dogdad', '#dogcare'],
    cats: ['#cat', '#catowner', '#cattok', '#catsoftiktok', '#catlove'],
    birds: ['#bird', '#birdowner', '#birdtok'],
    rodents: ['#hamster', '#rodent', '#hamsterlife'],
    fish: ['#aquarium', '#fish', '#fishkeeper'],
  }
  const hashtagsFormat: Record<ScriptFormat, string[]> = {
    pov: ['#pov', '#povvideo'],
    problem_solution: ['#problem', '#solution', '#tip'],
    educational: ['#learntiktok', '#tips', '#didyouknow'],
    review: ['#review', '#honestreview', '#productreview'],
    trending: ['#trending', '#fyp', '#viral'],
    unboxing: ['#unboxing', '#haul', '#new'],
    top3: ['#top3', '#musthave', '#recommended'],
  }

  const hashtags = [
    ...hashtagsBase,
    ...(hashtagsCat[product.category] ?? []),
    ...hashtagsFormat[format],
    '#fyp',
  ]

  const formatNames: Record<ScriptFormat, string> = {
    pov: 'POV Video',
    problem_solution: 'Problem & Solution',
    educational: 'Educational (Top 3 tips)',
    review: 'Honest Review',
    trending: 'Trending Format',
    unboxing: 'Unboxing Video',
    top3: 'Top 3 Products',
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
    return NextResponse.json({ error: 'No products found' }, { status: 404 })
  }

  // Choose 7 products — spread across categories as much as possible
  const shuffled = [...products].sort(() => Math.random() - 0.5)
  const selected: Product[] = []
  const usedCategories = new Set<string>()

  // First: 1 per category
  for (const p of shuffled) {
    if (!usedCategories.has(p.category) && selected.length < 7) {
      selected.push(p)
      usedCategories.add(p.category)
    }
  }

  // Fill up to 7 if there are fewer categories
  for (const p of shuffled) {
    if (selected.length >= 7) break
    if (!selected.find((s) => s.id === p.id)) selected.push(p)
  }

  const scripts: TikTokScript[] = selected.slice(0, 7).map((product, i) =>
    generateScript(product, FORMATS[i % FORMATS.length], i)
  )

  return NextResponse.json({ scripts, generatedAt: new Date().toISOString() })
}
