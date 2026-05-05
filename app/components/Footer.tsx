import Link from "next/link";
import Image from "next/image";
import { navLinks, contactInfo } from "@/lib/data";

const footerNav = navLinks.filter((l) => l.href !== "/");

/*
 * Footer — the brand finale. A saturated Brand-deep block (not Ink),
 * topped with an Aurora hairline. Provides contrast without going dark.
 */
export default function Footer() {
  return (
    <footer
      className="relative bg-brand-deep"
      aria-label="Sitefooter"
      style={{
        // Slight inner glow toward Brand for depth without shadow
        backgroundImage:
          "radial-gradient(120% 80% at 30% 0%, color-mix(in oklch, var(--color-brand) 35%, transparent) 0%, transparent 60%)",
      }}
    >
      {/* Aurora hairline at the very top edge */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, var(--color-aurora-1) 24%, var(--color-base) 50%, var(--color-aurora-2) 76%, transparent 100%)",
          backgroundSize: "200% 100%",
          animation: "aurora-drift 22s linear infinite",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-20 lg:pt-28 pb-12 lg:pb-16">
        <div className="grid lg:grid-cols-[1fr_180px_220px] gap-14 lg:gap-12 xl:gap-20">

          {/* Typographic CTA */}
          <div>
            <p className="inline-flex items-center gap-2 text-[0.625rem] font-bold uppercase tracking-[0.22em] text-base/55 font-sans mb-7">
              <span
                aria-hidden="true"
                className="block w-[5px] h-[5px] rounded-full bg-base"
              />
              Klaar om te beginnen
            </p>

            <h2
              className="font-display font-extrabold uppercase leading-[0.86] tracking-[-0.015em] text-base mb-10 max-w-[14ch]"
              style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.75rem)" }}
            >
              Vraag een gratis<br />
              offerte aan.
            </h2>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md">
              <Link
                href="/contact"
                className="group inline-flex items-center justify-center gap-2 px-7 py-[0.9375rem] bg-base text-ink font-sans text-[0.6875rem] font-bold uppercase tracking-[0.1em] rounded-full hover:bg-base/90 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-base focus-visible:ring-offset-2 focus-visible:ring-offset-brand-deep"
              >
                Offerte aanvragen
                <span
                  aria-hidden="true"
                  className="block w-[5px] h-[5px] rounded-full bg-brand transition-transform duration-200 group-hover:translate-x-0.5"
                />
              </Link>
              <a
                href={`tel:${contactInfo.phone}`}
                className="inline-flex items-center justify-center px-7 py-[0.9375rem] rounded-full border border-base/30 text-base font-sans text-[0.6875rem] font-bold uppercase tracking-[0.1em] tabular hover:border-base/60 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-base"
              >
                Bel {contactInfo.phoneDisplay}
              </a>
            </div>
          </div>

          {/* Nav */}
          <div>
            <p className="text-[0.5625rem] font-bold uppercase tracking-[0.22em] text-base/45 font-sans mb-6">
              Sitemap
            </p>
            <ul className="space-y-3">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.875rem] text-base/70 hover:text-base font-sans transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-base rounded-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-[0.5625rem] font-bold uppercase tracking-[0.22em] text-base/45 font-sans mb-6">
              Contact
            </p>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="text-[0.875rem] text-base/70 hover:text-base font-sans transition-colors duration-200 tabular focus:outline-none focus-visible:ring-1 focus-visible:ring-base rounded-sm"
                >
                  {contactInfo.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-[0.875rem] text-base/70 hover:text-base font-sans transition-colors duration-200 break-all focus:outline-none focus-visible:ring-1 focus-visible:ring-base rounded-sm"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li>
                <address className="not-italic text-[0.875rem] text-base/70 font-sans leading-snug">
                  {contactInfo.address}
                </address>
              </li>
            </ul>

            <div className="mt-8 pt-7 border-t border-base/15">
              <p className="text-[0.5625rem] font-bold uppercase tracking-[0.22em] text-base/45 font-sans mb-3">
                Openingstijden
              </p>
              <p className="text-[0.875rem] text-base/70 font-sans leading-[1.65] tabular">
                Ma t/m vr 09:00 &ndash; 18:00
              </p>
              <p className="text-[0.6875rem] text-base/45 font-sans mt-5 leading-snug tabular">
                KvK {contactInfo.kvk}<br />
                BTW {contactInfo.btw}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-base/15">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-6 flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
          <Link
            href="/"
            className="shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-base rounded-sm"
            aria-label="MMC Techniek B.V., terug naar home"
          >
            <Image
              src="/images/logo.png"
              alt="MMC Techniek B.V."
              width={120}
              height={36}
              className="h-7 w-auto object-contain"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>

          <p className="text-[0.6875rem] text-base/55 font-sans order-last sm:order-none">
            &copy; {new Date().getFullYear()} MMC Techniek B.V. Alle rechten voorbehouden.
          </p>

          <div className="flex items-center gap-5">
            <a
              href="https://www.instagram.com/mmctechniek/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-base/55 hover:text-base transition-colors duration-200 font-sans focus:outline-none focus-visible:ring-1 focus-visible:ring-base rounded-sm"
              aria-label="MMC Techniek op Instagram"
            >
              Instagram
            </a>
            <span className="block w-px h-3 bg-base/25" aria-hidden="true" />
            <a
              href="https://m.facebook.com/profile.php?id=100064674913125"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-base/55 hover:text-base transition-colors duration-200 font-sans focus:outline-none focus-visible:ring-1 focus-visible:ring-base rounded-sm"
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
