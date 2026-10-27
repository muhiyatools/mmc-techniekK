import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Over Ons | MMC Techniek B.V.",
  description:
    "16+ jaar ervaring in duurzame installaties vanuit Oudewater. Ontdek het verhaal, de werkwijze en de certificeringen (NEN 1010, NEN 3140, VCA) van MMC Techniek.",
  alternates: { canonical: "/over-ons" },
};

export default function OverOnsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
