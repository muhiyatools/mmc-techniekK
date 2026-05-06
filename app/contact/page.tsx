"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  contactInfo,
  services,
  productCategories,
  testimonials,
  type Product,
} from "@/lib/data";
import { supabase } from "@/lib/supabase";
import Reveal from "../components/Reveal";

const WA_PHONE = "31634311225";

const tierConfig = {
  economy: { label: "Economy", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  medium:  { label: "Medium",  color: "bg-amber-100  text-amber-700  border-amber-200"  },
  premium: { label: "Premium", color: "bg-violet-100 text-violet-700 border-violet-200" },
};

// Flat product list for product-informatie mode
const allContactProducts: (Product & { serviceSlug: string })[] = services.flatMap((s) =>
  s.products.map((p) => ({ ...p, serviceSlug: s.slug }))
);

function buildWhatsAppMessage(form: {
  name: string; email: string; phone: string;
  service: string; product: string; message: string;
  mode: string;
}) {
  const serviceLabel = services.find((s) => s.slug === form.service)?.title ?? form.service;
  const lines = [
    "Hallo MMC Techniek,",
    "",
    form.mode === "product"
      ? "Ik wil graag meer informatie over een product."
      : "Ik wil graag een offerte aanvragen.",
    "",
    `Naam: ${form.name || "(niet ingevuld)"}`,
    `E-mail: ${form.email || "(niet ingevuld)"}`,
    form.phone   ? `Telefoon: ${form.phone}` : null,
    serviceLabel ? `Dienst: ${serviceLabel}` : null,
    form.product ? `Product: ${form.product}` : null,
    form.message ? `\nBericht: ${form.message}` : null,
    "",
    "Met vriendelijke groet,",
    form.name || "een geinteresseerde klant",
  ].filter((l) => l !== null).join("\n");
  return encodeURIComponent(lines);
}

// Shared input class
const inputClass =
  "w-full px-4 py-3.5 border border-hairline bg-base text-ink text-sm rounded-xl focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all placeholder:text-muted/40";

const selectClass =
  "w-full px-4 py-3.5 pr-10 border border-hairline bg-base text-ink text-sm rounded-xl focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all appearance-none cursor-pointer";

function ContactForm() {
  const searchParams = useSearchParams();
  const serviceParam  = searchParams.get("service");
  const productParam  = searchParams.get("product");

  const [mode, setMode] = useState<"dienst" | "product">("dienst");
  const [productCat, setProductCat] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "", email: "", phone: "",
    service: serviceParam || "",
    product: productParam || "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  const selectedService = services.find((s) => s.slug === form.service);
  const selectedProduct: Product | undefined = allContactProducts.find(
    (p) => p.name === form.product
  );

  const handleModeSwitch = (next: "dienst" | "product") => {
    setMode(next);
    setForm((f) => ({ ...f, service: "", product: "" }));
    setProductCat(null);
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error: supaError } = await supabase.from("quote_requests").insert({
        name: form.name, email: form.email, phone: form.phone || null,
        service_slug: form.service || null, product_name: form.product || null,
        message: form.message || null, status: "pending",
      });
      if (supaError) throw supaError;
      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Er is iets misgegaan. Probeer het opnieuw.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const waForm = { ...form, mode };
  const waHref = `https://wa.me/${WA_PHONE}?text=${buildWhatsAppMessage(waForm)}`;

  // Products shown in product-informatie mode
  const modeProducts = productCat
    ? allContactProducts.filter((p) => p.categoryId === productCat)
    : allContactProducts;

  return (
    <>
      {/* Page header */}
      <section className="relative pt-[70px] lg:pt-[114px] bg-base">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-14 py-16 lg:py-20">
          <Reveal>
            <div className="flex items-center gap-2.5 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Contact</span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display text-[clamp(2.5rem,5vw,4rem)] font-extrabold leading-[0.92] tracking-tight text-ink mb-4">
              Start uw project
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-lg text-muted leading-relaxed max-w-xl">
              Vul het formulier in. Wij nemen binnen 24 uur contact op, of stuur direct een WhatsApp.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Main contact grid */}
      <section className="pb-28 lg:pb-36 bg-base">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-14">
          <div className="h-px bg-gradient-to-r from-aurora-1 via-brand/30 to-aurora-2 mb-12 lg:mb-16" />

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">

            {/* Left column */}
            <div className="lg:col-span-4 space-y-8">

              {/* Project photo + testimonial */}
              <Reveal>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src="/images/projects/PHOTO-2024-12-03-12-54-01.jpg"
                    alt="MMC Techniek project"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 35vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/88 via-ink/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="flex mb-2">
                      {Array.from({ length: testimonials[0].stars }).map((_, s) => (
                        <svg key={s} className="w-3.5 h-3.5 text-brand" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed italic mb-3">
                      &ldquo;{testimonials[0].text}&rdquo;
                    </p>
                    <p className="text-white text-xs font-bold">{testimonials[0].name}</p>
                    <p className="text-white/50 text-xs mt-0.5">{testimonials[0].role}</p>
                  </div>
                </div>
              </Reveal>

              {/* Contact details */}
              <div className="space-y-5">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    ),
                    label: "Telefoon",
                    value: <a href={`tel:${contactInfo.phone}`} className="hover:text-brand transition-colors tabular">{contactInfo.phoneDisplay}</a>,
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ),
                    label: "E-mail",
                    value: <a href={`mailto:${contactInfo.email}`} className="hover:text-brand transition-colors">{contactInfo.email}</a>,
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ),
                    label: "Adres",
                    value: <span>{contactInfo.address}</span>,
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    label: "Openingstijden",
                    value: <span>{contactInfo.hours}</span>,
                  },
                ].map((item) => (
                  <Reveal key={item.label}>
                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl bg-concrete border border-hairline flex items-center justify-center shrink-0 text-brand mt-0.5">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted mb-0.5">{item.label}</p>
                        <div className="text-sm text-copy">{item.value}</div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <Reveal>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-5 rounded-2xl bg-[#25D366]/6 border border-[#25D366]/20 hover:border-[#25D366]/45 hover:bg-[#25D366]/10 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 shadow-lg shadow-[#25D366]/30 group-hover:scale-105 transition-transform">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-ink group-hover:text-[#1a9d52] transition-colors mb-0.5">
                      Direct via WhatsApp
                    </p>
                    <p className="text-xs text-muted leading-relaxed">
                      Vul het formulier in en stuur direct. Snelste reactie.
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-muted/40 shrink-0 group-hover:text-[#25D366] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </Reveal>
            </div>

            {/* Right column: form */}
            <Reveal delay={100} className="lg:col-span-8">
              <div className="relative bg-concrete border border-hairline rounded-2xl overflow-hidden shadow-xl shadow-ink/5">
                {/* Aurora top stripe */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-1 via-brand/40 to-aurora-2" />

                {submitted ? (
                  /* Success state */
                  <div className="p-10 lg:p-12 text-center py-20">
                    <div className="w-16 h-16 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-6">
                      <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-display text-2xl font-extrabold text-ink mb-3">Aanvraag ontvangen</h3>
                    <p className="text-muted mb-8 max-w-sm mx-auto">
                      Bedankt. Wij nemen binnen 24 uur contact op.
                    </p>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#25D366] text-white font-bold rounded-full hover:bg-[#1da851] transition-colors text-sm"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Stuur ook via WhatsApp
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleEmailSubmit}>

                    {/* Mode toggle */}
                    <div className="p-8 lg:p-10 border-b border-hairline">
                      <div className="flex rounded-full border border-hairline p-1 bg-base gap-1">
                        <button
                          type="button"
                          onClick={() => handleModeSwitch("dienst")}
                          className={`flex-1 py-2.5 px-4 text-sm font-bold rounded-full transition-all duration-200 ${
                            mode === "dienst"
                              ? "bg-brand text-white shadow-sm"
                              : "text-muted hover:text-ink"
                          }`}
                        >
                          Dienst aanvragen
                        </button>
                        <button
                          type="button"
                          onClick={() => handleModeSwitch("product")}
                          className={`flex-1 py-2.5 px-4 text-sm font-bold rounded-full transition-all duration-200 ${
                            mode === "product"
                              ? "bg-brand text-white shadow-sm"
                              : "text-muted hover:text-ink"
                          }`}
                        >
                          Product informatie
                        </button>
                      </div>
                    </div>

                    {/* Personal info */}
                    <div className="p-8 lg:p-10 border-b border-hairline">
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="name" className="block text-xs font-bold uppercase tracking-[0.12em] text-ink mb-2">
                            Naam <span className="text-brand">*</span>
                          </label>
                          <input
                            id="name" type="text" required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className={inputClass}
                            placeholder="Uw naam"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-xs font-bold uppercase tracking-[0.12em] text-ink mb-2">
                            E-mail <span className="text-brand">*</span>
                          </label>
                          <input
                            id="email" type="email" required
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className={inputClass}
                            placeholder="uw@email.nl"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-[0.12em] text-ink mb-2">
                            Telefoon
                          </label>
                          <input
                            id="phone" type="tel"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            className={inputClass}
                            placeholder="06 1234 5678"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Dienst aanvragen mode */}
                    {mode === "dienst" && (
                      <div className="p-8 lg:p-10 border-b border-hairline">
                        {/* Service selector */}
                        <div className="mb-6">
                          <label htmlFor="service" className="block text-xs font-bold uppercase tracking-[0.12em] text-ink mb-2">
                            Dienst
                          </label>
                          <div className="relative">
                            <select
                              id="service"
                              value={form.service}
                              onChange={(e) => setForm({ ...form, service: e.target.value, product: "" })}
                              className={selectClass}
                            >
                              <option value="">Kies een dienst</option>
                              {services.map((s) => (
                                <option key={s.slug} value={s.slug}>{s.title}</option>
                              ))}
                            </select>
                            <svg className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>

                        {/* Product picker */}
                        {selectedService && selectedService.products.length > 0 && (
                          <div>
                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink mb-3">
                              Product kiezen
                              <span className="ml-2 text-muted font-normal normal-case tracking-normal">(optioneel)</span>
                            </p>
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                              {selectedService.products.map((p) => {
                                const isSelected = form.product === p.name;
                                const tier = tierConfig[p.tier];
                                return (
                                  <button
                                    key={p.name}
                                    type="button"
                                    onClick={() => setForm({ ...form, product: isSelected ? "" : p.name })}
                                    className={`relative text-left p-3 rounded-xl border transition-all duration-150 ${
                                      isSelected
                                        ? "border-brand bg-brand/5 shadow-sm shadow-brand/10"
                                        : "border-hairline bg-base hover:border-brand/40 hover:bg-brand/3"
                                    }`}
                                  >
                                    {isSelected && (
                                      <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand flex items-center justify-center">
                                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                      </span>
                                    )}
                                    <span className={`inline-block px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider border rounded mb-1.5 ${tier.color}`}>
                                      {tier.label}
                                    </span>
                                    <p className="text-xs font-bold text-ink leading-snug pr-5">{p.name}</p>
                                    {p.price && (
                                      <p className="text-[0.7rem] text-muted mt-1">{p.price}</p>
                                    )}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Selected product panel */}
                        {selectedProduct && (
                          <div className="mt-5 border border-brand/20 bg-brand/3 rounded-xl overflow-hidden">
                            <div className="h-px bg-gradient-to-r from-aurora-1 via-brand/50 to-aurora-2" />
                            <div className="flex gap-0">
                              <div className="relative w-[140px] lg:w-[180px] shrink-0 aspect-square">
                                <Image
                                  src={selectedProduct.image}
                                  alt={selectedProduct.name}
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                              <div className="flex-1 p-5 min-w-0">
                                <div className="flex items-start justify-between gap-3 mb-2">
                                  <div>
                                    <span className={`inline-block px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider border rounded mb-1.5 ${tierConfig[selectedProduct.tier].color}`}>
                                      {tierConfig[selectedProduct.tier].label}
                                    </span>
                                    <h4 className="text-base font-bold text-ink leading-tight">
                                      {selectedProduct.name}
                                    </h4>
                                    <p className="text-xs text-muted mt-0.5">{selectedProduct.brand}</p>
                                  </div>
                                  {selectedProduct.price && (
                                    <div className="shrink-0 text-right">
                                      <p className="text-[0.65rem] font-bold uppercase tracking-wide text-muted">Vanaf</p>
                                      <p className="text-base font-extrabold text-brand tabular">{selectedProduct.price}</p>
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs text-copy leading-relaxed mb-3">{selectedProduct.description}</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {selectedProduct.techSpecs.slice(0, 4).map((spec) => (
                                    <span key={spec} className="inline-flex items-center gap-1 px-2 py-0.5 bg-base border border-hairline text-[0.65rem] text-copy rounded-full">
                                      <span className="w-1 h-1 rounded-full bg-brand shrink-0" />
                                      {spec}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Product informatie mode */}
                    {mode === "product" && (
                      <div className="p-8 lg:p-10 border-b border-hairline">
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-ink mb-4">
                          Kies een product
                          <span className="ml-2 text-muted font-normal normal-case tracking-normal">(optioneel)</span>
                        </p>

                        {/* Category chips */}
                        <div className="flex flex-wrap gap-2 mb-5">
                          <button
                            type="button"
                            onClick={() => setProductCat(null)}
                            className={`px-3.5 py-1.5 text-xs font-bold rounded-full border transition-all duration-150 ${
                              productCat === null
                                ? "bg-brand border-brand text-white"
                                : "border-hairline text-muted hover:border-brand/40 hover:text-ink"
                            }`}
                          >
                            Alle
                          </button>
                          {productCategories.filter((cat) =>
                            allContactProducts.some((p) => p.categoryId === cat.id)
                          ).map((cat) => (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => setProductCat(productCat === cat.id ? null : cat.id)}
                              className={`px-3.5 py-1.5 text-xs font-bold rounded-full border transition-all duration-150 ${
                                productCat === cat.id
                                  ? "bg-brand border-brand text-white"
                                  : "border-hairline text-muted hover:border-brand/40 hover:text-ink"
                              }`}
                            >
                              {cat.label}
                            </button>
                          ))}
                        </div>

                        {/* Product grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5">
                          {modeProducts.map((p) => {
                            const isSelected = form.product === p.name;
                            const tier = tierConfig[p.tier];
                            return (
                              <button
                                key={p.name}
                                type="button"
                                onClick={() =>
                                  setForm({
                                    ...form,
                                    product: isSelected ? "" : p.name,
                                    service: isSelected ? "" : p.categoryId,
                                  })
                                }
                                className={`relative text-left p-3 rounded-xl border transition-all duration-150 ${
                                  isSelected
                                    ? "border-brand bg-brand/5 shadow-sm shadow-brand/10"
                                    : "border-hairline bg-base hover:border-brand/40 hover:bg-brand/3"
                                }`}
                              >
                                {isSelected && (
                                  <span className="absolute top-2 right-2 w-4 h-4 rounded-full bg-brand flex items-center justify-center">
                                    <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  </span>
                                )}
                                <span className={`inline-block px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider border rounded mb-1.5 ${tier.color}`}>
                                  {tier.label}
                                </span>
                                <p className="text-xs font-bold text-ink leading-snug pr-5">{p.name}</p>
                                <p className="text-[0.65rem] text-muted mt-0.5">{p.brand}</p>
                                {p.price && (
                                  <p className="text-[0.7rem] text-muted mt-1">{p.price}</p>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Message */}
                    <div className="p-8 lg:p-10 border-b border-hairline">
                      <label htmlFor="message" className="block text-xs font-bold uppercase tracking-[0.12em] text-ink mb-2">
                        Uw bericht
                      </label>
                      <textarea
                        id="message" rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className={`${inputClass} resize-none`}
                        placeholder="Vertel ons over uw situatie: type woning, huidige installatie, wensen..."
                      />
                    </div>

                    {/* Submit area */}
                    <div className="p-8 lg:p-10">
                      {error && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-4 mb-5">{error}</p>
                      )}
                      <div className="grid sm:grid-cols-2 gap-3">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex items-center justify-center gap-2.5 py-4 bg-ink text-white text-sm font-bold uppercase tracking-wide rounded-full hover:bg-brand transition-all duration-200 hover:shadow-lg hover:shadow-brand/20 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {loading ? "Verzenden..." : "Versturen per e-mail"}
                        </button>
                        <a
                          href={waHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2.5 py-4 bg-[#25D366] text-white text-sm font-bold uppercase tracking-wide rounded-full hover:bg-[#1da851] transition-all duration-200 hover:shadow-lg hover:shadow-[#25D366]/25"
                        >
                          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          Via WhatsApp
                        </a>
                      </div>
                      <p className="text-xs text-muted text-center mt-4">
                        Door te versturen gaat u akkoord met onze verwerking van uw gegevens.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Also browse products */}
      <section className="bg-concrete border-t border-hairline py-10">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-14 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            Op zoek naar een specifiek product?{" "}
            <span className="font-semibold text-ink">Bekijk ons volledige assortiment.</span>
          </p>
          <Link
            href="/producten/"
            className="shrink-0 px-6 py-2.5 border border-brand text-brand text-sm font-bold rounded-full hover:bg-brand hover:text-white transition-all duration-200"
          >
            Naar productoverzicht
          </Link>
        </div>
      </section>
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-base" />}>
      <ContactForm />
    </Suspense>
  );
}
