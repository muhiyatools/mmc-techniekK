import type { Metadata } from "next";
import { faqItems } from "@/lib/data";
import JsonLd from "../_ui/JsonLd";

export const metadata: Metadata = {
  title: "Veelgestelde Vragen | MMC Techniek B.V.",
  description:
    "Antwoorden op veelgestelde vragen over warmtepompen, zonnepanelen, subsidies, onderhoud en installatie door MMC Techniek.",
  alternates: { canonical: "/veelgestelde-vragen" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((f) => ({
    "@type": "Question",
    name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer },
  })),
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  );
}
