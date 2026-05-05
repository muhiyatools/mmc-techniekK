import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import FooterCTA from "./components/FooterCTA";
import ScrollToTop from "./components/ScrollToTop";
import ReadingProgress from "./components/ReadingProgress";
import StickyMobileBar from "./components/StickyMobileBar";
import JsonLd from "./components/JsonLd";
import { localBusinessSchema, organizationSchema, websiteSchema } from "@/lib/data";

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
  title: {
    default: "MMC Techniek B.V. | Uw installateur in Oudewater & omgeving",
    template: "%s | MMC Techniek B.V.",
  },
  description:
    "MMC Techniek B.V. uit Oudewater: de specialist in warmtepompen, zonnepanelen, airco, vloerverwarming, liften en complete verduurzaming. Bel 06 3431 1225.",
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
    "Zuid-Holland",
    "verduurzamen",
    "energiebesparing",
  ],
  authors: [{ name: "MMC Techniek B.V." }],
  creator: "MMC Techniek B.V.",
  publisher: "MMC Techniek B.V.",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://mmctechniek.nl",
    siteName: "MMC Techniek B.V.",
    title: "MMC Techniek B.V. | Uw installateur in Oudewater & omgeving",
    description:
      "De specialist in warmtepompen, zonnepanelen, airco en complete verduurzaming. 16+ jaar ervaring, persoonlijke service.",
    images: [
      {
        url: "/images/services/warmtepompen.webp",
        width: 1200,
        height: 630,
        alt: "MMC Techniek warmtepomp installatie",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "MMC Techniek B.V. | Uw installateur in Oudewater & omgeving",
    description:
      "De specialist in warmtepompen, zonnepanelen, airco en complete verduurzaming. 16+ jaar ervaring.",
    images: ["/images/services/warmtepompen.webp"],
  },
  alternates: {
    canonical: "https://mmctechniek.nl",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#F5F6FA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl-NL"
      className={`${barlow.variable} ${barlowCondensed.variable}`}
    >
      <body className="min-h-full flex flex-col bg-base">
        <JsonLd data={[localBusinessSchema, organizationSchema, websiteSchema]} />
        <a href="#main-content" className="skip-to-content">
          Ga naar hoofdinhoud
        </a>
        <ReadingProgress />
        <Header />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <FooterCTA />
        <Footer />
        <StickyMobileBar />
        <ScrollToTop />
      </body>
    </html>
  );
}
