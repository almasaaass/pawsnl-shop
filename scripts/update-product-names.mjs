import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)

// Slug → nieuw benefit-focused naam (Hormozi-stijl)
const nameUpdates = {
  // HONDEN
  'anti-schrok-voerbak-voor-honden': 'Anti-Schrok Voerbak — Gezond Eetpatroon voor je Hond',
  'anti-slip-hondensokken-4-stuks': 'Anti-Slip Hondensokken — Grip op Gladde Vloeren (4 stuks)',
  'anti-trek-hondenharnas-reflecterend': 'Anti-Trek Hondenharnas — Ontspannen Wandelen Zonder Trekken',
  'automatische-voerbak-timer-recorder': 'Automatische Voerbak — Vaste Eettijden, Zelfs als je Weg Bent',
  'gps-tracker-honden-katten': 'GPS Tracker — Altijd Weten Waar je Huisdier Is',
  'huisdiercamera-snackdispenser': 'Huisdiercamera met Snackdispenser — Verbinding op Afstand',
  'snuffelmat-honden-interactief': 'Interactieve Snuffelmat — Stimuleert Intelligentie & Voorkomt Verveling',
  'led-halsband-hond-usb': 'LED Halsband USB — Zichtbaar tot 500m in het Donker',
  'likmat-voor-honden-met-zuignap': 'Likmat met Zuignap — Kalmerend Effect bij Stress & Bad',
  'multivitamine-kauwtabletten-honden': 'Multivitamine Kauwtabletten — Glanzende Vacht & Sterke Gewrichten',
  'opvouwbare-reisbak-honden-set': 'Opvouwbare Reisbak Set — Eten & Drinken Onderweg (2 stuks)',
  'poten-reiniger-voor-honden': 'Poten Reiniger — Schone Poten in Seconden, Geen Modder Meer',
  'regenjas-voor-honden-waterproof': 'Waterproof Regenjas — Droog & Warm bij Elk Weer',
  'slow-feeder-lick-mat-honden': 'Slow Feeder Likmat — Rustiger Eten, Betere Spijsvertering',
  'tandenborstel-kauwspeeltje-voor-honden': 'Tandenborstel Kauwspeeltje — Schone Tanden Tijdens het Spelen',
  'verkoelende-mat-voor-honden': 'Verkoelende Mat — Tot 8 Uur Verkoeling op Warme Dagen',
  'waterdichte-hondenjas-reflectie': 'Waterdichte Hondenjas — Warm, Droog & Zichtbaar in het Donker',
  'zelfreinigende-huisdier-borstel': 'Zelfreinigende Borstel — Minder Haaruitval, Glanzende Vacht',
  // KATTEN
  'laser-speelgoed-katten': 'Automatische Kattenlaser — Eindeloos Speelplezier, Zelfs Zonder Jou',
  'kattenhangmat-raam-zuignap': 'Raamhangmat voor Katten — Zonnebaden met Uitzicht',
  'kattenrugzak-met-kijkvenster': 'Kattenrugzak met Kijkvenster — Veilig & Comfortabel Op Pad',
  'krabmat-sisal-bank': 'Sisal Krabmat — Beschermt je Meubels, Bevredigt Krabdrang',
  'kattentunnel-3-weg-opvouwbaar': 'Opvouwbare Kattentunnel 3-weg — Verstoppen, Rennen & Spelen',
  'raamhangmat-voor-katten': 'Luxe Raamhangmat — Favoriete Slaapplekje voor je Kat',
  'kattenfontein-koolstoffilter': 'Stille Kattenfontein — Altijd Vers & Gefilterd Water',
  'zelfverwarmende-kattenmat': 'Zelfverwarmende Kattenmat — Behaaglijke Warmte Zonder Stroom',
  // KNAAGDIEREN
  'houten-speelset-knaagdieren': 'Houten Speelset — Knagen, Klimmen & Ontdekken',
  'koelmat-knaagdieren-aluminium': 'Aluminium Koelmat — Verkoeling voor Knaagdieren op Warme Dagen',
  'speeltunnel-voor-konijnen': 'Speeltunnel voor Konijnen — Urenlang Ontdekken & Verstoppen',
  'stil-loopwiel-hamster': 'Geruisloos Hamsterwiel — Nachtrust voor Jou, Beweging voor Hem',
  // VOGELS
  'vogelschommel-natuurlijk-speelgoed': 'Natuurlijke Vogelschommel — Beweging & Entertainment',
  'vogelbadje-automatisch-waterstroom': 'Vogelbadje met Waterstroom — Schone & Gelukkige Vogels',
  'vogelkooi-ladder-klimrek-set': 'Ladder & Klimrek Set — Actieve Vogels, Gezonde Vogels',
  'vogelspeelgoed-set-10-delig': 'Vogelspeelgoed Set — 10 Onderdelen voor Eindeloos Plezier',
}

async function main() {
  console.log('Product namen bijwerken met Hormozi-stijl voordelen...\n')

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug')
    .order('category')
    .order('name')

  if (error) {
    console.error('Fout:', error.message)
    return
  }

  let updated = 0
  let skipped = 0

  for (const product of products) {
    const newName = nameUpdates[product.slug]
    if (!newName) {
      console.log(`⏭️  ${product.slug} — geen mapping, overslaan`)
      skipped++
      continue
    }

    if (product.name === newName) {
      console.log(`✓  ${product.slug} — al correct`)
      skipped++
      continue
    }

    const { error: updateError } = await supabase
      .from('products')
      .update({ name: newName })
      .eq('id', product.id)

    if (updateError) {
      console.error(`❌ ${product.slug}: ${updateError.message}`)
    } else {
      console.log(`✅ ${product.name} → ${newName}`)
      updated++
    }
  }

  console.log(`\nKlaar! ${updated} bijgewerkt, ${skipped} overgeslagen`)
}

main()
