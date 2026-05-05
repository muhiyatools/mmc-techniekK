import type { Metadata } from "next";
import Image from "next/image";
import FadeIn from "../components/FadeIn";
import PageHero from "../components/PageHero";
import ContactForm from "../components/ContactForm";
import { contactInfo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Neem contact op met MMC Techniek B.V. uit Oudewater. Bel 06 3431 1225 of vul het formulier in voor een vrijblijvend adviesgesprek.",
  openGraph: {
    title: "Contact | MMC Techniek B.V.",
    description:
      "Heeft u vragen of wilt u een vrijblijvend adviesgesprek? We staan voor u klaar.",
  },
  alternates: {
    canonical: "https://mmctechniek.nl/contact",
  },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        title="Neem contact op"
        description="Heeft u vragen of wilt u een vrijblijvend adviesgesprek? We staan voor u klaar."
        image="/images/services/vloerverwarming.webp"
        imageAlt="Vloerverwarming installatie door MMC Techniek"
        breadcrumbItems={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />

      {/* Form + Info */}
      <section className="py-24 lg:py-32 bg-base" aria-labelledby="contact-form-heading">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">

            {/* Left: form */}
            <FadeIn>
              <div>
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.13em] text-brand font-sans mb-4">
                  Direct contact
                </p>
                <h2
                  id="contact-form-heading"
                  className="font-display font-bold uppercase leading-[0.9] tracking-tight text-ink mb-6"
                  style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
                >
                  Stuur ons een bericht
                </h2>
                <p className="text-[1rem] leading-[1.72] text-copy/80 mb-10 font-sans">
                  Heeft u vragen over warmtepompen, zonnepanelen of een andere installatie? Vul het formulier in en we nemen binnen 24 uur contact met u op.
                </p>
                <ContactForm />
              </div>
            </FadeIn>

            {/* Right: contact info + map */}
            <FadeIn delay={80} direction="right">
              <div>
                <p className="text-[0.75rem] font-bold uppercase tracking-[0.13em] text-brand font-sans mb-4">
                  Bereikbaarheid
                </p>
                <h2
                  className="font-display font-bold uppercase leading-[0.9] tracking-tight text-ink mb-8"
                  style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
                >
                  Bezoek ons in Oudewater
                </h2>

                {/* Contact details */}
                <div className="space-y-5 mb-10">
                  {[
                    {
                      label: "Adres",
                      value: contactInfo.address,
                      href: "https://maps.google.com/?q=Heemraadsingel+11+3421+VG+Oudewater",
                      icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z",
                    },
                    {
                      label: "Telefoon",
                      value: contactInfo.phoneDisplay,
                      href: `tel:${contactInfo.phone}`,
                      icon: "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
                    },
                    {
                      label: "E-mail",
                      value: contactInfo.email,
                      href: `mailto:${contactInfo.email}`,
                      icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
                    },
                    {
                      label: "Openingstijden",
                      value: contactInfo.hours,
                      href: null,
                      icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-ink text-brand flex items-center justify-center shrink-0 mt-0.5 rounded-full">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                        </svg>
                      </div>
                      <div>
                        <p className="text-[0.6875rem] font-bold uppercase tracking-[0.1em] text-muted font-sans mb-0.5">
                          {item.label}
                        </p>
                        {item.href ? (
                          <a
                            href={item.href}
                            target={item.href.startsWith("http") ? "_blank" : undefined}
                            rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="text-[0.9375rem] text-ink hover:text-brand transition-colors font-sans"
                          >
                            {item.value}
                          </a>
                        ) : (
                          <p className="text-[0.9375rem] text-ink font-sans">{item.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Map */}
                <div className="overflow-hidden rounded-2xl">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2451.1234567890123!2d4.8696!3d52.0293!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTLCsDAxJzQ1LjUiTiA0wrA1MicxMC41IkU!5e0!3m2!1snl!2snl!4v1234567890123"
                    width="100%"
                    height="320"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="MMC Techniek BV locatie in Oudewater"
                  />
                </div>
              </div>
            </FadeIn>

          </div>
        </div>
      </section>
    </>
  );
}
