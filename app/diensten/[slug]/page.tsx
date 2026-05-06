import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, contactInfo } from "@/lib/data";
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

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  
  if (!service) {
    notFound();
  }

  const relatedServices = services.filter((s) => s.slug !== slug).slice(0, 3);

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
                  href="/contact/"
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
      <section className="py-16 lg:py-20 bg-surface">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10">
          <Reveal>
            <div className="text-center mb-12">
              <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-brand mb-3">
                <span className="w-2 h-2 rounded-full bg-brand" />
                Producten & Merken
              </span>
              <h2 className="text-[2rem] sm:text-[2.5rem] font-bold text-ink">
                Wat wij <span className="text-brand">leveren</span>
              </h2>
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {service.products?.map((product, i) => (
              <Reveal key={product.name} delay={i * 80}>
                <div className="bg-white rounded-xl p-5 border border-border hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5 transition-all duration-300 group">
                  <h3 className="text-base font-bold text-ink mb-2 group-hover:text-brand transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-sm text-muted mb-3">{product.description}</p>
                  {product.price && (
                    <span className="inline-block px-3 py-1.5 bg-brand/10 text-brand text-xs font-semibold rounded-full">
                      {product.price}
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={300}>
            <div className="text-center mt-10 p-6 bg-white rounded-xl border border-border">
              <p className="text-muted mb-4">
                Vraag vrijblijvend advies over de beste oplossing voor uw situatie
              </p>
              <Link
                href="/contact/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-brand text-white text-sm font-semibold rounded-full hover:bg-brand-deep transition-all duration-200"
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
              href="/contact/"
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