"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { contactInfo, services, testimonials } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import Reveal from "../components/Reveal";

const WA_PHONE = "31634311225";

function buildWhatsAppMessage(form: {
  name: string; email: string; phone: string;
  service: string; product: string; message: string;
}) {
  const serviceLabel = services.find((s) => s.slug === form.service)?.title ?? form.service;
  const lines = [
    "Hallo MMC Techniek,",
    "",
    "Ik wil graag een offerte aanvragen.",
    "",
    `Naam: ${form.name || "(niet ingevuld)"}`,
    `E-mail: ${form.email || "(niet ingevuld)"}`,
    form.phone ? `Telefoon: ${form.phone}` : null,
    serviceLabel ? `Dienst: ${serviceLabel}` : null,
    form.product ? `Product: ${form.product}` : null,
    form.message ? `\nBericht: ${form.message}` : null,
    "",
    "Met vriendelijke groet,",
    form.name || "een geinteresseerde klant",
  ].filter((l) => l !== null).join("\n");
  return encodeURIComponent(lines);
}

const inputClass =
  "w-full px-4 py-3 border border-hairline bg-white text-ink text-sm rounded-xl focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all placeholder:text-muted/40";

const selectClass =
  "w-full px-4 py-3 pr-10 border border-hairline bg-white text-ink text-sm rounded-xl focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all appearance-none cursor-pointer";

function ContactForm() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");
  const productParam = searchParams.get("product");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    service: serviceParam || "",
    product: productParam || "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selectedService = services.find((s) => s.slug === form.service);
  const selectedProduct = form.product && selectedService
    ? selectedService.products.find((p) => p.name === form.product)
    : null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { error: supaError } = await supabase.from("quote_requests").insert({
        name: form.name,
        email: form.email,
        phone: form.phone || null,
        service_slug: form.service || null,
        product_name: form.product || null,
        message: form.message || null,
        status: "pending",
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

  const waHref = `https://wa.me/${WA_PHONE}?text=${buildWhatsAppMessage(form)}`;

  return (
    <>
      {/* Compact header */}
      <section className="pt-[70px] lg:pt-[114px] bg-base">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-8 lg:py-10">
          <Reveal>
            <div className="flex items-center gap-2.5 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
              <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted">Contact</span>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h1 className="font-display text-[clamp(2rem,4vw,3rem)] font-extrabold leading-[0.95] tracking-tight text-ink mb-2">
              Vraag een offerte aan
            </h1>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-base text-muted leading-relaxed max-w-lg">
              Vul het formulier in. Wij nemen binnen 24 uur contact op.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="pb-20 lg:pb-28 bg-base">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* Left: Contact info sidebar */}
            <div className="lg:col-span-4 space-y-5">
              {/* Project testimonial */}
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
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex mb-1.5">
                      {Array.from({ length: testimonials[0].stars }).map((_, s) => (
                        <svg key={s} className="w-3 h-3 text-brand" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-white/90 text-sm leading-relaxed italic mb-2">
                      &ldquo;{testimonials[0].text}&rdquo;
                    </p>
                    <p className="text-white text-xs font-bold">{testimonials[0].name}</p>
                  </div>
                </div>
              </Reveal>

              {/* Contact details */}
              <div className="space-y-4">
                {[
                  {
                    icon: (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    ),
                    label: "Telefoon",
                    value: <a href={`tel:${contactInfo.phone}`} className="hover:text-brand transition-colors tabular">{contactInfo.phoneDisplay}</a>,
                  },
                  {
                    icon: (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    ),
                    label: "E-mail",
                    value: <a href={`mailto:${contactInfo.email}`} className="hover:text-brand transition-colors">{contactInfo.email}</a>,
                  },
                  {
                    icon: (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    ),
                    label: "Adres",
                    value: <span>{contactInfo.address}</span>,
                  },
                ].map((item) => (
                  <Reveal key={item.label}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-concrete border border-hairline flex items-center justify-center shrink-0 text-brand">
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-muted mb-0.5">{item.label}</p>
                        <div className="text-sm text-copy">{item.value}</div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              {/* WhatsApp quick CTA */}
              <Reveal>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 rounded-xl bg-[#25D366]/6 border border-[#25D366]/20 hover:border-[#25D366]/40 hover:bg-[#25D366]/10 transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-ink">Direct via WhatsApp</p>
                    <p className="text-xs text-muted">Snelste reactie</p>
                  </div>
                </a>
              </Reveal>
            </div>

            {/* Right: Form */}
            <Reveal delay={100} className="lg:col-span-8">
              <div className="bg-white border border-hairline rounded-2xl shadow-xl shadow-ink/5 overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-1 via-brand/40 to-aurora-2" />
                
                {submitted ? (
                  <div className="p-8 lg:p-10 text-center py-16">
                    <div className="w-14 h-14 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-5">
                      <svg className="w-7 h-7 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-display text-xl font-extrabold text-ink mb-2">Aanvraag ontvangen</h3>
                    <p className="text-muted mb-6 max-w-sm mx-auto text-sm">
                      Bedankt. Wij nemen binnen 24 uur contact op.
                    </p>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold rounded-full hover:bg-[#1da851] transition-colors text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Stuur ook via WhatsApp
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleEmailSubmit} className="p-6 lg:p-8">
                    {/* Personal info row */}
                    <div className="grid sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <label htmlFor="name" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ink mb-1.5">
                          Naam <span className="text-brand">*</span>
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className={inputClass}
                          placeholder="Uw naam"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ink mb-1.5">
                          E-mail <span className="text-brand">*</span>
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className={inputClass}
                          placeholder="uw@email.nl"
                        />
                      </div>
                      <div>
                        <label htmlFor="phone" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ink mb-1.5">
                          Telefoon
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className={inputClass}
                          placeholder="06 1234 5678"
                        />
                      </div>
                    </div>

                    {/* Service + Product row */}
                    <div className="grid sm:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="service" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ink mb-1.5">
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
                          <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                      <div>
                        <label htmlFor="product" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ink mb-1.5">
                          Product <span className="text-muted font-normal normal-case tracking-normal">(optioneel)</span>
                        </label>
                        <div className="relative">
                          <select
                            id="product"
                            value={form.product}
                            onChange={(e) => setForm({ ...form, product: e.target.value })}
                            className={selectClass}
                            disabled={!selectedService || selectedService.products.length === 0}
                          >
                            <option value="">
                              {!selectedService
                                ? "Kies eerst een dienst"
                                : selectedService.products.length === 0
                                ? "Geen producten beschikbaar"
                                : "Kies een product"}
                            </option>
                            {selectedService?.products.map((p) => (
                              <option key={p.name} value={p.name}>{p.name}</option>
                            ))}
                          </select>
                          <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                        {/* Selected product info */}
                    {selectedProduct && (
                      <div className="mb-4 p-4 bg-concrete border border-hairline rounded-xl">
                        <div className="flex items-start gap-4">
                          <div className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-white border border-hairline">
                            <Image
                              src={selectedProduct.image}
                              alt={selectedProduct.name}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-ink">{selectedProduct.name}</p>
                            <p className="text-xs text-muted mt-0.5">
                              {selectedProduct.brand}
                            </p>
                            <p className="text-xs text-brand font-bold mt-1">
                              {selectedProduct.price ?? "Prijs op aanvraag"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Message */}
                    <div className="mb-5">
                      <label htmlFor="message" className="block text-[11px] font-bold uppercase tracking-[0.12em] text-ink mb-1.5">
                        Uw bericht
                      </label>
                      <textarea
                        id="message"
                        rows={3}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className={`${inputClass} resize-none`}
                        placeholder="Vertel ons over uw situatie..."
                      />
                    </div>

                    {/* Error */}
                    {error && (
                      <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-3 mb-4">{error}</p>
                    )}

                    {/* Submit buttons */}
                    <div className="grid sm:grid-cols-2 gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 py-3.5 bg-ink text-white text-sm font-bold uppercase tracking-wide rounded-full hover:bg-brand transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
                        className="flex items-center justify-center gap-2 py-3.5 bg-[#25D366] text-white text-sm font-bold uppercase tracking-wide rounded-full hover:bg-[#1da851] transition-all duration-200"
                      >
                        <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Via WhatsApp
                      </a>
                    </div>
                    <p className="text-[11px] text-muted text-center mt-3">
                      Door te versturen gaat u akkoord met onze verwerking van uw gegevens.
                    </p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Cross-link to products */}
      <section className="bg-concrete border-t border-hairline py-8">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-4">
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
