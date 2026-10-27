// Generated with the Supabase MCP `generate_typescript_types` (project stjmmlzykokwaqkushnu).
// Regenerate after every migration; do not edit by hand.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_brands: {
        Row: { created_at: string; id: string; logo_url: string; name: string }
        Insert: { created_at?: string; id?: string; logo_url?: string; name: string }
        Update: { created_at?: string; id?: string; logo_url?: string; name?: string }
        Relationships: []
      }
      admin_products: {
        Row: {
          brand: string
          created_at: string
          description: string
          id: string
          image: string
          images: string[]
          name: string
          price: string | null
          service_slug: string
          sizes: string[] | null
          tech_specs: string[]
          updated_at: string
        }
        Insert: {
          brand: string
          created_at?: string
          description?: string
          id?: string
          image?: string
          images?: string[]
          name: string
          price?: string | null
          service_slug: string
          sizes?: string[] | null
          tech_specs?: string[]
          updated_at?: string
        }
        Update: {
          brand?: string
          created_at?: string
          description?: string
          id?: string
          image?: string
          images?: string[]
          name?: string
          price?: string | null
          service_slug?: string
          sizes?: string[] | null
          tech_specs?: string[]
          updated_at?: string
        }
        Relationships: []
      }
      admin_services: {
        Row: { caption: string; created_at: string; description: string; id: string; image: string; popular: boolean; slug: string; summary: string; title: string }
        Insert: { caption?: string; created_at?: string; description?: string; id?: string; image?: string; popular?: boolean; slug: string; summary?: string; title: string }
        Update: { caption?: string; created_at?: string; description?: string; id?: string; image?: string; popular?: boolean; slug?: string; summary?: string; title?: string }
        Relationships: []
      }
      admin_settings: {
        Row: { created_at: string; id: string; key: string; updated_at: string; value: string }
        Insert: { created_at?: string; id?: string; key: string; updated_at?: string; value?: string }
        Update: { created_at?: string; id?: string; key?: string; updated_at?: string; value?: string }
        Relationships: []
      }
      audit_log: {
        Row: { action: string; actor: string | null; changed: Json | null; created_at: string; id: number; row_id: string; table_name: string }
        Insert: { action: string; actor?: string | null; changed?: Json | null; created_at?: string; id?: never; row_id: string; table_name: string }
        Update: { action?: string; actor?: string | null; changed?: Json | null; created_at?: string; id?: never; row_id?: string; table_name?: string }
        Relationships: [
          { foreignKeyName: "audit_log_actor_fkey"; columns: ["actor"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
      brands: {
        Row: {
          created_at: string
          id: string
          kind: Database["public"]["Enums"]["brand_kind"]
          logo_path: string | null
          name: string
          show_in_strip: boolean
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
          updated_by: string | null
          website: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["brand_kind"]
          logo_path?: string | null
          name: string
          show_in_strip?: boolean
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          kind?: Database["public"]["Enums"]["brand_kind"]
          logo_path?: string | null
          name?: string
          show_in_strip?: boolean
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          updated_by?: string | null
          website?: string | null
        }
        Relationships: [
          { foreignKeyName: "brands_updated_by_fkey"; columns: ["updated_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
      faqs: {
        Row: {
          answer: Json
          created_at: string
          featured: boolean
          id: string
          question: Json
          service_id: string | null
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          answer: Json
          created_at?: string
          featured?: boolean
          id?: string
          question: Json
          service_id?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          answer?: Json
          created_at?: string
          featured?: boolean
          id?: string
          question?: Json
          service_id?: string | null
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          { foreignKeyName: "faqs_service_id_fkey"; columns: ["service_id"]; isOneToOne: false; referencedRelation: "services"; referencedColumns: ["id"] },
          { foreignKeyName: "faqs_updated_by_fkey"; columns: ["updated_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
      home_sections: {
        Row: { content: Json; key: string; updated_at: string; updated_by: string | null }
        Insert: { content?: Json; key: string; updated_at?: string; updated_by?: string | null }
        Update: { content?: Json; key?: string; updated_at?: string; updated_by?: string | null }
        Relationships: [
          { foreignKeyName: "home_sections_updated_by_fkey"; columns: ["updated_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
      lead_events: {
        Row: {
          actor: string | null
          body: string | null
          created_at: string
          from_status: string | null
          id: number
          lead_id: string
          to_status: string | null
          type: Database["public"]["Enums"]["lead_event_type"]
        }
        Insert: {
          actor?: string | null
          body?: string | null
          created_at?: string
          from_status?: string | null
          id?: never
          lead_id: string
          to_status?: string | null
          type: Database["public"]["Enums"]["lead_event_type"]
        }
        Update: {
          actor?: string | null
          body?: string | null
          created_at?: string
          from_status?: string | null
          id?: never
          lead_id?: string
          to_status?: string | null
          type?: Database["public"]["Enums"]["lead_event_type"]
        }
        Relationships: [
          { foreignKeyName: "lead_events_actor_fkey"; columns: ["actor"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
          { foreignKeyName: "lead_events_lead_id_fkey"; columns: ["lead_id"]; isOneToOne: false; referencedRelation: "quote_requests"; referencedColumns: ["id"] },
        ]
      }
      lead_files: {
        Row: { bytes: number; created_at: string; id: string; lead_id: string; mime: string; path: string }
        Insert: { bytes: number; created_at?: string; id?: string; lead_id: string; mime: string; path: string }
        Update: { bytes?: number; created_at?: string; id?: string; lead_id?: string; mime?: string; path?: string }
        Relationships: [
          { foreignKeyName: "lead_files_lead_id_fkey"; columns: ["lead_id"]; isOneToOne: false; referencedRelation: "quote_requests"; referencedColumns: ["id"] },
        ]
      }
      media: {
        Row: {
          alt: Json
          bucket: string
          bytes: number
          created_at: string
          created_by: string | null
          dominant_color: string
          focal_x: number
          focal_y: number
          height: number
          id: string
          mime: string
          path: string
          sha256: string
          updated_at: string
          width: number
        }
        Insert: {
          alt: Json
          bucket?: string
          bytes: number
          created_at?: string
          created_by?: string | null
          dominant_color?: string
          focal_x?: number
          focal_y?: number
          height: number
          id?: string
          mime: string
          path: string
          sha256: string
          updated_at?: string
          width: number
        }
        Update: {
          alt?: Json
          bucket?: string
          bytes?: number
          created_at?: string
          created_by?: string | null
          dominant_color?: string
          focal_x?: number
          focal_y?: number
          height?: number
          id?: string
          mime?: string
          path?: string
          sha256?: string
          updated_at?: string
          width?: number
        }
        Relationships: [
          { foreignKeyName: "media_created_by_fkey"; columns: ["created_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
      pages: {
        Row: {
          body: Json
          created_at: string
          id: string
          seo_description: Json
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          title: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          body?: Json
          created_at?: string
          id?: string
          seo_description?: Json
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          body?: Json
          created_at?: string
          id?: string
          seo_description?: Json
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          title?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          { foreignKeyName: "pages_updated_by_fkey"; columns: ["updated_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
      product_brands: {
        Row: { brand_id: string; product_id: string }
        Insert: { brand_id: string; product_id: string }
        Update: { brand_id?: string; product_id?: string }
        Relationships: [
          { foreignKeyName: "product_brands_brand_id_fkey"; columns: ["brand_id"]; isOneToOne: false; referencedRelation: "brands"; referencedColumns: ["id"] },
          { foreignKeyName: "product_brands_product_id_fkey"; columns: ["product_id"]; isOneToOne: false; referencedRelation: "products"; referencedColumns: ["id"] },
        ]
      }
      product_images: {
        Row: { media_id: string; product_id: string; sort_order: number }
        Insert: { media_id: string; product_id: string; sort_order?: number }
        Update: { media_id?: string; product_id?: string; sort_order?: number }
        Relationships: [
          { foreignKeyName: "product_images_media_id_fkey"; columns: ["media_id"]; isOneToOne: false; referencedRelation: "media"; referencedColumns: ["id"] },
          { foreignKeyName: "product_images_product_id_fkey"; columns: ["product_id"]; isOneToOne: false; referencedRelation: "products"; referencedColumns: ["id"] },
        ]
      }
      products: {
        Row: {
          body: Json
          created_at: string
          id: string
          legacy_slugs: string[]
          media_id: string | null
          name: string
          price_from: number | null
          price_note: Json
          price_to: number | null
          service_id: string
          slug: string
          sort_order: number
          source_admin_product_id: string | null
          specs: Json
          status: Database["public"]["Enums"]["content_status"]
          summary: Json
          tier: string | null
          updated_at: string
          updated_by: string | null
          variants: Json
        }
        Insert: {
          body?: Json
          created_at?: string
          id?: string
          legacy_slugs?: string[]
          media_id?: string | null
          name: string
          price_from?: number | null
          price_note?: Json
          price_to?: number | null
          service_id: string
          slug: string
          sort_order?: number
          source_admin_product_id?: string | null
          specs?: Json
          status?: Database["public"]["Enums"]["content_status"]
          summary?: Json
          tier?: string | null
          updated_at?: string
          updated_by?: string | null
          variants?: Json
        }
        Update: {
          body?: Json
          created_at?: string
          id?: string
          legacy_slugs?: string[]
          media_id?: string | null
          name?: string
          price_from?: number | null
          price_note?: Json
          price_to?: number | null
          service_id?: string
          slug?: string
          sort_order?: number
          source_admin_product_id?: string | null
          specs?: Json
          status?: Database["public"]["Enums"]["content_status"]
          summary?: Json
          tier?: string | null
          updated_at?: string
          updated_by?: string | null
          variants?: Json
        }
        Relationships: [
          { foreignKeyName: "products_media_id_fkey"; columns: ["media_id"]; isOneToOne: false; referencedRelation: "media"; referencedColumns: ["id"] },
          { foreignKeyName: "products_service_id_fkey"; columns: ["service_id"]; isOneToOne: false; referencedRelation: "services"; referencedColumns: ["id"] },
          { foreignKeyName: "products_updated_by_fkey"; columns: ["updated_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
      profiles: {
        Row: {
          active: boolean
          created_at: string
          email: string | null
          full_name: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          email?: string | null
          full_name?: string
          id: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      project_images: {
        Row: { media_id: string; project_id: string; sort_order: number }
        Insert: { media_id: string; project_id: string; sort_order?: number }
        Update: { media_id?: string; project_id?: string; sort_order?: number }
        Relationships: [
          { foreignKeyName: "project_images_media_id_fkey"; columns: ["media_id"]; isOneToOne: false; referencedRelation: "media"; referencedColumns: ["id"] },
          { foreignKeyName: "project_images_project_id_fkey"; columns: ["project_id"]; isOneToOne: false; referencedRelation: "projects"; referencedColumns: ["id"] },
        ]
      }
      project_services: {
        Row: { project_id: string; service_id: string }
        Insert: { project_id: string; service_id: string }
        Update: { project_id?: string; service_id?: string }
        Relationships: [
          { foreignKeyName: "project_services_project_id_fkey"; columns: ["project_id"]; isOneToOne: false; referencedRelation: "projects"; referencedColumns: ["id"] },
          { foreignKeyName: "project_services_service_id_fkey"; columns: ["service_id"]; isOneToOne: false; referencedRelation: "services"; referencedColumns: ["id"] },
        ]
      }
      projects: {
        Row: {
          body: Json
          cover_media_id: string | null
          created_at: string
          featured: boolean
          id: string
          place: string | null
          sector: Database["public"]["Enums"]["project_sector"]
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          summary: Json
          title: Json
          updated_at: string
          updated_by: string | null
          year: number | null
        }
        Insert: {
          body?: Json
          cover_media_id?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          place?: string | null
          sector?: Database["public"]["Enums"]["project_sector"]
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          summary?: Json
          title: Json
          updated_at?: string
          updated_by?: string | null
          year?: number | null
        }
        Update: {
          body?: Json
          cover_media_id?: string | null
          created_at?: string
          featured?: boolean
          id?: string
          place?: string | null
          sector?: Database["public"]["Enums"]["project_sector"]
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          summary?: Json
          title?: Json
          updated_at?: string
          updated_by?: string | null
          year?: number | null
        }
        Relationships: [
          { foreignKeyName: "projects_cover_media_id_fkey"; columns: ["cover_media_id"]; isOneToOne: false; referencedRelation: "media"; referencedColumns: ["id"] },
          { foreignKeyName: "projects_updated_by_fkey"; columns: ["updated_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
      quote_requests: {
        Row: {
          answers: Json
          assignee: string | null
          consent_at: string | null
          created_at: string
          email: string
          house_number: string | null
          id: string
          kind: string
          last_activity_at: string
          locale: string
          message: string | null
          name: string
          phone: string | null
          postcode: string | null
          product_name: string | null
          product_slug: string | null
          property_type: string | null
          ref: string
          service_slug: string | null
          services: string[]
          source_page: string | null
          status: string
          timing: string | null
          updated_at: string
          utm: Json
        }
        Insert: {
          answers?: Json
          assignee?: string | null
          consent_at?: string | null
          created_at?: string
          email: string
          house_number?: string | null
          id?: string
          kind?: string
          last_activity_at?: string
          locale?: string
          message?: string | null
          name: string
          phone?: string | null
          postcode?: string | null
          product_name?: string | null
          product_slug?: string | null
          property_type?: string | null
          ref?: string
          service_slug?: string | null
          services?: string[]
          source_page?: string | null
          status?: string
          timing?: string | null
          updated_at?: string
          utm?: Json
        }
        Update: {
          answers?: Json
          assignee?: string | null
          consent_at?: string | null
          created_at?: string
          email?: string
          house_number?: string | null
          id?: string
          kind?: string
          last_activity_at?: string
          locale?: string
          message?: string | null
          name?: string
          phone?: string | null
          postcode?: string | null
          product_name?: string | null
          product_slug?: string | null
          property_type?: string | null
          ref?: string
          service_slug?: string | null
          services?: string[]
          source_page?: string | null
          status?: string
          timing?: string | null
          updated_at?: string
          utm?: Json
        }
        Relationships: [
          { foreignKeyName: "quote_requests_assignee_fkey"; columns: ["assignee"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
      rate_limits: {
        Row: { hits: number; key: string; window_start: string }
        Insert: { hits?: number; key: string; window_start: string }
        Update: { hits?: number; key?: string; window_start?: string }
        Relationships: []
      }
      reviews: {
        Row: {
          author: string
          body: Json
          consent: boolean
          created_at: string
          id: string
          place: string | null
          rating: number
          review_date: string | null
          sort_order: number
          source: string | null
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          author: string
          body: Json
          consent?: boolean
          created_at?: string
          id?: string
          place?: string | null
          rating?: number
          review_date?: string | null
          sort_order?: number
          source?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          author?: string
          body?: Json
          consent?: boolean
          created_at?: string
          id?: string
          place?: string | null
          rating?: number
          review_date?: string | null
          sort_order?: number
          source?: string | null
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          { foreignKeyName: "reviews_updated_by_fkey"; columns: ["updated_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
      services: {
        Row: {
          audience: Json
          body: Json
          created_at: string
          hero_media_id: string | null
          id: string
          kicker: Json
          seo_description: Json
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          steps: Json
          summary: Json
          tags: Json
          title: Json
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          audience?: Json
          body?: Json
          created_at?: string
          hero_media_id?: string | null
          id?: string
          kicker?: Json
          seo_description?: Json
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          steps?: Json
          summary?: Json
          tags?: Json
          title: Json
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          audience?: Json
          body?: Json
          created_at?: string
          hero_media_id?: string | null
          id?: string
          kicker?: Json
          seo_description?: Json
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          steps?: Json
          summary?: Json
          tags?: Json
          title?: Json
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          { foreignKeyName: "services_hero_media_id_fkey"; columns: ["hero_media_id"]; isOneToOne: false; referencedRelation: "media"; referencedColumns: ["id"] },
          { foreignKeyName: "services_updated_by_fkey"; columns: ["updated_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
      site_settings: {
        Row: { key: string; updated_at: string; updated_by: string | null; value: Json }
        Insert: { key: string; updated_at?: string; updated_by?: string | null; value: Json }
        Update: { key?: string; updated_at?: string; updated_by?: string | null; value?: Json }
        Relationships: [
          { foreignKeyName: "site_settings_updated_by_fkey"; columns: ["updated_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
      team_members: {
        Row: {
          bio: Json
          created_at: string
          id: string
          media_id: string | null
          name: string
          role: Json
          sort_order: number
          status: Database["public"]["Enums"]["content_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          bio?: Json
          created_at?: string
          id?: string
          media_id?: string | null
          name: string
          role?: Json
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          bio?: Json
          created_at?: string
          id?: string
          media_id?: string | null
          name?: string
          role?: Json
          sort_order?: number
          status?: Database["public"]["Enums"]["content_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          { foreignKeyName: "team_members_media_id_fkey"; columns: ["media_id"]; isOneToOne: false; referencedRelation: "media"; referencedColumns: ["id"] },
          { foreignKeyName: "team_members_updated_by_fkey"; columns: ["updated_by"]; isOneToOne: false; referencedRelation: "profiles"; referencedColumns: ["id"] },
        ]
      }
    }
    Views: {
      media_usage: {
        Row: { media_id: string | null; uses: number | null }
        Insert: { media_id?: string | null; uses?: never }
        Update: { media_id?: string | null; uses?: never }
        Relationships: []
      }
    }
    Functions: {
      check_rate_limit: { Args: { p_key: string; p_max: number; p_window_seconds: number }; Returns: boolean }
      has_nl: { Args: { v: Json }; Returns: boolean }
      has_role: { Args: { min_role: Database["public"]["Enums"]["app_role"] }; Returns: boolean }
      role_rank: { Args: { r: Database["public"]["Enums"]["app_role"] }; Returns: number }
    }
    Enums: {
      app_role: "editor" | "admin" | "owner"
      brand_kind: "supplier" | "client"
      content_status: "draft" | "published"
      lead_event_type: "created" | "status" | "note" | "call" | "email" | "whatsapp" | "assign" | "notify"
      project_sector: "particulier" | "utiliteit" | "retail" | "nieuwbouw"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database["public"]

export type Tables<T extends keyof (PublicSchema["Tables"] & PublicSchema["Views"])> =
  (PublicSchema["Tables"] & PublicSchema["Views"])[T] extends { Row: infer R } ? R : never
export type TablesInsert<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> = PublicSchema["Tables"][T]["Update"]
export type Enums<T extends keyof PublicSchema["Enums"]> = PublicSchema["Enums"][T]

export const Constants = {
  public: {
    Enums: {
      app_role: ["editor", "admin", "owner"],
      brand_kind: ["supplier", "client"],
      content_status: ["draft", "published"],
      lead_event_type: ["created", "status", "note", "call", "email", "whatsapp", "assign", "notify"],
      project_sector: ["particulier", "utiliteit", "retail", "nieuwbouw"],
    },
  },
} as const
