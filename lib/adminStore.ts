import { services as baseServices, brandImages as baseBrandImages, type Service, type Product } from "./data";

export interface AdminStore {
  products: Record<string, Product[]>; // key = service slug
  brandImages: Record<string, string>;
}

const LOCAL_STORAGE_KEY = "mmc_admin_store";

export function getLocalAdminStore(): AdminStore {
  if (typeof window === "undefined") return { products: {}, brandImages: {} };
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return { products: {}, brandImages: {} };
    return JSON.parse(raw) as AdminStore;
  } catch {
    return { products: {}, brandImages: {} };
  }
}

export function setLocalAdminStore(store: AdminStore) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(store));
}

export async function fetchAdminStore(): Promise<AdminStore> {
  try {
    const res = await fetch("/api/admin/store/", { cache: "no-store" });
    if (!res.ok) throw new Error("API failed");
    return (await res.json()) as AdminStore;
  } catch {
    return getLocalAdminStore();
  }
}

export async function saveAdminStore(store: AdminStore): Promise<boolean> {
  setLocalAdminStore(store);
  try {
    const res = await fetch("/api/admin/store/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(store),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export function mergeServices(adminStore: AdminStore): Service[] {
  return baseServices.map((service) => {
    const adminProducts = adminStore.products[service.slug];
    if (!adminProducts || adminProducts.length === 0) return service;
    return {
      ...service,
      products: [...service.products, ...adminProducts],
    };
  });
}

export function mergeBrandImages(adminStore: AdminStore): Record<string, string> {
  return { ...baseBrandImages, ...adminStore.brandImages };
}

export function getAdminPassword(): string {
  return process.env.NEXT_PUBLIC_ADMIN_PASSWORD ?? "mmc-admin-2024";
}
