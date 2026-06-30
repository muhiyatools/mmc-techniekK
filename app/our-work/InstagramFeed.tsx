"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Reveal from "../_ui/Reveal";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function InstagramFeed() {
  const { t } = useLanguage();
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);
  const [widgetHtml, setWidgetHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 1. Fetch settings from Supabase on mount
  useEffect(() => {
    async function loadConfig() {
      try {
        const { data: settings } = await supabase.from("admin_settings").select("*");
        if (settings) {
          const codeSetting = settings.find((s) => s.key === "instagram_widget_code");
          if (codeSetting?.value) {
            const val = codeSetting.value;

            // 1. Check if it is a div embed with data-embed-id
            const embedIdMatch = val.match(/data-embed-id=['"]([^'"]+)['"]/);
            if (embedIdMatch && embedIdMatch[1]) {
              const id = embedIdMatch[1];
              // Convert to a stable iframe URL to prevent React route navigation blank issues
              setIframeUrl(`https://widgets.sociablekit.com/instagram-feed/iframe/${id}`);
            }
            // 2. Check if it is an iframe with a src attribute
            else if (val.includes("<iframe")) {
              const iframeSrcMatch = val.match(/src=['"]([^'"]+)['"]/);
              if (iframeSrcMatch && iframeSrcMatch[1]) {
                setIframeUrl(iframeSrcMatch[1]);
              } else {
                setWidgetHtml(val);
              }
            } else {
              // Fallback to raw HTML injection if format is different
              setWidgetHtml(val);
            }
            setIsLoading(false);
            return;
          }
        }
      } catch (e) {
        console.error("Failed to load Instagram settings from database:", e);
      }
      
      // Fallback default placeholder
      setIframeUrl("https://widgets.sociablekit.com/instagram-feed/iframe/PLACEHOLDER_SOCIABLEKIT_ID");
      setIsLoading(false);
    }
    loadConfig();
  }, []);

  return (
    <>
      <section className="relative pt-[104px] lg:pt-[114px] bg-bg min-h-screen">
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

          {/* SociableKIT Widget Container */}
          <Reveal delay={300}>
            <div className="relative w-full min-h-[600px] overflow-hidden flex items-center justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-10 h-10 border-4 border-brand border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs font-bold text-muted uppercase tracking-wider">Laden...</p>
                </div>
              ) : iframeUrl ? (
                <iframe
                  src={iframeUrl}
                  frameBorder="0"
                  width="100%"
                  className="w-full min-h-[1200px] border-none"
                  title="SociableKIT Instagram Feed"
                  loading="lazy"
                />
              ) : widgetHtml ? (
                <div 
                  className="w-full h-full" 
                  dangerouslySetInnerHTML={{ __html: widgetHtml }} 
                />
              ) : (
                <p className="text-sm text-muted">Geen widget geconfigureerd</p>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
