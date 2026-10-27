import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";

export const alt = "MMC Techniek, installateur in Oudewater";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default share image: logo mark on ink with the loop, in brand colours. */
export default async function OgImage() {
  const mark = await readFile(path.join(process.cwd(), "public/brand/mark-white.svg"), "utf8");
  const src = `data:image/svg+xml;base64,${Buffer.from(mark).toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0F1B26", color: "#fff", padding: 80, position: "relative", fontFamily: "sans-serif" }}>
        <svg width="760" height="760" viewBox="0 0 400 400" style={{ position: "absolute", right: -180, top: -60 }}>
          <circle cx="200" cy="200" r="190" fill="none" stroke="#2C3D4E" strokeWidth="2" />
          <path d="M334.4 65.6 A190 190 0 1 0 334.4 334.4" fill="none" stroke="#41A7F2" strokeWidth="5" strokeLinecap="round" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} width={120} height={120} alt="" />
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ fontSize: 88, fontWeight: 800, letterSpacing: -3, lineHeight: 0.95 }}>Van dak tot meterkast.</div>
            <div style={{ fontSize: 32, color: "#B4C0CB" }}>MMC Techniek · Oudewater · sinds 2008</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
