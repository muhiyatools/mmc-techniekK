import { supabase } from "./supabase";
import { services as baseServices, brandImages as baseBrandImages } from "./data";
import type { Service, Product } from "./data";

export interface AdminStore {
  products: Record<string, Product[]>;
  brandImages: Record<string, string>;
}

const ADMIN_STORE_KEY = "mmc_admin_store_v2";

// ── Local storage fallback ──
function getLocalStore(): AdminStore {
  if (typeof window === "undefined") return { products: {}, brandImages: {} };
  try {
    const raw = localStorage.getItem(ADMIN_STORE_KEY);
    if (!raw) return { products: {}, brandImages: {} };
    return JSON.parse(raw) as AdminStore;
  } catch {
    return { products: {}, brandImages: {} };
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
    const [{ data: dbProducts }, { data: dbBrands }] = await Promise.all([
      supabase.from("admin_products").select("*"),
      supabase.from("admin_brands").select("*"),
    ]);

    if (!dbProducts && !dbBrands) return local;

    const store: AdminStore = { products: {}, brandImages: {} };

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

    // Sync to localStorage as backup
    setLocalStore(store);

    return store;
  } catch (err) {
    // Supabase not configured — return localStorage data
    return local;
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
  };
  next.products[serviceSlug] = (next.products[serviceSlug] ?? []).filter((p) => p.name !== name);
  setLocalStore(next);

  try {
    await supabase.from("admin_products").delete().eq("name", name).eq("service_slug", serviceSlug);
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
    const adminList = adminStore.products[service.slug] ?? [];
    if (adminList.length === 0) return service;

    const adminMap = new Map(adminList.map((p) => [p.name, p]));
    const mergedProducts = service.products.map((baseP) => adminMap.get(baseP.name) ?? baseP);

    const baseNames = new Set(service.products.map((p) => p.name));
    const adminOnly = adminList.filter((p) => !baseNames.has(p.name));

    return { ...service, products: [...mergedProducts, ...adminOnly] };
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
