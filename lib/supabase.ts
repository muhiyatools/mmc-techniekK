import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://givwadhkowednmwskpfc.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "sb_publishable_ouAiWKMe9wi5X8JT8jnjaQ_N4UsDIWg";

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types
export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price_range: string | null;
  service_slug: string;
  image_url: string | null;
  created_at: string;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description: string;
  image_url: string;
  popular: boolean;
  caption: string;
  created_at: string;
}

export interface QuoteRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service_slug: string | null;
  product_id: string | null;
  message: string | null;
  status: "pending" | "contacted" | "quoted" | "completed";
  created_at: string;
}
