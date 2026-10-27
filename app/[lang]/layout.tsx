import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { ViewTransition } from "react";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { JsonLd, localBusiness } from "@/components/site/JsonLd";
import { MobileActionBar } from "@/components/site/MobileActionBar";
import { buildNav } from "@/components/site/nav";
import { RevealObserver } from "@/components/ui/Reveal";
import { getPublishedPageSlugs, getServices, getSettings } from "@/lib/content";
import { htmlLang, isLocale, locales, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: "500", variable: "--font-plex-mono", display: "swap" });

export const dynamicParams = false;
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  const nl = lang === "nl";
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: "MMC Techniek · Installateur in Oudewater", template: "%s · MMC Techniek" },
    description: nl
      ? "Zonnepanelen, thuisbatterijen, warmtepompen, airco en meterkasten in Oudewater en omgeving. Eigen monteurs, sinds 2008."
      : "Solar panels, home batteries, heat pumps, air conditioning and consumer units in Oudewater and the surrounding area. Our own fitters, since 2008.",
    applicationName: "MMC Techniek",
    openGraph: { siteName: "MMC Techniek", locale: nl ? "nl_NL" : "en_GB", type: "website" },
    twitter: { card: "summary_large_image" },
    formatDetection: { telephone: false },
  };
}

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang: raw } = await params;
  if (!isLocale(raw)) notFound();
  const lang: Locale = raw;
  const d = getDict(lang);
  const [services, settings, legal] = await Promise.all([getServices(), getSettings(), getPublishedPageSlugs()]);
  const nav = buildNav(lang, services, settings);

  return (
    <html lang={htmlLang[lang]} className={`${archivo.variable} ${plexMono.variable}`}>
      <body className="bg-white text-ink">
        <a href="#main" className="sr-only z-[100] rounded-full bg-ink px-5 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
          {d.skip}
        </a>
        <Header lang={lang} nav={nav} />
        <ViewTransition>
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
        </ViewTransition>
        <Footer lang={lang} nav={nav} settings={settings} legal={legal} />
        <MobileActionBar lang={lang} nav={nav} />
        <RevealObserver />
        <JsonLd data={localBusiness(settings, services, lang)} />
      </body>
    </html>
  );
}
