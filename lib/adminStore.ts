import { supabase } from "./supabase";
import { services as baseServices, brandImages as baseBrandImages } from "./data";
import type { Service, Product } from "./data";

export interface AdminStore {
  products: Record<string, Product[]>;
  brandImages: Record<string, string>;
  settings?: Record<string, string>;
  deletedProducts?: Record<string, string[]>;
}

const ADMIN_STORE_KEY = "mmc_admin_store_v2";

// ── Local storage fallback ──
export function getLocalStore(): AdminStore {
  if (typeof window === "undefined") return { products: {}, brandImages: {}, settings: {}, deletedProducts: {} };
  try {
    const raw = localStorage.getItem(ADMIN_STORE_KEY);
    if (!raw) return { products: {}, brandImages: {}, settings: {}, deletedProducts: {} };
    const parsed = JSON.parse(raw) as AdminStore;
    if (!parsed.deletedProducts) parsed.deletedProducts = {};
    return parsed;
  } catch {
    return { products: {}, brandImages: {}, settings: {}, deletedProducts: {} };
  }
}

function setLocalStore(store: AdminStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ADMIN_STORE_KEY, JSON.stringify(store));
}

// ── Fetch from Supabase, fallback to localStorage ──
export async function fetchAdminStore(): Promise<AdminStore> {
  // Always load local first for instant render
  const local = getLocalStore();

  try {
    const fetchProducts = async () => {
      try { const { data } = await supabase.from("admin_products").select("*"); return data; } catch { return null; }
    };
    const fetchBrands = async () => {
      try { const { data } = await supabase.from("admin_brands").select("*"); return data; } catch { return null; }
    };
    const fetchSettings = async () => {
      try { const { data } = await supabase.from("admin_settings").select("*"); return data; } catch { return null; }
    };

    const [dbProducts, dbBrands, dbSettings] = await Promise.all([fetchProducts(), fetchBrands(), fetchSettings()]);

    if (!dbProducts && !dbBrands && !dbSettings) return local;

    const store: AdminStore = { products: {}, brandImages: {}, settings: {}, deletedProducts: {} };

    dbProducts?.forEach((p: any) => {
      const slug = p.service_slug;
      if (!store.products[slug]) store.products[slug] = [];
      store.products[slug].push({
        name: p.name ?? "",
        brand: p.brand ?? "",
        price: p.price ?? null,
        description: p.description ?? "",
        techSpecs: Array.isArray(p.tech_specs) ? p.tech_specs : [],
        image: p.image ?? "",
        categoryId: slug,
      });
    });

    dbBrands?.forEach((b: any) => {
      store.brandImages[b.name] = b.logo_url ?? "";
    });

    dbSettings?.forEach((s: any) => {
      if (!store.settings) store.settings = {};
      if (s.key === "deleted_products") {
        try {
          store.deletedProducts = JSON.parse(s.value ?? "{}");
        } catch {
          store.deletedProducts = {};
        }
      } else {
        store.settings[s.key] = s.value ?? "";
      }
    });

    // Sync to localStorage as backup
    setLocalStore(store);

    return store;
  } catch (err) {
    // Supabase not configured — return localStorage data
    return local;
  }
}

// ── Save general settings ──
export async function saveSetting(key: string, value: string): Promise<boolean> {
  const local = getLocalStore();
  const next: AdminStore = {
    ...local,
    settings: {
      ...(local.settings ?? {}),
      [key]: value,
    },
  };
  setLocalStore(next);

  try {
    await supabase.from("admin_settings").upsert({ key, value }, { onConflict: "key" });
    return true;
  } catch {
    return false;
  }
}

// ── Save product: try Supabase first, localStorage always ──
export async function saveProduct(serviceSlug: string, product: Product): Promise<boolean> {
  // Always save to localStorage
  const local = getLocalStore();
  const next: AdminStore = {
    ...local,
    products: { ...local.products },
  };
  next.products[serviceSlug] = [...(next.products[serviceSlug] ?? [])];
  const idx = next.products[serviceSlug].findIndex((p) => p.name === product.name);
  if (idx >= 0) {
    next.products[serviceSlug][idx] = product;
  } else {
    next.products[serviceSlug].push(product);
  }
  setLocalStore(next);

  // Try Supabase
  try {
    await supabase.from("admin_products").upsert(
      {
        name: product.name,
        brand: product.brand,
        price: product.price,
        description: product.description,
        tech_specs: product.techSpecs,
        image: product.image,
        service_slug: serviceSlug,
      },
      { onConflict: "name,service_slug" }
    );
    return true;
  } catch {
    return false;
  }
}

// ── Delete product ──
export async function deleteProduct(serviceSlug: string, name: string): Promise<void> {
  const local = getLocalStore();
  const next: AdminStore = {
    ...local,
    products: { ...local.products },
    deletedProducts: { ...(local.deletedProducts ?? {}) },
  };
  // Remove from admin products
  next.products[serviceSlug] = (next.products[serviceSlug] ?? []).filter((p) => p.name !== name);

  // Check if it's a base product — if so, mark as deleted
  const isBaseProduct = baseServices.some(
    (s) => s.slug === serviceSlug && s.products.some((p) => p.name === name)
  );
  if (isBaseProduct) {
    if (!next.deletedProducts![serviceSlug]) next.deletedProducts![serviceSlug] = [];
    if (!next.deletedProducts![serviceSlug].includes(name)) {
      next.deletedProducts![serviceSlug] = [...next.deletedProducts![serviceSlug], name];
    }
  }

  setLocalStore(next);

  try {
    await supabase.from("admin_products").delete().eq("name", name).eq("service_slug", serviceSlug);
    if (isBaseProduct) {
      await supabase.from("admin_settings").upsert(
        { key: "deleted_products", value: JSON.stringify(next.deletedProducts) },
        { onConflict: "key" }
      );
    }
  } catch {
    // Ignore
  }
}

// ── Save brand ──
export async function saveBrand(name: string, logoUrl: string): Promise<void> {
  const local = getLocalStore();
  const next: AdminStore = {
    ...local,
    brandImages: { ...local.brandImages, [name]: logoUrl },
  };
  setLocalStore(next);

  try {
    await supabase.from("admin_brands").upsert({ name, logo_url: logoUrl }, { onConflict: "name" });
  } catch {
    // Ignore
  }
}

// ── Delete brand ──
export async function deleteBrand(name: string): Promise<void> {
  const local = getLocalStore();
  const next = { ...local, brandImages: { ...local.brandImages } };
  delete next.brandImages[name];
  setLocalStore(next);

  try {
    await supabase.from("admin_brands").delete().eq("name", name);
  } catch {
    // Ignore
  }
}

// ── Upload image: Supabase Storage → base64 fallback ──
export async function uploadImage(file: File): Promise<string> {
  // Try Supabase Storage first
  try {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;

    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filename, file, { contentType: file.type, upsert: true });

    if (!error && data) {
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(data.path);
      return urlData.publicUrl;
    }
  } catch {
    // Fall through to base64 fallback
  }

  // Base64 fallback — works everywhere, no server needed
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Afbeelding kon niet worden gelezen"));
    reader.readAsDataURL(file);
  });
}

// ── Merge helpers: admin OVERRIDES base by name ──
export function mergeServices(adminStore: AdminStore): Service[] {
  return baseServices.map((service) => {
    // Only return products from the admin store (database)
    const adminProducts = adminStore.products[service.slug] ?? [];
    return { ...service, products: adminProducts };
  });
}

export function mergeBrandImages(adminStore: AdminStore): Record<string, string> {
  return { ...baseBrandImages, ...adminStore.brandImages };
}

export function getAdminPassword(): string {
  return process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "mmc-admin-2024";
}

export function getAllBrands(adminStore: AdminStore): string[] {
  const set = new Set<string>();
  baseServices.forEach((s) => s.products.forEach((p) => set.add(p.brand)));
  Object.keys(adminStore.brandImages).forEach((b) => set.add(b));
  Object.values(adminStore.products).forEach((list) => list.forEach((p) => set.add(p.brand)));
  return Array.from(set).sort();
}
