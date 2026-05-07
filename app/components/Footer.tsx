import Link from "next/link";
import Image from "next/image";
import { contactInfo } from "@/lib/data";
import Reveal from "./Reveal";
import PreFooterCTA from "./PreFooterCTA";

export default function Footer() {
  return (
    <footer>
      <PreFooterCTA />

      {/* Footer navigation — carbon black, brand-blue accents */}
      <div className="bg-[#0d0d0d] text-white">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-16 lg:py-20">
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
                  style={{ filter: "brightness(0) saturate(100%) invert(63%) sepia(55%) saturate(500%) hue-rotate(185deg) brightness(108%)" }}
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
                    { label: "Diensten", href: "/aanbod/" },
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
          <div className="max-w-[1280px] mx-auto px-6 lg:px-8 py-6 text-center">
            <p className="text-white/20 text-xs">
              &copy; {new Date().getFullYear()} MMC Techniek B.V. Alle rechten voorbehouden.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
