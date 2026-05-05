import FadeIn from "../components/FadeIn";
import Image from "next/image";

export default function About() {
  return (
    <section className="py-[96px] lg:py-[128px] bg-base" aria-labelledby="about-heading">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <FadeIn>
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src="/images/services/zonnepanelen.webp"
                  alt="MMC Techniek monteurs aan het werk bij een zonnepanelen project in Oudewater"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-ink p-8 hidden lg:block rounded-2xl">
                <p className="text-[2.5rem] font-extrabold text-brand leading-none">16+</p>
                <p className="text-[0.6875rem] font-bold uppercase tracking-[0.06em] text-base mt-2">Jaar ervaring</p>
              </div>
              {/* Decorative frame */}
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-brand/20 -z-10" aria-hidden="true" />
            </div>
          </FadeIn>

          <div>
            <FadeIn delay={80}>
              <p className="text-[0.6875rem] font-bold uppercase tracking-[0.13em] text-brand font-sans mb-4">
                Over ons
              </p>
              <h2
                id="about-heading"
                className="font-display font-bold uppercase leading-[0.9] tracking-tight text-ink mb-6"
                style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
              >
                Uw partner in verduurzaming vanuit Oudewater
              </h2>
            </FadeIn>

            <FadeIn delay={160}>
              <p className="text-base leading-[1.7] text-copy/80 font-sans mb-6">
                MMC Techniek BV is een echt familiebedrijf uit Oudewater. Al sinds 2008 helpen we woningeigenaren en bedrijven in heel Nederland met duurzame installaties die echt werken.
              </p>
              <p className="text-base leading-[1.7] text-copy/80 font-sans mb-10">
                We doen geen standaardpakketten. Elk huis is anders, elke klant heeft andere wensen. Daarom kijken we eerst, denken we mee en komen dan pas met een passend advies.
              </p>
            </FadeIn>

            <FadeIn delay={240} direction="right">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8 border-t border-concrete">
                {[
                  { value: "16+", label: "Jaar ervaring" },
                  { value: "1000+", label: "Tevreden klanten" },
                  { value: "7", label: "Specialisaties" },
                  { value: "A++", label: "Energielabel" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="text-[1.75rem] font-extrabold text-ink leading-none font-display">{stat.value}</p>
                    <p className="text-[0.6875rem] font-bold uppercase tracking-[0.07em] text-muted font-sans mt-2">{stat.label}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}
