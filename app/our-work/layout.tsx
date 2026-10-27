import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projecten | MMC Techniek B.V.",
  description:
    "Bekijk uitgevoerde projecten van MMC Techniek: zonnepanelen, warmtepompen, airco en elektra in Oudewater, Woerden en Utrecht.",
  alternates: { canonical: "/our-work" },
};

export default function OurWorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
