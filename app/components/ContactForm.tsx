"use client";

import { useState } from "react";
import { contactInfo } from "@/lib/data";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    telefoon: "",
    postcode: "",
    onderwerp: "",
    bericht: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Aanvraag via website: ${formData.onderwerp || "Offerte"}`);
    const body = encodeURIComponent(
      `Naam: ${formData.naam}\nE-mail: ${formData.email}\nTelefoon: ${formData.telefoon}\nPostcode: ${formData.postcode}\n\nBericht:\n${formData.bericht}`
    );
    window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-concrete p-8 lg:p-10 text-center">
        <div className="w-16 h-16 bg-brand text-base flex items-center justify-center mx-auto mb-6 rounded-full">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-[1.25rem] font-bold text-ink mb-3">Bericht verstuurd</h3>
        <p className="text-[0.9375rem] text-copy/80 mb-6">
          Bedankt voor uw aanvraag. We nemen binnen 24 uur contact met u op.
        </p>
        <p className="text-[0.875rem] text-muted">
          Geen e-mailprogramma geopend? Stuur ons direct een bericht naar{" "}
          <a href={`mailto:${contactInfo.email}`} className="text-brand hover:underline">
            {contactInfo.email}
          </a>{" "}
          of bel{" "}
          <a href={`tel:${contactInfo.phone}`} className="text-brand hover:underline">
            {contactInfo.phoneDisplay}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="naam" className="sr-only">Naam</label>
          <input
            id="naam"
            type="text"
            name="naam"
            required
            placeholder="Naam *"
            value={formData.naam}
            onChange={handleChange}
            className="w-full px-5 py-4 bg-concrete border-0 text-[0.875rem] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand transition-shadow font-sans"
          />
        </div>
        <div>
          <label htmlFor="email" className="sr-only">E-mail</label>
          <input
            id="email"
            type="email"
            name="email"
            required
            placeholder="E-mail *"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-5 py-4 bg-concrete border-0 text-[0.875rem] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand transition-shadow font-sans"
          />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="telefoon" className="sr-only">Telefoonnummer</label>
          <input
            id="telefoon"
            type="tel"
            name="telefoon"
            placeholder="Telefoonnummer"
            value={formData.telefoon}
            onChange={handleChange}
            className="w-full px-5 py-4 bg-concrete border-0 text-[0.875rem] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand transition-shadow font-sans"
          />
        </div>
        <div>
          <label htmlFor="postcode" className="sr-only">Postcode / Woonplaats</label>
          <input
            id="postcode"
            type="text"
            name="postcode"
            placeholder="Postcode / Woonplaats"
            value={formData.postcode}
            onChange={handleChange}
            className="w-full px-5 py-4 bg-concrete border-0 text-[0.875rem] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand transition-shadow font-sans"
          />
        </div>
      </div>
      <div>
        <label htmlFor="onderwerp" className="sr-only">Onderwerp</label>
        <input
          id="onderwerp"
          type="text"
          name="onderwerp"
          placeholder="Onderwerp"
          value={formData.onderwerp}
          onChange={handleChange}
          className="w-full px-5 py-4 bg-concrete border-0 text-[0.875rem] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand transition-shadow font-sans"
        />
      </div>
      <div>
        <label htmlFor="bericht" className="sr-only">Bericht</label>
        <textarea
          id="bericht"
          name="bericht"
          rows={5}
          required
          placeholder="Vertel ons over uw project... *"
          value={formData.bericht}
          onChange={handleChange}
          className="w-full px-5 py-4 bg-concrete border-0 text-[0.875rem] text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand resize-none transition-shadow font-sans"
        />
      </div>
      <button
        type="submit"
        className="w-full sm:w-auto px-8 py-4 bg-ink text-base text-[0.75rem] font-bold uppercase tracking-[0.09em] font-sans rounded-full hover:bg-brand transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-base"
      >
        Verstuur aanvraag
      </button>
    </form>
  );
}
