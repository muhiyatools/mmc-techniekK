import Link from "next/link";
import Image from "next/image";
import { navLinks, contactInfo, services } from "@/lib/data";
import MicroLabel from "./MicroLabel";
import HairlineDivider from "./HairlineDivider";

const footerNav = navLinks.filter((l) => l.href !== "/");

/*
 * Footer — brand blue closing band with clean 4-column layout.
 *
 * Simple, organized, no duplication. Brand color matches the logo.
 */
export default function Footer() {
  return (
    <footer
      className="relative bg-brand"
      aria-label="Sitefooter"
    >
      {/* Aurora hairline at the top edge */}
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

      {/* Main footer content */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-16 lg:pt-20 pb-12 lg:pb-16">
        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          
          {/* Column 1: Brand identity */}
          <div className="lg:col-span-4">
            <Link
              href="/"
              className="inline-block focus:outline-none focus-visible:ring-2 focus-visible:ring-base rounded-sm"
              aria-label="MMC Techniek B.V., terug naar home"
            >
              <Image
                src="/images/logo.png"
                alt="MMC Techniek B.V."
                width={140}
                height={42}
                className="h-9 w-auto object-contain"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </Link>

            <p className="mt-5 text-[0.9375rem] text-base/75 font-sans leading-[1.7] max-w-[32ch]">
              Installatie en verduurzaming voor thuis en bedrijf. 
              Eigen monteurs, 16 jaar ervaring.
            </p>

            {/* Social links */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.instagram.com/mmctechniek/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-base/20 text-base/70 hover:text-base hover:border-base/40 transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-base"
                aria-label="MMC Techniek op Instagram"
              >
                <svg
                  className="w-[17px] h-[17px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="https://m.facebook.com/profile.php?id=100064674913125"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 flex items-center justify-center rounded-full border border-base/20 text-base/70 hover:text-base hover:border-base/40 transition-all duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-base"
                aria-label="MMC Techniek op Facebook"
              >
                <svg
                  className="w-[17px] h-[17px]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="lg:col-span-2">
            <MicroLabel variant="inverse" size="micro" className="mb-4">
              Diensten
            </MicroLabel>
            <ul className="space-y-2">
              {services.slice(0, 5).map((service) => (
                <li key={service.title}>
                  <Link
                    href="/onze-diensten"
                    className="text-[0.8125rem] text-base/70 hover:text-base font-sans transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-base rounded-sm"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Navigation */}
          <div className="lg:col-span-2">
            <MicroLabel variant="inverse" size="micro" className="mb-4">
              Pagina&apos;s
            </MicroLabel>
            <ul className="space-y-2">
              {footerNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[0.8125rem] text-base/70 hover:text-base font-sans transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-base rounded-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="lg:col-span-4">
            <MicroLabel variant="inverse" size="micro" className="mb-4">
              Contact
            </MicroLabel>
            
            <ul className="space-y-2.5">
              <li>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="text-[0.9375rem] text-base font-sans hover:text-base/80 transition-colors duration-200 tabular"
                >
                  {contactInfo.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-[0.9375rem] text-base/80 hover:text-base font-sans transition-colors duration-200"
                >
                  {contactInfo.email}
                </a>
              </li>
              <li>
                <address className="not-italic text-[0.9375rem] text-base/80 font-sans">
                  {contactInfo.address}
                </address>
              </li>
            </ul>

            <p className="mt-4 text-[0.8125rem] text-base/60 font-sans">
              Ma t/m vr 09:00 – 18:00
            </p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <HairlineDivider variant="muted-inverse" />
      </div>

      {/* Bottom bar */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-5">
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <p className="text-[0.6875rem] text-base/55 font-sans">
            &copy; {new Date().getFullYear()} MMC Techniek B.V.
          </p>
          <p className="text-[0.6875rem] text-base/55 font-sans tabular">
            KvK {contactInfo.kvk} · BTW {contactInfo.btw}
          </p>
        </div>
      </div>
    </footer>
  );
}
