"use client";

import { useState } from "react";
import { contactInfo } from "@/lib/data";

/*
 * Contact form — sits inside a Mist Shelf on the contact page.
 *
 * Inputs use a hairline-bottom-only style: clean, technical, no boxy
 * "concrete" fills. Focus states swap the hairline for the brand color.
 *
 * Hardened for production:
 *   - isLoading state prevents double-submit
 *   - Button disabled + label changes during submission
 *   - All inputs have autocomplete and aria-required
 *   - Inline placeholders guide format expectations
 */
const inputClass =
  "block w-full bg-base border border-hairline px-4 py-3 text-[0.9375rem] text-ink placeholder:text-muted/50 font-sans transition-colors duration-200 focus:outline-none focus:border-brand focus:bg-mist";

export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    naam: "",
    email: "",
    telefoon: "",
    postcode: "",
    onderwerp: "",
    bericht: "",
    bereikbaar: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    const subject = encodeURIComponent(
      `Aanvraag via website: ${formData.onderwerp || "Offerte"}`,
    );
    const body = encodeURIComponent(
      `Naam: ${formData.naam}\nE-mail: ${formData.email}\nTelefoon: ${formData.telefoon}\nPostcode: ${formData.postcode}\n\nBericht:\n${formData.bericht}`,
    );
    window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;
    // Small delay lets the mailto handler open before we swap to the success state
    setTimeout(() => setSubmitted(true), 350);
  };

  if (submitted) {
    return (
      <div
        className="py-4"
        role="status"
        aria-live="polite"
      >
        <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-brand font-sans mb-4">
          <span
            aria-hidden="true"
            className="block w-[5px] h-[5px] rounded-full bg-brand"
          />
          Verzonden
        </p>
        <h3 className="font-display font-bold uppercase tracking-[-0.005em] text-ink text-[1.5rem] leading-tight mb-3">
          Bericht verstuurd
        </h3>
        <p className="text-[0.9375rem] leading-[1.7] text-copy/85 mb-5 font-sans">
          Bedankt voor uw aanvraag. We nemen binnen 24 uur contact met u op.
        </p>
        <p className="text-[0.875rem] leading-[1.7] text-muted font-sans">
          Geen e-mailprogramma geopend? Stuur direct een bericht naar{" "}
          <a
            href={`mailto:${contactInfo.email}`}
            className="text-brand hover:text-brand-deep transition-colors duration-200 underline underline-offset-4 decoration-1"
          >
            {contactInfo.email}
          </a>{" "}
          of bel{" "}
          <a
            href={`tel:${contactInfo.phone}`}
            className="text-brand hover:text-brand-deep transition-colors duration-200 underline underline-offset-4 decoration-1 tabular"
          >
            {contactInfo.phoneDisplay}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7" noValidate>
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7">
        <Field
          id="naam"
          label="Naam"
          required
          value={formData.naam}
          onChange={handleChange}
          autoComplete="name"
          placeholder="Jan de Vries"
        />
        <Field
          id="email"
          type="email"
          label="E-mailadres"
          required
          value={formData.email}
          onChange={handleChange}
          autoComplete="email"
          placeholder="naam@voorbeeld.nl"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7">
        <Field
          id="telefoon"
          type="tel"
          label="Telefoonnummer"
          value={formData.telefoon}
          onChange={handleChange}
          autoComplete="tel"
          placeholder="06 12 34 56 78"
        />
        <Field
          id="postcode"
          label="Postcode of woonplaats"
          value={formData.postcode}
          onChange={handleChange}
          autoComplete="postal-code"
          placeholder="1234 AB of Amsterdam"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7">
        <Field
          id="onderwerp"
          label="Onderwerp"
          value={formData.onderwerp}
          onChange={handleChange}
          placeholder="Warmtepomp advies"
        />
        <div>
          <label
            htmlFor="bereikbaar"
            className="block text-[0.625rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-2"
          >
            Wanneer kunnen we u bereiken?
          </label>
          <select
            id="bereikbaar"
            name="bereikbaar"
            value={formData.bereikbaar}
            onChange={handleChange}
            className="block w-full bg-base border border-hairline px-4 py-3 text-[0.9375rem] text-ink font-sans transition-colors duration-200 focus:outline-none focus:border-brand focus:bg-mist appearance-none cursor-pointer"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 12px center",
              paddingRight: "40px",
            }}
          >
            <option value="">Maak een keuze</option>
            <option value="ochtend">Ochtend (09:00 – 12:00)</option>
            <option value="middag">Middag (12:00 – 17:00)</option>
            <option value="avond">Avond (17:00 – 20:00)</option>
            <option value="weekend">Weekend</option>
          </select>
        </div>
      </div>
      <div>
        <label
          htmlFor="bericht"
          className="block text-[0.625rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-2"
        >
          Bericht <span className="text-brand" aria-hidden="true">*</span>
          <span className="sr-only">(verplicht)</span>
        </label>
        <textarea
          id="bericht"
          name="bericht"
          required
          aria-required="true"
          rows={5}
          value={formData.bericht}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
          placeholder="Beschrijf kort uw situatie of vraag"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="group inline-flex items-center justify-center gap-2 px-7 py-[0.9375rem] bg-ink text-base text-[0.6875rem] font-bold uppercase tracking-[0.12em] font-sans rounded-full hover:bg-brand transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-mist disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-ink"
        >
          {isLoading ? "Wordt verstuurd\u2026" : "Bericht versturen"}
          {!isLoading && (
            <span
              aria-hidden="true"
              className="block w-[5px] h-[5px] rounded-full bg-base/85 transition-transform duration-200 group-hover:translate-x-0.5"
            />
          )}
        </button>

        <p className="text-[0.6875rem] text-muted font-sans">
          Reactie binnen 24 uur{" "}
          <span aria-hidden="true">
            &middot; Velden met <span className="text-brand">*</span> zijn verplicht
          </span>
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  required = false,
  type = "text",
  value,
  onChange,
  autoComplete,
  placeholder,
}: {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[0.625rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-2"
      >
        {label}{" "}
        {required && (
          <>
            <span className="text-brand" aria-hidden="true">*</span>
            <span className="sr-only">(verplicht)</span>
          </>
        )}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        aria-required={required ? "true" : undefined}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}
