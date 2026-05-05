import Link from "next/link";
import JsonLd from "./JsonLd";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

/*
 * Breadcrumb — sits inside PageHero on a daylight Mist surface,
 * so the type is dark on light. Includes BreadcrumbList JSON-LD.
 */
export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href ? `https://mmctechniek.nl${item.href}` : undefined,
    })),
  };

  return (
    <>
      <JsonLd data={schema} />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted font-sans">
          {items.map((item, index) => (
            <li key={item.label} className="flex items-center gap-2">
              {index > 0 && (
                <span aria-hidden="true" className="text-hairline">
                  /
                </span>
              )}
              {item.href && index < items.length - 1 ? (
                <Link
                  href={item.href}
                  className="text-muted hover:text-ink transition-colors duration-200 focus:outline-none focus-visible:ring-1 focus-visible:ring-brand rounded-sm"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={index === items.length - 1 ? "text-ink" : ""}
                  aria-current={index === items.length - 1 ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
