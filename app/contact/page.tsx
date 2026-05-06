"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { contactInfo, services } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import Reveal from "../components/Reveal";

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

  // Get selected service data
  const selectedService = services.find((s) => s.slug === form.service);

  const handleSubmit = async (e: React.FormEvent) => {
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
                Vul het formulier in en we nemen binnen 24 uur contact met u op. Of bel direct voor een vrijblijvend gesprek.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Contact section */}
      <section className="pb-28 lg:pb-36 bg-base">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
            {/* Left — info */}
            <div>
              <div className="space-y-8">
                <Reveal>
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
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
                    <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
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
                    <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
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
                    <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
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
            </div>

            {/* Right — form */}
            <Reveal delay={150} variant="scale">
              <div className="bg-elevated rounded-2xl border border-border p-6 sm:p-8 lg:p-10">
                {submitted ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-5">
                      <svg className="w-8 h-8 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-ink mb-3">Bedankt voor uw aanvraag</h3>
                    <p className="text-muted">We nemen binnen 24 uur contact met u op.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
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
                          className="w-full px-4 py-3.5 rounded-xl border border-border bg-base text-ink text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
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
                          className="w-full px-4 py-3.5 rounded-xl border border-border bg-base text-ink text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
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
                          className="w-full px-4 py-3.5 rounded-xl border border-border bg-base text-ink text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all"
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
                          className="w-full px-4 py-3.5 rounded-xl border border-border bg-base text-ink text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all appearance-none"
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
                          className="w-full px-4 py-3.5 rounded-xl border border-border bg-base text-ink text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all appearance-none"
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
                        className="w-full px-4 py-3.5 rounded-xl border border-border bg-base text-ink text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/10 transition-all resize-none"
                        placeholder="Vertel ons over uw project..."
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-brand text-white text-sm font-semibold rounded-full hover:bg-brand-hover transition-all duration-300 hover:shadow-lg hover:shadow-brand/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? "Verzenden..." : "Offerte aanvragen"}
                    </button>

                    <p className="text-xs text-muted text-center">
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
