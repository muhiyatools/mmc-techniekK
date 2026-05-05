import Link from "next/link";
import Image from "next/image";
import { navLinks, contactInfo } from "@/lib/data";

const footerNav = navLinks.filter((l) => l.href !== "/");

export default function Footer() {
  return (
    <footer className="bg-ink" aria-label="Sitefooter">

      {/* Brand accent bar — same motif as PageHero */}
      <div className="h-[3px] bg-brand" aria-hidden="true" />

      {/* ── Main body ── */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-20 lg:pt-28 pb-16 lg:pb-20">
        <div className="grid lg:grid-cols-[1fr_200px_220px] gap-16 lg:gap-12 xl:gap-20">

          {/* ── Left: typographic CTA ── */}
          <div>
            <p className="text-[0.6125rem] font-bold uppercase tracking-[0.18em] text-base/35 font-sans mb-7">
              Klaar om te beginnen?
            </p>

            <h2
              className="font-display font-extrabold uppercase leading-[0.84] tracking-tight text-base mb-10"
              style={{ fontSize: "clamp(2.75rem, 6vw, 5.25rem)" }}
            >
              VRAAG EEN
              <br />
              GRATIS
              <br />
              <span className="text-brand">OFFERTE AAN.</span>
            </h2>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-7 py-[0.9375rem] bg-brand text-base font-sans text-[0.6875rem] font-bold uppercase tracking-[0.1em] rounded-full hover:bg-brand-deep transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-base"
              >
                Offerte aanvragen
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <a
                href={`tel:${contactInfo.phone}`}
                className="inline-flex items-center justify-center px-7 py-[0.9375rem] rounded-full border border-base/20 text-base font-sans text-[0.6875rem] font-bold uppercase tracking-[0.1em] hover:border-base/50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand"
              >
                Bel {contactInfo.phoneDisplay}
              </a>
            </div>
          </div>

          {/* ── Navigation column ── */}
          <div>
            <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-base/30 font-sans mb-6">
              Navigatie
            </p>
            <ul className="space-y-3">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.8125rem] text-base/55 hover:text-base font-sans transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact + hours ── */}
          <div>
            <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-base/30 font-sans mb-6">
              Contact
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="text-[0.8125rem] text-base/55 hover:text-base font-sans transition-colors duration-200"
                >
                  {contactInfo.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-[0.8125rem] text-base/55 hover:text-base font-sans transition-colors duration-200 break-all"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li>
                <address className="not-italic text-[0.8125rem] text-base/55 font-sans leading-snug">
                  {contactInfo.address}
                </address>
              </li>
            </ul>

            <div className="mt-8 pt-8 border-t border-base/10">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.18em] text-base/30 font-sans mb-3">
                Openingstijden
              </p>
              <p className="text-[0.8125rem] text-base/55 font-sans leading-[1.7]">
                Maandag t/m vrijdag<br />
                09:00 &ndash; 18:00
              </p>
              <p className="text-[0.6875rem] text-base/25 font-sans mt-5 space-y-1 leading-snug">
                KvK&nbsp;{contactInfo.kvk}<br />
                BTW&nbsp;{contactInfo.btw}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* ── Bottom bar ── */}
      <div className="border-t border-base/10">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">

          {/* Logo */}
          <Link
            href="/"
            className="shrink-0 focus:outline-none focus:ring-2 focus:ring-brand"
            aria-label="MMC Techniek B.V. — home"
          >
            <Image
              src="/images/logo.png"
              alt="MMC Techniek B.V."
              width={120}
              height={36}
              className="h-7 w-auto object-contain"
              style={{ filter: "brightness(0) invert(0.45)" }}
            />
          </Link>

          <p className="text-[0.6875rem] text-base/30 font-sans order-last sm:order-none">
            &copy; {new Date().getFullYear()} MMC Techniek B.V. Alle rechten voorbehouden.
          </p>

          {/* Social — text links, no icon soup */}
          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com/mmctechniek/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-base/30 hover:text-base transition-colors duration-200 font-sans focus:outline-none focus:ring-1 focus:ring-brand"
              aria-label="MMC Techniek op Instagram"
            >
              Instagram
            </a>
            <span className="block w-px h-3 bg-base/15" aria-hidden="true" />
            <a
              href="https://m.facebook.com/profile.php?id=100064674913125"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.6875rem] font-bold uppercase tracking-[0.12em] text-base/30 hover:text-base transition-colors duration-200 font-sans focus:outline-none focus:ring-1 focus:ring-brand"
              aria-label="MMC Techniek op Facebook"
            >
              Facebook
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
