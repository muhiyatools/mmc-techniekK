"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  getAdminPassword,
  fetchAdminStore,
  saveAdminStore,
  type AdminStore,
} from "@/lib/adminStore";
import { services as baseServices, type Product, type PriceTier, priceTierLabels } from "@/lib/data";

// ── Toast system ──
interface Toast {
  id: number;
  message: string;
  type: "success" | "error";
}

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idRef = useRef(0);

  const show = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = ++idRef.current;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  return { toasts, show };
}

function ToastContainer({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-xl text-sm font-semibold shadow-lg border transition-all animate-[scaleIn_0.2s_ease-out] ${
            t.type === "success"
              ? "bg-brand text-white border-brand/30"
              : "bg-red-500 text-white border-red-400/30"
          }`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ── Image upload helper ──
function ImageField({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (url: string) => void;
  label: string;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload/", { method: "POST", body: formData });
      const data = await res.json();
      if (data.success && data.url) {
        onChange(data.url);
      } else {
        throw new Error(data.error || "Upload mislukt");
      }
    } catch (e) {
      alert("Upload mislukt: " + String(e));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-[0.15em] text-muted mb-1.5">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="flex-1 px-3 py-2 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
        />
        <label className="shrink-0 px-3 py-2 border border-hairline text-xs font-bold uppercase tracking-wide rounded-xl cursor-pointer hover:border-brand hover:text-brand transition-colors bg-white">
          {uploading ? "..." : "Upload"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </label>
      </div>
      {value && (
        <div className="mt-2 relative w-20 h-14 rounded-lg overflow-hidden border border-hairline">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
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
    <div className="min-h-screen bg-base flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white border border-hairline rounded-2xl p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <span className="w-2 h-2 rounded-full bg-brand" />
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Admin</span>
        </div>
        <h1 className="font-display font-extrabold text-2xl text-ink mb-2 leading-tight">Inloggen</h1>
        <p className="text-sm text-muted mb-6">Voer het admin wachtwoord in om door te gaan.</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setError(false);
            onLogin(pw);
            setError(true);
          }}
        >
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            placeholder="Wachtwoord"
            className={`w-full px-4 py-3 text-sm border rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all mb-4 ${
              error ? "border-red-400" : "border-hairline"
            }`}
          />
          {error && <p className="text-xs text-red-500 mb-3 font-semibold">Onjuist wachtwoord</p>}
          <button
            type="submit"
            className="w-full px-4 py-3 bg-brand text-white text-sm font-bold rounded-full hover:bg-brand-deep transition-colors uppercase tracking-wide"
          >
            Inloggen
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Products tab ──
function ProductsTab({
  store,
  setStore,
  toast,
}: {
  store: AdminStore;
  setStore: (s: AdminStore) => void;
  toast: ReturnType<typeof useToast>["show"];
}) {
  const allServices = baseServices;
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const toggleExpand = (slug: string) => {
    setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }));
  };

  const updateProductImage = (serviceSlug: string, productName: string, image: string) => {
    const next: AdminStore = {
      ...store,
      products: {
        ...store.products,
        [serviceSlug]: (store.products[serviceSlug] ?? []).map((p) =>
          p.name === productName ? { ...p, image } : p
        ),
      },
    };
    setStore(next);
    toast("Productafbeelding bijgewerkt", "success");
  };

  return (
    <div className="space-y-4">
      {allServices.map((service) => {
        const adminProducts = store.products[service.slug] ?? [];
        const allProducts = [...service.products, ...adminProducts];
        const isOpen = expanded[service.slug] ?? false;

        return (
          <div key={service.slug} className="bg-white border border-hairline rounded-2xl overflow-hidden">
            <button
              onClick={() => toggleExpand(service.slug)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-concrete/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-ink">{service.title}</span>
                <span className="text-xs text-muted tabular-nums">{allProducts.length} producten</span>
              </div>
              <svg
                className={`w-4 h-4 text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && (
              <div className="border-t border-hairline px-5 py-4 space-y-4">
                {allProducts.length === 0 ? (
                  <p className="text-sm text-muted">Geen producten in deze categorie.</p>
                ) : (
                  allProducts.map((product) => (
                    <div
                      key={product.name}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-concrete/40 rounded-xl"
                    >
                      <div className="shrink-0 w-16 h-16 rounded-lg overflow-hidden border border-hairline bg-white relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-ink truncate">{product.name}</p>
                        <p className="text-xs text-muted">{product.brand} · {product.price ?? "Prijs op aanvraag"}</p>
                      </div>
                      <div className="sm:w-64">
                        <ImageField
                          label="Afbeelding URL"
                          value={product.image}
                          onChange={(url) => updateProductImage(service.slug, product.name, url)}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Brands tab ──
function BrandsTab({
  store,
  setStore,
  toast,
}: {
  store: AdminStore;
  setStore: (s: AdminStore) => void;
  toast: ReturnType<typeof useToast>["show"];
}) {
  const [newName, setNewName] = useState("");
  const [newImage, setNewImage] = useState("");

  const allBrands = Object.entries({ ...store.brandImages });

  const addBrand = () => {
    if (!newName.trim()) return;
    const next: AdminStore = {
      ...store,
      brandImages: {
        ...store.brandImages,
        [newName.trim()]: newImage.trim(),
      },
    };
    setStore(next);
    setNewName("");
    setNewImage("");
    toast("Merk toegevoegd", "success");
  };

  const removeBrand = (name: string) => {
    const next = { ...store, brandImages: { ...store.brandImages } };
    delete next.brandImages[name];
    setStore(next);
    toast("Merk verwijderd", "success");
  };

  return (
    <div className="space-y-6">
      {/* Add brand */}
      <div className="bg-white border border-hairline rounded-2xl p-5">
        <h3 className="text-sm font-bold text-ink mb-4">Merk toevoegen</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-[0.15em] text-muted mb-1.5">Merknaam</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="bijv. Samsung"
              className="w-full px-3 py-2 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
            />
          </div>
          <ImageField label="Logo afbeelding" value={newImage} onChange={setNewImage} />
        </div>
        <button
          onClick={addBrand}
          disabled={!newName.trim()}
          className="px-5 py-2.5 bg-brand text-white text-xs font-bold rounded-full hover:bg-brand-deep transition-colors disabled:opacity-40 uppercase tracking-wide"
        >
          Merk toevoegen
        </button>
      </div>

      {/* Brand list */}
      <div className="bg-white border border-hairline rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-hairline flex items-center justify-between">
          <h3 className="text-sm font-bold text-ink">Bestaande merken</h3>
          <span className="text-xs text-muted">{allBrands.length} merken</span>
        </div>
        <div className="divide-y divide-hairline">
          {allBrands.map(([name, url]) => (
            <div key={name} className="px-5 py-4 flex items-center gap-4">
              <div className="shrink-0 w-12 h-8 rounded border border-hairline bg-white flex items-center justify-center overflow-hidden">
                {url ? (
                  <img src={url} alt={name} className="max-w-full max-h-full object-contain" />
                ) : (
                  <span className="text-[10px] text-muted uppercase font-bold">{name.slice(0, 3)}</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{name}</p>
                <p className="text-xs text-muted truncate">{url || "Geen afbeelding"}</p>
              </div>
              <button
                onClick={() => removeBrand(name)}
                className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
              >
                Verwijder
              </button>
            </div>
          ))}
          {allBrands.length === 0 && (
            <div className="px-5 py-8 text-center">
              <p className="text-sm text-muted">Nog geen merken toegevoegd.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Add Product tab ──
function AddProductTab({
  store,
  setStore,
  toast,
}: {
  store: AdminStore;
  setStore: (s: AdminStore) => void;
  toast: ReturnType<typeof useToast>["show"];
}) {
  const [serviceSlug, setServiceSlug] = useState(baseServices[0].slug);
  const [form, setForm] = useState<Omit<Product, "categoryId">>({
    name: "",
    brand: "",
    price: null,
    priceMin: null,
    priceMax: null,
    tier: "medium",
    description: "",
    techSpecs: [],
    image: "",
  });
  const [specInput, setSpecInput] = useState("");

  const update = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addSpec = () => {
    if (!specInput.trim()) return;
    setForm((prev) => ({ ...prev, techSpecs: [...prev.techSpecs, specInput.trim()] }));
    setSpecInput("");
  };

  const removeSpec = (idx: number) => {
    setForm((prev) => ({ ...prev, techSpecs: prev.techSpecs.filter((_, i) => i !== idx) }));
  };

  const submit = () => {
    if (!form.name.trim() || !form.brand.trim()) {
      toast("Naam en merk zijn verplicht", "error");
      return;
    }
    const product: Product = {
      ...form,
      categoryId: serviceSlug,
      price: form.price?.trim() ? form.price.trim() : null,
      priceMin: form.priceMin,
      priceMax: form.priceMax,
    };
    const next: AdminStore = {
      ...store,
      products: {
        ...store.products,
        [serviceSlug]: [...(store.products[serviceSlug] ?? []), product],
      },
    };
    setStore(next);
    toast("Product toegevoegd", "success");
    setForm({
      name: "",
      brand: "",
      price: null,
      priceMin: null,
      priceMax: null,
      tier: "medium",
      description: "",
      techSpecs: [],
      image: "",
    });
  };

  return (
    <div className="bg-white border border-hairline rounded-2xl p-5 lg:p-6 space-y-5">
      <h3 className="text-sm font-bold text-ink">Product toevoegen</h3>

      <div>
        <label className="block text-xs font-bold uppercase tracking-[0.15em] text-muted mb-1.5">Dienst</label>
        <select
          value={serviceSlug}
          onChange={(e) => setServiceSlug(e.target.value)}
          className="w-full px-3 py-2 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
        >
          {baseServices.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-[0.15em] text-muted mb-1.5">Productnaam *</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="bijv. LG Artcool Gallery"
            className="w-full px-3 py-2 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-[0.15em] text-muted mb-1.5">Merk *</label>
          <input
            type="text"
            value={form.brand}
            onChange={(e) => update("brand", e.target.value)}
            placeholder="bijv. LG"
            className="w-full px-3 py-2 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-[0.15em] text-muted mb-1.5">Prijs (tekst)</label>
          <input
            type="text"
            value={form.price ?? ""}
            onChange={(e) => update("price", e.target.value || null)}
            placeholder="€2.800 - €5.000"
            className="w-full px-3 py-2 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-[0.15em] text-muted mb-1.5">Prijs min (€)</label>
          <input
            type="number"
            value={form.priceMin ?? ""}
            onChange={(e) => update("priceMin", e.target.value ? Number(e.target.value) : null)}
            placeholder="2800"
            className="w-full px-3 py-2 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-[0.15em] text-muted mb-1.5">Prijs max (€)</label>
          <input
            type="number"
            value={form.priceMax ?? ""}
            onChange={(e) => update("priceMax", e.target.value ? Number(e.target.value) : null)}
            placeholder="5000"
            className="w-full px-3 py-2 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-[0.15em] text-muted mb-1.5">Kwaliteitsklasse</label>
          <select
            value={form.tier}
            onChange={(e) => update("tier", e.target.value as PriceTier)}
            className="w-full px-3 py-2 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
          >
            {(Object.keys(priceTierLabels) as PriceTier[]).map((t) => (
              <option key={t} value={t}>
                {priceTierLabels[t]}
              </option>
            ))}
          </select>
        </div>
        <ImageField label="Productafbeelding" value={form.image} onChange={(url) => update("image", url)} />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-[0.15em] text-muted mb-1.5">Beschrijving</label>
        <textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          rows={3}
          placeholder="Korte productbeschrijving..."
          className="w-full px-3 py-2 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-bold uppercase tracking-[0.15em] text-muted mb-1.5">Specificaties</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={specInput}
            onChange={(e) => setSpecInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSpec();
              }
            }}
            placeholder="Voeg een specificatie toe..."
            className="flex-1 px-3 py-2 text-sm border border-hairline rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
          />
          <button
            onClick={addSpec}
            className="px-4 py-2 bg-concrete text-ink text-xs font-bold rounded-xl border border-hairline hover:border-brand hover:text-brand transition-colors"
          >
            +
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {form.techSpecs.map((spec, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-concrete border border-hairline rounded-full text-xs font-semibold text-ink"
            >
              {spec}
              <button
                onClick={() => removeSpec(i)}
                className="text-muted hover:text-red-500 transition-colors"
                aria-label="Verwijder specificatie"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={submit}
          className="px-6 py-3 bg-brand text-white text-sm font-bold rounded-full hover:bg-brand-deep transition-colors uppercase tracking-wide"
        >
          Product opslaan
        </button>
      </div>
    </div>
  );
}

// ── Main admin page ──
export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [store, setStoreState] = useState<AdminStore>({ products: {}, brandImages: {} });
  const [activeTab, setActiveTab] = useState<"products" | "brands" | "add">("products");
  const [loading, setLoading] = useState(true);
  const { toasts, show } = useToast();

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("mmc_admin_authed") === "1") {
        setAuthed(true);
      }
    }
    fetchAdminStore()
      .then(setStoreState)
      .finally(() => setLoading(false));
  }, []);

  const setStore = async (next: AdminStore) => {
    setStoreState(next);
    const ok = await saveAdminStore(next);
    if (!ok) {
      show("Opgeslagen in browser (API niet beschikbaar)", "success");
    }
  };

  const handleLogin = (pw: string) => {
    if (pw === getAdminPassword()) {
      sessionStorage.setItem("mmc_admin_authed", "1");
      setAuthed(true);
    }
  };

  if (!authed) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-base">
      <ToastContainer toasts={toasts} />

      {/* Header */}
      <div className="bg-white border-b border-hairline sticky top-0 z-40">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Admin</span>
            </div>
            <button
              onClick={() => {
                sessionStorage.removeItem("mmc_admin_authed");
                setAuthed(false);
              }}
              className="text-xs font-bold text-muted hover:text-ink transition-colors"
            >
              Uitloggen
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-hairline">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="flex gap-1 -mb-px">
            {([
              { key: "products", label: "Producten" },
              { key: "brands", label: "Merken" },
              { key: "add", label: "Product toevoegen" },
            ] as const).map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-4 py-3 text-xs font-bold uppercase tracking-wide border-b-2 transition-colors ${
                  activeTab === t.key
                    ? "text-brand border-brand"
                    : "text-muted border-transparent hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8 lg:py-10">
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm text-muted">Laden...</p>
          </div>
        ) : (
          <>
            {activeTab === "products" && <ProductsTab store={store} setStore={setStore} toast={show} />}
            {activeTab === "brands" && <BrandsTab store={store} setStore={setStore} toast={show} />}
            {activeTab === "add" && <AddProductTab store={store} setStore={setStore} toast={show} />}
          </>
        )}
      </div>
    </div>
  );
}
