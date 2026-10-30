"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { href, type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";

export default function NotFound() {
  const pathname = usePathname();
  const lang: Locale = pathname.startsWith("/en") ? "en" : "nl";
  const d = getDict(lang);
  const links = [
    { path: "/aanbod", label: d.nav.catalog },
    { path: "/zakelijk", label: d.nav.business },
    { path: "/veelgestelde-vragen", label: d.nav.faq },
    { path: "/contact", label: d.nav.contact },
  ];
  return (
    <section className="section-y">
      <div className="wrap flex max-w-[760px] flex-col items-start gap-6">
        <span className="t-mono text-graphite">404</span>
        <h1 className="t-h1">{d.notFound.title}</h1>
        <p className="t-lead">{d.notFound.text}</p>
        <ul className="flex flex-wrap gap-2">
          {links.map((l) => (
            <li key={l.path}>
              <Link href={href(lang, l.path)} className="chip">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <ButtonLink href={href(lang, "/")}>{d.notFound.home}</ButtonLink>
      </div>
    </section>
  );
}
