export const metadata = {
  title: 'Klachtenprocedure | PawsShop.nl',
  description: 'Klachtenprocedure van PawsShop.nl. Lees hoe je een klacht kunt indienen en hoe wij deze behandelen.',
}

export default function KlachtenprocedurePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-orange-50 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-orange-500 font-semibold text-sm uppercase tracking-wider mb-3">
            Klachtenprocedure
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Jouw <span className="text-orange-500">tevredenheid</span> staat voorop
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Niet tevreden? Wij nemen elke klacht serieus en doen ons best om samen
            tot een passende oplossing te komen.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-10">
            {/* Stap 1 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Stap 1 — Neem contact met ons op</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Heb je een klacht over een product, bestelling of onze dienstverlening? Neem
                  dan zo snel mogelijk contact met ons op, bij voorkeur <strong>binnen 48 uur</strong> na
                  het ontdekken van het probleem.
                </p>
                <p>Je kunt ons bereiken via:</p>
                <ul className="list-none space-y-2 ml-2">
                  <li>
                    <strong>E-mail:</strong>{' '}
                    <a href="mailto:info@pawsshop.nl" className="text-orange-500 hover:underline font-medium">
                      info@pawsshop.nl
                    </a>
                  </li>
                  <li>
                    <strong>Telefoon:</strong>{' '}
                    <a href="tel:+31681473561" className="text-orange-500 hover:underline font-medium">
                      06 - 814 73 561
                    </a>{' '}
                    (ma-vr, 09:00-17:00)
                  </li>
                </ul>
                <p>Vermeld in je bericht altijd:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Je ordernummer</li>
                  <li>Een duidelijke omschrijving van de klacht</li>
                  <li>Eventuele foto&apos;s ter ondersteuning</li>
                  <li>Je gewenste oplossing (indien van toepassing)</li>
                </ul>
              </div>
            </div>

            {/* Stap 2 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Stap 2 — Ontvangstbevestiging</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Na ontvangst van je klacht sturen wij binnen <strong>1 werkdag</strong> een
                  ontvangstbevestiging per e-mail. Hierin bevestigen wij dat je klacht bij ons is
                  binnengekomen en geven we je een indicatie van de verwachte afhandeltijd.
                </p>
              </div>
            </div>

            {/* Stap 3 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Stap 3 — Behandeling</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Wij streven ernaar om elke klacht binnen <strong>5 werkdagen</strong> volledig af
                  te handelen. In sommige gevallen kan dit langer duren, bijvoorbeeld als wij
                  informatie moeten opvragen bij onze leverancier. In dat geval houden wij je op
                  de hoogte van de voortgang.
                </p>
                <p>Mogelijke oplossingen zijn onder andere:</p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Vervanging van het product</li>
                  <li>Gedeeltelijke of volledige terugbetaling</li>
                  <li>Een kortingscode voor een volgende bestelling</li>
                  <li>Een andere passende oplossing in overleg</li>
                </ul>
              </div>
            </div>

            {/* Stap 4 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Stap 4 — Niet tevreden met de oplossing?</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Komen we er samen niet uit? Dan kun je als consument gebruik maken van het
                  Europees platform voor onlinegeschillenbeslechting (ODR). Dit platform is
                  opgericht door de Europese Commissie en biedt een laagdrempelige manier om
                  geschillen op te lossen.
                </p>
                <div className="bg-orange-50 rounded-xl p-5 mt-4">
                  <p className="font-semibold text-gray-900 mb-2">
                    EU Online Geschillenbeslechting (ODR)
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    Via het ODR-platform kun je een klacht indienen over een online aankoop. Het
                    platform is beschikbaar in alle officiële EU-talen.
                  </p>
                  <a
                    href="https://ec.europa.eu/consumers/odr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-orange-500 text-white text-sm font-bold py-2.5 px-6 rounded-xl hover:bg-orange-600 transition-colors"
                  >
                    Naar het ODR-platform
                  </a>
                </div>
              </div>
            </div>

            {/* Onze belofte */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Onze belofte</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <p>
                  Bij PawsNL behandelen wij elke klacht vertrouwelijk en met respect. Wij
                  gebruiken klachten ook als leermomenten om onze producten en service continu te
                  verbeteren.
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2">
                  <li>Elke klacht wordt geregistreerd en bewaard gedurende 2 jaar</li>
                  <li>Wij streven naar een eerlijke en snelle oplossing</li>
                  <li>Je klacht wordt altijd vertrouwelijk behandeld</li>
                  <li>Wij leren van klachten en passen onze processen aan waar nodig</li>
                </ul>
              </div>
            </div>

            {/* Bedrijfsgegevens */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Bedrijfsgegevens</h2>
              <div className="space-y-3 text-gray-600 leading-relaxed">
                <ul className="list-none space-y-1 ml-2">
                  <li><strong>Bedrijfsnaam:</strong> Multi Talent Service (h/o PawsNL)</li>
                  <li><strong>Vestigingsadres:</strong> Weverstraat 227, 4204CB Gorinchem</li>
                  <li><strong>KvK-nummer:</strong> 92754783</li>
                  <li><strong>BTW-nummer:</strong> NL004974786B65</li>
                  <li><strong>Telefoon:</strong> 06 - 814 73 561</li>
                  <li><strong>E-mail:</strong>{' '}
                    <a href="mailto:info@pawsshop.nl" className="text-orange-500 hover:underline font-medium">
                      info@pawsshop.nl
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact CTA */}
            <div className="bg-orange-50 rounded-2xl p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Klacht indienen?</h3>
              <p className="text-gray-600 mb-4">
                Stuur ons een e-mail met je ordernummer en omschrijving. Wij reageren binnen 1 werkdag.
              </p>
              <a
                href="mailto:info@pawsshop.nl?subject=Klacht%20-%20Ordernummer%20"
                className="inline-block bg-orange-500 text-white font-bold py-3 px-8 rounded-xl hover:bg-orange-600 transition-colors"
              >
                Klacht indienen via e-mail
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
