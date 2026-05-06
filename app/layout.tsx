import type { Metadata, Viewport } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

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
  themeColor: "#5A9EFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl-NL" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body className="min-h-full flex flex-col bg-base">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <ScrollToTop />
      </body>
    </html>
  );
}
