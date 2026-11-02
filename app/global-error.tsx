"use client";

import { useEffect } from "react";

/**
 * Last line of defence. A failed router request (for example a rejected upload) used to
 * land on Next.js's bare English screen; this one is on brand and holds the visitor's
 * hand. Inline styles only: this page can render when the stylesheet did not load.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="nl">
      <head>
        <title>Er ging iets mis · MMC Techniek</title>
        <meta name="robots" content="noindex" />
      </head>
      <body style={{ margin: 0, minHeight: "100vh", display: "grid", placeItems: "center", background: "#f3f6f9", color: "#0f1b26", fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif", padding: 24 }}>
        <main style={{ width: "100%", maxWidth: 460, background: "#fff", border: "1px solid #dbe3ea", borderRadius: 16, padding: 28, textAlign: "center" }}>
          <div aria-hidden style={{ width: 44, height: 44, margin: "0 auto", display: "grid", placeItems: "center", borderRadius: 999, background: "#fdeceb", color: "#b3261e", fontSize: 22, fontWeight: 700 }}>
            !
          </div>
          <h1 style={{ margin: "12px 0 6px", fontSize: 21, lineHeight: 1.25, fontWeight: 700 }}>Deze pagina kon niet laden</h1>
          <p style={{ margin: 0, fontSize: 15, lineHeight: 1.55, color: "#44525f" }}>Er ging iets mis. Herlaad de pagina om het opnieuw te proberen.</p>
          <div style={{ marginTop: 18, display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={reset}
              style={{ height: 42, padding: "0 18px", border: 0, borderRadius: 8, background: "#0a6bc2", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
            >
              Opnieuw proberen
            </button>
            <button
              type="button"
              onClick={() => window.location.assign("/")}
              style={{ height: 42, padding: "0 18px", border: "1.5px solid #c3cfd9", borderRadius: 8, background: "#fff", color: "#0f1b26", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
            >
              Naar de homepage
            </button>
          </div>
          {error.digest && <p style={{ margin: "14px 0 0", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#7a8894" }}>Foutcode {error.digest}</p>}
        </main>
      </body>
    </html>
  );
}
