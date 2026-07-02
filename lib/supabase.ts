import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://stjmmlzykokwaqkushnu.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN0am1tbHp5a29rd2Fxa3VzaG51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI4NTQ1OTIsImV4cCI6MjA5ODQzMDU5Mn0.Sxw5aSp7dG-4sHuvVKqI6ivsgQ5-EPCw_ZGVqxGoYIc";

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
  images?: string[];
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
