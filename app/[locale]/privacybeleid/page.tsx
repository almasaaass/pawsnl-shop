export const metadata = {
  title: 'Privacybeleid | PawsNL',
  description: 'Privacybeleid van PawsNL. Lees hoe wij omgaan met je persoonsgegevens.',
}

export default function PrivacybeleidPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-3">
            Privacybeleid
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Jouw <span className="text-orange-500">privacy</span> is belangrijk
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Wij gaan zorgvuldig om met je persoonsgegevens. Hieronder lees je precies wat
            wij verzamelen, waarom, en wat je rechten zijn.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-10">
            {/* Wie zijn wij */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Wie zijn wij?</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  PawsNL is een online winkel gespecialiseerd in producten voor huisdieren.
                  Wij zijn gevestigd in Gorinchem en ingeschreven bij de Kamer van Koophandel.
                </p>
                <ul className="list-none space-y-1 ml-2">
                  <li><strong>Bedrijfsnaam:</strong> Multi Talent Service (h/o PawsNL)</li>
                  <li><strong>Adres:</strong> Weverstraat 227, 4204CB Gorinchem</li>
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

            {/* Welke gegevens verzamelen wij */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welke gegevens verzamelen wij?</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Wanneer je een bestelling plaatst of contact met ons opneemt, verzamelen wij de
                  volgende persoonsgegevens:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Voor- en achternaam</li>
                  <li>E-mailadres</li>
                  <li>Bezorgadres (straat, huisnummer, postcode, stad, land)</li>
                  <li>Telefoonnummer (indien opgegeven)</li>
                  <li>Betaalgegevens (verwerkt via Stripe; wij slaan deze niet zelf op)</li>
                  <li>Bestelgeschiedenis en bestelnummers</li>
                </ul>
              </div>
            </div>

            {/* Waarvoor gebruiken wij je gegevens */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Waarvoor gebruiken wij je gegevens?</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>Wij gebruiken je persoonsgegevens uitsluitend voor de volgende doeleinden:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Orderverwerking</strong> — om je bestelling te verwerken, te verzenden en je op de hoogte te houden van de status</li>
                  <li><strong>Klantenservice</strong> — om je vragen te beantwoorden en eventuele problemen op te lossen</li>
                  <li><strong>Wettelijke verplichtingen</strong> — om te voldoen aan belasting- en boekhoudkundige vereisten</li>
                  <li><strong>Marketing</strong> — alleen met je uitdrukkelijke toestemming sturen wij je aanbiedingen en nieuwsbrieven. Je kunt je op elk moment uitschrijven</li>
                </ul>
              </div>
            </div>

            {/* Beveiliging */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Beveiliging</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Wij nemen de bescherming van je gegevens serieus en treffen passende maatregelen
                  om misbruik, verlies en onbevoegde toegang te voorkomen:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>SSL-encryptie</strong> — alle communicatie met onze website is beveiligd via HTTPS</li>
                  <li><strong>Stripe</strong> — betalingen worden veilig verwerkt via Stripe, een gecertificeerde PCI DSS Level 1 betaalprovider. Wij slaan nooit je creditcard- of bankgegevens op</li>
                  <li><strong>Toegangsbeperking</strong> — alleen bevoegd personeel heeft toegang tot persoonsgegevens</li>
                </ul>
              </div>
            </div>

            {/* Cookies */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cookies</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Onze website maakt gebruik van cookies om je ervaring te verbeteren. Wij gebruiken de
                  volgende soorten cookies:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Functionele cookies</strong> — noodzakelijk voor het functioneren van de website, zoals het onthouden van je winkelwagen</li>
                  <li><strong>Analytische cookies</strong> — om inzicht te krijgen in hoe bezoekers onze website gebruiken zodat wij deze kunnen verbeteren. Deze gegevens worden anoniem verwerkt</li>
                </ul>
                <p>
                  Je kunt cookies uitschakelen via je browserinstellingen. Let op: het uitschakelen van
                  functionele cookies kan de functionaliteit van de website beperken.
                </p>
              </div>
            </div>

            {/* Delen met derden */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Delen met derden</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Wij verkopen je gegevens nooit aan derden. Wij delen je gegevens alleen met
                  partijen die noodzakelijk zijn voor onze dienstverlening:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Stripe</strong> — voor het verwerken van betalingen</li>
                  <li><strong>Vervoerders</strong> — voor het bezorgen van je bestelling</li>
                  <li><strong>Resend</strong> — voor het versturen van transactionele e-mails</li>
                </ul>
              </div>
            </div>

            {/* Jouw rechten */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Jouw rechten</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Op grond van de Algemene Verordening Gegevensbescherming (AVG) heb je de
                  volgende rechten:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li><strong>Recht op inzage</strong> — je kunt opvragen welke gegevens wij van je bewaren</li>
                  <li><strong>Recht op rectificatie</strong> — je kunt verzoeken om je gegevens te corrigeren</li>
                  <li><strong>Recht op vergetelheid</strong> — je kunt verzoeken om je gegevens te verwijderen</li>
                  <li><strong>Recht op overdraagbaarheid</strong> — je kunt verzoeken om je gegevens in een leesbaar formaat te ontvangen</li>
                  <li><strong>Recht op bezwaar</strong> — je kunt bezwaar maken tegen de verwerking van je gegevens</li>
                </ul>
                <p>
                  Wil je een van deze rechten uitoefenen? Stuur een e-mail naar{' '}
                  <a href="mailto:info@pawsnlshop.com" className="text-orange-500 hover:underline font-medium">
                    info@pawsnlshop.com
                  </a>. Wij reageren binnen 30 dagen op je verzoek.
                </p>
              </div>
            </div>

            {/* Bewaartermijn */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Bewaartermijn</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Wij bewaren je persoonsgegevens niet langer dan noodzakelijk voor de
                  doeleinden waarvoor ze zijn verzameld. Bestelgegevens bewaren wij maximaal
                  7 jaar in overeenstemming met de wettelijke bewaarplicht.
                </p>
              </div>
            </div>

            {/* Wijzigingen */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Wijzigingen</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Wij behouden ons het recht voor om dit privacybeleid te wijzigen. De meest
                  recente versie is altijd beschikbaar op onze website. Bij belangrijke
                  wijzigingen stellen wij je hiervan op de hoogte.
                </p>
                <p className="text-sm text-gray-400">
                  Laatst bijgewerkt: maart 2026
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-orange-50 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Vragen over je privacy?</h3>
              <p className="text-gray-600 mb-4">
                Neem gerust contact met ons op als je vragen hebt over hoe wij met je gegevens omgaan.
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
