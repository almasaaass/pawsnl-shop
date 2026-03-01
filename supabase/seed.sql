-- ============================================================
-- PawsNL – Seed data (demo producten)
-- Voer dit uit NA schema.sql
-- ============================================================

INSERT INTO products (name, slug, description, price, compare_price, images, category, stock, featured)
VALUES

-- HONDEN
(
  'Premium Hondenbrokken Kip & Rijst',
  'premium-hondenbrokken-kip-rijst',
  'Heerlijke en voedzame hondenbrokken met echte kip en rijst. Zonder kunstmatige kleurstoffen en conserveermiddelen. Ideaal voor honden van alle rassen en leeftijden. Per zak van 5 kg.',
  29.99, 34.99,
  '["https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600"]',
  'honden', 50, true
),
(
  'Interactief Hondenspeelgoed – Denkspeelgoed',
  'interactief-hondenspeelgoed',
  'Houd je hond mentaal actief met dit uitdagende denkspeelgoed. Verstop lekkernijen in de puzzelcompartimenten en laat je hond ontdekken hoe hij ze eruit kan krijgen. Gemaakt van duurzaam, voedselveilig plastic.',
  19.99, null,
  '["https://images.unsplash.com/photo-1535591273668-578e31182c4f?w=600"]',
  'honden', 75, true
),
(
  'Orthopedisch Hondenbed XL',
  'orthopedisch-hondenbed-xl',
  'Geef je hond het comfort dat hij verdient. Dit orthopedische bed biedt optimale ondersteuning voor gewrichten en botten. Afneembaar en wasbaar hoesje. Formaat: 110 x 80 cm.',
  49.99, 59.99,
  '["https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600"]',
  'honden', 30, true
),
(
  'Reflecterende Hondenriem 2m',
  'reflecterende-hondenriem',
  'Veilig uitlaten, ook in het donker. Deze stevige nylon riem heeft reflecterende strepen voor maximale zichtbaarheid. Comfortabele ergonomische handgreep. Geschikt voor honden tot 50 kg.',
  14.99, null,
  '["https://images.unsplash.com/photo-1559249975-efb236a88a4a?w=600"]',
  'honden', 120, false
),

-- KATTEN
(
  'Premium Kattenvoer – Zalm & Groenten',
  'premium-kattenvoer-zalm',
  'Smakelijk nat kattenvoer met echte zalm en verse groenten. Rijk aan omega-3 vetzuren voor een glanzende vacht. Geschikt voor volwassen katten. Inhoud: 12 x 85 gram.',
  18.49, 21.99,
  '["https://images.unsplash.com/photo-1574158622682-e40e69881006?w=600"]',
  'katten', 100, true
),
(
  'Automatische Kattenbak met Filter',
  'automatische-kattenbak',
  'Zeg vaarwel tegen onaangename geuren! Deze automatische kattenbak reinigt zichzelf na elk bezoek van je kat. Met actieve koolstoffilter en groot opvangbak. Stil en energiezuinig.',
  89.99, 109.99,
  '["https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600"]',
  'katten', 20, true
),
(
  'Kattenkrabpaal met Hangmat',
  'kattenkrabpaal-hangmat',
  'Hoog kattenkrabpaal (160 cm) met meerdere platforms, hangmat en speeltuigen. Bekleed met stevig sisal touw. Geeft je kat de perfecte plek om te klimmen, scherpen en ontspannen.',
  74.99, null,
  '["https://images.unsplash.com/photo-1516934024742-b461fba47600?w=600"]',
  'katten', 15, false
),

-- VOGELS
(
  'Vogelvoer Mix – Exoten Blend',
  'vogelvoer-mix-exoten',
  'Speciaal samengestelde zaadblennd voor tropische vogels zoals parkieten, kanaries en vinkachtigen. Bevat 15 verschillende zaden en gedroogd fruit. Verpakt per 2 kg.',
  12.99, null,
  '["https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=600"]',
  'vogels', 80, false
),

-- KNAAGDIEREN
(
  'Hamsterhuis Deluxe – Complete Set',
  'hamsterhuis-deluxe',
  'Complete behuizing voor hamsters en kleine knaagdieren. Inclusief loopwiel, waterfles, voederbak en schuilhut. Afmetingen: 60 x 40 x 50 cm. Eenvoudig te reinigen.',
  39.99, 47.99,
  '["https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=600"]',
  'knaagdieren', 25, true
),

-- VISSEN
(
  'LED Aquarium Verlichting 60cm',
  'led-aquarium-verlichting-60cm',
  'Energiezuinige LED balk speciaal voor aquaria. Bevordert plantengroei en geeft levende kleuren aan je vissen. Waterdicht (IP68), regelbaar lichtspectrum en timer functie.',
  34.99, 39.99,
  '["https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?w=600"]',
  'vissen', 40, false
);
