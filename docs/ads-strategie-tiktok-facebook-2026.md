# PawsNL Ads Strategie 2026 — TikTok & Facebook/Meta

> Markt: Nederland + Belgie | Niche: huisdierproducten (honden & katten)
> Budget: EUR 10-20/dag startbudget | Winnerproducten: Pootjesreiniger (EUR 14.95), LED Halsband (EUR 16.95)

---

## DEEL 1: JOUW CIJFERS EERST — BREAKEVEN ROAS BEREKENEN

Voordat je 1 cent uitgeeft aan ads, moet je weten wanneer je winst maakt.

### Formule: Breakeven ROAS

```
Breakeven ROAS = Verkoopprijs / (Verkoopprijs - Inkoopprijs - Verzendkosten - Transactiekosten)
```

### Jouw producten doorgerekend:

**Pootjesreiniger (EUR 14.95)**
- Inkoop CJ: ~EUR 1.72 ($1.86)
- Verzending CJ: ~EUR 3.00 (geschat)
- Stripe fee: ~EUR 0.70 (1.5% + EUR 0.25)
- Totale kosten: EUR 5.42
- Winst per stuk (zonder ads): EUR 9.53
- Winstmarge: 63.7%
- **Breakeven ROAS: 1.57** (elke EUR 1 aan ads moet EUR 1.57 opleveren)

**LED Halsband (EUR 16.95)**
- Inkoop CJ: ~EUR 1.10 ($1.19)
- Verzending CJ: ~EUR 3.00
- Stripe fee: ~EUR 0.76
- Totale kosten: EUR 4.86
- Winst per stuk (zonder ads): EUR 12.09
- Winstmarge: 71.3%
- **Breakeven ROAS: 1.40**

### Wat betekent dit?

| ROAS | Pootjesreiniger | LED Halsband | Status |
|------|----------------|--------------|--------|
| 1.0 | -EUR 5.42 verlies | -EUR 4.86 verlies | VERLIES |
| 1.57 | EUR 0.00 | +EUR 1.97 winst | BREAKEVEN / WINST |
| 2.0 | +EUR 2.05 winst | +EUR 3.62 winst | WINSTGEVEND |
| 3.0 | +EUR 4.99 winst | +EUR 6.21 winst | GOED SCHAALBAAR |
| 4.0+ | +EUR 6.22 winst | +EUR 7.61 winst | UITSTEKEND |

**Doel: ROAS van 2.5+ voor gezonde winst. 3.0+ voor schalen.**

> Industriestandaard 2026: gemiddelde eCommerce ROAS is 2.87:1. Voor dropshipping heb je 3.0-4.0 nodig om echt winstgevend te zijn na alle kosten.

---

## DEEL 2: TIKTOK ADS — COMPLETE GIDS

### 2.1 Account Setup

1. **TikTok Business Account** — al aangemaakt (Ads Manager ID: 7612903922939985921)
2. Ga naar ads.tiktok.com → Ads Manager
3. Stel betalingsmethode in (creditcard of PayPal)
4. **Installeer TikTok Pixel** op pawsnlshop.com:
   - Ads Manager → Assets → Events → Web Events
   - Kies "Manual Setup" of "TikTok Pixel Helper"
   - Voeg de pixel-code toe aan je Next.js `<head>`
   - Stel events in: `ViewContent`, `AddToCart`, `InitiateCheckout`, `CompletePayment`
   - Sla het Pixel ID op als `NEXT_PUBLIC_TIKTOK_PIXEL_ID` in je .env

### 2.2 Minimumbudgetten TikTok (2026)

| Niveau | Minimum budget |
|--------|---------------|
| Campagne (dagelijks) | $50 USD (~EUR 46) |
| Campagne (totaal) | $50 USD |
| Advertentiegroep (dagelijks) | $20 USD (~EUR 18.50) |
| Advertentiegroep (totaal) | $20 x aantal dagen |

**Praktisch:** Met EUR 20/dag kun je 1 advertentiegroep testen. Met EUR 40/dag kun je 2 advertentiegroepen tegelijk testen.

### 2.3 Campagnestructuur — ABO Testing Phase

**Stap 1: Test met ABO (Ad Group Budget Optimization)**

```
CAMPAGNE: [TEST] Pootjesreiniger - Conversie
├── Advertentiegroep 1: Interesse "Honden" — EUR 20/dag
│   ├── Ad 1: UGC-stijl video (probleem → oplossing)
│   ├── Ad 2: Demo video (product in actie)
│   └── Ad 3: Before/After video
├── Advertentiegroep 2: Interesse "Huisdieren + Online Shoppen" — EUR 20/dag
│   ├── Ad 1: UGC-stijl video
│   ├── Ad 2: Demo video
│   └── Ad 3: Before/After video
└── Advertentiegroep 3: Broad (geen interesses) — EUR 20/dag
    ├── Ad 1: UGC-stijl video
    ├── Ad 2: Demo video
    └── Ad 3: Before/After video
```

**Instellingen per advertentiegroep:**
- Optimalisatiedoel: Conversies → CompletePayment
- Locatie: Nederland + Belgie
- Leeftijd: 25-55 (huisdiereigenaren)
- Taal: Nederlands
- Plaatsing: Alleen TikTok (niet Pangle)
- Biedstrategie: "Lowest Cost" (laat TikTok optimaliseren)

### 2.4 Ad Creative — Wat Werkt op TikTok

**DE GOUDEN REGEL: De eerste 3 seconden bepalen 71% van je succes.**

45% van de mensen die de eerste 3 seconden kijken, kijkt minstens 30 seconden door. 63% van de best presterende TikTok ads plaatsen hun kernboodschap in de eerste 3 seconden.

**Ideale video-opbouw voor pet products:**

```
[0-3 sec]  HOOK — Pakt aandacht
[3-8 sec]  PROBLEEM — Herkenbaar probleem tonen
[8-20 sec] OPLOSSING — Product in actie
[20-25 sec] SOCIAL PROOF — Reviews/resultaten
[25-30 sec] CTA — "Bestel nu via link in bio"
```

**Optimale videoduur:** 15-30 seconden (korter = beter voor ads)

**5 Bewezen Hook-Formules voor Pet Products:**

1. **Schokkende vraag:** "Wist je dat 80% van de hondeneigenaren dit fout doet?"
2. **Before/After:** [Vieze pootjes → schone pootjes in 5 seconden]
3. **Probleem-agitatie:** "Modderige pootafdrukken op je WITTE bank..."
4. **Reactie-hook:** "Kijk hoe mijn hond reageert op dit product..."
5. **Autoriteit:** "Dierenartsen raden dit aan en dit is waarom..."

**UGC (User Generated Content) stijl wint:**
- Natief, creator-stijl content verslaat gepolijste studio-ads
- Film alsof het een gewone TikTok is, niet een reclame
- Gebruik tekst-overlays in het Nederlands
- Toon echte mensen (of AI-gegenereerde "echte" scenes) met huisdieren

### 2.5 Targeting voor Nederland & Belgie

**TikTok bereik:**
- Belgie: ~4.5 miljoen bereikbare gebruikers (18+)
- Nederland: geschat ~6-7 miljoen bereikbare gebruikers (18+)
- CPM in Benelux: EUR 3-7 (buiten Q4), hoger in november/december

**Interesses om te testen:**
- Huisdieren / Pets
- Honden / Dogs
- Katten / Cats
- Hondentraining
- Dierenverzorging
- Online winkelen
- Broad (geen interesses — laat TikTok's algoritme het werk doen)

**Tip:** In 2026 werkt "broad targeting" (geen specifieke interesses) vaak beter dan nauwkeurige targeting, omdat TikTok's algoritme zelf de beste kopers vindt via je pixel-data.

### 2.6 Kill Metrics — Wanneer Zet Je Een Ad Uit?

**De 1.5x CPA Regel:**

```
Als een advertentiegroep 1.5x je Target CPA heeft uitgegeven met 0 verkopen → UIT.
```

**Voorbeeld Pootjesreiniger:**
- Verkoopprijs: EUR 14.95
- Winstmarge: EUR 9.53
- Maximale CPA (breakeven): EUR 9.53
- Target CPA (winstgevend): EUR 5.00-7.00
- **Kill-drempel: EUR 10.50 uitgegeven, 0 verkopen → UIT**

**BELANGRIJK: Wacht minimaal 48-72 uur voordat je oordeelt.** TikTok heeft tijd nodig om uit de leerfase te komen. Schaal of kill NIET op dag 1.

**Decision Framework na 3 dagen:**

| Metric | Goed | Matig | Slecht → Kill |
|--------|------|-------|---------------|
| CTR (klikratio) | >1.5% | 0.8-1.5% | <0.8% |
| CPC (kosten per klik) | <EUR 0.80 | EUR 0.80-1.50 | >EUR 1.50 |
| CVR (conversieratio) | >2% | 1-2% | <1% |
| ROAS | >2.5 | 1.5-2.5 | <1.5 |
| CPM | <EUR 7 | EUR 7-12 | >EUR 12 |

---

## DEEL 3: FACEBOOK / META ADS — COMPLETE GIDS

### 3.1 Account Setup

1. **Meta Business Suite** → business.facebook.com
2. Maak een Business Manager aan
3. Koppel je Facebook-pagina en Instagram-account
4. **Installeer Meta Pixel** op pawsnlshop.com:
   - Events Manager → Gegevensbronnen → Pixel toevoegen
   - Voeg pixel-code toe aan je Next.js `<head>`
   - Stel Conversions API (CAPI) in voor server-side tracking
   - Events: `PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`
5. **Stel Conversions API in** — in 2026 is dit essentieel door iOS privacy-updates
6. Verifieer je domein (pawsnlshop.com) in Business Manager

### 3.2 Minimumbudgetten Facebook (2026)

| Niveau | Minimum budget |
|--------|---------------|
| ABO advertentieset | EUR 1/dag (maar EUR 5+ aanbevolen) |
| CBO campagne | Geen hard minimum, maar EUR 20+ aanbevolen |

**Groot voordeel t.o.v. TikTok:** Facebook heeft veel lagere minimumbudgetten. Je kunt letterlijk met EUR 5/dag per advertentieset beginnen.

### 3.3 Campagnestructuur — ABO Testing Phase

**Stap 1: Test met ABO (Budget per advertentieset)**

```
CAMPAGNE: [TEST] Pootjesreiniger - Verkopen
Doel: Verkopen (Conversies)
├── Advertentieset 1: Interesse "Hondeneigenaren" — EUR 5/dag
│   ├── Ad 1: Video (UGC probleem/oplossing)
│   ├── Ad 2: Carousel (4 productfoto's)
│   └── Ad 3: Video (before/after)
├── Advertentieset 2: Interesse "Huisdierproducten" — EUR 5/dag
│   ├── Ad 1: Video
│   ├── Ad 2: Carousel
│   └── Ad 3: Video
├── Advertentieset 3: Interesse "Hondentraining + Dierenverzorging" — EUR 5/dag
│   ├── Ad 1: Video
│   ├── Ad 2: Carousel
│   └── Ad 3: Video
└── Advertentieset 4: Breed publiek (25-55, NL+BE) — EUR 5/dag
    ├── Ad 1: Video
    ├── Ad 2: Carousel
    └── Ad 3: Video
```

**Totaal testbudget: EUR 20/dag = EUR 140/week**

**Instellingen per advertentieset:**
- Campagnedoel: Verkopen
- Conversie-event: Purchase
- Locatie: Nederland + Belgie
- Leeftijd: 25-55
- Geslacht: Alle (vrouwen converteren vaak beter voor pet products)
- Taal: Nederlands
- Plaatsingen: Advantage+ Plaatsingen (laat Meta optimaliseren)
- Biedstrategie: Laagste kosten

### 3.4 Interest Targeting — Pet Products

**Beschikbare audiences op Facebook:**
- 24+ miljoen mensen die online hondenproducten kopen
- 17+ miljoen mensen die online kattenproducten kopen
- 17.7 miljoen die zich als hondeneigenaar identificeren
- 12.8 miljoen die zich als katteneigenaar identificeren

**Beste interesses om te testen (begin met deze):**

Groep A — Breed:
- Honden (Dogs)
- Katten (Cats)
- Huisdieren (Pets)

Groep B — Specifiek:
- Hondentraining (Dog training)
- Dierenverzorging (Pet care)
- Hondenvoer (Dog food)
- Hondenspeelgoed

Groep C — Gedrag + Interesse combo:
- Online winkelen + Hondeneigenaar
- Huisdierproducten + Ouders (pet parents)

Groep D — Lookalike (later):
- 1% Lookalike van kopers
- 1% Lookalike van AddToCart
- 1% Lookalike van websitebezoekers

**Tip:** Start met brede interesses (Groep A). Facebook's algoritme is in 2026 zo goed dat breed vaak beter werkt dan heel specifiek targeten.

### 3.5 Ad Creative — Wat Werkt op Facebook/Instagram

**Best presterende formaten (2026):**

1. **Video ads (15-30 sec)** — Verreweg het beste format
   - UGC-stijl verslaat studio-ads met 3-4x
   - Toon huisdieren die het product GEBRUIKEN
   - Ondertiteling verplicht (80% kijkt zonder geluid)

2. **Carousel ads** — 3-5 afbeeldingen
   - Beeld 1: Aandachttrekker (schattig huisdier + product)
   - Beeld 2-3: Product features/voordelen
   - Beeld 4: Social proof (reviews)
   - Beeld 5: Aanbieding + CTA

3. **Collection ads** — Productcatalogus
   - Pas later inzetten als je meer producten hebt

**Ad Copy Template (Nederlands):**

```
[HOOK] Heeft jouw hond ook altijd vieze pootjes na een wandeling?

[PROBLEEM] Moddersporen door je hele huis...
Handdoeken die niet echt helpen...
Elke keer weer dezelfde frustratie.

[OPLOSSING] De PawsNL Pootjesreiniger lost dit op in 10 seconden.
Zachte siliconen borstels + ingebouwde handdoek.
Geen gedoe, geen troep.

[SOCIAL PROOF] Al 500+ blije hondeneigenaren in Nederland

[CTA] Bestel nu met 40% korting
Gratis verzending | Niet goed? Geld terug.
👉 pawsnlshop.com
```

### 3.6 Kill Metrics — Wanneer Zet Je Een Ad Uit?

**Na 3 dagen testen (of EUR 15 per advertentieset):**

| Metric | Goed | Matig | Slecht → Kill |
|--------|------|-------|---------------|
| CTR (alle) | >2.5% | 1.5-2.5% | <1.5% |
| CTR (link clicks) | >1.5% | 0.8-1.5% | <0.8% |
| CPC (link click) | <EUR 1.00 | EUR 1.00-1.75 | >EUR 1.75 |
| CPM | <EUR 12 | EUR 12-20 | >EUR 20 |
| ROAS | >2.5 | 1.5-2.5 | <1.5 |
| Kosten per ATC | <EUR 3 | EUR 3-5 | >EUR 5 |

**Benchmarks Facebook 2026 (eCommerce/dropshipping):**
- Gemiddelde CTR dropshipping: 2.5%
- Gemiddelde CPC dropshipping: ~EUR 0.55
- Gemiddelde CPM: EUR 7-20 (afhankelijk van seizoen en concurrentie)
- CPC stijgt naar ~EUR 1.85 gemiddeld in 2026 door hogere concurrentie

**Kill-regel:** Geen verkoop na 2x je productprijs aan spend → advertentieset uit.
- Pootjesreiniger: geen verkoop na EUR 30 spend → UIT
- LED Halsband: geen verkoop na EUR 34 spend → UIT

---

## DEEL 4: TIKTOK vs FACEBOOK — VERGELIJKING

| Aspect | TikTok Ads | Facebook/Meta Ads |
|--------|-----------|-------------------|
| **Min. budget/dag** | EUR 18.50/advertentiegroep | EUR 5/advertentieset |
| **Beste voor beginners** | Nee (hoog minimum) | JA (laag minimum) |
| **CPM (Benelux)** | EUR 3-7 | EUR 7-20 |
| **CPC gemiddeld** | ~EUR 1.40 | ~EUR 1.75 |
| **CTR gemiddeld** | ~0.8% | ~2.5% |
| **ROAS gemiddeld** | 1.2-3.0x | ~2.0-3.0x |
| **Leeftijd publiek** | 18-34 (jonger) | 25-55 (breder) |
| **Ad formaat** | Alleen video | Video + afbeelding + carousel |
| **Pixel/tracking** | TikTok Pixel | Meta Pixel + CAPI |
| **Algoritme** | Snel lerend, onvoorspelbaar | Stabiel, betrouwbaar |
| **Account risico** | Laag (makkelijk nieuw account) | Hoog (bans moeilijk op te lossen) |
| **Pet product fit** | Uitstekend (visueel, viraal) | Uitstekend (brede reach) |

### Aanbeveling voor PawsNL

**Start met Facebook Ads EERST:**
1. Lager minimumbudget (EUR 5/dag vs EUR 18.50/dag)
2. Stabieler platform voor beginners
3. Carousel ads mogelijk (hoef niet ALLES video te zijn)
4. Beter voor NL/BE targeting (meer data)

**Voeg TikTok Ads toe zodra:**
1. Je een winnend product hebt gevonden op Facebook
2. Je 3-5 video-creatives hebt die werken
3. Je budget kunt verhogen naar EUR 40+/dag
4. Je TikTok Pixel voldoende data heeft (50+ events)

---

## DEEL 5: SCHAALSTRATEGIE — VAN EUR 10/DAG NAAR EUR 100+/DAG

### Fase 1: Testen (Week 1-2) — EUR 20/dag

**Doel:** Vind je winnende ad creative en audience

- Facebook ABO: 4 advertentiesets x EUR 5/dag = EUR 20/dag
- Test 3 ads per advertentieset (12 ads totaal)
- Elke ad test een andere hoek: probleem, voordeel, social proof, demo
- Na 3 dagen: kill verliezers, houd winnaars aan

**Verwachte kosten:** EUR 140-280
**Verwacht resultaat:** 1-3 winnende ads geidentificeerd

### Fase 2: Valideren (Week 3-4) — EUR 30-40/dag

**Doel:** Bevestig dat je winnaar consistent presteert

- Verhoog budget van winnende advertentiesets met max 20% per 2-3 dagen
- NOOIT meer dan 20% per keer verhogen (reset het algoritme)
- Test 2-3 nieuwe creatives met dezelfde hoek als je winnaar
- Begin met Lookalike audiences (1% van websitebezoekers)

**Schaalschema:**
```
Dag 1-3:  EUR 5/dag   → Testen
Dag 4-6:  EUR 6/dag   → +20% als ROAS >2.5
Dag 7-9:  EUR 7.20/dag → +20%
Dag 10-12: EUR 8.65/dag → +20%
Dag 13-15: EUR 10.40/dag → +20%
```

### Fase 3: Schalen met CBO (Week 5-8) — EUR 50-100/dag

**Doel:** Laat het algoritme optimaliseren over meerdere audiences

- Maak een NIEUWE CBO-campagne
- Zet je 2-3 beste advertentiesets erin (gebruik "post ID" om bestaande ads te dupliceren zodat social proof behouden blijft)
- Budget: EUR 50/dag op campagneniveau
- Facebook verdeelt automatisch budget naar best presterende set

```
CAMPAGNE: [SCALE] Pootjesreiniger - CBO EUR 50/dag
├── Advertentieset 1: Winnende interesse (beste creative)
├── Advertentieset 2: Lookalike 1% kopers (beste creative)
├── Advertentieset 3: Breed publiek (beste creative)
└── Advertentieset 4: Retargeting bezoekers 7 dagen
```

### Fase 4: Agressief Schalen (Week 9+) — EUR 100+/dag

- **Horizontaal schalen:** Test nieuwe audiences en creatives in aparte ABO-campagnes
- **Verticaal schalen:** Verhoog CBO budget met 20% per 3 dagen
- **Retargeting:** Stel aparte campagne in voor winkelwagenverlaters
- **TikTok toevoegen:** Neem je best presterende video's en test ze op TikTok
- **Creative vernieuwen:** Elke 7-14 dagen nieuwe variaties maken (ad fatigue)

### Herinvestering Regel

**Investeer 25-35% van je nettowinst terug in ads.**

Voorbeeld bij EUR 1.000 omzet/maand:
- Productkosten: ~EUR 350
- Ads: ~EUR 300
- Stripe/Vercel/overig: ~EUR 50
- Nettowinst: ~EUR 300
- Herinvestering: EUR 75-105 extra ads budget volgende maand

---

## DEEL 6: VEELGEMAAKTE FOUTEN (EN HOE ZE TE VERMIJDEN)

### Fout 1: Te snel oordelen
**Probleem:** Ad na 1 dag uitzetten omdat er geen verkoop is.
**Oplossing:** Wacht minimaal 48-72 uur. Het algoritme heeft tijd nodig om te leren.

### Fout 2: Te veel tegelijk wijzigen
**Probleem:** Budget, targeting, EN creative tegelijk aanpassen.
**Oplossing:** Verander 1 ding per keer. Anders weet je niet wat werkt.

### Fout 3: Budget te snel verhogen
**Probleem:** Van EUR 5 naar EUR 50 in een keer → ROAS klapt in.
**Oplossing:** Max 20% verhoging per 2-3 dagen. Geduld is key.

### Fout 4: Geen pixel data
**Probleem:** Pixel niet goed geinstalleerd, geen conversie-events.
**Oplossing:** Installeer pixel EERST. Test met Facebook Pixel Helper / TikTok Pixel Helper extensie. Zonder pixel data kan het algoritme niet optimaliseren.

### Fout 5: Slechte creative
**Probleem:** Stockfoto's of saaie productvideo's.
**Oplossing:** UGC-stijl video's. Eerste 3 seconden moeten PAKKEN. Test minimaal 3 verschillende hooks per product.

### Fout 6: Verkeerde optimalisatie
**Probleem:** Optimaliseren voor Traffic in plaats van Conversies.
**Oplossing:** ALTIJD optimaliseren voor Purchase/CompletePayment. Traffic-campagnes brengen kijkers, geen kopers.

### Fout 7: Geen retargeting
**Probleem:** Alleen cold traffic, vergeet warme bezoekers.
**Oplossing:** Stel vanaf dag 1 een retargeting-campagne in voor:
- Websitebezoekers laatste 7 dagen
- AddToCart maar geen Purchase (laatste 14 dagen)
- Video viewers 75%+ (laatste 30 dagen)

### Fout 8: Landing page niet geoptimaliseerd
**Probleem:** Goede ads maar slechte productpagina.
**Oplossing:** Zorg dat je productpagina snel laadt (<3 sec), mobiel-vriendelijk is, reviews toont, en een duidelijke CTA heeft. De ad is slechts de eerste stap.

### Fout 9: Geen A/B testing van creatives
**Probleem:** Slechts 1 ad per advertentieset draaien.
**Oplossing:** Altijd 3-5 creatives per advertentieset. Test verschillende hooks, formats, en hoeken. Het verschil tussen een winnende en verliezende ad kan 10x ROAS zijn.

### Fout 10: ROAS obsessie op dag 1
**Probleem:** Elke dag paniek over ROAS.
**Oplossing:** Kijk naar 3-dagen en 7-dagen gemiddelden. Dagelijkse fluctuaties zijn normaal. De trend telt, niet individuele dagen.

---

## DEEL 7: METRICS DASHBOARD — WAT JE DAGELIJKS MOET CHECKEN

### Dagelijks (2 minuten)

| Metric | Waar | Doel |
|--------|------|------|
| Spend | Ads Manager | Binnen budget? |
| ROAS | Ads Manager | >2.5? |
| Aankopen | Ads Manager | Hoeveel sales? |

### Om de 3 dagen (10 minuten)

| Metric | Doel | Actie als slecht |
|--------|------|-----------------|
| CTR | >1.5% FB / >0.8% TT | Nieuwe creative nodig |
| CPC | <EUR 1.50 | Targeting aanpassen |
| CPM | <EUR 15 | Audience te klein of te competitief |
| CVR (site) | >1.5% | Productpagina verbeteren |
| Cost per ATC | <EUR 3 | Aanbieding/urgentie toevoegen |
| Frequency | <3.0 | Audience te klein, verbreden |

### Wekelijks (30 minuten)

- Welke creatives presteren het best? → Maak variaties
- Welke audiences presteren het best? → Verhoog budget
- Wat is je gemiddelde ROAS deze week? → Boven breakeven?
- Hoeveel nieuwe klanten? → Bereken Customer Acquisition Cost
- Ad fatigue? (dalende CTR bij hoge frequency) → Nieuwe creatives

---

## DEEL 8: CONCREET ACTIEPLAN VOOR PAWSNL

### Week 0 (Voorbereiding) — EUR 0 kosten

- [ ] Stripe LIVE keys instellen (BLOKKEER voor echte verkopen!)
- [ ] Meta Pixel installeren op pawsnlshop.com
- [ ] TikTok Pixel installeren op pawsnlshop.com
- [ ] Meta Business Suite account aanmaken
- [ ] Betalingsmethode toevoegen aan beide platforms
- [ ] 3-5 video ads maken (AI-gegenereerd via InVideo AI / Creatify)
- [ ] 2-3 carousel ads maken (Canva + CJ productfoto's)
- [ ] Productpagina's checken: snelheid, mobiel, reviews, CTA

### Week 1-2: Facebook Test — EUR 20/dag (EUR 280 totaal)

- [ ] Start 4 ABO advertentiesets a EUR 5/dag
- [ ] Product: Pootjesreiniger (hoogste wow-factor)
- [ ] 3 ads per set: video (UGC), carousel, video (demo)
- [ ] Na 3 dagen: kill <1.5% CTR of >EUR 2 CPC
- [ ] Na 7 dagen: identificeer winnende ad + audience

### Week 3-4: Facebook Validatie — EUR 30/dag (EUR 420 totaal)

- [ ] Verhoog winnende sets met 20% per 3 dagen
- [ ] Maak 3 nieuwe variaties van winnende creative
- [ ] Test Lookalike audience (1% websitebezoekers)
- [ ] Start retargeting campagne (EUR 5/dag)
- [ ] Evalueer: consistent ROAS >2.5?

### Week 5-6: Facebook CBO + TikTok Test — EUR 50/dag

- [ ] Facebook: Maak CBO campagne met winnende sets (EUR 30/dag)
- [ ] TikTok: Start eerste test met beste video (EUR 20/dag)
- [ ] Vergelijk performance tussen platforms
- [ ] Test LED Halsband als tweede product

### Week 7-8: Schalen — EUR 75-100/dag

- [ ] Verhoog CBO budget met 20% per 3 dagen
- [ ] Horizontaal schalen: nieuwe audiences testen
- [ ] Creative refresh: nieuwe video-variaties
- [ ] Doel: EUR 1.000+ omzet/maand

### Budget Overzicht Eerste 2 Maanden

| Periode | Platform | Budget/dag | Totaal |
|---------|----------|-----------|--------|
| Week 1-2 | Facebook | EUR 20 | EUR 280 |
| Week 3-4 | Facebook | EUR 30 | EUR 420 |
| Week 5-6 | FB + TikTok | EUR 50 | EUR 700 |
| Week 7-8 | FB + TikTok | EUR 75 | EUR 1.050 |
| **TOTAAL** | | | **EUR 2.450** |

**Verwachte omzet bij ROAS 2.5:** EUR 6.125
**Verwachte brutowinst:** ~EUR 3.675 (60% marge)
**Nettowinst na ads:** ~EUR 1.225

---

## DEEL 9: HANDIGE TOOLS & RESOURCES

| Tool | Kosten | Waarvoor |
|------|--------|----------|
| Meta Ad Library | Gratis | Concurrent ads bekijken |
| TikTok Creative Center | Gratis | Trending ads en muziek vinden |
| TikTok Pixel Helper (Chrome) | Gratis | Pixel installatie testen |
| Meta Pixel Helper (Chrome) | Gratis | Pixel installatie testen |
| Canva Pro | EUR 12/mnd | Carousel ads en thumbnails |
| InVideo AI | Gratis start | AI video ads genereren |
| Creatify AI | $19/mnd | URL-naar-video voor ads |
| Minea | $49/mnd | Ad spy tool (LATER pas nodig) |

---

## BRONNEN

- [Shopify — TikTok Ads 2026 Guide](https://www.shopify.com/blog/tiktok-ads)
- [TrueProfit — Facebook Ads for Dropshipping](https://trueprofit.io/blog/facebook-ads-for-dropshipping)
- [BrandsGateway — Facebook vs TikTok Ads](https://brandsgateway.com/blog/facebook-ads-vs-tiktok-ads/)
- [TikAdTools — Scale TikTok Ads Without Killing ROAS](https://tikadtools.com/blog/scale-tiktok-ads/)
- [AdsUploader — ABO vs CBO 2026](https://adsuploader.com/blog/abo-vs-cbo)
- [Upbeat Agency — Facebook Ads for Pet Products](https://upbeatagency.com/facebook-ads-for-pet-products/)
- [TrendTrack — Good ROAS for eCommerce 2026](https://www.trendtrack.io/blog-post/what-is-a-good-roas-for-ecommerce)
- [Creatify — TikTok Ads Complete Guide 2026](https://creatify.ai/blog/tiktok-ads-complete-guide-to-creating-high-performing-creatives-in-2026)
- [DoDropshipping — Facebook Ad Tips 2026](https://dodropshipping.com/facebook-ad-tips-for-dropshipping-stores/)
- [Zeely — 15 Facebook Dropshipping Ads 2026](https://zeely.ai/blog/15-facebook-dropshipping-ads/)
- [TikTok Ads Manager — Budget Help](https://ads.tiktok.com/help/article/budget?lang=en)
- [TikTok Ads Manager — Location Targeting](https://ads.tiktok.com/help/article/location-targeting?lang=en)
- [Minea — TikTok Dropshipping 2026](https://www.minea.com/how-to-start-a-dropshipping-business/tiktok-dropshipping)
- [10xCrew — TikTok Shop Netherlands 2026](https://10xcrew.com/tiktok-shop-netherlands-anticipating-the-2026-launch/)
- [Triple Whale — TikTok vs Facebook Ads](https://www.triplewhale.com/blog/tiktok-ads-vs-facebook-ads)
- [Kill Your Darlings — TikTok Advertising Belgium](https://www.killyourdarlings.be/insights/tiktok-advertising-belgium-food-drinks-hospitality)
