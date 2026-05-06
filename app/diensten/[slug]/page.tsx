import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, contactInfo, brandImages } from "@/lib/data";
import Reveal from "../../components/Reveal";
import BrandLogo from "../../components/BrandLogo";

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

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);

  if (!service) {
    notFound();
  }

  const relatedServices = services.filter((s) => s.slug !== slug).slice(0, 3);
  const hasProducts = service.products && service.products.length > 0;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-[70px] pb-16 lg:pt-[114px] lg:pb-20 overflow-hidden">
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

        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10">
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
              <h1 className="font-display text-[2.5rem] sm:text-[3.5rem] lg:text-[4rem] font-extrabold text-white mb-6 leading-[1.02] tracking-tight">
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
                  className="px-7 py-3.5 bg-brand text-white text-sm font-semibold rounded-full hover:bg-brand-deep transition-all duration-200"
                >
                  Offerte aanvragen
                </Link>
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="px-7 py-3.5 border border-white/30 text-white text-sm font-semibold rounded-full hover:bg-white/10 transition-colors duration-200"
                >
                  Bel ons
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      {hasProducts && (
        <section className="py-16 lg:py-24 bg-surface">
          <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
            <Reveal>
              <div className="mb-8 max-w-xl">
                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3">
                  <span className="w-2 h-2 rounded-full bg-brand" />
                  Producten & Merken
                </span>
                <h2 className="font-display text-[2rem] sm:text-[2.5rem] font-extrabold text-ink mb-3">
                  Wat wij <span className="text-brand">leveren</span>
                </h2>
                <p className="text-muted leading-relaxed">
                  Kwalitatieve producten van A-merken, professioneel geïnstalleerd door onze eigen monteurs.
                </p>
              </div>
            </Reveal>

            {/* Brand logos strip */}
            {(() => {
              const uniqueBrands = [...new Set(service.products.map((p) => p.brand))];
              return (
                <Reveal delay={80}>
                  <div className="flex flex-wrap items-center gap-6 mb-10 p-5 bg-concrete rounded-xl border border-hairline">
                    <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted shrink-0">Merken:</span>
                    <div className="flex flex-wrap items-center gap-6">
                      {uniqueBrands.map((brand) => (
                        <BrandLogo
                          key={brand}
                          brand={brand}
                          imageSrc={brandImages[brand] ?? ""}
                          height={28}
                        />
                      ))}
                    </div>
                  </div>
                </Reveal>
              );
            })()}

            {/* Flat product grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.products.map((product, i) => (
                <Reveal key={product.name} delay={i * 80}>
                  <div className="group bg-white border border-hairline hover:border-brand/40 transition-all duration-300 overflow-hidden flex flex-col rounded-xl">
                    {/* Product Image */}
                    <div className="relative aspect-[4/3] overflow-hidden bg-concrete">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="mb-1.5 h-6 flex items-center">
                        <BrandLogo
                          brand={product.brand}
                          imageSrc={brandImages[product.brand] ?? ""}
                          height={20}
                        />
                      </div>
                      <h4 className="text-base font-bold text-ink mb-2 group-hover:text-brand transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-sm text-muted mb-4 leading-relaxed">
                        {product.description}
                      </p>

                      {/* Tech Specs */}
                      <ul className="space-y-1 mb-4">
                        {product.techSpecs.slice(0, 4).map((spec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-copy">
                            <svg className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            {spec}
                          </li>
                        ))}
                      </ul>

                      {/* Price + CTA */}
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-hairline">
                        {product.price ? (
                          <span className="text-sm font-bold text-ink">
                            {product.price}
                          </span>
                        ) : (
                          <span className="text-sm text-muted italic">
                            Prijs op aanvraag
                          </span>
                        )}
                        <Link
                          href={`/contact/?service=${service.slug}&product=${encodeURIComponent(product.name)}`}
                          className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand hover:text-brand-deep transition-colors"
                        >
                          Offerte
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={300}>
              <div className="mt-14 p-8 lg:p-10 bg-mist border border-hairline relative rounded-xl overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-1 via-brand/40 to-aurora-2" />
                <p className="text-muted mb-5 max-w-md">
                  Niet zeker welk product het beste bij uw situatie past? Wij adviseren u graag vrijblijvend.
                </p>
                <Link
                  href={`/contact/?service=${service.slug}`}
                  className="inline-flex items-center gap-2 px-7 py-3 bg-ink text-white text-sm font-bold uppercase tracking-wide rounded-full hover:bg-brand transition-colors duration-200"
                >
                  Gratis adviesgesprek
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
      <section className="py-14 lg:py-20 bg-base">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="mb-10">
              <h2 className="font-display text-[1.75rem] sm:text-[2rem] font-extrabold text-ink">
                Andere <span className="text-brand">diensten</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-3 gap-5">
            {relatedServices.map((related, i) => (
              <Reveal key={related.slug} delay={i * 100}>
                <Link
                  href={`/diensten/${related.slug}`}
                  className="group block bg-white overflow-hidden border border-hairline hover:border-brand/40 hover:shadow-lg hover:shadow-brand/5 transition-all duration-300 rounded-xl"
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
    </>
  );
}
