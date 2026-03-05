export const metadata = {
  title: 'Verzendbeleid | PawsNL',
  description: 'Verzendbeleid van PawsNL. Gratis verzending boven €35. Levering in 7-14 werkdagen.',
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
            Snelle en <span className="text-orange-500">betrouwbare</span> bezorging
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            We zorgen ervoor dat je bestelling veilig en zo snel mogelijk bij jou
            aan de deur wordt bezorgd.
          </p>
        </div>
      </section>

      {/* Inhoud */}
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
                    <p className="text-green-600 text-sm mt-1">Bij bestellingen boven &euro;35</p>
                  </div>
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center">
                    <p className="text-gray-900 font-bold text-lg">&euro;4,95</p>
                    <p className="text-gray-500 text-sm mt-1">Bij bestellingen onder &euro;35</p>
                  </div>
                </div>
                <p>
                  Verzendkosten worden automatisch berekend bij het afrekenen. Als je
                  bestelling boven &euro;35 uitkomt, worden de verzendkosten automatisch
                  op &euro;0,00 gezet.
                </p>
              </div>
            </div>

            {/* Levertijd */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Levertijd</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  De gemiddelde levertijd is <strong>7 tot 14 werkdagen</strong> na
                  bevestiging van je bestelling. Onze producten worden rechtstreeks vanuit het
                  magazijn naar jou verzonden, waardoor we concurrerende prijzen kunnen bieden.
                </p>
                <p>
                  De verwachte levertijd kan variëren afhankelijk van:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Het type product en de beschikbaarheid</li>
                  <li>Het bezorgadres (Nederland, België of Duitsland)</li>
                  <li>Drukke periodes bij de bezorgdienst (bijv. feestdagen)</li>
                </ul>
              </div>
            </div>

            {/* Track & Trace */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Track &amp; Trace</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Zodra je bestelling is verzonden, ontvang je een e-mail met een{' '}
                  <strong>track &amp; trace code</strong>. Hiermee kun je de status
                  van je pakket op elk moment volgen.
                </p>
                <p>
                  Geen track &amp; trace code ontvangen? Controleer je spammap of neem
                  contact met ons op via{' '}
                  <a href="mailto:info@pawsnlshop.com" className="text-orange-500 hover:underline font-medium">
                    info@pawsnlshop.com
                  </a>.
                </p>
              </div>
            </div>

            {/* Bezorggebied */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Bezorggebied</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  We verzenden momenteel naar:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Nederland</strong></li>
                  <li><strong>België</strong></li>
                  <li><strong>Duitsland</strong></li>
                </ul>
                <p>
                  Verzending naar andere landen is momenteel nog niet beschikbaar.
                  Houd onze website in de gaten voor toekomstige uitbreidingen.
                </p>
              </div>
            </div>

            {/* Vertragingen */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Vertragingen</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  In uitzonderlijke gevallen kan de levering langer duren dan verwacht, bijvoorbeeld
                  door hoge vraag, feestdagen of onvoorziene omstandigheden bij de vervoerder.
                </p>
                <p>
                  Mocht er sprake zijn van een vertraging, dan nemen we proactief contact met je
                  op per e-mail om je op de hoogte te houden. Je bestelling is altijd in goede handen.
                </p>
              </div>
            </div>

            {/* Pakket niet ontvangen */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Pakket niet ontvangen?</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Je pakket na 15 werkdagen nog niet ontvangen? Neem dan contact met ons op
                  via{' '}
                  <a href="mailto:info@pawsnlshop.com" className="text-orange-500 hover:underline font-medium">
                    info@pawsnlshop.com
                  </a>{' '}
                  met je bestelnummer. We zoeken het uit en zorgen voor een oplossing, of dat
                  nu een nieuw pakket is of een terugbetaling.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-orange-50 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Vragen over je verzending?</h3>
              <p className="text-gray-600 mb-4">
                Onze klantenservice helpt je graag bij vragen over je bestelling.
              </p>
              <a
                href="mailto:info@pawsnlshop.com"
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
