"use client";

import { useState } from "react";
import { contactInfo } from "@/lib/data";

/*
 * Contact form — sits inside a Mist Shelf on the contact page.
 *
 * Inputs use a hairline-bottom-only style: clean, technical, no boxy
 * "concrete" fills. Focus states swap the hairline for the brand color
 * and add a 1px brand inset shadow.
 */
const inputClass =
  "block w-full bg-transparent border-0 border-b border-hairline px-0 py-3 text-[0.9375rem] text-ink placeholder:text-muted/85 font-sans transition-colors duration-200 focus:outline-none focus:border-brand focus:placeholder:text-muted/40";

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Aanvraag via website: ${formData.onderwerp || "Offerte"}`,
    );
    const body = encodeURIComponent(
      `Naam: ${formData.naam}\nE-mail: ${formData.email}\nTelefoon: ${formData.telefoon}\nPostcode: ${formData.postcode}\n\nBericht:\n${formData.bericht}`,
    );
    window.location.href = `mailto:${contactInfo.email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        className="relative shelf p-8 lg:p-10"
        role="status"
        aria-live="polite"
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--color-aurora-1) 28%, var(--color-brand) 50%, var(--color-aurora-2) 72%, transparent 100%)",
          }}
        />
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
        <Field id="naam" label="Naam" required value={formData.naam} onChange={handleChange} />
        <Field
          id="email"
          type="email"
          label="E-mailadres"
          required
          value={formData.email}
          onChange={handleChange}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-7">
        <Field
          id="telefoon"
          type="tel"
          label="Telefoonnummer"
          value={formData.telefoon}
          onChange={handleChange}
        />
        <Field
          id="postcode"
          label="Postcode of woonplaats"
          value={formData.postcode}
          onChange={handleChange}
        />
      </div>
      <Field
        id="onderwerp"
        label="Onderwerp"
        value={formData.onderwerp}
        onChange={handleChange}
      />
      <div>
        <label
          htmlFor="bericht"
          className="block text-[0.625rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-2"
        >
          Bericht <span className="text-brand">*</span>
        </label>
        <textarea
          id="bericht"
          name="bericht"
          required
          rows={5}
          value={formData.bericht}
          onChange={handleChange}
          className={`${inputClass} resize-none`}
          placeholder="Vertel kort waar het over gaat"
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
        <button
          type="submit"
          className="group inline-flex items-center justify-center gap-2 px-7 py-[0.9375rem] bg-ink text-base text-[0.6875rem] font-bold uppercase tracking-[0.12em] font-sans rounded-full hover:bg-brand transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-mist"
        >
          Bericht versturen
          <span
            aria-hidden="true"
            className="block w-[5px] h-[5px] rounded-full bg-base/85 transition-transform duration-200 group-hover:translate-x-0.5"
          />
        </button>

        <p className="text-[0.6875rem] text-muted font-sans">
          Reactie binnen 24 uur · Velden met <span className="text-brand">*</span> zijn verplicht
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
}: {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[0.625rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-2"
      >
        {label} {required && <span className="text-brand">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className={inputClass}
      />
    </div>
  );
}
