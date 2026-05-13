import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Header from "./_ui/Header";
import Footer from "./_ui/Footer";
import ScrollToTop from "./_ui/ScrollToTop";
import WhatsAppButton from "./_ui/WhatsAppButton";
import { LanguageProvider } from "@/lib/i18n/LanguageContext";

const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow-condensed",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mmctechniek.nl"),
  title: "MMC Techniek B.V. | Installateur in Oudewater & omgeving",
  description:
    "MMC Techniek B.V. uit Oudewater: specialist in warmtepompen, zonnepanelen, airco, vloerverwarming, liften en complete verduurzaming. Bel 06 3431 1225.",
  keywords: [
    "warmtepomp",
    "zonnepanelen",
    "airco",
    "vloerverwarming",
    "meterkast",
    "liften",
    "batterijopslag",
    "installateur",
    "Oudewater",
    "Utrecht",
    "verduurzamen",
  ],
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
  themeColor: "#42a8f2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl-NL" dir="ltr" className={`${barlow.variable} ${barlowCondensed.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-bg" suppressHydrationWarning>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-ink focus:text-white focus:text-sm focus:font-bold focus:rounded-full focus:outline-none">
          Naar hoofdinhoud
        </a>
        <LanguageProvider>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <ScrollToTop />
          <WhatsAppButton />
        </LanguageProvider>
      {process.env.NODE_ENV === "development" && (
        <script src="http://localhost:8400/live.js" />
      )}
</body>
    </html>
  );
}
