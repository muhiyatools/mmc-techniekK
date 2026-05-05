import FadeIn from "../components/FadeIn";
import InstrumentDot from "../components/InstrumentDot";
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

        <FadeIn>
          <div className="grid lg:grid-cols-[1fr_auto] items-end gap-6 mb-14 lg:mb-20">
            <div>
              <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-muted font-sans mb-4">
                <InstrumentDot size={4} />
                Wat klanten zeggen
              </p>
              <h2
                id="testimonials-heading"
                className="font-display font-bold uppercase leading-[0.92] tracking-[-0.012em] text-ink"
                style={{ fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)" }}
              >
                Vertrouwd door<br />
                <span className="text-brand">onze klanten</span>
              </h2>
            </div>
            <a
              href="https://g.co/kgs/3y8vZ8W"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 text-[0.8125rem] font-semibold text-muted font-sans tabular shrink-0 hover:text-ink transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-sm"
            >
              <span className="text-brand">★</span>&nbsp;4,9 / 5 op Google
              <span
                aria-hidden="true"
                className="block w-[5px] h-[5px] rounded-full bg-brand opacity-0 group-hover:opacity-100 transition-opacity duration-200"
              />
            </a>
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-[1fr_1px_1fr] gap-0">

          {/* Featured */}
          <FadeIn delay={0} direction="scale">
            <article className="lg:pr-16 pb-10 lg:pb-0">
              <StarRow count={featured.stars} size="lg" />

              <div
                className="font-display font-bold text-brand leading-none select-none mb-4"
                style={{ fontSize: "clamp(4rem, 8vw, 7rem)", lineHeight: 0.8 }}
                aria-hidden="true"
              >
                &ldquo;
              </div>

              <blockquote>
                <p
                  className="text-ink font-sans leading-[1.65] mb-8 max-w-[44ch]"
                  style={{ fontSize: "clamp(1.0625rem, 1.5vw, 1.1875rem)" }}
                >
                  {featured.text}
                </p>
                <footer className="border-t border-hairline pt-6">
                  <p className="text-[0.75rem] font-bold uppercase tracking-[0.16em] text-ink font-display">
                    {featured.name}
                  </p>
                  <p className="text-[0.6875rem] text-muted font-sans mt-1">{featured.role}</p>
                </footer>
              </blockquote>
            </article>
          </FadeIn>

          <div className="hidden lg:block bg-hairline" aria-hidden="true" />

          <div className="lg:pl-16 flex flex-col divide-y divide-hairline border-t border-hairline lg:border-t-0">
            {rest.map((t, i) => (
              <FadeIn key={t.name} delay={(i + 1) * 80} direction="right">
                <article className="py-8 first:pt-0 lg:first:pt-0">
                  <StarRow count={t.stars} size="sm" />
                  <blockquote>
                    <p className="text-[0.9375rem] leading-[1.7] text-copy font-sans mb-4 max-w-[60ch]">
                      &ldquo;{t.text}&rdquo;
                    </p>
                    <footer>
                      <p className="text-[0.75rem] font-bold uppercase tracking-[0.16em] text-ink font-display">
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
