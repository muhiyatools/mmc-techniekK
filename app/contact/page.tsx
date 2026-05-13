"use client";

import { useState, Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { contactInfo, services as baseServices, testimonials, certifications, type Service } from "@/lib/data";
import { supabase } from "@/lib/supabase";
import { fetchAdminStore, mergeServices } from "@/lib/adminStore";
import Reveal from "../_ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { resolveProductImage } from "@/lib/images";

const WA_PHONE = "31634311225";

function buildWhatsAppMessage(form: {
  name: string; email: string; phone: string;
  service: string; product: string; message: string;
}, allServices: Service[], t: any) {
  const serviceLabel = allServices.find((s) => s.slug === form.service)?.title ?? form.service;
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

const labelClass = "block text-[11px] font-bold uppercase tracking-[0.15em] text-ink mb-2";
const inputClass =
  "w-full px-5 py-4 border border-hairline bg-concrete/30 text-ink text-sm rounded-2xl focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all placeholder:text-muted/30";
const selectClass =
  "w-full px-5 py-4 pr-12 border border-hairline bg-concrete/30 text-ink text-sm rounded-2xl focus:outline-none focus:border-brand focus:ring-4 focus:ring-brand/5 transition-all appearance-none cursor-pointer";

function ContactForm() {
  const { t, language } = useLanguage();
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");
  const productParam = searchParams.get("product");
  const [services, setServices] = useState<Service[]>(baseServices);

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

  useEffect(() => {
    fetchAdminStore().then((store) => {
      setServices(mergeServices(store));
    });
  }, []);

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

  const waHref = `https://wa.me/${WA_PHONE}?text=${buildWhatsAppMessage(form, services, t)}`;

  return (
    <>
      {/* Immersive Header */}
      <section className="pt-[120px] lg:pt-[180px] pb-12 bg-bg relative overflow-hidden">
        {/* Decorative mesh */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-px bg-brand" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand">{t.nav.contact}</span>
            </div>
          </Reveal>
          <div className="grid lg:grid-cols-2 gap-12 items-end">
            <div>
              <Reveal delay={100}>
                <h1 className="font-display text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold leading-[0.9] tracking-tighter text-ink mb-6">
                  {t.contact.title.split(" ").map((word, i) => (
                    <span key={i} className={i === t.contact.title.split(" ").length - 1 ? "text-brand" : ""}>{word} </span>
                  ))}
                </h1>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-lg lg:text-xl text-muted leading-relaxed max-w-xl">
                  {t.contact.description}
                </p>
              </Reveal>
            </div>
            
            <div className="hidden lg:flex flex-col items-end gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-12 h-12 rounded-full border-4 border-base bg-concrete overflow-hidden relative">
                    <Image src={`/images/partners/partner-${i}.png`} alt="Client" fill className="object-cover grayscale" />
                  </div>
                ))}
              </div>
              <p className="text-xs font-bold text-ink/40 uppercase tracking-widest">
                Vertrouwd door 2500+ huishoudens
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-32 bg-bg">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-16 items-start">
            
            {/* Form Section */}
            <Reveal delay={300} className="lg:col-span-8">
              <div className="bg-white border border-hairline rounded-[2.5rem] shadow-2xl shadow-ink/5 overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-aurora-1 via-brand to-aurora-2" />
                
                {submitted ? (
                  <div className="p-12 lg:p-20 text-center py-24">
                    <div className="w-20 h-20 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-8">
                      <svg className="w-10 h-10 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="font-display text-3xl font-extrabold text-ink mb-4">{t.contact.form.successTitle}</h3>
                    <p className="text-muted mb-10 max-w-md mx-auto text-lg leading-relaxed">
                      {t.contact.form.successDescription}
                    </p>
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 px-10 py-5 bg-[#25D366] text-white font-bold rounded-full hover:scale-105 transition-all text-sm uppercase tracking-widest shadow-lg shadow-[#25D366]/20"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                      {t.contact.form.whatsappSuccess}
                    </a>
                  </div>
                ) : (
                  <form onSubmit={handleEmailSubmit} className="p-8 lg:p-12">
                    {/* Section: Who are you? */}
                    <div className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                        <h4 className="text-sm font-bold text-ink uppercase tracking-widest">1. Contactgegevens</h4>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6">
                        <div className="sm:col-span-2">
                          <label htmlFor="name" className={labelClass}>{t.contact.form.name}</label>
                          <input
                            id="name"
                            type="text"
                            required
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className={inputClass}
                            placeholder="Volledige naam"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className={labelClass}>{t.contact.form.email}</label>
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
                          <label htmlFor="phone" className={labelClass}>{t.contact.form.phone}</label>
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
                    </div>

                    {/* Section: What do you need? */}
                    <div className="mb-12">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                        <h4 className="text-sm font-bold text-ink uppercase tracking-widest">2. Projectdetails</h4>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-6 mb-6">
                        <div>
                          <label htmlFor="service" className={labelClass}>{t.contact.form.service}</label>
                          <div className="relative">
                            <select
                              id="service"
                              value={form.service}
                              onChange={(e) => setForm({ ...form, service: e.target.value, product: "" })}
                              className={selectClass}
                            >
                              <option value="">{language === "nl" ? "Selecteer een dienst" : "Select a service"}</option>
                              {services.map((s) => (
                                <option key={s.slug} value={s.slug}>{s.title}</option>
                              ))}
                            </select>
                            <svg className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                        <div>
                          <label htmlFor="product" className={labelClass}>
                            {t.contact.form.product} <span className="text-muted/50 font-normal lowercase tracking-normal">{t.contact.form.productOptional}</span>
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
                                  ? (language === "nl" ? "Kies eerst een dienst" : "Choose a service first")
                                  : selectedService.products.length === 0
                                  ? (language === "nl" ? "Geen producten beschikbaar" : "No products available")
                                  : (language === "nl" ? "Selecteer een product" : "Select a product")}
                              </option>
                              {selectedService?.products.map((p) => (
                                <option key={p.name} value={p.name}>{p.name}</option>
                              ))}
                            </select>
                            <svg className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      {/* Selected product context fixed */}
                      {selectedProduct && (
                        <Reveal>
                          <div className="mb-8 p-6 bg-brand/5 border border-brand/10 rounded-3xl flex items-center gap-6">
                            <div className="relative w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-white border border-hairline shadow-inner">
                              <Image
                                src={resolveProductImage(selectedProduct.image)}
                                alt={selectedProduct.name}
                                fill
                                className="object-cover"
                                sizes="96px"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-brand mb-1">Geselecteerd product</p>
                              <p className="text-lg font-bold text-ink mb-1 truncate">{selectedProduct.name}</p>
                              <p className="text-sm text-muted font-medium">
                                {selectedProduct.brand} · <span className="text-brand">{selectedProduct.price ?? "Prijs op aanvraag"}</span>
                              </p>
                            </div>
                          </div>
                        </Reveal>
                      )}

                      <div>
                        <label htmlFor="message" className={labelClass}>{t.contact.form.message}</label>
                        <textarea
                          id="message"
                          rows={4}
                          value={form.message}
                          onChange={(e) => setForm({ ...form, message: e.target.value })}
                          className={`${inputClass} resize-none`}
                          placeholder={t.contact.form.placeholderMessage}
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="p-4 mb-8 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {error}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center gap-3 py-5 bg-ink text-white text-sm font-bold uppercase tracking-widest rounded-full hover:bg-brand transition-all duration-300 disabled:opacity-50 shadow-xl shadow-ink/10"
                      >
                        {loading ? t.contact.form.submitting : t.contact.form.submit}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </button>
                      <a
                        href={waHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-3 px-8 py-5 bg-[#25D366] text-white text-sm font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-all shadow-xl shadow-[#25D366]/10"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                        </svg>
                        WhatsApp
                      </a>
                    </div>
                    <p className="text-[10px] text-muted text-center mt-6 font-medium">
                      {t.contact.form.privacyNote}
                    </p>
                  </form>
                )}
              </div>
            </Reveal>

            {/* Sidebar Section */}
            <div className="lg:col-span-4 space-y-10">
              {/* Testimonial Shelf */}
              <Reveal delay={400}>
                <div className="relative group">
                  <div className="absolute -inset-4 bg-brand/5 rounded-[2.5rem] scale-95 group-hover:scale-100 transition-transform duration-500" />
                  <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl">
                    <Image
                      src="/images/projects/PHOTO-2024-12-03-12-54-01.jpg"
                      alt="MMC Techniek project"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />
                    <div className="absolute bottom-0 p-8">
                      <div className="flex gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg key={s} className="w-4 h-4 text-brand" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <p className="text-white/90 text-lg leading-relaxed italic mb-6">
                        &ldquo;Heel goed geholpen, enorm blij met het resultaat. Professioneel en netjes opgeleverd.&rdquo;
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-brand/20 flex items-center justify-center text-brand font-bold">SZ</div>
                        <div>
                          <p className="text-white text-sm font-bold">Sabina Zondag</p>
                          <p className="text-white/40 text-[10px] uppercase tracking-widest">Klant uit Oudewater</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Contact Details Shelf */}
              <Reveal delay={500}>
                <div className="bg-concrete/40 border border-hairline rounded-[2rem] p-8 space-y-8">
                  {[
                    {
                      label: t.contact.sidebar.phone,
                      value: contactInfo.phoneDisplay,
                      href: `tel:${contactInfo.phone}`,
                      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    },
                    {
                      label: t.contact.sidebar.email,
                      value: contactInfo.email,
                      href: `mailto:${contactInfo.email}`,
                      icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    },
                    {
                      label: t.contact.sidebar.address,
                      value: contactInfo.address,
                      icon: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></>
                    }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-hairline flex items-center justify-center shrink-0 text-brand shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{item.icon}</svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">{item.label}</p>
                        {item.href ? (
                          <a href={item.href} className="text-base font-bold text-ink hover:text-brand transition-colors">{item.value}</a>
                        ) : (
                          <p className="text-base font-bold text-ink">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Quick Trust Badges */}
                  <div className="pt-4 flex items-center gap-6 opacity-30">
                    {certifications.map((c) => (
                      <div key={c.name} className="relative w-12 h-12 grayscale">
                        <Image src={c.src} alt={c.name} fill className="object-contain" />
                      </div>
                    ))}
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-link Section */}
      <section className="bg-ink py-24 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex flex-col items-center text-center">
          <Reveal>
            <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-white mb-6">
              {language === "nl" ? "Klaar om te verduurzamen?" : "Ready to go sustainable?"}
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-white/60 text-lg mb-10 max-w-xl">
              {language === "nl" 
                ? "Ontdek ons volledige aanbod aan warmtepompen, zonnepanelen en meer."
                : "Discover our full range of heat pumps, solar panels and more."}
            </p>
          </Reveal>
          <Reveal delay={200}>
            <Link
              href="/aanbod/"
              className="px-12 py-5 border border-white/20 text-white font-bold rounded-full hover:bg-white/10 transition-all uppercase tracking-widest text-sm"
            >
              {t.nav.aanbod}
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <ContactForm />
    </Suspense>
  );
}
