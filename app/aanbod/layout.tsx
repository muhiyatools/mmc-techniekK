import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aanbod & Diensten | MMC Techniek B.V.",
  description:
    "Bekijk het complete aanbod van MMC Techniek: warmtepompen, zonnepanelen, airco, thuisbatterijen, meterkast en onderhoud. Vraag vrijblijvend een offerte aan.",
  alternates: { canonical: "/aanbod" },
};

export default function AanbodLayout({ children }: { children: React.ReactNode }) {
  return children;
}
