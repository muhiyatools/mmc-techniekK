import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "../globals.css";

const archivo = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: "500", variable: "--font-plex-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "MMC Beheer", template: "%s · MMC Beheer" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#0f1b26", width: "device-width", initialScale: 1, viewportFit: "cover" };

/** Admin root layout (separate from the public site: Dutch only, no site chrome). */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl-NL" className={`${archivo.variable} ${plexMono.variable}`}>
      <body className="admin bg-white text-[14px] leading-normal text-ink">{children}</body>
    </html>
  );
}
