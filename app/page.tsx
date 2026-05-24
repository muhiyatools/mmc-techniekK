"use client";

import Services from "./_sections/Services";
import TrustStrip from "./_sections/TrustStrip";
import HeroSection from "./_sections/HeroSection";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import ClientStrip from "./_ui/ClientStrip";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      <HeroSection />

      <TrustStrip />

      <Services />

      <ClientStrip />
    </>
  );
}
