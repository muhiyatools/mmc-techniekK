import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { href, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { whatsappHref, type NavModel } from "./nav";

/** Fixed bottom bar on phones and tablets: call, WhatsApp, quote. */
export function MobileActionBar({ lang, nav }: { lang: Locale; nav: NavModel }) {
  const d = getDict(lang);
  return (
    <nav
      aria-label={d.quickContact}
      className="mobile-bar fixed inset-x-0 bottom-0 z-30 flex items-center gap-2 border-t border-line bg-white/95 px-[var(--gutter)] pb-[calc(12px+var(--safe-bottom))] pt-3 backdrop-blur-[14px] lg:hidden"
    >
      <a href={`tel:${nav.phone}`} aria-label={`${d.cta.call} ${nav.phoneDisplay}`} className="icon-btn size-[52px]">
        <Icon name="phone" size={20} />
      </a>
      <a href={whatsappHref(nav, nav.whatsappText)} target="_blank" rel="noopener noreferrer" aria-label={d.cta.whatsappLong} className="icon-btn size-[52px]">
        <Icon name="whatsapp" size={20} />
      </a>
      <Link href={href(lang, "/offerte")} className="btn btn-primary h-[52px] flex-1 pl-5 pr-1.5">
        <span>{d.cta.quote}</span>
        <span className="knob">
          <Icon name="arrow" />
        </span>
      </Link>
    </nav>
  );
}
