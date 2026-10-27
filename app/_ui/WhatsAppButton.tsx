"use client";

import { useLanguage } from "@/lib/i18n/LanguageContext";
import { contactInfo } from "@/lib/data";
import WhatsAppIcon from "./WhatsAppIcon";

export default function WhatsAppButton() {
  const { t } = useLanguage();
  const message = encodeURIComponent(t.components.whatsapp.message);

  return (
    <a
      href={`https://wa.me/${contactInfo.whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="wa-float fixed right-6 z-[49] w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-all duration-300"
      aria-label={t.components.whatsapp.ariaLabel}
    >
      <WhatsAppIcon className="w-7 h-7" />
    </a>
  );
}
