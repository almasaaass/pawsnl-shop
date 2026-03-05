-- TikTok Videos Pipeline tabel
-- Plak dit in Supabase SQL Editor → Run

CREATE TABLE IF NOT EXISTS tiktok_videos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_url TEXT NOT NULL,
  script TEXT,
  caption TEXT,
  hashtags TEXT[],

  -- Creatify
  creatify_task_id TEXT,
  video_url TEXT,
  thumbnail_url TEXT,

  -- Blotato / TikTok
  blotato_post_id TEXT,
  tiktok_post_url TEXT,

  -- Metrics
  views INTEGER DEFAULT 0,
  viral_alert_sent BOOLEAN DEFAULT FALSE,

  -- Status: draft → generating → ready → posted → viral
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'ready', 'posted', 'viral', 'failed')),
  failed_reason TEXT,

  -- Timestamps
  scheduled_at TIMESTAMPTZ,
  posted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index voor status filtering
CREATE INDEX idx_tiktok_videos_status ON tiktok_videos(status);

-- RLS: alleen via service role (admin)
ALTER TABLE tiktok_videos ENABLE ROW LEVEL SECURITY;
