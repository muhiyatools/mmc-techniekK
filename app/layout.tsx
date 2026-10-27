import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Header from "./_ui/Header";
import Footer from "./_ui/Footer";
import ScrollToTop from "./_ui/ScrollToTop";
import WhatsAppButton from "./_ui/WhatsAppButton";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";
import JsonLd from "./_ui/JsonLd";
import { contactInfo } from "@/lib/data";

// Self-hosted via next/font — no render-blocking <link>, no layout shift.
// Weights match actual usage (400–800); 900 "black" is normalised to 800 (extrabold).
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-barlow-sans",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-barlow-display",
  display: "swap",
});

// LocalBusiness structured data — improves local search + rich results.
const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "HVACBusiness",
  "@id": "https://mmctechniek.nl/#business",
  name: "MMC Techniek B.V.",
  description:
    "Installateur uit Oudewater, gespecialiseerd in warmtepompen, zonnepanelen, airco, thuisbatterijen, meterkast en verduurzaming.",
  url: "https://mmctechniek.nl",
  telephone: contactInfo.phoneHref,
  email: contactInfo.email,
  logo: "https://mmctechniek.nl/images/logo.png",
  image: "https://mmctechniek.nl/images/services/warmtepompen.webp",
  priceRange: "€€",
  foundingDate: "2008",
  vatID: contactInfo.btw,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Heemraadsingel 11",
    postalCode: "3421 VG",
    addressLocality: "Oudewater",
    addressRegion: "Utrecht",
    addressCountry: "NL",
  },
  areaServed: ["Oudewater", "Woerden", "Utrecht", "Bodegraven", "Montfoort"],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://mmctechniek.nl"),
  title: "MMC Techniek B.V. | Installateur in Oudewater & omgeving",
  description:
    "MMC Techniek B.V. uit Oudewater: specialist in warmtepompen, zonnepanelen, airco, meterkast en complete verduurzaming. Bel 06 3431 1225.",
  keywords: [
    "warmtepomp",
    "zonnepanelen",
    "airco",
    "meterkast",
    "batterijopslag",
    "installateur",
    "Oudewater",
    "Utrecht",
    "verduurzamen",
  ],
  icons: {
    icon: "/images/logo.png",
    shortcut: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://mmctechniek.nl",
    siteName: "MMC Techniek B.V.",
    title: "MMC Techniek B.V. | Installateur in Oudewater & omgeving",
    description:
      "Specialist in warmtepompen, zonnepanelen, airco en complete verduurzaming. 16+ jaar ervaring, persoonlijke service.",
    images: [
      {
        url: "/images/services/warmtepompen.webp",
        width: 1200,
        height: 630,
        alt: "MMC Techniek warmtepomp installatie",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#42a8f2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl-NL"
      dir="ltr"
      className={`${barlow.variable} ${barlowCondensed.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-bg" suppressHydrationWarning>
        <JsonLd data={localBusinessJsonLd} />
        <LanguageProvider>
          <Header />
          <main id="main-content" className="flex-1 animate-[fadeIn_400ms_ease-out]">
            {children}
          </main>
          <Footer />
          <ScrollToTop />
          <WhatsAppButton />
        </LanguageProvider>

        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-ink focus:text-white focus:text-sm focus:font-bold focus:rounded-full focus:outline-none">
          Naar hoofdinhoud
        </a>

        {process.env.NODE_ENV === "development" && (
          <script src="http://localhost:8400/live.js" />
        )}
      </body>
    </html>
  );
}
