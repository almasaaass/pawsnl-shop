import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)

const products = [
  {
    name: 'Automatisch Laser Kattenspeelgoed',
    slug: 'automatisch-laser-kattenspeelgoed',
    description: 'Houd je kat uren bezig met dit slimme automatische laserspeelgoed! De laser draait in willekeurige patronen en stimuleert het natuurlijke jachtinstinct van je kat. Met 3 snelheidsinstellingen en automatische uitschakeling na 15 minuten. Veilige laserklasse voor je huisdier. Werkt op batterijen of USB.',
    price: 34.95, compare_price: 49.95,
    images: ['https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600'],
    category: 'katten', stock: 60, featured: true
  },
  {
    name: 'Slimme Drinkfontein voor Katten',
    slug: 'slimme-drinkfontein-katten',
    description: 'Katten drinken van nature liever stromend water. Deze stijlvolle drinkfontein filtert continu het water met een koolstoffilter en houdt het vers en schoon. Inhoud 2,5 liter – ideaal voor meerdere katten. Superstil motorpomp (< 30 dB). Incl. 3 vervangende filters.',
    price: 39.95, compare_price: 54.95,
    images: ['https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600'],
    category: 'katten', stock: 45, featured: true
  },
  {
    name: 'Zelfverwarmend Kattenbed Rond',
    slug: 'zelfverwarmend-kattenbed-rond',
    description: 'Dit luxe zelfverwarmende kattenbed gebruikt je kat\'s eigen lichaamstemperatuur om warm te blijven – geen stroom nodig! De pluizige binnenkant is heerlijk zacht en de antislip onderkant houdt het bed op zijn plek. Diameter 50 cm. Wasbaar op 30°C.',
    price: 44.95, compare_price: 59.95,
    images: ['https://images.unsplash.com/photo-1548681528-6f5631a65a91?w=600'],
    category: 'katten', stock: 35, featured: true
  },
  {
    name: 'Interactieve Veer Hengel Kat',
    slug: 'interactieve-veer-hengel-kat',
    description: 'De ultieme speelhengel voor katten! Met kleurrijke veren, belletjes en crinkle materiaal die je kat gek maakt van opwinding. Uittrekbare steel van 65 tot 100 cm. Verwisselbare speeltjes. Versterk de band met je kat tijdens dagelijks spelen.',
    price: 14.95, compare_price: null,
    images: ['https://images.unsplash.com/photo-1516934024742-b461fba47600?w=600'],
    category: 'katten', stock: 90, featured: false
  },
  {
    name: 'Elektrische Nagelvijl voor Huisdieren',
    slug: 'elektrische-nagelvijl-huisdieren',
    description: 'Zeg vaarwel tegen de nagelknipper! Deze stille elektrische nagelvijl slijpt de nagels van je hond of kat rustig en zonder stress. Superstiil (< 50 dB) zodat zelfs angstige huisdieren er niet van schrikken. 3 schuurkapjes meegeleverd, USB oplaadbaar. Geschikt voor alle rassen.',
    price: 29.95, compare_price: 44.95,
    images: ['https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600'],
    category: 'honden', stock: 75, featured: true
  },
  {
    name: 'Anti-Trek Hondenharnas Verstelbaar',
    slug: 'anti-trek-hondenharnas-verstelbaar',
    description: 'Stop met trekken aan de riem! Dit ergonomische harnas verdeelt de trekkracht gelijkmatig over de borst en beschermt de nek van je hond. Reflecterende strepen voor zichtbaarheid in het donker. Eenvoudig aan en uit te doen met kliksluiting. Maten XS t/m XL. Wasbaar.',
    price: 27.95, compare_price: 39.95,
    images: ['https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=600'],
    category: 'honden', stock: 80, featured: true
  },
  {
    name: 'Automatische Voerbak met Timer',
    slug: 'automatische-voerbak-met-timer',
    description: 'Nooit meer vergeten je huisdier te voeren! Programmeer tot 4 maaltijden per dag met exacte portiegroottes. Groot reservoir van 4 liter – genoeg voor meerdere dagen. Ingebouwde recorder zodat je je eigen stem kunt opnemen als oproep. Werkt op stroom én batterijen (backup).',
    price: 54.95, compare_price: 74.95,
    images: ['https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600'],
    category: 'honden', stock: 30, featured: true
  },
  {
    name: 'GPS Tracker voor Huisdieren',
    slug: 'gps-tracker-huisdieren',
    description: 'Weet altijd waar je hond of kat is! Deze compacte GPS tracker bevestig je eenvoudig aan de halsband. Real-time locatie via app op je smartphone. Stel een veilige zone in en ontvang een melding als je huisdier die verlaat. Waterdicht (IP67), 7 dagen batterijduur. Werkt in heel Europa.',
    price: 44.95, compare_price: 64.95,
    images: ['https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600'],
    category: 'honden', stock: 25, featured: true
  },
  {
    name: 'Honden Regenjas Waterdicht',
    slug: 'honden-regenjas-waterdicht',
    description: 'Houd je hond droog tijdens regenachtige wandelingen! Deze lichtgewicht regenjas is volledig waterdicht en heeft een reflecterende streep voor veiligheid. Eenvoudig aan te trekken met velcro sluiting. Beschikbaar in maten XS t/m XXL. Inclusief handige opbergzak.',
    price: 24.95, compare_price: 34.95,
    images: ['https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=600'],
    category: 'honden', stock: 55, featured: false
  },
  {
    name: 'Uitschuifbare Hondenlijn 5 Meter',
    slug: 'uitschuifbare-hondenlijn-5-meter',
    description: 'Geef je hond de vrijheid om te snuffelen met deze stevige uitschuifbare lijn van 5 meter. Ergonomische antislip handgreep, one-button vergrendeling voor volledige controle. Geschikt voor honden tot 50 kg. Nylon band (geen draad) voor maximale veiligheid. Inclusief poepzakjeshouder.',
    price: 22.95, compare_price: null,
    images: ['https://images.unsplash.com/photo-1559249975-efb236a88a4a?w=600'],
    category: 'honden', stock: 100, featured: false
  },
  {
    name: 'Honden Tandverzorging Set',
    slug: 'honden-tandverzorging-set',
    description: 'Gezonde tanden voor een gelukkige hond! Deze complete set bevat een dubbele tandenborstel, vingertandenborstel en enzymatische tandpasta in kipsmaak. Dagelijks poetsen voorkomt tandsteen, tandvleesontsteking en slechte adem. Geschikt voor honden van alle groottes. 100% veilig als ingeslikt.',
    price: 14.95, compare_price: 19.95,
    images: ['https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=600'],
    category: 'honden', stock: 120, featured: false
  },
  {
    name: 'Huisdieren Reisrugzak Transparant',
    slug: 'huisdieren-reisrugzak-transparant',
    description: 'Neem je kat of kleine hond overal mee naartoe in deze stijlvolle ruimterugzak! Het transparante venster geeft je huisdier een geweldig uitzicht en jij kunt altijd zien hoe het met ze gaat. Geventileerd, comfortabel gevoerd interieur, veiligheidsriem binnenin. Max. draaggewicht 8 kg. Goedgekeurd voor vliegreizen.',
    price: 49.95, compare_price: 69.95,
    images: ['https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=600'],
    category: 'katten', stock: 40, featured: true
  }
]

async function run() {
  console.log('Oude producten verwijderen...')
  const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  if (deleteError) { console.error('Fout bij verwijderen:', deleteError); process.exit(1) }
  console.log('✓ Oude producten verwijderd')

  console.log('12 nieuwe producten toevoegen...')
  const { data, error: insertError } = await supabase.from('products').insert(products).select()
  if (insertError) { console.error('Fout bij toevoegen:', insertError); process.exit(1) }
  console.log(`✓ ${data.length} producten toegevoegd!`)
  data.forEach(p => console.log(`  - ${p.name} (€${p.price})`))
}

run()
