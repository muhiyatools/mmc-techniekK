import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, contactInfo, priceTierLabels } from "@/lib/data";
import type { PriceTier } from "@/lib/data";
import Reveal from "../../components/Reveal";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return { title: "Dienst niet gevonden" };

  return {
    title: `${service.title} | MMC Techniek B.V.`,
    description: service.summary,
  };
}

const tierBadgeStyles: Record<PriceTier, string> = {
  economy: "bg-emerald-100 text-emerald-700 border-emerald-200",
  medium: "bg-amber-100 text-amber-700 border-amber-200",
  premium: "bg-rose-100 text-rose-700 border-rose-200",
};

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const relatedServices = services.filter((s) => s.slug !== slug).slice(0, 3);
  const hasProducts = service.products && service.products.length > 0;

  // Group products by tier
  const groupedProducts = hasProducts
    ? {
        premium: service.products.filter((p) => p.tier === "premium"),
        medium: service.products.filter((p) => p.tier === "medium"),
        economy: service.products.filter((p) => p.tier === "economy"),
      }
    : null;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-[100px] pb-16 lg:pt-[120px] lg:pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={service.image}
            alt={service.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/60 to-ink/40" />
        </div>

        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl">
            <Reveal>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-brand mb-6 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Terug naar home
              </Link>
            </Reveal>
            <Reveal delay={100}>
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand mb-4">
                <span className="w-2 h-2 rounded-full bg-brand" />
                {service.title}
              </span>
            </Reveal>
            <Reveal delay={200}>
              <h1 className="text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] font-bold text-white mb-6 leading-tight">
                {service.title}
              </h1>
            </Reveal>
            <Reveal delay={300}>
              <p className="text-base lg:text-lg text-white/70 mb-8 max-w-lg">
                {service.description}
              </p>
            </Reveal>
            <Reveal delay={400}>
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/contact/?service=${service.slug}`}
                  className="px-7 py-3.5 bg-brand text-white text-sm font-semibold rounded-full hover:bg-brand-hover transition-all duration-200"
                >
                  Offerte Aanvragen
                </Link>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="px-7 py-3.5 border border-white/30 text-white text-sm font-semibold rounded-full hover:bg-white/10 transition-colors duration-200"
                >
                  Bel Ons
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      {hasProducts && (
        <section className="py-16 lg:py-24 bg-surface">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
            <Reveal>
              <div className="text-center mb-14">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3">
                  <span className="w-2 h-2 rounded-full bg-brand" />
                  Producten & Merken
                </span>
                <h2 className="text-[2rem] sm:text-[2.5rem] font-bold text-ink">
                  Wat wij <span className="text-brand">leveren</span>
                </h2>
                <p className="text-muted mt-3 max-w-lg mx-auto">
                  Kwalitatieve producten van A-merken, ingedeeld naar prijsklasse
                </p>
              </div>
            </Reveal>

            {/* Legend */}
            <Reveal delay={100}>
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                {(["economy", "medium", "premium"] as PriceTier[]).map((tier) => (
                  <div key={tier} className="flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${
                      tier === "economy" ? "bg-emerald-500" : tier === "medium" ? "bg-amber-500" : "bg-rose-500"
                    }`} />
                    <span className="text-sm text-muted">{priceTierLabels[tier]}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            {/* Products by tier */}
            <div className="space-y-16">
              {groupedProducts && (["premium", "medium", "economy"] as PriceTier[]).map((tier) => {
                const tierProducts = groupedProducts[tier];
                if (tierProducts.length === 0) return null;

                return (
                  <div key={tier}>
                    <Reveal>
                      <div className="flex items-center gap-3 mb-6">
                        <span className={`w-3 h-3 rounded-full ${
                          tier === "economy" ? "bg-emerald-500" : tier === "medium" ? "bg-amber-500" : "bg-rose-500"
                        }`} />
                        <h3 className="text-lg font-bold text-ink">{priceTierLabels[tier]}</h3>
                        <div className="flex-1 h-px bg-hairline" />
                      </div>
                    </Reveal>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {tierProducts.map((product, i) => (
                        <Reveal key={product.name} delay={i * 100}>
                          <div className="group bg-white rounded-2xl border border-border overflow-hidden hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5 transition-all duration-300">
                            {/* Product Image */}
                            <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-concrete to-mist">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              />
                              <div className="absolute top-3 left-3">
                                <span className={`inline-block px-2.5 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${tierBadgeStyles[tier]}`}>
                                  {priceTierLabels[tier]}
                                </span>
                              </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-5">
                              <div className="text-xs font-bold uppercase tracking-wider text-brand mb-1">
                                {product.brand}
                              </div>
                              <h4 className="text-base font-bold text-ink mb-2 group-hover:text-brand transition-colors">
                                {product.name}
                              </h4>
                              <p className="text-sm text-muted mb-4 leading-relaxed">
                                {product.description}
                              </p>

                              {/* Tech Specs */}
                              <div className="mb-4">
                                <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">
                                  Technische specificaties
                                </p>
                                <ul className="space-y-1">
                                  {product.techSpecs.slice(0, 4).map((spec, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs text-copy">
                                      <svg className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      {spec}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Price */}
                              <div className="flex items-center justify-between pt-4 border-t border-hairline">
                                {product.price ? (
                                  <span className="text-sm font-bold text-brand">
                                    {product.price}
                                  </span>
                                ) : (
                                  <span className="text-sm text-muted italic">
                                    Prijs op aanvraag
                                  </span>
                                )}
                                <Link
                                  href={`/contact/?service=${service.slug}&product=${encodeURIComponent(product.name)}`}
                                  className="text-xs font-bold uppercase tracking-wider text-ink hover:text-brand transition-colors"
                                >
                                  Offerte →
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Reveal>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <Reveal delay={300}>
              <div className="text-center mt-16 p-8 bg-white rounded-2xl border border-border">
                <p className="text-muted mb-5 max-w-md mx-auto">
                  Niet zeker welk product het beste bij uw situatie past? Wij adviseren u graag vrijblijvend.
                </p>
                <Link
                  href={`/contact/?service=${service.slug}`}
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand text-white text-sm font-semibold rounded-full hover:bg-brand-deep transition-all duration-200"
                >
                  Gratis Adviesgesprek
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Related Services */}
      <section className="py-14 lg:py-18 bg-base">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="text-center mb-10">
              <h2 className="text-[1.75rem] sm:text-[2rem] font-bold text-ink">
                Andere <span className="text-brand">diensten</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-5">
            {relatedServices.map((related, i) => (
              <Reveal key={related.slug} delay={i * 100}>
                <Link
                  href={`/diensten/${related.slug}`}
                  className="group block bg-white rounded-xl overflow-hidden border border-border hover:border-brand/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="aspect-[3/2] relative">
                    <Image
                      src={related.image}
                      alt={related.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-ink/40 group-hover:bg-ink/50 transition-colors" />
                  </div>
                  <div className="p-5">
                    <h3 className="text-base font-bold text-ink mb-1 group-hover:text-brand transition-colors">
                      {related.title}
                    </h3>
                    <p className="text-sm text-muted line-clamp-2">{related.summary}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 lg:py-18 bg-brand">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 text-center">
          <h2 className="text-[1.75rem] sm:text-[2.25rem] font-bold text-white mb-4">
            Klaar voor een duurzame toekomst?
          </h2>
          <p className="text-white/70 max-w-lg mx-auto mb-8">
            Neem contact met ons op voor een vrijblijvend gesprek over uw wensen
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/contact/?service=${service.slug}`}
              className="px-8 py-4 bg-white text-brand text-base font-semibold rounded-full hover:bg-white/90 transition-all duration-200"
            >
              Offerte Aanvragen
            </Link>
            <a
              href={`tel:${contactInfo.phone}`}
              className="px-8 py-4 border-2 border-white text-white text-base font-semibold rounded-full hover:bg-white/10 transition-all duration-200"
            >
              {contactInfo.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
