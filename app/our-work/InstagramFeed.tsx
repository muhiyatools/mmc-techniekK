"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Reveal from "../_ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// Only ever load the feed inside an iframe from a trusted host. The admin-stored
// widget code is untrusted input, so we never inject it as raw HTML (that was a
// stored-XSS vector) — we extract an embed id or a trusted iframe src instead.
const isTrustedSrc = (url: string) =>
  /^https:\/\/([a-z0-9-]+\.)*(sociablekit\.com|instagram\.com)\//i.test(url);

export default function InstagramFeed() {
  const { t, language } = useLanguage();
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const { data: settings } = await supabase.from("admin_settings").select("*");
        const val = settings?.find((s) => s.key === "instagram_widget_code")?.value as
          | string
          | undefined;
        if (val) {
          const embedId = val.match(/data-embed-id=['"]([^'"]+)['"]/)?.[1];
          const iframeSrc = val.match(/src=['"]([^'"]+)['"]/)?.[1];
          if (embedId) {
            setIframeUrl(
              `https://widgets.sociablekit.com/instagram-feed/iframe/${encodeURIComponent(embedId)}`
            );
          } else if (iframeSrc && isTrustedSrc(iframeSrc)) {
            setIframeUrl(iframeSrc);
          }
          // Unrecognized / untrusted config → render the empty state, never raw HTML.
        }
      } catch (e) {
        console.error("Failed to load Instagram settings from database:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadConfig();
  }, []);

  return (
    <section className="relative pt-[104px] lg:pt-[114px] bg-bg min-h-dvh">
      <div className="max-w-[935px] mx-auto px-5 py-12 md:py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <Reveal>
            <span className="inline-flex items-center gap-2.5 text-xs font-bold uppercase tracking-wider text-muted mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              Live Feed
            </span>
          </Reveal>
          <Reveal delay={100}>
            <h1 className="font-display text-3xl md:text-5xl font-extrabold tracking-tight text-ink mb-4">
              {t.pages.ourWork.title}
            </h1>
          </Reveal>
          <Reveal delay={200}>
            <p className="text-sm md:text-base text-muted leading-relaxed max-w-xl mx-auto">
              {t.pages.ourWork.description}
            </p>
          </Reveal>
        </div>

        <Reveal delay={300}>
          <div className="relative w-full min-h-[600px] overflow-hidden flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin motion-reduce:animate-none" />
                <p className="text-xs font-bold text-muted uppercase tracking-wider">{language === "nl" ? "Laden..." : "Loading..."}</p>
              </div>
            ) : iframeUrl ? (
              <iframe
                src={iframeUrl}
                width="100%"
                className="w-full min-h-[1200px] border-none"
                title="MMC Techniek Instagram Feed"
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-popups"
                referrerPolicy="no-referrer"
              />
            ) : (
              <p className="text-sm text-muted">{language === "nl" ? "Geen widget geconfigureerd" : "No widget configured"}</p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
