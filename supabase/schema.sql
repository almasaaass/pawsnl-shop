-- ============================================================
-- PawsNL – Supabase Database Schema
-- Voer dit uit in de Supabase SQL Editor
-- ============================================================

-- Extensies
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PRODUCTEN
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  description   TEXT NOT NULL DEFAULT '',
  price         DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  compare_price DECIMAL(10, 2) CHECK (compare_price >= 0),
  images        JSONB NOT NULL DEFAULT '[]',
  category      TEXT NOT NULL,
  stock         INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
  featured      BOOLEAN NOT NULL DEFAULT FALSE,
  cj_pid        TEXT,
  cj_vid        TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS products_category_idx ON products(category);
CREATE INDEX IF NOT EXISTS products_featured_idx ON products(featured);
CREATE INDEX IF NOT EXISTS products_slug_idx ON products(slug);

-- ============================================================
-- BESTELLINGEN
-- ============================================================
CREATE TABLE IF NOT EXISTS orders (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_email     TEXT NOT NULL,
  customer_name      TEXT NOT NULL,
  shipping_address   JSONB NOT NULL DEFAULT '{}',
  items              JSONB NOT NULL DEFAULT '[]',
  total              DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  status             TEXT NOT NULL DEFAULT 'pending'
                       CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
  stripe_session_id  TEXT UNIQUE,
  tracking_number    TEXT,
  cj_order_id        TEXT,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS orders_email_idx ON orders(customer_email);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
CREATE INDEX IF NOT EXISTS orders_created_idx ON orders(created_at DESC);

-- ============================================================
-- KLANTEN
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  orders_count  INTEGER NOT NULL DEFAULT 0,
  total_spent   DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS customers_email_idx ON customers(email);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Producten zijn publiek leesbaar
-- Orders en klanten alleen via service role key (server-side)
-- ============================================================

ALTER TABLE products  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders    ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Producten: iedereen mag lezen
CREATE POLICY "Producten zijn publiek leesbaar"
  ON products FOR SELECT
  USING (true);

-- Orders: service role heeft altijd toegang (via supabaseAdmin)
-- Anon users mogen NIET direct orders lezen/schrijven
CREATE POLICY "Orders alleen via service role"
  ON orders FOR ALL
  USING (false);

-- Klanten: service role heeft altijd toegang
CREATE POLICY "Klanten alleen via service role"
  ON customers FOR ALL
  USING (false);
