import type { Metadata } from "next";
import PageHero from "../components/PageHero";
import ProcessSteps from "../sections/ProcessSteps";
import Partners from "../sections/Partners";
import ServiceFilter from "../components/ServiceFilter";
import JsonLd from "../components/JsonLd";

export const metadata: Metadata = {
  title: "Onze Diensten",
  description:
    "Het complete dienstenpakket van MMC Techniek: warmtepompen, zonnepanelen, airco, vloerverwarming, batterijopslag, meterkasten en liften. Vakkundig ge\u00efnstalleerd in heel Nederland vanuit Oudewater.",
  openGraph: {
    title: "Onze Diensten | MMC Techniek B.V.",
    description:
      "Van warmtepompen tot complete verduurzaming. Ge\u00efnstalleerd door eigen monteurs.",
  },
  alternates: {
    canonical: "https://mmctechniek.nl/onze-diensten",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Welke diensten biedt MMC Techniek aan?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MMC Techniek installeert warmtepompen, zonnepanelen, airconditioning, batterijopslag, vloerverwarming, meterkasten en liften. Wij begeleiden van advies tot oplevering en service.",
      },
    },
    {
      "@type": "Question",
      name: "Werken jullie ook in mijn regio?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Wij zijn gevestigd in Oudewater en werken in heel Nederland, met name in de provincies Utrecht, Zuid-Holland en Noord-Brabant.",
      },
    },
    {
      "@type": "Question",
      name: "Hoe snel kan er gestart worden met een installatie?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Na goedkeuring van de offerte starten we meestal binnen 2 tot 4 weken, afhankelijk van het seizoen en de beschikbaarheid van materialen.",
      },
    },
  ],
};

export default function OnzeDienstenPage() {
  return (
    <>
      <JsonLd data={faqSchema} />

      <PageHero
        title="Onze diensten"
        description="Warmtepompen, zonnepanelen, airco, batterijopslag, vloerverwarming, meterkasten en liften. Ge\u00efnstalleerd door eigen monteurs uit Oudewater."
        image="/images/services/warmtepompen.webp"
        imageAlt="Warmtepomp installatie door MMC Techniek"
        breadcrumbItems={[
          { label: "Home", href: "/" },
          { label: "Onze diensten" },
        ]}
        eyebrow="Diensten"
      />

      <ServiceFilter />

      <ProcessSteps />
      <Partners />
    </>
  );
}
