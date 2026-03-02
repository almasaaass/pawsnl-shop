export const metadata = {
  title: 'Algemene Voorwaarden | PawsShop.nl',
  description: 'Algemene voorwaarden van PawsShop.nl. Lees de voorwaarden die van toepassing zijn op alle bestellingen.',
}

export default function AlgemeneVoorwaardenPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-3">
            Algemene Voorwaarden
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Onze <span className="text-orange-500">voorwaarden</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Hieronder vind je de algemene voorwaarden die van toepassing zijn op alle
            bestellingen en diensten van PawsShop.nl.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-10">
            {/* Artikel 1 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Artikel 1 — Toepasselijkheid</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Deze algemene voorwaarden zijn van toepassing op elk aanbod van PawsNL en op
                  elke tot stand gekomen overeenkomst op afstand tussen PawsNL en de klant.
                </p>
                <p>
                  Door het plaatsen van een bestelling via onze webshop ga je akkoord met deze
                  algemene voorwaarden. Wij raden je aan deze voorwaarden goed door te lezen
                  voordat je een bestelling plaatst.
                </p>
                <p>
                  Indien een of meerdere bepalingen in deze algemene voorwaarden ongeldig of
                  vernietigbaar zijn, blijven de overige bepalingen onverminderd van kracht.
                </p>
              </div>
            </div>

            {/* Artikel 2 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Artikel 2 — Identiteit van de ondernemer</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <ul className="list-none space-y-1 ml-2">
                  <li><strong>Handelsnaam:</strong> Multi Talent Service (h/o PawsNL)</li>
                  <li><strong>Vestigingsadres:</strong> Weverstraat 227, 4204CB Gorinchem</li>
                  <li><strong>KvK-nummer:</strong> 92754783</li>
                  <li><strong>BTW-nummer:</strong> NL004974786B65</li>
                  <li><strong>Telefoon:</strong> 06 - 814 73 561</li>
                  <li><strong>E-mail:</strong>{' '}
                    <a href="mailto:info@pawsshop.nl" className="text-orange-500 hover:underline font-medium">
                      info@pawsshop.nl
                    </a>
                  </li>
                  <li><strong>Website:</strong>{' '}
                    <a href="https://pawsshop.nl" className="text-orange-500 hover:underline font-medium">
                      pawsshop.nl
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Artikel 3 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Artikel 3 — Aanbod en prijzen</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Alle prijzen op onze website zijn vermeld in <strong>euro&apos;s</strong> en
                  zijn <strong>inclusief BTW</strong>.
                </p>
                <p>
                  Het aanbod bevat een volledige en nauwkeurige omschrijving van de aangeboden
                  producten. Kennelijke vergissingen of fouten in het aanbod binden PawsNL niet.
                </p>
                <p>
                  Wij behouden ons het recht voor om prijzen en het assortiment op elk moment
                  te wijzigen. Reeds geplaatste bestellingen worden niet door prijswijzigingen
                  beïnvloed.
                </p>
                <p>
                  Verzendkosten bedragen &euro;4,95 voor bestellingen onder &euro;35. Bestellingen
                  vanaf &euro;35 worden gratis verzonden.
                </p>
              </div>
            </div>

            {/* Artikel 4 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Artikel 4 — Bestelling en overeenkomst</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  De overeenkomst komt tot stand op het moment dat je een bestelling plaatst en
                  de betaling succesvol is verwerkt. Je ontvangt een orderbevestiging per e-mail.
                </p>
                <p>
                  PawsNL behoudt zich het recht voor om een bestelling te weigeren of aanvullende
                  voorwaarden te stellen, bijvoorbeeld bij vermoeden van fraude of bij een
                  onredelijk grote bestelling.
                </p>
              </div>
            </div>

            {/* Artikel 5 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Artikel 5 — Betaling</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Betalingen worden veilig verwerkt via <strong>Stripe</strong>. Wij bieden de
                  volgende betaalmethoden aan:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>iDEAL</li>
                  <li>Creditcard (Visa, Mastercard)</li>
                </ul>
                <p>
                  De betaling dient direct bij het plaatsen van de bestelling te worden voldaan.
                  Wij slaan geen betaalgegevens op; dit wordt volledig door Stripe afgehandeld.
                </p>
              </div>
            </div>

            {/* Artikel 6 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Artikel 6 — Levering</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  De levertijd bedraagt gemiddeld <strong>5 tot 12 werkdagen</strong> na ontvangst
                  van de betaling. Wij verzenden naar Nederland en België.
                </p>
                <p>
                  Indien de bezorging vertraging ondervindt, word je hiervan zo snel mogelijk op
                  de hoogte gesteld per e-mail.
                </p>
                <p>
                  Het risico van beschadiging of vermissing van producten berust bij PawsNL tot
                  het moment van bezorging aan de klant of een vooraf aangewezen vertegenwoordiger.
                </p>
              </div>
            </div>

            {/* Artikel 7 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Artikel 7 — Herroepingsrecht</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  De wettelijke bedenktijd bedraagt 14 dagen. Bij PawsNL bieden wij je echter
                  een <strong>verlengd retourrecht van 30 dagen</strong>. Binnen deze termijn
                  kun je de overeenkomst zonder opgave van reden ontbinden.
                </p>
                <p>
                  Om gebruik te maken van het herroepingsrecht stuur je een e-mail naar{' '}
                  <a href="mailto:info@pawsshop.nl" className="text-orange-500 hover:underline font-medium">
                    info@pawsshop.nl
                  </a>{' '}
                  met je ordernummer en het product dat je wilt retourneren.
                </p>
                <p>
                  Na ontvangst en controle van het geretourneerde product betalen wij het
                  aankoopbedrag binnen 5 tot 7 werkdagen terug. De kosten voor retourzending
                  zijn voor rekening van de klant, tenzij het product defect is.
                </p>
                <p>
                  Het herroepingsrecht is uitgesloten voor:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Hygiëneproducten waarvan de verzegeling is verbroken</li>
                  <li>Geopend dierenvoer of snacks</li>
                  <li>Op maat gemaakte of gepersonaliseerde producten</li>
                </ul>
              </div>
            </div>

            {/* Artikel 8 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Artikel 8 — Klachten</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Heb je een klacht over een product of onze dienstverlening? Neem dan zo snel
                  mogelijk, bij voorkeur <strong>binnen 48 uur</strong>, contact met ons op via{' '}
                  <a href="mailto:info@pawsshop.nl" className="text-orange-500 hover:underline font-medium">
                    info@pawsshop.nl
                  </a>.
                </p>
                <p>
                  Vermeld in je e-mail je ordernummer, een duidelijke omschrijving van de klacht
                  en eventueel foto&apos;s ter ondersteuning. Wij streven ernaar om klachten
                  binnen <strong>5 werkdagen</strong> af te handelen.
                </p>
                <p>
                  Komen we er samen niet uit? Dan kun je je klacht voorleggen aan het Europees
                  platform voor onlinegeschillenbeslechting (ODR):{' '}
                  <a
                    href="https://ec.europa.eu/consumers/odr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:underline font-medium"
                  >
                    ec.europa.eu/consumers/odr
                  </a>.
                </p>
              </div>
            </div>

            {/* Artikel 9 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Artikel 9 — Aansprakelijkheid</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  PawsNL is niet aansprakelijk voor schade die het gevolg is van onjuist gebruik
                  van de producten. Wij adviseren je altijd de productbeschrijving en gebruiks-
                  instructies goed door te lezen.
                </p>
                <p>
                  De aansprakelijkheid van PawsNL is in alle gevallen beperkt tot het bedrag dat
                  door de klant is betaald voor het betreffende product.
                </p>
                <p>
                  PawsNL is niet aansprakelijk voor schade als gevolg van overmacht, waaronder
                  maar niet beperkt tot vertragingen bij vervoerders, stakingen, natuurrampen of
                  storingen in het internetverkeer.
                </p>
              </div>
            </div>

            {/* Artikel 10 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Artikel 10 — Toepasselijk recht</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Op alle overeenkomsten tussen PawsNL en de klant is <strong>Nederlands recht</strong>{' '}
                  van toepassing.
                </p>
                <p>
                  Geschillen die voortvloeien uit of verband houden met een overeenkomst worden
                  voorgelegd aan de bevoegde rechter in Rotterdam, tenzij de wet dwingend een
                  andere rechter voorschrijft.
                </p>
              </div>
            </div>

            {/* Slotbepaling */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Artikel 11 — Slotbepalingen</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  PawsNL behoudt zich het recht voor om deze algemene voorwaarden te wijzigen.
                  De meest recente versie is altijd beschikbaar op onze website. Bij belangrijke
                  wijzigingen informeren wij onze klanten hierover.
                </p>
                <p className="text-sm text-gray-400">
                  Laatst bijgewerkt: maart 2026
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-orange-50 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Vragen over onze voorwaarden?</h3>
              <p className="text-gray-600 mb-4">
                Heb je vragen of opmerkingen? Ons team staat klaar om je te helpen.
              </p>
              <a
                href="mailto:info@pawsshop.nl"
                className="inline-block bg-orange-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-orange-600 transition-colors"
              >
                Mail ons
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
