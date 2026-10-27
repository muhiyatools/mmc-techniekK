import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product | MMC Techniek B.V.",
  description:
    "Productdetails en specificaties. Vraag een offerte op maat aan bij MMC Techniek — installatie door eigen gecertificeerde monteurs.",
};

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
