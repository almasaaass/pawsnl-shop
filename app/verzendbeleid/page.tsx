export const metadata = {
  title: 'Verzendbeleid | PawsShop.nl',
  description: 'Verzendbeleid van PawsShop.nl. Gratis verzending vanaf 35 euro. Levertijd 5-12 werkdagen.',
}

export default function VerzendbeleidPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-3">
            Verzendbeleid
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Snel en <span className="text-orange-500">betrouwbaar</span> bezorgd
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Wij zorgen ervoor dat jouw bestelling veilig en zo snel mogelijk bij je thuis
            wordt afgeleverd.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-10">
            {/* Verzendkosten */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verzendkosten</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
                    <p className="text-green-700 font-bold text-lg">Gratis verzending</p>
                    <p className="text-green-600 text-sm mt-1">Bij bestellingen vanaf &euro;35</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
                    <p className="text-gray-900 font-bold text-lg">&euro;4,95</p>
                    <p className="text-gray-500 text-sm mt-1">Bij bestellingen onder &euro;35</p>
                  </div>
                </div>
                <p>
                  De verzendkosten worden automatisch berekend bij het afrekenen. Als je
                  bestelling boven de &euro;35 uitkomt, worden de verzendkosten automatisch
                  op &euro;0,00 gezet.
                </p>
              </div>
            </div>

            {/* Levertijd */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Levertijd</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  De gemiddelde levertijd bedraagt <strong>5 tot 12 werkdagen</strong> na
                  bevestiging van je bestelling. Onze producten worden rechtstreeks vanuit het
                  magazijn naar jou verzonden, wat ons in staat stelt om scherpe prijzen te bieden.
                </p>
                <p>
                  De verwachte levertijd kan variëren afhankelijk van:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Het type product en de beschikbaarheid</li>
                  <li>Het bezorgadres (Nederland of België)</li>
                  <li>Drukte bij de bezorgdienst (bijv. feestdagen)</li>
                </ul>
              </div>
            </div>

            {/* Track & Trace */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Track &amp; Trace</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Zodra je bestelling is verzonden, ontvang je een e-mail met een{' '}
                  <strong>track &amp; trace code</strong>. Hiermee kun je de status van je pakket
                  op elk moment volgen.
                </p>
                <p>
                  Heb je geen track &amp; trace ontvangen? Controleer je spammap of neem contact
                  met ons op via{' '}
                  <a href="mailto:info@pawsshop.nl" className="text-orange-500 hover:underline font-medium">
                    info@pawsshop.nl
                  </a>.
                </p>
              </div>
            </div>

            {/* Bezorggebied */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Bezorggebied</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Wij verzenden momenteel naar:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Nederland</strong> (inclusief Waddeneilanden)</li>
                  <li><strong>België</strong></li>
                </ul>
                <p>
                  Verzending naar andere landen is op dit moment nog niet beschikbaar.
                  Houd onze website in de gaten voor uitbreidingen.
                </p>
              </div>
            </div>

            {/* Vertragingen */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Vertragingen</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  In uitzonderlijke gevallen kan de levertijd langer zijn dan verwacht, bijvoorbeeld
                  door grote drukte, feestdagen of onvoorziene omstandigheden bij de vervoerder.
                </p>
                <p>
                  Mocht er sprake zijn van een vertraging, dan nemen wij proactief contact met je
                  op per e-mail om je op de hoogte te houden. Jouw bestelling is altijd in goede
                  handen.
                </p>
              </div>
            </div>

            {/* Niet ontvangen */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pakket niet ontvangen?</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Heb je na 15 werkdagen nog geen pakket ontvangen? Neem dan contact met ons op
                  via{' '}
                  <a href="mailto:info@pawsshop.nl" className="text-orange-500 hover:underline font-medium">
                    info@pawsshop.nl
                  </a>{' '}
                  met je ordernummer. Wij zoeken het voor je uit en zorgen voor een oplossing, of
                  dat nu een nieuw pakket of een terugbetaling is.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-orange-50 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Vragen over je verzending?</h3>
              <p className="text-gray-600 mb-4">
                Ons klantenserviceteam helpt je graag verder met vragen over je bestelling.
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
