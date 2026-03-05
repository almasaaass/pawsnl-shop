-- Email signups tabel voor lead magnet & newsletter
-- Voer dit uit in Supabase Dashboard → SQL Editor

CREATE TABLE IF NOT EXISTS email_signups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  email text UNIQUE NOT NULL,
  source text DEFAULT 'unknown',
  created_at timestamptz DEFAULT now()
);

-- RLS inschakelen
ALTER TABLE email_signups ENABLE ROW LEVEL SECURITY;

-- Service role heeft volledige toegang (voor API routes)
CREATE POLICY "Service role full access" ON email_signups
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Referral tracking tabel
CREATE TABLE IF NOT EXISTS referral_clicks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_email text NOT NULL,
  clicked_at timestamptz DEFAULT now(),
  ip_address text
);

ALTER TABLE referral_clicks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON referral_clicks
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
