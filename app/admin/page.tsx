"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getAdminPassword,
  fetchAdminStore,
  saveProduct,
  deleteProduct,
  saveBrand,
  deleteBrand,
  uploadImage,
  mergeServices,
  mergeBrandImages,
  getAllBrands,
  type AdminStore,
} from "@/lib/adminStore";
import { services as baseServices, type Product } from "@/lib/data";

// ── Toast ──
function useToast() {
  const [toasts, setToasts] = useState<{ id: number; message: string; type: "success" | "error" }[]>([]);
  const idRef = useMemo(() => ({ current: 0 }), []);
  const show = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, [idRef]);
  return { toasts, show };
}

function ToastContainer({ toasts }: { toasts: ReturnType<typeof useToast>["toasts"] }) {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-xl text-sm font-semibold shadow-lg border animate-[fadeIn_0.2s_ease-out] ${
            t.type === "success" ? "bg-brand text-white border-brand/30" : "bg-red-500 text-white border-red-400/30"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ── Image upload (Supabase Storage) ──
function useImageUpload() {
  const [uploading, setUploading] = useState(false);
  const upload = useCallback(async (file: File): Promise<string> => {
    setUploading(true);
    try {
      const url = await uploadImage(file);
      return url;
    } finally {
      setUploading(false);
    }
  }, []);
  return { upload, uploading };
}

function ImageUpload({ value, onChange, label }: { value: string | null | undefined; onChange: (url: string) => void; label: string }) {
  const { upload, uploading } = useImageUpload();
  const safeValue = value ?? "";
  return (
    <div>
      <label className="block text-label text-muted mb-2">{label}</label>
      <div className="flex items-start gap-3">
        <input
          type="text" value={safeValue} onChange={(e) => onChange(e.target.value)}
          placeholder="URL of upload"
          className="flex-1 min-w-0 px-3 py-2.5 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
        />
        <label className="shrink-0 px-4 py-2.5 border border-hairline text-xs font-bold uppercase tracking-wide rounded-xl cursor-pointer hover:border-brand hover:text-brand transition-colors bg-white disabled:opacity-50">
          {uploading ? "..." : "Upload"}
          <input
            type="file" accept="image/*" className="hidden"
            onChange={async (e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try { const url = await upload(f); onChange(url); } catch { alert("Upload mislukt"); }
              const target = e.currentTarget;
              if (target) target.value = "";
            }}
          />
        </label>
      </div>
      {safeValue && (
        <div className="mt-3 relative w-24 h-16 rounded-lg overflow-hidden border border-hairline bg-white">
          <img src={safeValue} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}

// ── Login ──
function LoginScreen({ onLogin }: { onLogin: (pw: string) => void }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white border border-hairline rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-2.5 mb-6">
          <span className="w-2 h-2 rounded-full bg-brand" />
          <span className="text-label text-muted">MMC Admin</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl text-ink mb-2 leading-tight">Inloggen</h1>
        <p className="text-sm text-muted mb-6">Voer het admin wachtwoord in.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError(false);
            if (pw === getAdminPassword()) { onLogin(pw); } else { setError(true); }
          }}
        >
          <input
            type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Wachtwoord"
            className={`w-full px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all mb-4 ${error ? "border-red-400" : "border-hairline"}`}
          />
          {error && <p className="text-xs text-red-500 mb-3 font-semibold">Onjuist wachtwoord</p>}
          <button type="submit" className="w-full px-4 py-3 bg-brand text-white text-sm font-bold rounded-full hover:bg-brand-deep transition-colors uppercase tracking-wide">Inloggen</button>
        </form>
      </div>
    </div>
  );
}

// ── Types ──
interface MergedProduct {
  product: Product;
  serviceSlug: string;
  source: "base" | "admin";
}

function serviceTitle(slug: string) {
  return baseServices.find((s) => s.slug === slug)?.title ?? slug;
}

// ── Stats ──
function StatsBar({ store }: { store: AdminStore }) {
  const totalProducts = useMemo(() => {
    let count = 0;
    baseServices.forEach((s) => (count += s.products.length));
    Object.values(store.products).forEach((list) => (count += list.length));
    return count;
  }, [store]);
  const totalBrands = useMemo(() => getAllBrands(store).length, [store]);
  const adminProducts = useMemo(() => Object.values(store.products).reduce((s, l) => s + l.length, 0), [store]);

  const stats = [
    { label: "Producten", value: totalProducts, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
    { label: "Merken", value: totalBrands, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 6h.008v.008H6V6z" /></svg> },
    { label: "Admin toevoegingen", value: adminProducts, icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.5v15m7.5-7.5h-15" /></svg> },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      {stats.map((s) => (
        <div key={s.label} className="bg-white border border-hairline rounded-2xl p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-brand">{s.icon}</div>
          <div>
            <p className="text-2xl font-extrabold text-ink tabular-nums leading-none">{s.value}</p>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-muted mt-1">{s.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Drawer ──
function Drawer({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 bg-ink/60" onClick={onClose} aria-label="Sluit" />
      <div className="relative ml-auto w-full max-w-lg bg-white h-full overflow-y-auto shadow-2xl flex flex-col">
        <div className="sticky top-0 bg-white border-b border-hairline px-6 py-4 flex items-center justify-between shrink-0 z-10">
          <h2 className="font-display font-bold text-lg text-ink">{title}</h2>
          <button onClick={onClose} className="text-muted hover:text-ink transition-colors p-1 rounded-lg hover:bg-concrete">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="p-6 flex-1">{children}</div>
      </div>
    </div>
  );
}

// ── Product Edit Form ──
function ProductEditForm({
  item,
  onSave,
  onDelete,
  onClose,
  toast,
}: {
  item: MergedProduct;
  onSave: (item: MergedProduct, updates: Product) => Promise<void>;
  onDelete: (item: MergedProduct) => Promise<void>;
  onClose: () => void;
  toast: ReturnType<typeof useToast>["show"];
}) {
  const { product, serviceSlug } = item;
  const [form, setForm] = useState<Product>({ ...product, image: product.image ?? "" });
  const [specInput, setSpecInput] = useState("");
  const [saving, setSaving] = useState(false);

  const update = <K extends keyof Product>(key: K, value: Product[K]) => setForm((p) => ({ ...p, [key]: value }));

  const handleSave = async () => {
    if (!form.name.trim() || !form.brand.trim()) { toast("Naam en merk zijn verplicht", "error"); return; }
    setSaving(true);
    try {
      await onSave(item, form);
      toast("Product opgeslagen", "success");
      onClose();
    } catch (e) {
      toast("Opslaan mislukt: " + String(e), "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`"${product.name}" verwijderen?`)) return;
    try {
      await onDelete(item);
      toast("Product verwijderd", "success");
      onClose();
    } catch (e) {
      toast("Verwijderen mislukt: " + String(e), "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-label text-muted mb-2">Productnaam *</label>
          <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} className="w-full px-3 py-2.5 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all" />
        </div>
        <div>
          <label className="block text-label text-muted mb-2">Merk *</label>
          <input type="text" value={form.brand} onChange={(e) => update("brand", e.target.value)} className="w-full px-3 py-2.5 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-label text-muted mb-2">Prijs</label>
          <input type="text" value={form.price ?? ""} onChange={(e) => update("price", e.target.value || null)} placeholder="€2.800 - €5.000" className="w-full px-3 py-2.5 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all" />
        </div>
        <div>
          <label className="block text-label text-muted mb-2">Dienst</label>
          <select value={form.categoryId} onChange={(e) => update("categoryId", e.target.value)} className="w-full px-3 py-2.5 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all">
            {baseServices.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
          </select>
        </div>
      </div>

      <ImageUpload label="Productafbeelding" value={form.image} onChange={(url) => update("image", url)} />

      <div>
        <label className="block text-label text-muted mb-2">Beschrijving</label>
        <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} className="w-full px-3 py-2.5 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all resize-none" />
      </div>

      <div>
        <label className="block text-label text-muted mb-2">Specificaties</label>
        <div className="flex gap-2 mb-3">
          <input type="text" value={specInput} onChange={(e) => setSpecInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (specInput.trim()) { update("techSpecs", [...form.techSpecs, specInput.trim()]); setSpecInput(""); } } }} placeholder="Spec toevoegen..." className="flex-1 px-3 py-2.5 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all" />
          <button onClick={() => { if (specInput.trim()) { update("techSpecs", [...form.techSpecs, specInput.trim()]); setSpecInput(""); } }} className="px-4 py-2.5 bg-concrete text-ink text-xs font-bold rounded-xl border border-hairline hover:border-brand hover:text-brand transition-colors">+</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.techSpecs.map((spec, i) => (
            <span key={`spec-${i}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-concrete border border-hairline rounded-full text-xs font-semibold text-ink">
              {spec}
              <button onClick={() => update("techSpecs", form.techSpecs.filter((_, idx) => idx !== i))} className="text-muted hover:text-red-500 transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 pt-4 border-t border-hairline">
        <button onClick={handleDelete} className="px-4 py-2.5 text-xs font-bold uppercase tracking-wide text-red-500 border border-red-200 rounded-full hover:bg-red-50 transition-colors">Verwijderen</button>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="px-5 py-2.5 text-xs font-bold uppercase tracking-wide text-muted border border-hairline rounded-full hover:border-brand hover:text-brand transition-colors bg-white">Annuleren</button>
          <button onClick={handleSave} disabled={saving} className="px-6 py-2.5 bg-brand text-white text-xs font-bold uppercase tracking-wide rounded-full hover:bg-brand-deep transition-colors disabled:opacity-50">{saving ? "Opslaan..." : "Opslaan"}</button>
        </div>
      </div>
    </div>
  );
}

// ── Products Tab ──
function ProductsTab({ store, setStore, toast }: { store: AdminStore; setStore: (s: AdminStore) => void; toast: ReturnType<typeof useToast>["show"] }) {
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [editItem, setEditItem] = useState<MergedProduct | null>(null);

  const products = useMemo(() => {
    const list: MergedProduct[] = [];
    baseServices.forEach((s) => {
      const adminList = store.products[s.slug] ?? [];
      s.products.forEach((baseP) => {
        const override = adminList.find((a) => a.name === baseP.name);
        list.push({ product: override ?? baseP, serviceSlug: s.slug, source: override ? "admin" : "base" });
      });
      adminList.forEach((a) => {
        if (!s.products.find((b) => b.name === a.name)) {
          list.push({ product: a, serviceSlug: s.slug, source: "admin" });
        }
      });
    });
    return list;
  }, [store]);

  const filtered = useMemo(() => {
    return products.filter((item) => {
      if (serviceFilter !== "all" && item.serviceSlug !== serviceFilter) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return item.product.name.toLowerCase().includes(q) || item.product.brand.toLowerCase().includes(q);
    });
  }, [products, serviceFilter, search]);

  const handleSave = async (item: MergedProduct, updates: Product) => {
    // Save to Supabase
    await saveProduct(updates.categoryId, updates);

    // Update local state
    const next: AdminStore = { ...store, products: { ...store.products } };
    const slug = updates.categoryId;
    next.products[slug] = [...(next.products[slug] ?? [])];
    const idx = next.products[slug].findIndex((p) => p.name === item.product.name);
    if (idx >= 0) {
      next.products[slug][idx] = updates;
    } else {
      next.products[slug].push(updates);
    }
    // Remove from old slug if moved
    if (slug !== item.serviceSlug) {
      next.products[item.serviceSlug] = (next.products[item.serviceSlug] ?? []).filter((p) => p.name !== item.product.name);
    }
    setStore(next);
  };

  const handleDelete = async (item: MergedProduct) => {
    await deleteProduct(item.serviceSlug, item.product.name);
    const next: AdminStore = { ...store, products: { ...store.products } };
    next.products[item.serviceSlug] = (next.products[item.serviceSlug] ?? []).filter((p) => p.name !== item.product.name);
    setStore(next);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Zoek product of merk..." className="w-full pl-10 pr-4 py-2.5 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all" />
        </div>
        <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="px-4 py-2.5 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all">
          <option value="all">Alle diensten</option>
          {baseServices.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
        </select>
      </div>

      <div className="bg-white border border-hairline rounded-2xl overflow-hidden">
        {/* Mobile card list */}
        <div className="md:hidden divide-y divide-hairline">
          {filtered.map((item, idx) => (
            <div key={`mob-${item.source}-${item.serviceSlug}-${item.product.name}-${idx}`} className="flex items-center gap-3 px-4 py-3.5">
              <div className="w-12 h-12 rounded-lg overflow-hidden border border-hairline bg-white shrink-0">
                <img src={item.product.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{item.product.name}</p>
                <p className="text-xs text-muted truncate">{item.product.brand} · {serviceTitle(item.serviceSlug)}</p>
                <p className="text-xs font-semibold text-brand mt-0.5">{item.product.price ?? "Op aanvraag"}</p>
              </div>
              <button
                onClick={() => setEditItem(item)}
                className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full border border-brand/20 text-brand hover:bg-brand/10 transition-colors"
                aria-label="Bewerk"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="px-4 py-12 text-center text-sm text-muted">Geen producten gevonden.</div>
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-hairline bg-concrete/40">
                <th className="px-5 py-3 text-label text-muted">Product</th>
                <th className="px-5 py-3 text-label text-muted">Merk</th>
                <th className="px-5 py-3 text-label text-muted">Dienst</th>
                <th className="px-5 py-3 text-label text-muted">Prijs</th>
                <th className="px-5 py-3 text-label text-muted text-right">Acties</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {filtered.map((item, idx) => (
                <tr key={`${item.source}-${item.serviceSlug}-${item.product.name}-${idx}`} className="hover:bg-concrete/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden border border-hairline bg-white shrink-0">
                        <img src={item.product.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <span className="text-sm font-semibold text-ink">{item.product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-copy">{item.product.brand}</td>
                  <td className="px-5 py-3.5 text-sm text-copy">{serviceTitle(item.serviceSlug)}</td>
                  <td className="px-5 py-3.5 text-sm text-copy">{item.product.price ?? "Op aanvraag"}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button onClick={() => setEditItem(item)} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-brand border border-brand/20 rounded-full hover:bg-brand/10 transition-colors">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" /></svg>
                      Bewerk
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-12 text-center text-sm text-muted">Geen producten gevonden.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Drawer open={!!editItem} onClose={() => setEditItem(null)} title={editItem ? "Product bewerken" : ""}>
        {editItem && (
          <ProductEditForm
            item={editItem}
            onSave={handleSave}
            onDelete={handleDelete}
            onClose={() => setEditItem(null)}
            toast={toast}
          />
        )}
      </Drawer>
    </div>
  );
}

// ── Brands Tab ──
function BrandsTab({ store, setStore, toast }: { store: AdminStore; setStore: (s: AdminStore) => void; toast: ReturnType<typeof useToast>["show"] }) {
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState("");
  const [loading, setLoading] = useState(false);

  const allBrands = Object.entries(store.brandImages);

  const addBrand = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      await saveBrand(newName.trim(), newImage.trim());
      const next: AdminStore = { ...store, brandImages: { ...store.brandImages, [newName.trim()]: newImage.trim() } };
      setStore(next);
      setNewName("");
      setNewImage("");
      toast("Merk toegevoegd", "success");
    } catch (e) {
      toast("Merk toevoegen mislukt: " + String(e), "error");
    } finally {
      setLoading(false);
    }
  };

  const removeBrand = async (name: string) => {
    if (!confirm(`Merk "${name}" verwijderen?`)) return;
    try {
      await deleteBrand(name);
      const next = { ...store, brandImages: { ...store.brandImages } };
      delete next.brandImages[name];
      setStore(next);
      toast("Merk verwijderd", "success");
    } catch (e) {
      toast("Verwijderen mislukt: " + String(e), "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-hairline rounded-2xl p-5 lg:p-6">
        <h3 className="text-sm font-bold text-ink mb-4">Merk toevoegen</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
          <div className="lg:col-span-1">
            <label className="block text-label text-muted mb-2">Merknaam</label>
            <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="bijv. Samsung" className="w-full px-3 py-2.5 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all" />
          </div>
          <div className="lg:col-span-2">
            <ImageUpload label="Logo afbeelding" value={newImage} onChange={setNewImage} />
          </div>
        </div>
        <button onClick={addBrand} disabled={!newName.trim() || loading} className="px-5 py-2.5 bg-brand text-white text-xs font-bold rounded-full hover:bg-brand-deep transition-colors disabled:opacity-40 uppercase tracking-wide">
          {loading ? "..." : "Merk opslaan"}
        </button>
      </div>

      {allBrands.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-ink">Bestaande merken</h3>
            <span className="text-xs text-muted">{allBrands.length} merken</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {allBrands.map(([name, url]) => (
              <div key={`brand-${name}`} className="bg-white border border-hairline rounded-2xl p-4 flex flex-col items-center text-center relative group">
                <button onClick={() => removeBrand(name)} className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-red-50 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100" title="Verwijder">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="w-16 h-12 mb-3 flex items-center justify-center">
                  {url ? <img src={url} alt={name} className="max-w-full max-h-full object-contain" /> : <span className="text-xs font-bold text-muted uppercase">{name.slice(0, 3)}</span>}
                </div>
                <p className="text-xs font-semibold text-ink truncate w-full">{name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Add Product Tab ──
function AddProductTab({ store, setStore, toast }: { store: AdminStore; setStore: (s: AdminStore) => void; toast: ReturnType<typeof useToast>["show"] }) {
  const [serviceSlug, setServiceSlug] = useState(baseServices[0].slug);
  const [form, setForm] = useState<Omit<Product, "categoryId">>({ name: "", brand: "", price: null, description: "", techSpecs: [], image: "" });
  const [specInput, setSpecInput] = useState("");
  const [newBrandMode, setNewBrandMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const existingBrands = useMemo(() => getAllBrands(store), [store]);
  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((p) => ({ ...p, [key]: value }));

  const submit = async () => {
    if (!form.name.trim() || !form.brand.trim()) { toast("Naam en merk zijn verplicht", "error"); return; }
    const product: Product = { ...form, categoryId: serviceSlug, price: form.price?.trim() ? form.price.trim() : null };
    setSaving(true);
    try {
      await saveProduct(serviceSlug, product);
      const next: AdminStore = { ...store, products: { ...store.products, [serviceSlug]: [...(store.products[serviceSlug] ?? []), product] } };
      setStore(next);
      toast("Product toegevoegd", "success");
      setForm({ name: "", brand: "", price: null, description: "", techSpecs: [], image: "" });
      setNewBrandMode(false);
    } catch (e) {
      toast("Toevoegen mislukt: " + String(e), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white border border-hairline rounded-2xl p-5 lg:p-6 space-y-6">
      <h3 className="text-sm font-bold text-ink">Nieuw product toevoegen</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-5">
          <div>
            <label className="block text-label text-muted mb-2">Dienst *</label>
            <select value={serviceSlug} onChange={(e) => setServiceSlug(e.target.value)} className="w-full px-3 py-2.5 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all">
              {baseServices.map((s) => <option key={s.slug} value={s.slug}>{s.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-label text-muted mb-2">Productnaam *</label>
            <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="bijv. LG Artcool Gallery" className="w-full px-3 py-2.5 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all" />
          </div>
          <div>
            <label className="block text-label text-muted mb-2">Merk *</label>
            {newBrandMode ? (
              <div className="flex items-center gap-2">
                <input type="text" value={form.brand} onChange={(e) => update("brand", e.target.value)} placeholder="Nieuw merk..." autoFocus className="flex-1 px-3 py-2.5 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all" />
                <button onClick={() => setNewBrandMode(false)} className="text-xs font-bold text-muted hover:text-ink px-2 py-1">Annuleren</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <select value={form.brand} onChange={(e) => update("brand", e.target.value)} className="flex-1 px-3 py-2.5 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all">
                  <option value="">Kies merk...</option>
                  {existingBrands.map((b) => <option key={`brand-opt-${b}`} value={b}>{b}</option>)}
                </select>
                <button onClick={() => { setNewBrandMode(true); update("brand", ""); }} className="shrink-0 px-3 py-2.5 text-xs font-bold uppercase tracking-wide border border-hairline rounded-xl hover:border-brand hover:text-brand transition-colors bg-white">+ Nieuw</button>
              </div>
            )}
          </div>
          <div>
            <label className="block text-label text-muted mb-2">Prijs</label>
            <input type="text" value={form.price ?? ""} onChange={(e) => update("price", e.target.value || null)} placeholder="€2.800 - €5.000" className="w-full px-3 py-2.5 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all" />
          </div>
        </div>
        <div className="space-y-5">
          <ImageUpload label="Productafbeelding" value={form.image} onChange={(url) => update("image", url)} />
          <div>
            <label className="block text-label text-muted mb-2">Beschrijving</label>
            <textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} placeholder="Korte productbeschrijving..." className="w-full px-3 py-2.5 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all resize-none" />
          </div>
        </div>
      </div>

      <div className="border-t border-hairline pt-5">
        <label className="block text-label text-muted mb-2">Specificaties</label>
        <div className="flex gap-2 mb-3">
          <input type="text" value={specInput} onChange={(e) => setSpecInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); if (specInput.trim()) { update("techSpecs", [...form.techSpecs, specInput.trim()]); setSpecInput(""); } } }} placeholder="Voeg specificatie toe..." className="flex-1 px-3 py-2.5 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all" />
          <button onClick={() => { if (specInput.trim()) { update("techSpecs", [...form.techSpecs, specInput.trim()]); setSpecInput(""); } }} className="px-4 py-2.5 bg-concrete text-ink text-xs font-bold rounded-xl border border-hairline hover:border-brand hover:text-brand transition-colors">+</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.techSpecs.map((spec, i) => (
            <span key={`add-spec-${i}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-concrete border border-hairline rounded-full text-xs font-semibold text-ink">
              {spec}
              <button onClick={() => update("techSpecs", form.techSpecs.filter((_, idx) => idx !== i))} className="text-muted hover:text-red-500 transition-colors">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <button onClick={submit} disabled={saving} className="px-6 py-3 bg-brand text-white text-sm font-bold rounded-full hover:bg-brand-deep transition-colors uppercase tracking-wide disabled:opacity-50">
          {saving ? "Opslaan..." : "Product opslaan"}
        </button>
      </div>
    </div>
  );
}

// ── Main ──
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [store, setStoreState] = useState<AdminStore>({ products: {}, brandImages: {} });
  const [activeTab, setActiveTab] = useState<"products" | "brands" | "add">("products");
  const [loading, setLoading] = useState(true);
  const { toasts, show } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("mmc_admin_authed") === "1") setAuthed(true);
    fetchAdminStore()
      .then(setStoreState)
      .catch(() => show("Kon admin data niet laden", "error"))
      .finally(() => setLoading(false));
  }, [show]);

  const setStore = useCallback((next: AdminStore) => setStoreState(next), []);

  const handleLogin = (pw: string) => {
    if (pw === getAdminPassword()) {
      sessionStorage.setItem("mmc_admin_authed", "1");
      setAuthed(true);
    }
  };

  if (!authed) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-bg">
      <ToastContainer toasts={toasts} />

      <div className="bg-white border-b border-hairline sticky top-0 z-40">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              <span className="text-label text-muted">MMC Admin Dashboard</span>
            </div>
            <button onClick={() => { sessionStorage.removeItem("mmc_admin_authed"); setAuthed(false); }} className="text-xs font-bold text-muted hover:text-ink transition-colors px-3 py-1.5 rounded-lg hover:bg-concrete">Uitloggen</button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-hairline">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="flex gap-1 -mb-px overflow-x-auto scrollbar-hide">
            {[
              { key: "products" as const, label: "Producten", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
              { key: "brands" as const, label: "Merken", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M6 6h.008v.008H6V6z" /></svg> },
              { key: "add" as const, label: "Toevoegen", icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 4.5v15m7.5-7.5h-15" /></svg> },
            ].map((t) => (
              <button key={t.key} onClick={() => setActiveTab(t.key)} className={`flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors whitespace-nowrap ${activeTab === t.key ? "text-brand border-brand" : "text-muted border-transparent hover:text-ink"}`}>
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8 lg:py-10">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted">Laden...</p>
          </div>
        ) : (
          <>
            <StatsBar store={store} />
            {activeTab === "products" && <ProductsTab store={store} setStore={setStore} toast={show} />}
            {activeTab === "brands" && <BrandsTab store={store} setStore={setStore} toast={show} />}
            {activeTab === "add" && <AddProductTab store={store} setStore={setStore} toast={show} />}
          </>
        )}
      </div>
    </div>
  );
}
