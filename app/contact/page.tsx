"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { contactInfo, services } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import Reveal from "../components/Reveal";

const WA_PHONE = "31634311225";

function buildWhatsAppMessage(form: {
  name: string;
  email: string;
  phone: string;
  service: string;
  product: string;
  message: string;
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
    `Met vriendelijke groet,`,
    form.name || "een geinteresseerde klant",
  ]
    .filter((l) => l !== null)
    .join("\n");
  return encodeURIComponent(lines);
}

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
    } catch (err: any) {
      setError(err.message || "Er is iets misgegaan. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  const waHref = `https://wa.me/${WA_PHONE}?text=${buildWhatsAppMessage(form)}`;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-[90px] lg:pt-[120px]">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-24 lg:py-32">
          <div className="max-w-3xl">
            <Reveal>
              <span className="inline-flex items-center gap-2.5 text-[0.75rem] font-semibold uppercase tracking-[0.18em] text-muted mb-6">
                <span className="w-2 h-2 rounded-full bg-brand" />
                Contact
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4.5rem] font-bold leading-[1.02] tracking-tight text-ink mb-8">
                Start uw
                <br />
                <span className="text-brand">project</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-xl text-muted leading-relaxed max-w-2xl">
                Vul het formulier in en we nemen binnen 24 uur contact met u op. Of stuur ons direct een bericht via WhatsApp.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="pb-28 lg:pb-36 bg-base">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Left — info + team */}
            <div className="lg:col-span-5 space-y-10">
              {/* Team foto placeholder — replace with real people images */}
              <Reveal>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-brand/10 via-concrete to-aurora-1/10 flex items-center justify-center border border-hairline">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-brand/15 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-ink">Mark</p>
                      <p className="text-xs text-muted">Eigenaar</p>
                    </div>
                  </div>
                  <div className="aspect-square rounded-2xl bg-gradient-to-br from-aurora-2/10 via-concrete to-brand/10 flex items-center justify-center border border-hairline mt-8">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-brand/15 flex items-center justify-center mx-auto mb-3">
                        <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                      </div>
                      <p className="text-sm font-bold text-ink">Sander</p>
                      <p className="text-xs text-muted">Projectleider</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted text-center">Voeg hier uw teamfoto's toe in <code className="text-brand">/public/images/team/</code></p>
              </Reveal>

              {/* Contact details */}
              <div className="space-y-8">
                <Reveal>
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-surface border border-hairline flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1.5">Telefoon</p>
                      <a href={`tel:${contactInfo.phone}`} className="text-muted hover:text-brand transition-colors tabular text-lg">
                        {contactInfo.phoneDisplay}
                      </a>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={100}>
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-surface border border-hairline flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1.5">E-mail</p>
                      <a href={`mailto:${contactInfo.email}`} className="text-muted hover:text-brand transition-colors text-lg">
                        {contactInfo.email}
                      </a>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={200}>
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-surface border border-hairline flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1.5">Adres</p>
                      <p className="text-muted text-lg">{contactInfo.address}</p>
                    </div>
                  </div>
                </Reveal>

                <Reveal delay={300}>
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-surface border border-hairline flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink mb-1.5">Openingstijden</p>
                      <p className="text-muted text-lg">{contactInfo.hours}</p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* WhatsApp direct channel card */}
              <Reveal delay={400}>
                <a
                  href={waHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-5 p-6 bg-[#25D366]/8 border border-[#25D366]/25 rounded-2xl hover:border-[#25D366]/50 hover:bg-[#25D366]/12 transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shrink-0 shadow-lg shadow-[#25D366]/30 group-hover:scale-105 transition-transform">
                    <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-ink text-base mb-0.5 group-hover:text-[#1a9d52] transition-colors">
                      Direct via WhatsApp
                    </p>
                    <p className="text-sm text-muted leading-relaxed">
                      Vul het formulier in en stuur via WhatsApp voor een directe reactie.
                    </p>
                  </div>
                  <svg className="w-5 h-5 text-muted/50 shrink-0 group-hover:text-[#25D366] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </Reveal>
            </div>

            {/* Right — form */}
            <Reveal delay={150} variant="scale">
              <div className="bg-concrete rounded-2xl border border-hairline p-6 sm:p-8 lg:p-10">
                {submitted ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-5">
                      <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-ink mb-3">Bedankt voor uw aanvraag</h3>
                    <p className="text-muted mb-8">We nemen binnen 24 uur contact met u op.</p>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#25D366] text-white font-semibold rounded-full hover:bg-[#1da851] transition-colors text-sm"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      Stuur ook via WhatsApp
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleEmailSubmit} className="space-y-5">
                    {/* Pre-selected service info */}
                    {selectedService && (
                      <div className="p-4 bg-brand/5 border border-brand/20 rounded-xl mb-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-brand mb-1">Geselecteerde dienst</p>
                        <p className="text-sm font-bold text-ink">{selectedService.title}</p>
                        {form.product && (
                          <p className="text-sm text-muted mt-1">Product: {form.product}</p>
                        )}
                      </div>
                    )}

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-ink mb-2">
                          Naam *
                        </label>
                        <input
                          id="name"
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-hairline bg-base text-ink text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                          placeholder="Uw naam"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-ink mb-2">
                          E-mail *
                        </label>
                        <input
                          id="email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-hairline bg-base text-ink text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                          placeholder="uw@email.nl"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-semibold text-ink mb-2">
                          Telefoon
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-hairline bg-base text-ink text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
                          placeholder="06 1234 5678"
                        />
                      </div>
                      <div>
                        <label htmlFor="service" className="block text-sm font-semibold text-ink mb-2">
                          Dienst
                        </label>
                        <select
                          id="service"
                          value={form.service}
                          onChange={(e) => setForm({ ...form, service: e.target.value, product: "" })}
                          className="w-full px-4 py-3.5 rounded-xl border border-hairline bg-base text-ink text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all appearance-none"
                        >
                          <option value="">Kies een dienst</option>
                          {services.map((s) => (
                            <option key={s.slug} value={s.slug}>{s.title}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {selectedService && selectedService.products && selectedService.products.length > 0 && (
                      <div>
                        <label htmlFor="product" className="block text-sm font-semibold text-ink mb-2">
                          Product
                        </label>
                        <select
                          id="product"
                          value={form.product}
                          onChange={(e) => setForm({ ...form, product: e.target.value })}
                          className="w-full px-4 py-3.5 rounded-xl border border-hairline bg-base text-ink text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all appearance-none"
                        >
                          <option value="">Kies een product (optioneel)</option>
                          {selectedService.products.map((p) => (
                            <option key={p.name} value={p.name}>{p.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-ink mb-2">
                        Bericht
                      </label>
                      <textarea
                        id="message"
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3.5 rounded-xl border border-hairline bg-base text-ink text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all resize-none"
                        placeholder="Vertel ons over uw project..."
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
                    )}

                    {/* Dual submit — Email + WhatsApp */}
                    <div className="grid sm:grid-cols-2 gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center justify-center gap-2 py-4 bg-brand text-white text-sm font-semibold rounded-full hover:bg-brand-deep transition-all duration-300 hover:shadow-lg hover:shadow-brand/25 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {loading ? "Verzenden..." : "Offerte per e-mail"}
                      </button>

                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-4 bg-[#25D366] text-white text-sm font-semibold rounded-full hover:bg-[#1da851] transition-all duration-300 hover:shadow-lg hover:shadow-[#25D366]/25"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        Via WhatsApp
                      </a>
                    </div>

                    <p className="text-xs text-muted text-center pt-1">
                      Door te versturen gaat u akkoord met onze verwerking van uw gegevens.
                    </p>
                  </form>
                )}
              </div>
            </Reveal>
          </div>
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
