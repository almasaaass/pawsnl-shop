## Product Audit — Visuele controle van alle producten

Voer een volledige audit uit van alle producten in de PawsNL webshop. Controleer of afbeeldingen, beschrijvingen en productdata kloppen.

### Stap 1: Download productdata en afbeeldingen

Voer het audit script uit vanuit de projectroot:

```bash
cd /Users/fariha/pawsnl-shop && node scripts/audit-products.mjs
```

Het script:
- Haalt alle producten op uit Supabase
- Downloadt de eerste afbeelding van elk product naar `/tmp/pawsnl-audit/`
- Geeft JSON output met alle productgegevens + pad naar de gedownloade afbeelding

Sla de JSON output op in een variabele om te gebruiken in de volgende stappen.

### Stap 2: Controleer elk product

Loop door elk product in de JSON output. Voer per product de volgende controles uit:

#### A. Visuele controle (BELANGRIJK — dit is de hoofdreden voor deze audit)
- **Lees de afbeelding** via het `image_path` uit de JSON (gebruik de Read tool — die kan afbeeldingen bekijken)
- Controleer: past de foto bij de **productnaam**? (bijv. "Hondenborstel" moet een borstel voor honden tonen, NIET een jurk of willekeurig item)
- Controleer: past de foto bij de **categorie**? (honden/katten/vogels/knaagdieren)
- Is het een echte productfoto? (geen totaal ongerelateerd item)
- **CJ Dropshipping levert vaak VERKEERDE foto's** — wees kritisch!

#### B. Beschrijving controle
- Is de beschrijving in het **Nederlands**? (geen Engels, geen CJ-rommel)
- Past de beschrijving bij het product?
- Is de beschrijving minimaal **80 tekens**?

#### C. Data controle
- Heeft het product een prijs > 0?
- Heeft het minstens 1 afbeelding?
- Is de categorie geldig? (honden, katten, vogels, knaagdieren, vissen)
- Is de vergelijkingsprijs (compare_price) hoger dan de verkoopprijs (price)?

Als het downloaden van een afbeelding is mislukt (`download_error` is niet null), markeer dit als FOUT.

### Stap 3: Genereer rapport

Maak een overzichtelijk rapport in deze vorm:

```
## Product Audit Rapport

### Resultaten per product

| # | Product | Categorie | Foto | Beschrijving | Data | Status |
|---|---------|-----------|------|-------------|------|--------|
| 1 | Naam    | katten    | OK   | OK          | OK   | ✅ OK  |
| 2 | Naam    | honden    | FOUT: verkeerde foto | OK | OK | ❌ FOUT |

### Samenvatting
- X van Y producten OK
- Z producten met fouten

### Foute producten — details
Per fout product: wat er mis is en aanbeveling (verwijderen / foto vervangen / beschrijving aanpassen)
```

### Stap 4: Vraag de gebruiker

Als er foute producten zijn, vraag de gebruiker wat ze wil doen:
- **Verwijderen** — product uit database verwijderen
- **Aanpassen** — beschrijving/data fixen (alleen als de foto WEL klopt)
- **Overslaan** — niets doen

Voer de gekozen acties uit. Bij verwijderen: gebruik Supabase delete op de product ID.
