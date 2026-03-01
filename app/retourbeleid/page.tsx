export const metadata = {
  title: 'Retourbeleid | PawsShop.nl',
  description: 'Retourbeleid van PawsShop.nl. 30 dagen retourrecht op al onze dierenproducten.',
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
            Niet tevreden? Geen probleem. Bij PawsShop.nl kun je producten eenvoudig
            binnen 30 dagen retourneren.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-10">
            {/* Retourvoorwaarden */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Retourvoorwaarden</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Je hebt het recht om je bestelling tot <strong>30 dagen na ontvangst</strong> zonder
                  opgave van reden te retourneren. Dit is ruimer dan de wettelijke termijn van 14 dagen,
                  omdat wij willen dat je volledig tevreden bent met je aankoop.
                </p>
                <p>Om in aanmerking te komen voor een retour moet het product:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Ongebruikt en in de originele staat zijn</li>
                  <li>In de originele, onbeschadigde verpakking zitten</li>
                  <li>Compleet zijn met alle bijbehorende accessoires en labels</li>
                </ul>
              </div>
            </div>

            {/* Retour aanmelden */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Retour aanmelden</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Wil je een product retourneren? Stuur dan een e-mail naar{' '}
                  <a href="mailto:info@pawsshop.nl" className="text-orange-500 hover:underline font-medium">
                    info@pawsshop.nl
                  </a>{' '}
                  met de volgende gegevens:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Je ordernummer</li>
                  <li>Welk product je wilt retourneren</li>
                  <li>De reden van retour (optioneel, maar helpt ons te verbeteren)</li>
                </ul>
                <p>
                  Wij sturen je vervolgens een bevestiging met de retourinstructies en het retouradres.
                </p>
              </div>
            </div>

            {/* Verzendkosten */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Verzendkosten retour</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  De kosten voor het retourzenden zijn voor rekening van de klant, tenzij het product
                  defect of beschadigd is geleverd. In dat geval nemen wij de retourkosten uiteraard
                  voor onze rekening.
                </p>
                <p>
                  Heb je een defect of beschadigd product ontvangen? Neem dan zo snel mogelijk contact
                  met ons op via{' '}
                  <a href="mailto:info@pawsshop.nl" className="text-orange-500 hover:underline font-medium">
                    info@pawsshop.nl
                  </a>{' '}
                  en voeg indien mogelijk een foto bij.
                </p>
              </div>
            </div>

            {/* Terugbetaling */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Terugbetaling</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Na ontvangst en controle van het geretourneerde product verwerken wij de terugbetaling
                  binnen <strong>5 tot 7 werkdagen</strong>. Het bedrag wordt teruggestort op dezelfde
                  betaalmethode die je bij de bestelling hebt gebruikt.
                </p>
                <p>
                  Je ontvangt een bevestigingsmail zodra de terugbetaling is verwerkt. Houd er rekening
                  mee dat het, afhankelijk van je bank, nog 1-3 werkdagen kan duren voordat het bedrag
                  zichtbaar is op je rekening.
                </p>
              </div>
            </div>

            {/* Uitzonderingen */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Uitzonderingen</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  De volgende producten kunnen helaas niet geretourneerd worden:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Hygieneproducten waarvan de verzegeling is verbroken</li>
                  <li>Geopend dierenvoer of snacks</li>
                  <li>Producten die op maat gemaakt of gepersonaliseerd zijn</li>
                  <li>Producten die duidelijk zijn gebruikt</li>
                </ul>
                <p>
                  Twijfel je of jouw product in aanmerking komt voor retour? Neem dan gerust contact
                  met ons op. We denken graag met je mee.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-orange-50 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Vragen over je retour?</h3>
              <p className="text-gray-600 mb-4">
                Ons klantenserviceteam staat voor je klaar op werkdagen van 09:00 tot 17:00.
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
