import Link from "next/link";
import Image from "next/image";
import { contactInfo } from "@/lib/data";
import Reveal from "./Reveal";

export default function Footer() {
  return (
    <footer>
      {/* Pre-footer CTA band — brand-blue, distinct from dark footer below */}
      <div className="bg-brand relative overflow-hidden">
        {/* Subtle background texture */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-brand-deep)/40,_transparent_60%)]" />
        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-8 py-20 lg:py-24 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2.5 text-[0.7rem] font-bold uppercase tracking-[0.2em] text-white/60 mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-white/50" />
              Klaar om te beginnen?
            </div>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display text-[clamp(2rem,5vw,3.75rem)] font-extrabold leading-[1.0] tracking-tight text-white mb-5">
              Klaar voor een duurzame woning?
            </h2>
          </Reveal>
          <Reveal delay={160}>
            <p className="text-white/75 text-lg max-w-xl mx-auto mb-10">
              Vraag vandaag nog een gratis en vrijblijvend adviesgesprek aan. Wij nemen binnen 24 uur contact op.
            </p>
          </Reveal>
          <Reveal delay={240}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact/"
                className="px-8 py-4 bg-white text-brand text-sm font-bold uppercase tracking-wide rounded-full hover:bg-hairline transition-all duration-200 shadow-lg shadow-ink/10"
              >
                Offerte aanvragen
              </Link>
              <a
                href={`tel:${contactInfo.phone}`}
                className="px-8 py-4 border-2 border-white/60 text-white text-sm font-bold uppercase tracking-wide rounded-full hover:border-white hover:bg-white/10 transition-all duration-200"
              >
                {contactInfo.phoneDisplay}
              </a>
            </div>
          </Reveal>
        </div>
      </div>

      {/* Footer navigation — carbon black, brand-blue accents */}
      <div className="bg-[#0d0d0d] text-white">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-16 lg:py-20">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">

            {/* Brand */}
            <Reveal className="lg:col-span-5">
              <div>
                <Image
                  src="/images/logo.png"
                  alt="MMC Techniek B.V."
                  width={200}
                  height={60}
                  className="h-14 w-auto object-contain mb-5"
                  style={{ filter: "brightness(0) invert(1) sepia(1) hue-rotate(165deg) saturate(3.5) brightness(0.95)" }}
                />
                <p className="text-sm text-white/40 leading-relaxed max-w-sm">
                  Specialist in warmtepompen, zonnepanelen, airco en complete verduurzaming.
                  Sinds 2008 actief vanuit Oudewater.
                </p>
              </div>
            </Reveal>

            {/* Navigatie */}
            <Reveal delay={100} className="lg:col-span-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-brand mb-5">
                  Navigatie
                </h4>
                <ul className="space-y-3 text-sm">
                  {[
                    { label: "Home", href: "/" },
                    { label: "Projecten", href: "/our-work/" },
                    { label: "Over ons", href: "/over-ons/" },
                    { label: "Contact", href: "/contact/" },
                    { label: "FAQ", href: "/veelgestelde-vragen/" },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-brand/55 hover:text-brand transition-colors duration-200">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            {/* Contact Info */}
            <Reveal delay={200} className="lg:col-span-3">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-brand mb-5">
                  Contactgegevens
                </h4>
                <ul className="space-y-3.5 text-sm">
                  <li>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="text-brand/55 hover:text-brand transition-colors duration-200"
                    >
                      {contactInfo.email}
                    </a>
                  </li>
                  <li className="text-white/40 leading-relaxed">
                    {contactInfo.address}
                  </li>
                  <li className="text-white/40">
                    {contactInfo.hours}
                  </li>
                </ul>
              </div>
            </Reveal>

            {/* KvK & BTW */}
            <Reveal delay={300} className="lg:col-span-2">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.18em] text-brand mb-5">
                  Bedrijfsinfo
                </h4>
                <ul className="space-y-3 text-sm">
                  <li className="text-white/35">
                    <span className="text-white/20">KvK:</span> {contactInfo.kvk}
                  </li>
                  <li className="text-white/35">
                    <span className="text-white/20">BTW:</span> {contactInfo.btw}
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-brand/10">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-8 py-6 text-center">
            <p className="text-white/20 text-xs">
              &copy; {new Date().getFullYear()} MMC Techniek B.V. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
