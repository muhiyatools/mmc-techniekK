-- Supabase schema for MMC Techniek
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  description TEXT NOT NULL,
  price_range TEXT,
  tier TEXT NOT NULL CHECK (tier IN ('economy', 'medium', 'premium')),
  service_slug TEXT NOT NULL,
  image_url TEXT,
  tech_specs TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quote requests table
CREATE TABLE IF NOT EXISTS quote_requests (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_slug TEXT,
  product_name TEXT,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'quoted', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample products for Air Conditioning
INSERT INTO products (slug, name, brand, description, price_range, tier, service_slug, image_url, tech_specs) VALUES
('lg-artcool-gallery', 'LG Artcool Gallery', 'LG', 'Design wandmodel met ionisator en WiFi. Ultra-stil met maar 19 dB.', '€2.800 - €5.000', 'premium', 'airconditioning', 'https://images.unsplash.com/photo-1631545308772-81a0e0a3a6ff?auto=format&fit=crop&w=600&q=80', ARRAY['A+++ energielabel', '19 dB geluidsniveau', 'Ionisator luchtzuivering', 'WiFi bediening', 'Dual Inverter Compressor', 'Tot 60% energiebesparing']),
('lg-prestige', 'LG Prestige', 'LG', 'Slim wandmodel met Dual Inverter. Snel koelen en verwarmen.', '€2.200 - €3.800', 'medium', 'airconditioning', 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=600&q=80', ARRAY['A++ energielabel', '22 dB geluidsniveau', 'Dual Inverter Compressor', 'WiFi bediening', 'Snelkoelfunctie', 'Slaapmodus']),
('mitsubishi-msz-ap', 'Mitsubishi Electric MSZ-AP', 'Mitsubishi Electric', 'Betrouwbaar en stil. Geschikt voor alle ruimtes.', '€2.500 - €4.200', 'medium', 'airconditioning', 'https://images.unsplash.com/photo-1631545308772-81a0e0a3a6ff?auto=format&fit=crop&w=600&q=80', ARRAY['A++ energielabel', '20 dB geluidsniveau', '3D i-See Sensor', 'Jet Airflow', 'Snelle installatie', '5 jaar garantie']),
('mitsubishi-msz-ln', 'Mitsubishi Electric MSZ-LN', 'Mitsubishi Electric', 'Premium design met plasma quad filter en 3D i-See Sensor.', '€3.200 - €5.500', 'premium', 'airconditioning', 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=600&q=80', ARRAY['A+++ energielabel', '19 dB geluidsniveau', 'Plasma Quad Filter', '3D i-See Sensor', 'Natural Colour finish', '7 jaar garantie']),
('daikin-perfera', 'Daikin Perfera', 'Daikin', 'Stil en energiezuinig met Flash Streamer luchtzuivering.', '€2.800 - €4.500', 'medium', 'airconditioning', 'https://images.unsplash.com/photo-1631545308772-81a0e0a3a6ff?auto=format&fit=crop&w=600&q=80', ARRAY['A++ energielabel', '21 dB geluidsniveau', 'Flash Streamer technologie', '3D luchtstroom', 'Vochtigheidsregeling', 'Online controller']),
('daikin-stylish', 'Daikin Stylish', 'Daikin', 'Design wandmodel met Coanda airflow en zilver-ion filter.', '€3.500 - €6.000', 'premium', 'airconditioning', 'https://images.unsplash.com/photo-1617103996702-96ff29b1c467?auto=format&fit=crop&w=600&q=80', ARRAY['A+++ energielabel', '19 dB geluidsniveau', 'Coanda Airflow', 'Zilver-ion filter', '3D luchtstroom', 'Online controller']);

-- Insert Solar Panel products
INSERT INTO products (slug, name, brand, description, price_range, tier, service_slug, image_url, tech_specs) VALUES
('trina-vertex', 'Trina Solar Vertex', 'Trina Solar', 'Betaalbare mono-crystalline panelen met 21% rendement.', '€4.500 - €7.500', 'economy', 'zonnepanelen', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80', ARRAY['21% rendement', '600W vermogen', '25 jaar productgarantie', 'Half-cut cell technologie', 'PID-bestendig', 'Tot -0.35%/C temperatuurscoefficient']),
('trina-duomax', 'Trina Solar Duomax', 'Trina Solar', 'Dubbelglas panelen met 30 jaar garantie en 22% rendement.', '€5.500 - €9.000', 'medium', 'zonnepanelen', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80', ARRAY['22% rendement', '650W vermogen', '30 jaar productgarantie', 'Dubbelglas technologie', 'PID-bestendig', 'Hagelbestendig tot 35mm']),
('jinko-tiger-neo', 'Jinko Solar Tiger Neo', 'Jinko', 'Betaalbare TOPCon panelen met 22.5% rendement.', '€5.000 - €8.000', 'economy', 'zonnepanelen', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80', ARRAY['22.5% rendement', '620W vermogen', '25 jaar productgarantie', 'TOPCon technologie', 'Half-cut cell', 'Excellent low-light prestatie']),
('jinko-n-type', 'Jinko Solar N-Type', 'Jinko', 'Premium N-type panelen met 23% rendement en 30 jaar garantie.', '€6.500 - €10.000', 'medium', 'zonnepanelen', 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=600&q=80', ARRAY['23% rendement', '670W vermogen', '30 jaar productgarantie', 'N-type TOPCon', 'Dubbelglas', '0.3%/C temperatuurscoefficient']);

-- Insert Inverter products
INSERT INTO products (slug, name, brand, description, price_range, tier, service_slug, image_url, tech_specs) VALUES
('growatt-mic', 'Growatt MIC', 'Growatt', 'Betrouwbare string omvormer met WiFi monitoring.', NULL, 'economy', 'zonnepanelen', 'https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?auto=format&fit=crop&w=600&q=80', ARRAY['98.4% max efficiëntie', 'WiFi monitoring', 'IP65 bescherming', 'Dubbele MPPT', '5 jaar garantie', 'Natuurlijke koeling']),
('enphase-iq8', 'Enphase IQ8', 'Enphase', 'Premium micro-omvormer met per-paneel monitoring en back-up.', NULL, 'premium', 'zonnepanelen', 'https://images.unsplash.com/photo-1611365892117-00ac5ef43c90?auto=format&fit=crop&w=600&q=80', ARRAY['97.6% CEC efficiëntie', 'Per-paneel monitoring', 'Sunlight back-up', '25 jaar garantie', 'Stroomuitval bescherming', 'Module-level optimalisatie']);

-- Insert Battery products
INSERT INTO products (slug, name, brand, description, price_range, tier, service_slug, image_url, tech_specs) VALUES
('alphaess-smile', 'AlphaESS Smile', 'AlphaESS', 'Betaalbare thuisbatterij met 5.7 kWh capaciteit en modulair uitbreidbaar.', '€5.500 - €8.000', 'economy', 'batterijopslag', 'https://images.unsplash.com/photo-1620770679803-964c922db3c5?auto=format&fit=crop&w=600&q=80', ARRAY['5.7 kWh basiscapaciteit', 'Modulair tot 34.2 kWh', 'LFP batterijtechnologie', '6000+ cycli', '10 jaar garantie', 'IP65 bescherming']),
('alphaess-storion', 'AlphaESS Storion', 'AlphaESS', 'High-end thuisbatterij met 13.3 kWh en zonnepaneel integratie.', '€8.000 - €12.000', 'medium', 'batterijopslag', 'https://images.unsplash.com/photo-1620770679803-964c922db3c5?auto=format&fit=crop&w=600&q=80', ARRAY['13.3 kWh capaciteit', 'LFP batterijtechnologie', '8000+ cycli', 'Hybride omvormer', '10 jaar garantie', 'Slimme energiemanagement']),
('sigenergy-sigenstor', 'Sigenergy SigenStor', 'Sigenergy', 'Premium batterij met AI-optimalisatie en EV-laden integratie.', '€7.000 - €10.000', 'premium', 'batterijopslag', 'https://images.unsplash.com/photo-1620770679803-964c922db3c5?auto=format&fit=crop&w=600&q=80', ARRAY['5-48 kWh configuratie', 'LFP batterijtechnologie', 'AI energieoptimalisatie', 'EV-laden integratie', '15 jaar garantie', '97% round-trip efficiëntie']);

-- Insert Heat Pump products
INSERT INTO products (slug, name, brand, description, price_range, tier, service_slug, image_url, tech_specs) VALUES
('nefit-compress-7000i', 'Nefit Bosch Compress 7000i', 'Nefit Bosch', 'Hybride warmtepomp met hoog rendement voor woningen met bestaande cv.', '€4.500 - €7.500', 'economy', 'warmtepompen', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80', ARRAY['A+ energielabel', 'COP tot 4.5', 'Lucht/water technologie', 'Ingebouwde boiler', 'Modulerend vermogen', 'Stil: 48 dB']),
('daikin-altherma-3', 'Daikin Altherma 3', 'Daikin', 'Full-electric warmtepomp met geïntegreerde boiler en vloerverwarming.', '€8.000 - €12.000', 'premium', 'warmtepompen', 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=600&q=80', ARRAY['A+++ energielabel', 'COP tot 5.0', 'Lucht/water', '230L geïntegreerde boiler', 'Smart grid ready', 'Stil: 42 dB']);

-- Create Row Level Security policies
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE quote_requests ENABLE ROW LEVEL SECURITY;

-- Allow public read access to products
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);

-- Allow public insert to quote_requests
CREATE POLICY "Allow public insert" ON quote_requests FOR INSERT WITH CHECK (true);

-- Allow public read access to quote_requests (for admin purposes)
CREATE POLICY "Allow public read access quotes" ON quote_requests FOR SELECT USING (true);
