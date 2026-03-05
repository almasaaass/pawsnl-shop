export const metadata = {
  title: 'Retourbeleid | PawsNL',
  description: 'Retourbeleid van PawsNL. 30 dagen retourrecht op al onze dierenproducten.',
}

export default function RetourbeleidPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-3">
            Retourbeleid
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            30 dagen <span className="text-orange-500">retourrecht</span>
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Niet tevreden? Geen probleem. Bij PawsNL kun je producten eenvoudig retourneren
            binnen 30 dagen.
          </p>
        </div>
      </section>

      {/* Inhoud */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-10">
            {/* Retourvoorwaarden */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Retourvoorwaarden</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Je hebt het recht om je bestelling tot <strong>30 dagen na ontvangst</strong> te retourneren,
                  zonder opgave van reden. Dit is langer dan de wettelijke bedenktijd van 14 dagen,
                  omdat we willen dat je volledig tevreden bent met je aankoop.
                </p>
                <p>Om in aanmerking te komen voor een retour moet het product:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Ongebruikt en in de originele staat zijn</li>
                  <li>In de originele, onbeschadigde verpakking zitten</li>
                  <li>Compleet zijn met alle bijbehorende accessoires en labels</li>
                </ul>
              </div>
            </div>

            {/* Retour aanvragen */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Retour aanvragen</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Wil je een product retourneren? Stuur een e-mail naar{' '}
                  <a href="mailto:info@pawsnlshop.com" className="text-orange-500 hover:underline font-medium">
                    info@pawsnlshop.com
                  </a>{' '}
                  met de volgende gegevens:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Je bestelnummer</li>
                  <li>Welk product je wilt retourneren</li>
                  <li>De reden voor retour (optioneel, maar helpt ons verbeteren)</li>
                </ul>
                <p>
                  We sturen je vervolgens een bevestiging met de retourinstructies en het retouradres.
                </p>
              </div>
            </div>

            {/* Retourkosten */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Retourkosten</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  De kosten voor het retourzenden zijn voor rekening van de klant, tenzij het product
                  defect of beschadigd is geleverd. In dat geval vergoeden we uiteraard de retourkosten.
                </p>
                <p>
                  Heb je een defect of beschadigd product ontvangen? Neem dan zo snel mogelijk contact
                  met ons op via{' '}
                  <a href="mailto:info@pawsnlshop.com" className="text-orange-500 hover:underline font-medium">
                    info@pawsnlshop.com
                  </a>{' '}
                  en voeg indien mogelijk een foto toe.
                </p>
              </div>
            </div>

            {/* Terugbetaling */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Terugbetaling</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Na ontvangst en controle van het geretourneerde product verwerken we de terugbetaling
                  binnen <strong>5 tot 7 werkdagen</strong>. Het bedrag wordt teruggestort via dezelfde
                  betaalmethode waarmee je de bestelling hebt geplaatst.
                </p>
                <p>
                  Je ontvangt een bevestigingsmail zodra de terugbetaling is verwerkt. Houd er rekening
                  mee dat het afhankelijk van je bank nog 1-3 extra werkdagen kan duren voordat het
                  bedrag zichtbaar is op je rekening.
                </p>
              </div>
            </div>

            {/* Uitzonderingen */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Uitzonderingen</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  De volgende producten kunnen helaas niet worden geretourneerd:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Hygiëneproducten waarbij de seal is verbroken</li>
                  <li>Geopend diervoer of snacks</li>
                  <li>Producten die op maat zijn gemaakt of gepersonaliseerd</li>
                  <li>Producten die duidelijk zijn gebruikt</li>
                </ul>
                <p>
                  Twijfel je of je product in aanmerking komt voor retour? Neem gerust contact met ons op.
                  We helpen je graag.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-orange-50 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Vragen over je retour?</h3>
              <p className="text-gray-600 mb-4">
                Onze klantenservice is bereikbaar op werkdagen van 09:00 tot 17:00.
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
