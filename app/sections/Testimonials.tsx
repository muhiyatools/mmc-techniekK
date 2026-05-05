import FadeIn from "../components/FadeIn";
import { testimonials } from "@/lib/data";

const StarRow = ({ count, size = "sm" }: { count: number; size?: "sm" | "lg" }) => (
  <div
    className={`flex gap-0.5 ${size === "lg" ? "mb-6" : "mb-4"}`}
    role="img"
    aria-label={`${count} van de 5 sterren`}
  >
    {Array.from({ length: count }).map((_, j) => (
      <svg
        key={j}
        className={`${size === "lg" ? "w-4 h-4" : "w-3 h-3"} text-brand`}
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export default function Testimonials() {
  const [featured, ...rest] = testimonials;

  return (
    <section
      className="py-24 lg:py-32 bg-base"
      aria-labelledby="testimonials-heading"
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">

        {/* Header */}
        <FadeIn>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-16 lg:mb-20">
            <div>
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.13em] text-muted font-sans mb-3">
                Wat klanten zeggen
              </p>
              <h2
                id="testimonials-heading"
                className="font-display font-bold uppercase leading-[0.9] tracking-tight text-ink"
                style={{ fontSize: "clamp(2rem, 4.5vw, 3.8rem)" }}
              >
                Vertrouwd door onze<br />
                <span className="text-brand">klanten</span>
              </h2>
            </div>
            <p className="text-[0.8125rem] font-semibold text-muted font-sans shrink-0">
              <span className="text-brand">★</span> 4,9 / 5 op Google
            </p>
          </div>
        </FadeIn>

        {/* Asymmetric layout: featured left, compact stack right */}
        <div className="grid lg:grid-cols-[1fr_1px_1fr] gap-0">

          {/* Featured quote — left column */}
          <FadeIn delay={0} direction="scale">
            <article className="lg:pr-16 pb-10 lg:pb-0">
              <StarRow count={featured.stars} size="lg" />

              {/* Large decorative quotation mark */}
              <div
                className="font-display font-bold text-brand leading-none select-none mb-4"
                style={{ fontSize: "clamp(4rem, 8vw, 7rem)", lineHeight: 0.8 }}
                aria-hidden="true"
              >
                &ldquo;
              </div>

              <blockquote>
                <p
                  className="text-ink font-sans leading-[1.65] mb-8"
                  style={{ fontSize: "clamp(1.0625rem, 1.5vw, 1.1875rem)" }}
                >
                  {featured.text}
                </p>
                <footer className="border-t border-concrete pt-6">
                  <p className="text-[0.75rem] font-bold uppercase tracking-[0.08em] text-ink font-display">
                    {featured.name}
                  </p>
                  <p className="text-[0.6875rem] text-muted font-sans mt-1">{featured.role}</p>
                </footer>
              </blockquote>
            </article>
          </FadeIn>

          {/* Vertical divider */}
          <div className="hidden lg:block bg-concrete" aria-hidden="true" />

          {/* Compact stack — right column */}
          <div className="lg:pl-16 flex flex-col divide-y divide-concrete border-t border-concrete lg:border-t-0">
            {rest.map((t, i) => (
              <FadeIn key={t.name} delay={(i + 1) * 80} direction="right">
                <article className="py-8 first:pt-0 lg:first:pt-0">
                  <StarRow count={t.stars} size="sm" />
                  <blockquote>
                    <p className="text-[0.9375rem] leading-[1.7] text-copy font-sans mb-4">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <footer>
                      <p className="text-[0.75rem] font-bold uppercase tracking-[0.08em] text-ink font-display">
                        {t.name}
                      </p>
                      <p className="text-[0.6875rem] text-muted font-sans mt-0.5">{t.role}</p>
                    </footer>
                  </blockquote>
                </article>
              </FadeIn>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
