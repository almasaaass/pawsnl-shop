import { NextRequest, NextResponse } from 'next/server'
import { verifyAdmin } from '@/lib/auth'

// ─── Trending products database ──────────────────────────────────────────────

export interface TrendingProduct {
  id: number
  name: string
  category: 'dogs' | 'cats' | 'birds' | 'small-pets'
  trendScore: number
  season: 'spring' | 'summer' | 'autumn' | 'winter' | 'always'
  tiktokHashtags: string[]
  searchTerms: string[]
  estimatedMargin: 'low' | 'medium' | 'high'
  difficulty: 'easy' | 'medium' | 'hard'
  tip: string
}

const TRENDING_PRODUCTS: TrendingProduct[] = [
  // ─── DOGS ─────────────────────────────────────────────────────
  { id: 1, name: 'No-pull harness', category: 'dogs', trendScore: 95, season: 'always', tiktokHashtags: ['#dogharness', '#nopullharness', '#dogtok'], searchTerms: ['dog harness no pull', 'no pull dog harness'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Bestseller on TikTok — make a before/after video with a pulling dog' },
  { id: 2, name: 'Slow feeder bowl', category: 'dogs', trendScore: 88, season: 'always', tiktokHashtags: ['#slowfeeder', '#dogbowl', '#dogtok'], searchTerms: ['slow feeder dog bowl', 'puzzle dog bowl'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Show the dog eating 3x slower — viral content' },
  { id: 3, name: 'LED collar', category: 'dogs', trendScore: 82, season: 'autumn', tiktokHashtags: ['#ledcollar', '#dogwalk', '#nightwalk'], searchTerms: ['dog led collar', 'light up dog collar'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Film in the dark for maximum effect — autumn/winter season' },
  { id: 4, name: 'Dog cooling mat', category: 'dogs', trendScore: 90, season: 'summer', tiktokHashtags: ['#coolingmat', '#dogsummer', '#dogtok'], searchTerms: ['dog cooling mat', 'pet cooling pad'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Seasonal product — start promotion in April/May for summer peak' },
  { id: 5, name: 'Lick mat with suction cup', category: 'dogs', trendScore: 86, season: 'always', tiktokHashtags: ['#lickmat', '#dogbath', '#dogtok'], searchTerms: ['lick mat dog', 'dog lick pad suction'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Film your dog calmly licking in the bath — super viral content' },
  { id: 6, name: 'GPS tracker collar', category: 'dogs', trendScore: 78, season: 'always', tiktokHashtags: ['#gpstracker', '#dogtracker', '#dogsafety'], searchTerms: ['pet gps tracker', 'dog gps collar tracker'], estimatedMargin: 'medium', difficulty: 'medium', tip: 'Premium product — emphasize the safety aspect for owners' },
  { id: 7, name: 'Snuffle mat', category: 'dogs', trendScore: 84, season: 'always', tiktokHashtags: ['#snufflemat', '#dogtoy', '#nosework'], searchTerms: ['snuffle mat dog', 'dog nose work mat'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Dogs become calm from it — show the energy difference before/after' },
  { id: 8, name: 'Dog swimming vest', category: 'dogs', trendScore: 75, season: 'summer', tiktokHashtags: ['#doglifejacket', '#dogswimming', '#dogsummer'], searchTerms: ['dog life jacket', 'dog swimming vest'], estimatedMargin: 'medium', difficulty: 'easy', tip: 'Summer seasonal product — focus on safety and cute footage' },
  { id: 9, name: 'Automatic ball launcher', category: 'dogs', trendScore: 72, season: 'always', tiktokHashtags: ['#dogballlauncher', '#dogtoy', '#dogtok'], searchTerms: ['automatic dog ball launcher', 'dog ball thrower'], estimatedMargin: 'medium', difficulty: 'medium', tip: 'Show the dog learning to return balls by itself — viral potential' },
  { id: 10, name: 'Dog raincoat', category: 'dogs', trendScore: 80, season: 'autumn', tiktokHashtags: ['#dograincoat', '#dogtok', '#petfashion'], searchTerms: ['dog raincoat', 'waterproof dog jacket'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Rainy weather is common — show the dog coming home dry' },
  { id: 11, name: 'Paw cleaner cup', category: 'dogs', trendScore: 77, season: 'autumn', tiktokHashtags: ['#pawcleaner', '#dogtok', '#mudpaws'], searchTerms: ['dog paw cleaner', 'paw washer cup'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Perfect for rainy weather — show dirty paws → clean paws' },
  { id: 12, name: 'Anti-bark device', category: 'dogs', trendScore: 70, season: 'always', tiktokHashtags: ['#antibark', '#dogtraining', '#dogtok'], searchTerms: ['anti bark device', 'ultrasonic dog bark control'], estimatedMargin: 'high', difficulty: 'medium', tip: 'Controversial = engagement — show that it is animal-friendly' },
  // ─── CATS ─────────────────────────────────────────────────────
  { id: 13, name: 'Cat water fountain', category: 'cats', trendScore: 92, season: 'always', tiktokHashtags: ['#catwaterfountain', '#cattok', '#cathack'], searchTerms: ['cat water fountain', 'pet water fountain'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Top product — cats drink more = healthier. Make an ASMR video of flowing water' },
  { id: 14, name: 'Automatic laser toy', category: 'cats', trendScore: 89, season: 'always', tiktokHashtags: ['#catlaser', '#cattoy', '#cattok'], searchTerms: ['automatic cat laser toy', 'cat laser pointer automatic'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Cats go crazy — film the reaction from a bird\'s-eye view' },
  { id: 15, name: 'Window hammock for cats', category: 'cats', trendScore: 85, season: 'always', tiktokHashtags: ['#catwindowperch', '#cathammock', '#cattok'], searchTerms: ['cat window perch', 'cat window hammock'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Installation + cat jumping in = perfect video content' },
  { id: 16, name: 'Interactive cat puzzle feeder', category: 'cats', trendScore: 81, season: 'always', tiktokHashtags: ['#catpuzzle', '#cattoy', '#cattok'], searchTerms: ['cat puzzle feeder', 'interactive cat toy feeder'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Smart cat content always does well — show the cat solving it' },
  { id: 17, name: 'Self-heating cat bed', category: 'cats', trendScore: 79, season: 'winter', tiktokHashtags: ['#catheatedbed', '#catbed', '#cattok'], searchTerms: ['self heating cat bed', 'thermal cat bed'], estimatedMargin: 'medium', difficulty: 'easy', tip: 'Winter season — show the cat falling asleep instantly' },
  { id: 18, name: 'Microchip cat door', category: 'cats', trendScore: 68, season: 'always', tiktokHashtags: ['#catdoor', '#catflap', '#cattok'], searchTerms: ['microchip cat door', 'smart cat flap'], estimatedMargin: 'medium', difficulty: 'hard', tip: 'Premium product — emphasize that only your cat can enter' },
  { id: 19, name: 'Collapsible cat tunnel', category: 'cats', trendScore: 76, season: 'always', tiktokHashtags: ['#cattunnel', '#cattoy', '#cattok'], searchTerms: ['cat tunnel', 'collapsible cat tunnel toy'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Film the cat running through it — simple but effective content' },
  // ─── BIRDS ─────────────────────────────────────────────────────
  { id: 20, name: 'Bird training set', category: 'birds', trendScore: 74, season: 'always', tiktokHashtags: ['#birdtraining', '#birdtok', '#parrottok'], searchTerms: ['bird training toys', 'parrot training set'], estimatedMargin: 'high', difficulty: 'medium', tip: 'Parakeet learning tricks = viral content. Show the progression' },
  { id: 21, name: 'Bird toy set (10-piece)', category: 'birds', trendScore: 80, season: 'always', tiktokHashtags: ['#birdtoys', '#birdtok', '#parrottok'], searchTerms: ['bird toys set', 'parrot cage toys bundle'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Bundle = higher order value. Show the bird trying out each toy' },
  { id: 22, name: 'Bird bath with fountain', category: 'birds', trendScore: 71, season: 'summer', tiktokHashtags: ['#birdbath', '#birdtok', '#parrotbath'], searchTerms: ['bird bath fountain', 'parrot shower bath'], estimatedMargin: 'medium', difficulty: 'easy', tip: 'Birds bathing = instant likes. ASMR water + bird sounds' },
  { id: 23, name: 'Automatic bird feeder', category: 'birds', trendScore: 69, season: 'always', tiktokHashtags: ['#birdfeeder', '#birdtok', '#automaticfeeder'], searchTerms: ['automatic bird feeder', 'bird food dispenser cage'], estimatedMargin: 'medium', difficulty: 'easy', tip: 'Handy for vacation — emphasize the convenience' },
  // ─── SMALL PETS ────────────────────────────────────────────────
  { id: 24, name: 'Hamster wheel (silent)', category: 'small-pets', trendScore: 83, season: 'always', tiktokHashtags: ['#hamsterwheel', '#hamstertok'], searchTerms: ['silent hamster wheel', 'quiet hamster running wheel'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Emphasize the silent aspect — show the difference with a normal squeaky wheel' },
  { id: 25, name: 'Rabbit tunnel system', category: 'small-pets', trendScore: 78, season: 'always', tiktokHashtags: ['#rabbittunnel', '#bunnytok'], searchTerms: ['rabbit tunnel toy', 'bunny play tunnel'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Rabbits through tunnels = cute content. Build an obstacle course' },
  { id: 26, name: 'Hamster climbing course', category: 'small-pets', trendScore: 76, season: 'always', tiktokHashtags: ['#hamsterplayground', '#hamstertok'], searchTerms: ['hamster climbing toy', 'hamster playground wood'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Hamster obstacle course video always goes viral on TikTok' },
  { id: 27, name: 'Guinea pig hammock', category: 'small-pets', trendScore: 72, season: 'always', tiktokHashtags: ['#guineapig', '#guineapighammock'], searchTerms: ['guinea pig hammock', 'guinea pig bed hanging'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Guinea pig climbing into hammock = instant viral. Film the moment' },
  { id: 28, name: 'Small pet cooling plate', category: 'small-pets', trendScore: 67, season: 'summer', tiktokHashtags: ['#hamstercooling', '#hamstertok'], searchTerms: ['hamster cooling plate', 'small pet cooling stone'], estimatedMargin: 'medium', difficulty: 'easy', tip: 'Summer product — show the hamster happily lying on it' },
  // ─── EXTRA TRENDING ─────────────────────────────────────────────
  { id: 29, name: 'Pet camera with treat dispenser', category: 'dogs', trendScore: 87, season: 'always', tiktokHashtags: ['#petcamera', '#dogcamera', '#furbocamera'], searchTerms: ['pet camera treat dispenser', 'dog camera wifi'], estimatedMargin: 'medium', difficulty: 'medium', tip: 'Film your dog\'s reaction when you toss a treat remotely' },
  { id: 30, name: 'Automatic feeder', category: 'cats', trendScore: 85, season: 'always', tiktokHashtags: ['#automaticfeeder', '#catfeeder', '#cattok'], searchTerms: ['automatic pet feeder', 'smart cat feeder timer'], estimatedMargin: 'medium', difficulty: 'medium', tip: 'Handy for working cat owners — emphasize the convenience' },
  { id: 31, name: 'Dog dryer vacuum', category: 'dogs', trendScore: 73, season: 'always', tiktokHashtags: ['#dogdryer', '#doggrooming', '#dogtok'], searchTerms: ['dog dryer blower', 'pet grooming dryer'], estimatedMargin: 'medium', difficulty: 'medium', tip: 'The dog\'s reaction to the dryer = funny content' },
  { id: 32, name: 'Cactus scratching post', category: 'cats', trendScore: 82, season: 'always', tiktokHashtags: ['#catscratcher', '#cactucat', '#cattok'], searchTerms: ['cactus cat scratching post', 'cat scratcher cactus'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Aesthetically pleasing — appeals to the interior-conscious cat owner' },
  { id: 33, name: 'Carrier bag for small dogs', category: 'dogs', trendScore: 79, season: 'always', tiktokHashtags: ['#dogcarrier', '#dogbag', '#smalldog'], searchTerms: ['small dog carrier bag', 'pet carrier sling'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Small dog in carrier bag through the city = lifestyle content' },
  { id: 34, name: 'Cat wall climbing elements', category: 'cats', trendScore: 77, season: 'always', tiktokHashtags: ['#catwall', '#catshelves', '#cattok'], searchTerms: ['cat wall shelves', 'cat climbing wall furniture'], estimatedMargin: 'medium', difficulty: 'hard', tip: 'Mounting video + cat testing the course = popular content' },
  { id: 35, name: 'Dog toothbrush toy', category: 'dogs', trendScore: 83, season: 'always', tiktokHashtags: ['#dogdental', '#dogtoothbrush', '#dogtok'], searchTerms: ['dog toothbrush toy', 'dog dental chew toy'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Show the before/after of dog teeth — educational + viral' },
  { id: 36, name: 'Cat harness with leash', category: 'cats', trendScore: 80, season: 'spring', tiktokHashtags: ['#catharness', '#catwalk', '#cattok'], searchTerms: ['cat harness leash', 'escape proof cat harness'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Walking a cat on the street = people stop and stare. Film the reactions' },
  { id: 37, name: 'Foldable dog pool', category: 'dogs', trendScore: 76, season: 'summer', tiktokHashtags: ['#dogpool', '#dogsummer', '#dogtok'], searchTerms: ['foldable dog pool', 'pet swimming pool'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Summer season — dog jumping into pool = instant viral hit' },
  { id: 38, name: 'Cat backpack with window', category: 'cats', trendScore: 86, season: 'always', tiktokHashtags: ['#catbackpack', '#catbubble', '#cattok'], searchTerms: ['cat backpack bubble', 'cat carrier backpack window'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Walking through the city with a cat in a backpack — people always react. Film it' },
  { id: 39, name: 'Reusable puppy training pads', category: 'dogs', trendScore: 71, season: 'always', tiktokHashtags: ['#puppytraining', '#puppypad', '#dogtok'], searchTerms: ['reusable puppy training pads', 'washable pee pads dog'], estimatedMargin: 'medium', difficulty: 'easy', tip: 'Sustainable alternative — emphasize eco-friendly and cost-saving' },
  { id: 40, name: 'Bird harness for parakeets', category: 'birds', trendScore: 73, season: 'spring', tiktokHashtags: ['#birdharness', '#birdtok', '#parrottok'], searchTerms: ['bird harness parrot', 'bird flight harness small'], estimatedMargin: 'high', difficulty: 'medium', tip: 'Walking a parakeet outside = extremely unique content. People can\'t believe their eyes' },
  { id: 41, name: 'Ceramic hamster house', category: 'small-pets', trendScore: 70, season: 'always', tiktokHashtags: ['#hamsterhouse', '#hamstertok'], searchTerms: ['ceramic hamster house', 'hamster hideout cool'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Hamster decorating its house = cute content' },
  { id: 42, name: 'Dog winter jacket', category: 'dogs', trendScore: 85, season: 'winter', tiktokHashtags: ['#dogcoat', '#dogwinter', '#dogtok'], searchTerms: ['dog winter jacket', 'warm dog coat waterproof'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Fashion + functional — show the transformation from shivering to warm' },
  { id: 43, name: 'Mini cat GPS tracker', category: 'cats', trendScore: 74, season: 'always', tiktokHashtags: ['#cattracker', '#cattok', '#catgps'], searchTerms: ['cat gps tracker small', 'mini pet tracker cat'], estimatedMargin: 'medium', difficulty: 'medium', tip: 'Show your cat\'s route on the map — people are always curious' },
  { id: 44, name: 'Dog intelligence toy', category: 'dogs', trendScore: 81, season: 'always', tiktokHashtags: ['#dogpuzzle', '#smartdog', '#dogtok'], searchTerms: ['dog puzzle toy', 'dog intelligence toy treat'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Is your dog smart enough? Challenge format works on TikTok' },
  { id: 45, name: 'Sisal cat scratch mat', category: 'cats', trendScore: 69, season: 'always', tiktokHashtags: ['#catscratcher', '#catmat', '#cattok'], searchTerms: ['cat scratch mat sisal', 'cat scratching pad floor'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Cheap alternative to a scratching post — emphasize the price' },
  { id: 46, name: 'Anti-slip dog socks', category: 'dogs', trendScore: 78, season: 'winter', tiktokHashtags: ['#dogsocks', '#dogtok', '#funnydogs'], searchTerms: ['dog socks anti slip', 'dog grip socks indoor'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Dogs learning to walk in socks = hilarious content. Guaranteed viral' },
  { id: 47, name: 'Rabbit toy set', category: 'small-pets', trendScore: 71, season: 'always', tiktokHashtags: ['#bunnytoys', '#rabbittok'], searchTerms: ['rabbit toy set', 'bunny chew toys natural'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Rabbits are popular on TikTok — show them playing with each item' },
  { id: 48, name: 'Dog car seat', category: 'dogs', trendScore: 75, season: 'always', tiktokHashtags: ['#dogcarseat', '#dogtok', '#dogtravel'], searchTerms: ['dog car seat', 'dog booster car seat small'], estimatedMargin: 'medium', difficulty: 'easy', tip: 'Safety + cuteness — dog looking out the window from the seat' },
  { id: 49, name: 'Automatic cat laser light', category: 'cats', trendScore: 84, season: 'always', tiktokHashtags: ['#catlaser', '#cattok', '#funnycat'], searchTerms: ['automatic cat laser toy rotating', 'cat laser pointer toy'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Cat chasing laser light = always funny. Film from above' },
  { id: 50, name: 'Self-cleaning pet hair brush', category: 'dogs', trendScore: 80, season: 'spring', tiktokHashtags: ['#petbrush', '#dogtok', '#doggrooming'], searchTerms: ['self cleaning pet brush', 'dog brush deshedding'], estimatedMargin: 'high', difficulty: 'easy', tip: 'Spring = shedding season. Show the mountain of hair that comes off — satisfying content' },
]

export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const season = searchParams.get('season')

  let filtered = [...TRENDING_PRODUCTS]

  if (category) {
    filtered = filtered.filter((p) => p.category === category)
  }
  if (season) {
    filtered = filtered.filter((p) => p.season === season || p.season === 'always')
  }

  // Sort by trendScore (highest first)
  filtered.sort((a, b) => b.trendScore - a.trendScore)

  return NextResponse.json({ products: filtered, total: filtered.length })
}
