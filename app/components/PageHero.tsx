import Image from "next/image";
import Breadcrumb from "./Breadcrumb";
import InstrumentDot from "./InstrumentDot";

interface PageHeroProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  breadcrumbItems: { label: string; href?: string }[];
  /** Optional eyebrow label. Defaults to the deepest breadcrumb. */
  eyebrow?: string;
}

/*
 * PageHero — daylight inner-page header.
 *
 *   ┌──── breadcrumb · eyebrow ─────────────┬──── thumbnail shelf ───┐
 *   │  H1 (display, ink)                    │  Mist surface, image   │
 *   │  lead (copy/80)                       │  hairline frame        │
 *   └────────────────────────────────────────┴────────────────────────┘
 *
 * Replaces the previous full-bleed dark image hero. No dark inversion,
 * no overlay-on-image text. The image now lives in a small Shelf so
 * the type can stay on Pearl/Void.
 */
export default function PageHero({
  title,
  description,
  image,
  imageAlt,
  breadcrumbItems,
  eyebrow,
}: PageHeroProps) {
  const eyebrowText =
    eyebrow ?? breadcrumbItems[breadcrumbItems.length - 1]?.label ?? "";

  return (
    <section
      className="relative bg-base pt-[88px] lg:pt-[112px] pb-12 lg:pb-16"
      aria-label="Pagina introductie"
    >
      {/* Atmospheric brand wash in the upper right */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(120% 80% at 90% 0%, color-mix(in oklch, var(--color-brand) 6%, transparent) 0%, transparent 55%)",
        }}
      />

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10">
        <Breadcrumb items={breadcrumbItems} />

        <div className="mt-8 grid lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_420px] gap-10 lg:gap-16 items-end">
          <div className="pt-2">
            <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-5">
              <InstrumentDot size={4} />
              {eyebrowText}
            </p>
            <h1
              className="font-display font-extrabold uppercase leading-[0.88] tracking-[-0.012em] text-ink mb-6 max-w-[16ch]"
              style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
            >
              {title}
            </h1>
            <p className="text-[1.0625rem] leading-[1.7] text-copy/80 max-w-[56ch] font-sans">
              {description}
            </p>
          </div>

          <div className="hidden lg:block relative shelf overflow-hidden rounded-2xl" style={{ aspectRatio: "16 / 11" }}>
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-px z-10 pointer-events-none"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, var(--color-aurora-1) 28%, var(--color-brand) 50%, var(--color-aurora-2) 72%, transparent 100%)",
                backgroundSize: "200% 100%",
                animation: "aurora-drift 18s linear infinite",
              }}
            />
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 0px, 420px"
            />
          </div>
        </div>
      </div>

      {/* Bottom hairline — terminates the hero band cleanly */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-px bg-hairline"
      />
    </section>
  );
}
