import { createClient } from '@supabase/supabase-js'
const c = createClient(
  'https://mumuorbsfiklktwqtveb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11bXVvcmJzZmlrbGt0d3F0dmViIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5NDU3MywiZXhwIjoyMDg3ODcwNTczfQ.1PrgoWGP-YJvbar2y31W2vZ913Xl4XgxA7mkdjlGcwQ'
)

const { data, error } = await c.from('products').update({
  name: 'Multivitamine Kauwtabletten voor Honden',
  slug: 'multivitamine-kauwtabletten-honden',
  description: 'Geef je hond dagelijks een boost met deze lekkere multivitamine kauwtabletten! Bevat essentiële vitamines en mineralen voor een gezonde vacht, sterke botten en meer energie. 60 tabletten per verpakking. Geschikt voor alle hondenrassen en leeftijden. Vlees-smaak die honden onweerstaanbaar vinden.',
  compare_price: 18.95,
}).eq('id', '875e82ae-b652-42fd-9c4b-d7078ed2a5c8').select()

if (error) console.error('Error:', error)
else console.log('Updated:', JSON.stringify(data, null, 2))
