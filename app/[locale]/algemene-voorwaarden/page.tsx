export const metadata = {
  title: 'Algemene Voorwaarden | PawsNL',
  description: 'Algemene voorwaarden van PawsNL. Lees de voorwaarden die gelden voor alle bestellingen.',
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
            bestellingen en diensten van PawsNL.
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
                  elke op afstand gesloten overeenkomst tussen PawsNL en de klant.
                </p>
                <p>
                  Door een bestelling te plaatsen via onze webshop ga je akkoord met deze
                  algemene voorwaarden. Wij raden je aan deze voorwaarden zorgvuldig te lezen
                  voordat je een bestelling plaatst.
                </p>
                <p>
                  Indien een of meerdere bepalingen van deze voorwaarden ongeldig of
                  vernietigbaar zijn, blijven de overige bepalingen onverminderd van kracht.
                </p>
              </div>
            </div>

            {/* Artikel 2 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Artikel 2 — Identiteit van het bedrijf</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <ul className="list-none space-y-1 ml-2">
                  <li><strong>Handelsnaam:</strong> Multi Talent Service (h/o PawsNL)</li>
                  <li><strong>Vestigingsadres:</strong> Weverstraat 227, 4204CB Gorinchem</li>
                  <li><strong>KvK-nummer:</strong> 92754783</li>
                  <li><strong>BTW-nummer:</strong> NL004974786B65</li>
                  <li><strong>Telefoon:</strong> 06 - 814 73 561</li>
                  <li><strong>E-mail:</strong>{' '}
                    <a href="mailto:info@pawsnlshop.com" className="text-orange-500 hover:underline font-medium">
                      info@pawsnlshop.com
                    </a>
                  </li>
                  <li><strong>Website:</strong>{' '}
                    <a href="https://pawsnlshop.com" className="text-orange-500 hover:underline font-medium">
                      pawsnlshop.com
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Artikel 3 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Artikel 3 — Aanbiedingen en prijzen</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Alle prijzen op onze website zijn vermeld in <strong>euro&apos;s</strong> en
                  zijn <strong>inclusief btw</strong>.
                </p>
                <p>
                  Het aanbod bevat een volledige en nauwkeurige omschrijving van de aangeboden
                  producten. Kennelijke vergissingen of fouten in het aanbod binden PawsNL niet.
                </p>
                <p>
                  Wij behouden ons het recht voor om prijzen en het assortiment op elk moment te wijzigen.
                  Reeds geplaatste bestellingen worden niet beïnvloed door prijswijzigingen.
                </p>
                <p>
                  Verzendkosten bedragen &euro;4,95 voor bestellingen onder de &euro;35. Bestellingen
                  van &euro;35 of meer worden gratis verzonden.
                </p>
              </div>
            </div>

            {/* Artikel 4 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Artikel 4 — Bestellingen en overeenkomst</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  De overeenkomst komt tot stand op het moment dat je een bestelling plaatst en
                  de betaling succesvol is verwerkt. Je ontvangt een orderbevestiging per e-mail.
                </p>
                <p>
                  PawsNL behoudt zich het recht voor om een bestelling te weigeren of aanvullende
                  voorwaarden te stellen, bijvoorbeeld bij vermoeden van fraude of een
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
                  <li>Bancontact</li>
                  <li>Klarna</li>
                  <li>Visa</li>
                  <li>Mastercard</li>
                </ul>
                <p>
                  Betaling vindt plaats op het moment van het plaatsen van de bestelling.
                  Wij slaan geen betaalgegevens op; dit wordt volledig afgehandeld door Stripe.
                </p>
              </div>
            </div>

            {/* Artikel 6 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Artikel 6 — Levering</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  De levertijd bedraagt gemiddeld <strong>7 tot 14 werkdagen</strong> na ontvangst
                  van de betaling. Wij verzenden naar Nederland, België en Duitsland.
                </p>
                <p>
                  Bij vertraging in de levering word je zo snel mogelijk per e-mail op de hoogte
                  gesteld.
                </p>
                <p>
                  Het risico van beschadiging of verlies van producten ligt bij PawsNL tot
                  het moment van levering aan de klant of een vooraf aangewezen vertegenwoordiger.
                </p>
              </div>
            </div>

            {/* Artikel 7 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Artikel 7 — Herroepingsrecht</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  De wettelijke bedenktijd bedraagt 14 dagen. Bij PawsNL bieden wij je echter een
                  <strong> verlengde retourperiode van 30 dagen</strong>. Binnen deze periode
                  kun je de overeenkomst zonder opgave van reden ontbinden.
                </p>
                <p>
                  Om je herroepingsrecht uit te oefenen, stuur een e-mail naar{' '}
                  <a href="mailto:info@pawsnlshop.com" className="text-orange-500 hover:underline font-medium">
                    info@pawsnlshop.com
                  </a>{' '}
                  met je bestelnummer en het product dat je wilt retourneren.
                </p>
                <p>
                  Na ontvangst en inspectie van het geretourneerde product betalen wij het
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
                  Heb je een klacht over een product of onze service? Neem dan zo snel mogelijk
                  contact met ons op, bij voorkeur <strong>binnen 48 uur</strong>, via{' '}
                  <a href="mailto:info@pawsnlshop.com" className="text-orange-500 hover:underline font-medium">
                    info@pawsnlshop.com
                  </a>.
                </p>
                <p>
                  Vermeld in je e-mail je bestelnummer, een duidelijke omschrijving van de klacht
                  en eventuele foto&apos;s ter onderbouwing. Wij streven ernaar klachten
                  binnen <strong>5 werkdagen</strong> af te handelen.
                </p>
                <p>
                  Komen wij er samen niet uit, dan kun je je klacht voorleggen aan het Europees
                  Online Geschillenbeslechting (ODR) platform:{' '}
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
                  PawsNL is niet aansprakelijk voor schade als gevolg van onjuist gebruik
                  van de producten. Wij raden altijd aan om de productomschrijving en
                  gebruiksaanwijzing zorgvuldig te lezen.
                </p>
                <p>
                  De aansprakelijkheid van PawsNL is in alle gevallen beperkt tot het bedrag
                  dat de klant heeft betaald voor het betreffende product.
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
                  Op alle overeenkomsten tussen PawsNL en de klant is <strong>Nederlands recht</strong> van toepassing.
                </p>
                <p>
                  Geschillen die voortvloeien uit of verband houden met een overeenkomst worden
                  voorgelegd aan de bevoegde rechtbank in Rotterdam, tenzij de wet een andere
                  rechtbank voorschrijft.
                </p>
              </div>
            </div>

            {/* Slotbepalingen */}
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
                Heb je vragen of opmerkingen? Ons team staat voor je klaar.
              </p>
              <a
                href="mailto:info@pawsnlshop.com"
                className="inline-block bg-orange-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-orange-600 transition-colors"
              >
                E-mail ons
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
