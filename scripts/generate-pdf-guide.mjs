import puppeteer from 'puppeteer'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outputPath = path.join(__dirname, '..', 'public', 'gids-gelukkig-huisdier.pdf')

const html = `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Inter', -apple-system, sans-serif;
      color: #1f2937;
      line-height: 1.7;
      font-size: 11pt;
    }

    /* ─── Cover Page ─── */
    .cover {
      height: 100vh;
      background: linear-gradient(135deg, #f97316, #ea580c);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      color: white;
      padding: 60px;
      page-break-after: always;
    }
    .cover-emoji { font-size: 80pt; margin-bottom: 20px; }
    .cover h1 { font-size: 28pt; font-weight: 800; margin-bottom: 12px; line-height: 1.2; }
    .cover h2 { font-size: 14pt; font-weight: 400; opacity: 0.9; margin-bottom: 40px; }
    .cover-badge {
      background: rgba(255,255,255,0.2);
      border-radius: 30px;
      padding: 8px 24px;
      font-size: 10pt;
      font-weight: 600;
    }
    .cover-footer {
      margin-top: auto;
      font-size: 9pt;
      opacity: 0.7;
    }

    /* ─── Pages ─── */
    .page {
      padding: 50px 55px;
      page-break-after: always;
      min-height: 100vh;
    }
    .page:last-child { page-break-after: avoid; }

    /* ─── Headers ─── */
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid #f97316;
      padding-bottom: 10px;
      margin-bottom: 30px;
    }
    .page-header-logo { font-weight: 700; color: #f97316; font-size: 10pt; }
    .page-header-title { font-size: 9pt; color: #9ca3af; }

    /* ─── Section titles ─── */
    .section-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: #f97316;
      color: white;
      font-weight: 800;
      font-size: 14pt;
      border-radius: 10px;
      margin-bottom: 10px;
    }
    h2 {
      font-size: 20pt;
      font-weight: 800;
      color: #111827;
      margin-bottom: 6px;
    }
    h2 .emoji { margin-right: 8px; }
    .section-subtitle {
      font-size: 11pt;
      color: #6b7280;
      margin-bottom: 24px;
    }

    h3 {
      font-size: 13pt;
      font-weight: 700;
      color: #1f2937;
      margin-top: 22px;
      margin-bottom: 8px;
    }

    p { margin-bottom: 12px; }

    /* ─── Tip boxes ─── */
    .tip-box {
      background: #fff7ed;
      border-left: 4px solid #f97316;
      border-radius: 0 10px 10px 0;
      padding: 14px 18px;
      margin: 16px 0;
    }
    .tip-box-green {
      background: #f0fdf4;
      border-left-color: #16a34a;
    }
    .tip-box-blue {
      background: #eff6ff;
      border-left-color: #2563eb;
    }
    .tip-box-purple {
      background: #faf5ff;
      border-left-color: #9333ea;
    }
    .tip-box strong { display: block; margin-bottom: 4px; font-size: 10pt; }

    /* ─── Checklist ─── */
    .checklist { list-style: none; padding: 0; }
    .checklist li {
      padding: 8px 0 8px 28px;
      position: relative;
      border-bottom: 1px solid #f3f4f6;
    }
    .checklist li:last-child { border-bottom: none; }
    .checklist li::before {
      content: "\\2713";
      position: absolute;
      left: 0;
      color: #16a34a;
      font-weight: 700;
      font-size: 13pt;
    }

    /* ─── Numbered list ─── */
    .numbered-list { list-style: none; padding: 0; counter-reset: item; }
    .numbered-list li {
      padding: 10px 0 10px 40px;
      position: relative;
      counter-increment: item;
      border-bottom: 1px solid #f3f4f6;
    }
    .numbered-list li:last-child { border-bottom: none; }
    .numbered-list li::before {
      content: counter(item);
      position: absolute;
      left: 0;
      width: 26px;
      height: 26px;
      background: #f97316;
      color: white;
      font-weight: 700;
      font-size: 10pt;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      top: 10px;
    }

    /* ─── Grid ─── */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin: 16px 0;
    }
    .grid-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
    }
    .grid-card h4 {
      font-size: 11pt;
      font-weight: 700;
      margin-bottom: 6px;
      color: #111827;
    }
    .grid-card p { font-size: 10pt; color: #4b5563; margin-bottom: 0; }

    /* ─── Stats ─── */
    .stat-row {
      display: flex;
      gap: 12px;
      margin: 16px 0;
    }
    .stat-box {
      flex: 1;
      text-align: center;
      background: #f0fdf4;
      border-radius: 12px;
      padding: 16px;
    }
    .stat-box .number { font-size: 22pt; font-weight: 800; color: #16a34a; }
    .stat-box .label { font-size: 8pt; color: #6b7280; margin-top: 2px; }

    /* ─── Table of Contents ─── */
    .toc { list-style: none; padding: 0; }
    .toc li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px dashed #d1d5db;
      font-size: 11pt;
    }
    .toc li .toc-num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      background: #f97316;
      color: white;
      font-weight: 700;
      font-size: 9pt;
      border-radius: 6px;
      margin-right: 10px;
    }
    .toc li .toc-page { color: #f97316; font-weight: 600; }

    /* ─── Footer CTA ─── */
    .cta-box {
      background: linear-gradient(135deg, #f97316, #ea580c);
      color: white;
      border-radius: 16px;
      padding: 30px;
      text-align: center;
      margin-top: 30px;
    }
    .cta-box h3 { color: white; font-size: 16pt; margin-bottom: 8px; }
    .cta-box p { color: rgba(255,255,255,0.9); margin-bottom: 0; }
    .cta-box .cta-url {
      display: inline-block;
      background: white;
      color: #ea580c;
      font-weight: 700;
      padding: 10px 28px;
      border-radius: 10px;
      margin-top: 16px;
      font-size: 12pt;
      text-decoration: none;
    }

    /* ─── Do/Don't ─── */
    .do-dont {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin: 16px 0;
    }
    .do-box, .dont-box {
      border-radius: 12px;
      padding: 16px;
    }
    .do-box { background: #f0fdf4; border: 1px solid #bbf7d0; }
    .dont-box { background: #fef2f2; border: 1px solid #fecaca; }
    .do-box h4 { color: #16a34a; font-size: 11pt; margin-bottom: 8px; }
    .dont-box h4 { color: #dc2626; font-size: 11pt; margin-bottom: 8px; }
    .do-box ul, .dont-box ul { padding-left: 16px; font-size: 10pt; }
    .do-box li { color: #166534; margin-bottom: 4px; }
    .dont-box li { color: #991b1b; margin-bottom: 4px; }
  </style>
</head>
<body>

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- COVER PAGE -->
<!-- ═══════════════════════════════════════════════════════════ -->
<div class="cover">
  <div class="cover-emoji">&#x1F43E;</div>
  <h1>De Ultieme Gids<br>voor een Gelukkig<br>Huisdier</h1>
  <h2>Voeding, verzorging, gedrag & meer — voor honden, katten en andere huisdieren</h2>
  <div class="cover-badge">GRATIS GIDS — 2026 EDITIE</div>
  <div class="cover-footer">
    <p>Samengesteld door PawsNL — pawsnlshop.com</p>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- TABLE OF CONTENTS -->
<!-- ═══════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="page-header">
    <div class="page-header-logo">&#x1F43E; PawsNL</div>
    <div class="page-header-title">Inhoudsopgave</div>
  </div>

  <h2>Inhoudsopgave</h2>
  <p class="section-subtitle">Alles wat je moet weten in 7 hoofdstukken</p>

  <ul class="toc">
    <li><span><span class="toc-num">1</span> De 5 Basisbehoeften van Elk Huisdier</span> <span class="toc-page">3</span></li>
    <li><span><span class="toc-num">2</span> Voeding: Wat Wél en Wat Niet</span> <span class="toc-page">4</span></li>
    <li><span><span class="toc-num">3</span> Gedrag Begrijpen & Problemen Voorkomen</span> <span class="toc-page">5</span></li>
    <li><span><span class="toc-num">4</span> Gezondheid & Preventieve Zorg</span> <span class="toc-page">6</span></li>
    <li><span><span class="toc-num">5</span> De Ideale Leefomgeving</span> <span class="toc-page">7</span></li>
    <li><span><span class="toc-num">6</span> Training & Mentale Stimulatie</span> <span class="toc-page">8</span></li>
    <li><span><span class="toc-num">7</span> Checklist: Jouw Huisdier Gelukkig Houden</span> <span class="toc-page">9</span></li>
  </ul>

  <div class="tip-box" style="margin-top: 30px;">
    <strong>&#x1F4A1; Over deze gids</strong>
    Deze gids is samengesteld door het PawsNL team op basis van adviezen van dierenartsen,
    gedragsdeskundigen en onze eigen ervaring als dierenliefhebbers. Of je nu een hond, kat,
    konijn, hamster of vogel hebt — deze tips helpen je om het beste baasje te zijn.
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- CHAPTER 1 -->
<!-- ═══════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="page-header">
    <div class="page-header-logo">&#x1F43E; PawsNL</div>
    <div class="page-header-title">Hoofdstuk 1</div>
  </div>

  <div class="section-number">1</div>
  <h2>De 5 Basisbehoeften van Elk Huisdier</h2>
  <p class="section-subtitle">Elk huisdier — van goudvis tot Duitse herder — heeft dezelfde basisbehoeften.</p>

  <p>Wetenschappelijk onderzoek toont aan dat huisdieren die aan alle vijf basisbehoeften voldoen, <strong>tot 3 jaar langer leven</strong> en significant minder gedragsproblemen vertonen. Dit zijn de vijf pijlers:</p>

  <ol class="numbered-list">
    <li><strong>Goede voeding</strong> — Kwalitatief voer afgestemd op leeftijd, ras en gezondheid. Goedkoop voer is vaak duurkoop: het leidt tot gezondheidsproblemen op de lange termijn.</li>
    <li><strong>Veilige leefomgeving</strong> — Een rustige slaapplek, voldoende ruimte en een omgeving vrij van gevaren. Denk aan temperatuur, ventilatie en schuilplekken.</li>
    <li><strong>Lichamelijke gezondheid</strong> — Regelmatige check-ups bij de dierenarts, vaccinaties op tijd en parasietpreventie. Preventie is altijd goedkoper dan behandeling.</li>
    <li><strong>Mentale stimulatie</strong> — Verveling is de #1 oorzaak van gedragsproblemen. Puzzelspeelgoed, training en afwisseling houden je huisdier mentaal fit.</li>
    <li><strong>Sociaal contact</strong> — Huisdieren zijn sociale wezens. Dagelijkse aandacht, spel en knuffeltijd zijn essentieel voor hun welzijn.</li>
  </ol>

  <div class="stat-row">
    <div class="stat-box">
      <div class="number">73%</div>
      <div class="label">van gedragsproblemen komt<br>door verveling of stress</div>
    </div>
    <div class="stat-box">
      <div class="number">+3 jaar</div>
      <div class="label">langer leven bij goede<br>verzorging & voeding</div>
    </div>
    <div class="stat-box">
      <div class="number">2x</div>
      <div class="label">per jaar naar de dierenarts<br>wordt aanbevolen</div>
    </div>
  </div>

  <div class="tip-box tip-box-green">
    <strong>&#x2705; Pro tip</strong>
    Maak een jaarlijks "huisdier wellness plan" aan. Plan de dierenarts bezoeken,
    ontworming en vaccinaties vooruit in je agenda. Zo vergeet je niks.
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- CHAPTER 2 -->
<!-- ═══════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="page-header">
    <div class="page-header-logo">&#x1F43E; PawsNL</div>
    <div class="page-header-title">Hoofdstuk 2</div>
  </div>

  <div class="section-number">2</div>
  <h2>&#x1F96A; Voeding: Wat Wel en Wat Niet</h2>
  <p class="section-subtitle">De juiste voeding is de basis voor een gezond en lang leven.</p>

  <h3>Honden</h3>
  <p>Honden zijn omnivoren en hebben een gevarieerd dieet nodig. Kies voor voer met <strong>vlees als eerste ingrediënt</strong> (niet granen of bijproducten). Let op de levensfase: puppy's, volwassenen en senioren hebben andere behoeften.</p>

  <div class="do-dont">
    <div class="do-box">
      <h4>&#x2705; Wél geven</h4>
      <ul>
        <li>Wortel, broccoli, komkommer</li>
        <li>Appel (zonder pitjes)</li>
        <li>Gekookt ei</li>
        <li>Blauwe bessen</li>
        <li>Gekookte zoete aardappel</li>
      </ul>
    </div>
    <div class="dont-box">
      <h4>&#x274C; Nooit geven</h4>
      <ul>
        <li>Chocolade (giftig!)</li>
        <li>Druiven & rozijnen</li>
        <li>Uien & knoflook</li>
        <li>Xylitol (in kauwgom)</li>
        <li>Macadamianoten</li>
      </ul>
    </div>
  </div>

  <h3>Katten</h3>
  <p>Katten zijn <strong>obligate carnivoren</strong> — ze hebben dierlijke eiwitten nodig om te overleven. Droogvoer is prima, maar combineer het met natvoer voor extra vocht. Katten drinken van nature weinig water.</p>

  <div class="tip-box tip-box-blue">
    <strong>&#x1F4A7; Belangrijk: water voor katten</strong>
    Katten drinken liever stromend water dan stilstaand water. Een drinkfontein kan
    de waterinname met <strong>tot 200% verhogen</strong> — cruciaal voor de nieren.
    Plaats de waterbak niet naast het voerbakje.
  </div>

  <h3>Kleine huisdieren</h3>
  <p><strong>Konijnen & hamsters:</strong> Onbeperkt hooi is de basis. Aanvullen met verse groente en een kleine hoeveelheid pellets. Fruit alleen als traktatie (max 1x per dag).</p>
  <p><strong>Vogels:</strong> Zaadmix als basis, aangevuld met verse groente en fruit. Sepiaschelp voor calcium. Vermijd avocado — dit is giftig voor vogels!</p>

  <div class="tip-box">
    <strong>&#x1F4B0; Bespaartip</strong>
    Investeer in kwalitatief voer. Het lijkt duurder, maar je huisdier eet er minder
    van (meer voedingswaarde per portie) en je bespaart op dierenarts kosten.
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- CHAPTER 3 -->
<!-- ═══════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="page-header">
    <div class="page-header-logo">&#x1F43E; PawsNL</div>
    <div class="page-header-title">Hoofdstuk 3</div>
  </div>

  <div class="section-number">3</div>
  <h2>&#x1F9E0; Gedrag Begrijpen & Problemen Voorkomen</h2>
  <p class="section-subtitle">De meeste gedragsproblemen zijn geen "stoutheid" — het is communicatie.</p>

  <p>Elk ongewenst gedrag heeft een <strong>onderliggende oorzaak</strong>. In plaats van straffen, is het effectiever om de oorzaak aan te pakken. Dit is wat de wetenschap ons vertelt:</p>

  <h3>Top 5 gedragsproblemen bij honden</h3>
  <div class="grid-2">
    <div class="grid-card">
      <h4>1. Blaffen</h4>
      <p><strong>Oorzaak:</strong> Verveling, angst of territoriumgedrag.<br><strong>Oplossing:</strong> Meer mentale stimulatie, rustige omgeving, niet bestraffen.</p>
    </div>
    <div class="grid-card">
      <h4>2. Trekken aan de riem</h4>
      <p><strong>Oorzaak:</strong> Opwinding, niet geleerd.<br><strong>Oplossing:</strong> Stop-en-ga methode: stop als hij trekt, loop pas verder als de riem slap hangt.</p>
    </div>
    <div class="grid-card">
      <h4>3. Verlatingsangst</h4>
      <p><strong>Oorzaak:</strong> Onveilige hechting, plotseling alleen.<br><strong>Oplossing:</strong> Geleidelijk opbouwen, puzzelspeelgoed bij vertrek.</p>
    </div>
    <div class="grid-card">
      <h4>4. Springen tegen mensen</h4>
      <p><strong>Oorzaak:</strong> Enthousiasme, aandacht zoeken.<br><strong>Oplossing:</strong> Negeer het springen, beloon pas als alle 4 poten op de grond staan.</p>
    </div>
  </div>

  <h3>Top 3 gedragsproblemen bij katten</h3>
  <div class="grid-2">
    <div class="grid-card">
      <h4>1. Krabben aan meubels</h4>
      <p><strong>Oorzaak:</strong> Natuurlijk gedrag (nagels slijpen).<br><strong>Oplossing:</strong> Krabpaal op de juiste plek. Minimaal 1 per kat + 1 extra.</p>
    </div>
    <div class="grid-card">
      <h4>2. Nachtelijk miauwen</h4>
      <p><strong>Oorzaak:</strong> Verveling, honger, aandacht.<br><strong>Oplossing:</strong> Intensief spelen voor het slapengaan, automatische voerbak.</p>
    </div>
    <div class="grid-card">
      <h4>3. Plassen buiten de bak</h4>
      <p><strong>Oorzaak:</strong> Stress, vuile bak, medisch probleem.<br><strong>Oplossing:</strong> Eerst naar de dierenarts. Regel: 1 bak per kat + 1 extra.</p>
    </div>
    <div class="grid-card" style="border-color: #f97316;">
      <h4>&#x1F4A1; Gouden regel</h4>
      <p><strong>Beloon gewenst gedrag</strong> in plaats van ongewenst gedrag te bestraffen. Positieve bekrachtiging werkt tot 5x effectiever dan straf.</p>
    </div>
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- CHAPTER 4 -->
<!-- ═══════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="page-header">
    <div class="page-header-logo">&#x1F43E; PawsNL</div>
    <div class="page-header-title">Hoofdstuk 4</div>
  </div>

  <div class="section-number">4</div>
  <h2>&#x1FA7A; Gezondheid & Preventieve Zorg</h2>
  <p class="section-subtitle">Voorkomen is beter (en goedkoper) dan genezen.</p>

  <p>Een jaarlijkse check-up kost gemiddeld <strong>€40-80</strong>. Een behandeling voor een ziekte die eerder opgemerkt had kunnen worden? Al snel <strong>€500-2000+</strong>. Preventie loont altijd.</p>

  <h3>Vaccinatieschema</h3>
  <div class="grid-2">
    <div class="grid-card">
      <h4>&#x1F436; Honden</h4>
      <p><strong>6-8 weken:</strong> Eerste enting (parvo, hondenziekte)<br>
      <strong>12 weken:</strong> Herhaaling + leptospirose<br>
      <strong>16 weken:</strong> Laatste puppyenting<br>
      <strong>Jaarlijks:</strong> Booster + gezondheidscheck</p>
    </div>
    <div class="grid-card">
      <h4>&#x1F431; Katten</h4>
      <p><strong>9 weken:</strong> Eerste enting (niesziekte, kattenziekte)<br>
      <strong>12 weken:</strong> Herhaling<br>
      <strong>Jaarlijks:</strong> Booster<br>
      <strong>Optioneel:</strong> FeLV bij buitenkatten</p>
    </div>
  </div>

  <h3>Signalen dat je huisdier ziek kan zijn</h3>
  <ul class="checklist">
    <li>Plotselinge verandering in eet- of drinkgedrag</li>
    <li>Minder actief dan normaal, lusteloos of teruggetrokken</li>
    <li>Verandering in ontlasting (diarree, constipatie, bloed)</li>
    <li>Overmatig krabben, likken of bijten aan zichzelf</li>
    <li>Onverklaarbaar gewichtsverlies of -toename</li>
    <li>Hoesten, niezen of moeite met ademhalen</li>
    <li>Troebele of rode ogen, abnormale afscheiding</li>
  </ul>

  <div class="tip-box tip-box-purple">
    <strong>&#x26A0;&#xFE0F; Wanneer direct naar de dierenarts?</strong>
    Bij bloedingen die niet stoppen, ademhalingsmoeilijkheden, niet eten langer dan 24 uur
    (katten: 12 uur), braken met bloed, of plotselinge verlamming. Bel altijd eerst de
    spoeddienst voor advies.
  </div>

  <h3>Parasietpreventie</h3>
  <p>Behandel je hond of kat <strong>maandelijks</strong> tegen vlooien en teken (april-november) en <strong>elk kwartaal</strong> tegen wormen. Gebruik middelen van de dierenarts — supermarktproducten werken vaak onvoldoende.</p>
</div>

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- CHAPTER 5 -->
<!-- ═══════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="page-header">
    <div class="page-header-logo">&#x1F43E; PawsNL</div>
    <div class="page-header-title">Hoofdstuk 5</div>
  </div>

  <div class="section-number">5</div>
  <h2>&#x1F3E0; De Ideale Leefomgeving</h2>
  <p class="section-subtitle">Een veilige, comfortabele omgeving maakt een wereld van verschil.</p>

  <h3>Honden</h3>
  <div class="grid-2">
    <div class="grid-card">
      <h4>&#x1F6CF;&#xFE0F; Slaapplek</h4>
      <p>Eigen bed op een rustige, tochtvrije plek. Niet in de doorloop. Orthopedische bedden zijn ideaal voor oudere honden.</p>
    </div>
    <div class="grid-card">
      <h4>&#x1F3C3; Bewegingsruimte</h4>
      <p>Minimaal 2x per dag uitlaten (30-60 min). Grote rassen hebben meer nodig. Een tuin is fijn, maar vervangt wandelingen niet.</p>
    </div>
  </div>

  <h3>Katten</h3>
  <div class="grid-2">
    <div class="grid-card">
      <h4>&#x2B06;&#xFE0F; Verticale ruimte</h4>
      <p>Katten houden van hoogte. Een krabpaal met platforms, wandplanken of een kattenmand op een kast geeft ze een veilig gevoel.</p>
    </div>
    <div class="grid-card">
      <h4>&#x1F6BB; Kattenbak</h4>
      <p>Regel: 1 bak per kat + 1 extra. Op een rustige plek, niet naast het voer. Dagelijks scheppen, wekelijks volledig verschonen.</p>
    </div>
  </div>

  <h3>Kleine huisdieren</h3>
  <div class="grid-2">
    <div class="grid-card">
      <h4>&#x1F439; Knaagdieren</h4>
      <p>Minimaal 100x50cm voor een hamster, 120x60cm voor cavia's. Gebruik bodembedekking van hennep of papier — geen houtkrullen van naaldbomen.</p>
    </div>
    <div class="grid-card">
      <h4>&#x1F426; Vogels</h4>
      <p>Kooi moet minimaal 2x de vleugelspanwijdte breed zijn. Plaats niet in de keuken (kookdampen zijn giftig) en niet in direct zonlicht.</p>
    </div>
  </div>

  <div class="tip-box tip-box-green">
    <strong>&#x1F3E0; Huisdierveilig maken</strong>
    Check je huis op gevaren: giftige planten (lelies, aloe vera, dieffenbachia),
    loshangende kabels, kleine voorwerpen die ingeslikt kunnen worden, open ramen
    zonder hor, en schoonmaakmiddelen binnen bereik.
  </div>

  <h3>Temperatuur</h3>
  <p>De ideale kamertemperatuur voor de meeste huisdieren is <strong>18-22°C</strong>. Honden en katten kunnen oververhitten boven 28°C. Zorg in de zomer voor schaduw en vers water. In de winter: geen mand naast de verwarming (uitdroging).</p>
</div>

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- CHAPTER 6 -->
<!-- ═══════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="page-header">
    <div class="page-header-logo">&#x1F43E; PawsNL</div>
    <div class="page-header-title">Hoofdstuk 6</div>
  </div>

  <div class="section-number">6</div>
  <h2>&#x1F3AF; Training & Mentale Stimulatie</h2>
  <p class="section-subtitle">Een mentaal gestimuleerd huisdier is een gelukkig huisdier.</p>

  <p>Wist je dat <strong>15 minuten mentale training even vermoeiend is als 1 uur wandelen</strong>? Mentale stimulatie is minstens zo belangrijk als fysieke beweging — en wordt door de meeste baasjes onderschat.</p>

  <h3>Voor honden</h3>
  <ol class="numbered-list">
    <li><strong>Snuffelmat of snuffeldeken</strong> — Verberg brokjes in de plooien. Activeert het natuurlijke zoekinstinct en vermoeit mentaal. Ideaal voor regenachtige dagen.</li>
    <li><strong>Basis commando's trainen</strong> — Zit, lig, blijf, hier, poot. Train in sessies van max 5-10 minuten. Gebruik altijd beloningen (snoepje of speelgoed).</li>
    <li><strong>Puzzelspeelgoed</strong> — Kong, lickmat, of voerbal. Vul met pindakaas (xylitolvrij!) of natvoer en vries in voor langere bezigheid.</li>
    <li><strong>Nosework / speuren</strong> — Verstop snoepjes door het huis en laat je hond zoeken. Begin simpel, maak het steeds moeilijker. Fantastisch voor het zelfvertrouwen.</li>
    <li><strong>Nieuwe routes wandelen</strong> — Varieer je wandelroutes. Nieuwe geuren en omgevingen zijn de beste stimulatie die je kunt geven.</li>
  </ol>

  <h3>Voor katten</h3>
  <div class="grid-2">
    <div class="grid-card">
      <h4>&#x1F3AE; Interactief spelen</h4>
      <p>Minimaal 2x 15 min per dag met een hengelspeeltje. Simuleer jachtgedrag: laat het "prooi" bewegen, stoppen, en weer bewegen.</p>
    </div>
    <div class="grid-card">
      <h4>&#x1F9E9; Voerpuzzels</h4>
      <p>Laat je kat "werken" voor voer. Een voerbal of snackdoolhof voorkomt verveling en overgewicht tegelijk.</p>
    </div>
  </div>

  <h3>Voor knaagdieren & vogels</h3>
  <p><strong>Knaagdieren:</strong> Tunnels, loopwielen (minimaal 28cm voor hamsters), en knaaghout. Wissel speelgoed regelmatig om om het interessant te houden.</p>
  <p><strong>Vogels:</strong> Foerageer speelgoed, schommels, en regelmatig buiten de kooi laten vliegen in een veilige ruimte. Vogels zijn intelligent en hebben veel afleiding nodig.</p>

  <div class="tip-box">
    <strong>&#x23F0; Dagelijkse routine</strong>
    Huisdieren floreren bij een vaste routine. Probeer elke dag op dezelfde tijd te voeren,
    te wandelen en te spelen. Dit geeft ze een gevoel van veiligheid en voorspelbaarheid.
  </div>
</div>

<!-- ═══════════════════════════════════════════════════════════ -->
<!-- CHAPTER 7 — CHECKLIST -->
<!-- ═══════════════════════════════════════════════════════════ -->
<div class="page">
  <div class="page-header">
    <div class="page-header-logo">&#x1F43E; PawsNL</div>
    <div class="page-header-title">Hoofdstuk 7</div>
  </div>

  <div class="section-number">7</div>
  <h2>&#x2705; Checklist: Jouw Huisdier Gelukkig Houden</h2>
  <p class="section-subtitle">Print deze pagina uit en hang hem op je koelkast!</p>

  <h3>Dagelijks</h3>
  <ul class="checklist">
    <li>Vers water geven (schoon bakje)</li>
    <li>Kwalitatief voer op vaste tijden</li>
    <li>Minimaal 30 min beweging of spel</li>
    <li>Knuffel- en aandachttijd</li>
    <li>Kattenbak scheppen / kooi checken</li>
  </ul>

  <h3>Wekelijks</h3>
  <ul class="checklist">
    <li>Vacht borstelen (honden & katten)</li>
    <li>Tanden poetsen of tandensnack</li>
    <li>Oren en ogen controleren</li>
    <li>Speelgoed wassen of vervangen</li>
    <li>Kattenbak volledig verschonen</li>
  </ul>

  <h3>Maandelijks</h3>
  <ul class="checklist">
    <li>Vlooien- en tekenbehandeling (seizoen)</li>
    <li>Nagels knippen (indien nodig)</li>
    <li>Gewicht controleren</li>
    <li>Slaapplek / mand wassen</li>
  </ul>

  <h3>Jaarlijks</h3>
  <ul class="checklist">
    <li>Dierenarts check-up (liefst 2x per jaar)</li>
    <li>Vaccinaties bijwerken</li>
    <li>Ontwormingskuur (4x per jaar)</li>
    <li>Chip- en registratiegegevens controleren</li>
  </ul>

  <!-- CTA -->
  <div class="cta-box">
    <h3>&#x1F6D2; Alles voor jouw huisdier</h3>
    <p>Bij PawsNL vind je de beste producten voor honden, katten, vogels en knaagdieren.<br>Van speelgoed tot verzorgingsproducten — met gratis verzending vanaf €35.</p>
    <div class="cta-url">pawsnlshop.com</div>
  </div>
</div>

</body>
</html>`

async function generatePdf() {
  console.log('🔄 PDF genereren...')

  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()

  await page.setContent(html, { waitUntil: 'networkidle0', timeout: 30000 })

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    displayHeaderFooter: false,
  })

  await browser.close()

  console.log(`✅ PDF opgeslagen: ${outputPath}`)
}

generatePdf().catch((err) => {
  console.error('❌ Fout:', err)
  process.exit(1)
})
