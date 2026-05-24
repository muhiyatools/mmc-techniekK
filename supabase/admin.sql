-- ============================================
-- MMC Techniek Admin Setup
-- Run this in your Supabase SQL Editor
-- ============================================

-- 1. Admin products table
CREATE TABLE IF NOT EXISTS public.admin_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  brand text NOT NULL,
  price text,
  description text NOT NULL DEFAULT '',
  tech_specs text[] NOT NULL DEFAULT '{}',
  image text NOT NULL DEFAULT '',
  service_slug text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(name, service_slug)
);

-- 2. Admin brands table
CREATE TABLE IF NOT EXISTS public.admin_brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  logo_url text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Admin services/categories table
CREATE TABLE IF NOT EXISTS public.admin_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  summary text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  image text NOT NULL DEFAULT '',
  caption text NOT NULL DEFAULT '',
  popular boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4. Enable Row Level Security
ALTER TABLE public.admin_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_services ENABLE ROW LEVEL SECURITY;

-- 5. Policies: allow public read/write
-- NOTE: For production, switch 'anon' to 'authenticated' and use Supabase Auth
CREATE POLICY "Allow public read products"
  ON public.admin_products FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public write products"
  ON public.admin_products FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read brands"
  ON public.admin_brands FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public write brands"
  ON public.admin_brands FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

CREATE POLICY "Allow public read services"
  ON public.admin_services FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Allow public write services"
  ON public.admin_services FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

-- 6. Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- 7. Storage policies
CREATE POLICY "Allow public read images"
  ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "Allow public write images"
  ON storage.objects FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow public delete images"
  ON storage.objects FOR DELETE TO anon, authenticated
  USING (bucket_id = 'product-images');

-- 8. Auto-update trigger for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS admin_products_updated_at ON public.admin_products;
CREATE TRIGGER admin_products_updated_at
  BEFORE UPDATE ON public.admin_products
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. Admin settings table (key-value for hero text etc.)
CREATE TABLE IF NOT EXISTS public.admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read settings"
  ON public.admin_settings FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public write settings"
  ON public.admin_settings FOR ALL TO anon, authenticated
  USING (true) WITH CHECK (true);

DROP TRIGGER IF EXISTS admin_settings_updated_at ON public.admin_settings;
CREATE TRIGGER admin_settings_updated_at
  BEFORE UPDATE ON public.admin_settings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
