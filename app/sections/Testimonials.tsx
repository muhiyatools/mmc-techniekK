import { testimonials } from "@/lib/data";
import Reveal from "../components/Reveal";

export default function Testimonials() {
  const [featured, ...rest] = testimonials;

  return (
    <section className="py-24 lg:py-32 bg-surface">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-16 lg:mb-24">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-muted mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-brand" />
              Wat klanten zeggen
            </span>
            <h2 className="text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
              Vertrouwd door
              <br />
              <span className="text-brand">onze klanten</span>
            </h2>
          </Reveal>
          <Reveal delay={100} className="flex items-end">
            <a
              href="https://g.co/kgs/3y8vZ8W"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-muted hover:text-ink transition-colors duration-200 lg:ml-auto"
            >
              <span className="text-brand">★</span>
              <span className="font-semibold">4,9 / 5 op Google</span>
            </a>
          </Reveal>
        </div>

        <div className="grid lg:grid-cols-[1fr_1px_1fr] gap-0">
          {/* Featured */}
          <Reveal variant="scale">
            <article className="lg:pr-16 pb-10 lg:pb-0">
              <div className="flex gap-0.5 mb-6">
                {Array.from({ length: featured.stars }).map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-brand" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xl lg:text-2xl text-ink leading-relaxed mb-8 font-medium">
                &ldquo;{featured.text}&rdquo;
              </p>
              <div className="border-t border-border pt-6">
                <p className="text-sm font-semibold text-ink">{featured.name}</p>
                <p className="text-sm text-muted mt-0.5">{featured.role}</p>
              </div>
            </article>
          </Reveal>

          <div className="hidden lg:block bg-border" aria-hidden="true" />

          <div className="lg:pl-16 flex flex-col divide-y divide-border border-t border-border lg:border-t-0">
            {rest.map((t, i) => (
              <Reveal key={t.name} delay={(i + 1) * 80}>
                <article className="py-8 first:pt-0 lg:first:pt-0">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <svg key={j} className="w-4 h-4 text-brand" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-base text-copy leading-relaxed mb-4">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <p className="text-sm font-semibold text-ink">{t.name}</p>
                  <p className="text-sm text-muted mt-0.5">{t.role}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
