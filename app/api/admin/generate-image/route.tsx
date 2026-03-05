import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

/**
 * Generates professional product images for social media and webshop.
 * Templates: infographic, social, banner, feature
 */
export async function GET(request: NextRequest) {
  // Auth check
  const cookie = request.cookies.get('admin-auth')?.value
  if (!cookie || cookie !== process.env.ADMIN_SECRET) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { searchParams } = new URL(request.url)

  const template = searchParams.get('template') ?? 'infographic'
  const productName = searchParams.get('name') ?? 'Product'
  const price = searchParams.get('price') ?? '€19,95'
  const comparePrice = searchParams.get('comparePrice') ?? ''
  const imageUrl = searchParams.get('image') ?? ''
  const category = searchParams.get('category') ?? ''
  const features = (searchParams.get('features') ?? '').split('|').filter(Boolean)
  const badge = searchParams.get('badge') ?? ''
  const discount = searchParams.get('discount') ?? ''

  if (template === 'social') {
    return new ImageResponse(
      (
        <div
          style={{
            width: '1080px',
            height: '1080px',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 50%, #FFF7ED 100%)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Top bar */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '40px 50px 0', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '40px' }}>🐾</span>
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#1F2937' }}>PawsNL</span>
            </div>
            {badge && (
              <div style={{ background: '#F97316', color: 'white', padding: '8px 24px', borderRadius: '50px', fontSize: '20px', fontWeight: 700 }}>
                {badge}
              </div>
            )}
          </div>

          {/* Product image */}
          <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            {imageUrl ? (
              <img
                src={imageUrl}
                width={500}
                height={500}
                style={{ objectFit: 'contain', borderRadius: '24px' }}
              />
            ) : (
              <div style={{ width: '500px', height: '500px', background: '#F3F4F6', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '120px' }}>
                🐾
              </div>
            )}
          </div>

          {/* Bottom info */}
          <div style={{ padding: '0 50px 50px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '36px', fontWeight: 700, color: '#1F2937', lineHeight: 1.2 }}>
              {productName}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '42px', fontWeight: 800, color: '#F97316' }}>{price}</span>
              {comparePrice && (
                <span style={{ fontSize: '28px', color: '#9CA3AF', textDecoration: 'line-through' }}>{comparePrice}</span>
              )}
              {discount && (
                <span style={{ background: '#10B981', color: 'white', padding: '6px 16px', borderRadius: '50px', fontSize: '20px', fontWeight: 700 }}>
                  -{discount}%
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F3F4F6', padding: '8px 16px', borderRadius: '12px', fontSize: '16px', color: '#6B7280' }}>
                🚚 Gratis verzending vanaf €35
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F3F4F6', padding: '8px 16px', borderRadius: '12px', fontSize: '16px', color: '#6B7280' }}>
                ↩️ 30 dagen retour
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1080, height: 1080 }
    )
  }

  if (template === 'feature') {
    return new ImageResponse(
      (
        <div
          style={{
            width: '1080px',
            height: '1080px',
            display: 'flex',
            background: 'linear-gradient(180deg, #1F2937 0%, #111827 100%)',
            fontFamily: 'Inter, sans-serif',
            color: 'white',
          }}
        >
          {/* Left: image */}
          <div style={{ width: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
            {imageUrl ? (
              <img
                src={imageUrl}
                width={420}
                height={420}
                style={{ objectFit: 'contain', borderRadius: '24px' }}
              />
            ) : (
              <div style={{ width: '420px', height: '420px', background: '#374151', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '100px' }}>
                🐾
              </div>
            )}
          </div>

          {/* Right: features */}
          <div style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px 50px 40px 10px', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '32px' }}>🐾</span>
              <span style={{ fontSize: '22px', fontWeight: 700, color: '#F97316' }}>PawsNL</span>
            </div>

            <div style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1.3 }}>
              {productName}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {features.length > 0 ? features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, flexShrink: 0 }}>
                    ✓
                  </div>
                  <span style={{ fontSize: '20px', color: '#D1D5DB' }}>{f}</span>
                </div>
              )) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700 }}>✓</div>
                    <span style={{ fontSize: '20px', color: '#D1D5DB' }}>Premium kwaliteit</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700 }}>✓</div>
                    <span style={{ fontSize: '20px', color: '#D1D5DB' }}>Gratis verzending</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700 }}>✓</div>
                    <span style={{ fontSize: '20px', color: '#D1D5DB' }}>30 dagen retour</span>
                  </div>
                </>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
              <span style={{ fontSize: '40px', fontWeight: 800, color: '#F97316' }}>{price}</span>
              {comparePrice && (
                <span style={{ fontSize: '24px', color: '#6B7280', textDecoration: 'line-through' }}>{comparePrice}</span>
              )}
            </div>

            <div style={{ background: '#F97316', padding: '14px 0', borderRadius: '16px', textAlign: 'center', fontSize: '22px', fontWeight: 700, marginTop: '8px' }}>
              Bestel nu op pawsnlshop.com
            </div>
          </div>
        </div>
      ),
      { width: 1080, height: 1080 }
    )
  }

  if (template === 'banner') {
    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '628px',
            display: 'flex',
            background: 'linear-gradient(135deg, #FFF7ED 0%, #FFFFFF 40%, #FEF3C7 100%)',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          {/* Left content */}
          <div style={{ width: '55%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '50px 30px 50px 60px', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '28px' }}>🐾</span>
              <span style={{ fontSize: '20px', fontWeight: 700, color: '#F97316' }}>PawsNL</span>
              {category && (
                <span style={{ background: '#FED7AA', color: '#C2410C', padding: '4px 14px', borderRadius: '50px', fontSize: '14px', fontWeight: 600, marginLeft: '8px' }}>
                  {category}
                </span>
              )}
            </div>

            <div style={{ fontSize: '38px', fontWeight: 800, color: '#1F2937', lineHeight: 1.2 }}>
              {productName}
            </div>

            {features.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                {features.slice(0, 3).map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '18px', color: '#4B5563' }}>
                    <span style={{ color: '#F97316', fontWeight: 700 }}>✓</span> {f}
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
              <span style={{ fontSize: '44px', fontWeight: 800, color: '#F97316' }}>{price}</span>
              {comparePrice && (
                <span style={{ fontSize: '26px', color: '#9CA3AF', textDecoration: 'line-through' }}>{comparePrice}</span>
              )}
              {discount && (
                <span style={{ background: '#10B981', color: 'white', padding: '6px 16px', borderRadius: '50px', fontSize: '18px', fontWeight: 700 }}>
                  -{discount}%
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
              <span style={{ fontSize: '14px', color: '#9CA3AF' }}>🚚 Gratis verzending</span>
              <span style={{ fontSize: '14px', color: '#9CA3AF' }}>•</span>
              <span style={{ fontSize: '14px', color: '#9CA3AF' }}>↩️ 30 dagen retour</span>
              <span style={{ fontSize: '14px', color: '#9CA3AF' }}>•</span>
              <span style={{ fontSize: '14px', color: '#9CA3AF' }}>🔒 Veilig betalen</span>
            </div>
          </div>

          {/* Right image */}
          <div style={{ width: '45%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '30px' }}>
            {imageUrl ? (
              <img
                src={imageUrl}
                width={400}
                height={400}
                style={{ objectFit: 'contain', borderRadius: '24px' }}
              />
            ) : (
              <div style={{ width: '400px', height: '400px', background: '#F3F4F6', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '80px' }}>
                🐾
              </div>
            )}
          </div>
        </div>
      ),
      { width: 1200, height: 628 }
    )
  }

  // Default: infographic (1080x1350 - Instagram portrait)
  return new ImageResponse(
    (
      <div
        style={{
          width: '1080px',
          height: '1350px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(180deg, #FFFFFF 0%, #FFF7ED 100%)',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '40px 50px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '36px' }}>🐾</span>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#1F2937' }}>PawsNL</span>
          </div>
          {discount && (
            <div style={{ background: '#EF4444', color: 'white', padding: '8px 20px', borderRadius: '50px', fontSize: '20px', fontWeight: 800 }}>
              -{discount}% OFF
            </div>
          )}
          {badge && !discount && (
            <div style={{ background: '#F97316', color: 'white', padding: '8px 20px', borderRadius: '50px', fontSize: '18px', fontWeight: 700 }}>
              {badge}
            </div>
          )}
        </div>

        {/* Product image */}
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center', padding: '10px 40px' }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              width={600}
              height={600}
              style={{ objectFit: 'contain', borderRadius: '32px' }}
            />
          ) : (
            <div style={{ width: '600px', height: '600px', background: '#F3F4F6', borderRadius: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '140px' }}>
              🐾
            </div>
          )}
        </div>

        {/* Product info */}
        <div style={{ padding: '20px 50px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {category && (
            <span style={{ color: '#F97316', fontSize: '18px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>
              {category}
            </span>
          )}
          <div style={{ fontSize: '34px', fontWeight: 700, color: '#1F2937', lineHeight: 1.2 }}>
            {productName}
          </div>
        </div>

        {/* Features */}
        {features.length > 0 && (
          <div style={{ padding: '0 50px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {features.slice(0, 4).map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '20px', color: '#4B5563' }}>
                <span style={{ color: '#F97316', fontSize: '22px' }}>✓</span> {f}
              </div>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div style={{ padding: '20px 50px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '48px', fontWeight: 800, color: '#F97316' }}>{price}</span>
            {comparePrice && (
              <span style={{ fontSize: '28px', color: '#9CA3AF', textDecoration: 'line-through' }}>{comparePrice}</span>
            )}
          </div>
          <div style={{ background: '#F97316', color: 'white', padding: '16px 32px', borderRadius: '16px', fontSize: '22px', fontWeight: 700 }}>
            pawsnlshop.com
          </div>
        </div>

        {/* Trust bar */}
        <div style={{ background: '#1F2937', padding: '20px 50px', display: 'flex', justifyContent: 'space-around', borderRadius: '0 0 0 0' }}>
          <span style={{ color: '#D1D5DB', fontSize: '16px' }}>🚚 Gratis verzending vanaf €35</span>
          <span style={{ color: '#D1D5DB', fontSize: '16px' }}>↩️ 30 dagen retour</span>
          <span style={{ color: '#D1D5DB', fontSize: '16px' }}>🔒 Veilig betalen</span>
        </div>
      </div>
    ),
    { width: 1080, height: 1350 }
  )
}
