import { supabase } from "./supabase";
import { services as baseServices, brandImages as baseBrandImages, type Service, type Product } from "./data";

export interface AdminStore {
  products: Record<string, Product[]>;
  brandImages: Record<string, string>;
}

// ── Fetch from Supabase ──
export async function fetchAdminStore(): Promise<AdminStore> {
  const [{ data: dbProducts }, { data: dbBrands }] = await Promise.all([
    supabase.from("admin_products").select("*"),
    supabase.from("admin_brands").select("*"),
  ]);

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
      image: p.image ?? "", // NEVER null
      categoryId: slug,
    });
  });

  dbBrands?.forEach((b: any) => {
    store.brandImages[b.name] = b.logo_url ?? "";
  });

  return store;
}

// ── Save product to Supabase ──
export async function saveProduct(serviceSlug: string, product: Product): Promise<void> {
  const { error } = await supabase.from("admin_products").upsert(
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
  if (error) throw error;
}

// ── Delete product from Supabase ──
export async function deleteProduct(serviceSlug: string, name: string): Promise<void> {
  const { error } = await supabase
    .from("admin_products")
    .delete()
    .eq("name", name)
    .eq("service_slug", serviceSlug);
  if (error) throw error;
}

// ── Save brand to Supabase ──
export async function saveBrand(name: string, logoUrl: string): Promise<void> {
  const { error } = await supabase
    .from("admin_brands")
    .upsert({ name, logo_url: logoUrl }, { onConflict: "name" });
  if (error) throw error;
}

// ── Delete brand from Supabase ──
export async function deleteBrand(name: string): Promise<void> {
  const { error } = await supabase.from("admin_brands").delete().eq("name", name);
  if (error) throw error;
}

// ── Upload image to Supabase Storage ──
export async function uploadImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
  const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 10)}.${ext}`;

  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(filename, file, { contentType: file.type });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

// ── Merge helpers: admin products OVERRIDE base products by name ──
export function mergeServices(adminStore: AdminStore): Service[] {
  return baseServices.map((service) => {
    const adminList = adminStore.products[service.slug] ?? [];
    if (adminList.length === 0) return service;

    // Map admin overrides by name
    const adminMap = new Map(adminList.map((p) => [p.name, p]));

    // Override base products
    const mergedProducts = service.products.map((baseP) =>
      adminMap.get(baseP.name) ?? baseP
    );

    // Append admin-only products (not in base)
    const baseNames = new Set(service.products.map((p) => p.name));
    const adminOnly = adminList.filter((p) => !baseNames.has(p.name));

    return {
      ...service,
      products: [...mergedProducts, ...adminOnly],
    };
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
