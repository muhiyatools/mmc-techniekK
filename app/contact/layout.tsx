import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact & Offerte | MMC Techniek B.V.",
  description:
    "Vraag een vrijblijvende offerte aan of bel 06 3431 1225. MMC Techniek installeert warmtepompen, zonnepanelen, airco en meer in de regio Utrecht.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
