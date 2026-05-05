"use client";

import { useState } from "react";
import { contactInfo } from "@/lib/data";
import Reveal from "../components/Reveal";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // In production, connect to your backend or form service
  };

  return (
    <section id="contact" className="py-24 lg:py-32 bg-base">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left — info */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                Contact
              </span>
              <h2 className="text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink mb-6">
                Start uw
                <br />
                <span className="text-brand">project</span>
              </h2>
              <p className="text-muted leading-relaxed max-w-md mb-12">
                Vul het formulier in en we nemen binnen 24 uur contact met u op. Of bel direct voor een vrijblijvend gesprek.
              </p>
            </Reveal>

            <div className="space-y-6">
              <Reveal delay={100}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink mb-1">Telefoon</p>
                    <a href={`tel:${contactInfo.phone}`} className="text-muted hover:text-brand transition-colors tabular">
                      {contactInfo.phoneDisplay}
                    </a>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={180}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink mb-1">E-mail</p>
                    <a href={`mailto:${contactInfo.email}`} className="text-muted hover:text-brand transition-colors">
                      {contactInfo.email}
                    </a>
                  </div>
                </div>
              </Reveal>

              <Reveal delay={260}>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink mb-1">Adres</p>
                    <p className="text-muted">{contactInfo.address}</p>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Right — form */}
          <Reveal delay={150} variant="scale">
            <div className="bg-elevated rounded-2xl border border-border p-6 sm:p-8 lg:p-10">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-14 h-14 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-ink mb-2">Bedankt voor uw aanvraag</h3>
                  <p className="text-muted">We nemen binnen 24 uur contact met u op.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-ink mb-1.5">
                        Naam
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-base text-ink text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
                        placeholder="Uw naam"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-ink mb-1.5">
                        E-mail
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-base text-ink text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
                        placeholder="uw@email.nl"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-ink mb-1.5">
                        Telefoon
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-base text-ink text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors"
                        placeholder="06 1234 5678"
                      />
                    </div>
                    <div>
                      <label htmlFor="service" className="block text-sm font-medium text-ink mb-1.5">
                        Dienst
                      </label>
                      <select
                        id="service"
                        value={form.service}
                        onChange={(e) => setForm({ ...form, service: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-base text-ink text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors appearance-none"
                      >
                        <option value="">Kies een dienst</option>
                        <option value="warmtepomp">Warmtepomp</option>
                        <option value="zonnepanelen">Zonnepanelen</option>
                        <option value="airco">Airconditioning</option>
                        <option value="batterij">Batterijopslag</option>
                        <option value="vloerverwarming">Vloerverwarming</option>
                        <option value="meterkast">Meterkast</option>
                        <option value="lift">Liften</option>
                        <option value="overig">Overig</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-ink mb-1.5">
                      Bericht
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-base text-ink text-sm focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand transition-colors resize-none"
                      placeholder="Vertel ons over uw project..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-ink text-white text-sm font-semibold rounded-full hover:bg-brand transition-colors duration-200"
                  >
                    Offerte aanvragen
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
  );
}
