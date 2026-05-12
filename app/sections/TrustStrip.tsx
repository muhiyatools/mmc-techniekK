import Image from "next/image";
import Link from "next/link";
import Reveal from "../components/Reveal";

export default function TrustStrip() {
  return (
    <section className="relative py-32 bg-base overflow-hidden">
      <div className="grid gap-20 items-start max-w-[1280px] mx-auto px-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-6">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand"></span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted">Expertise & Vakmanschap</span>
            </div>
            <h2 className="font-display text-[clamp(3rem,7vw,6rem)] font-extrabold leading-[0.82] tracking-[-0.03em] text-ink mb-12">
              HET VERSCHIL ZIT IN DE DETAILS
            </h2>
          </Reveal>

          <div className="border-t border-hairline">
            <Reveal delay={0}>
              <div className="flex gap-8 py-8 border-b border-hairline">
                <span className="font-display text-base font-bold text-brand tracking-[0.1em]">01</span>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-ink">BEWEZEN ERVARING</h3>
                  <p className="text-[15px] text-muted max-w-[40ch] leading-relaxed">
                    Sinds 2008 uw vertrouwde partner voor duurzame renovaties en technische installaties in Oudewater.
                  </p>
                </div>
              </div>
            </Reveal>
            
            <Reveal delay={90}>
              <div className="flex gap-8 py-8 border-b border-hairline">
                <span className="font-display text-base font-bold text-brand tracking-[0.1em]">02</span>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-ink">GECERTIFICEERD TEAM</h3>
                  <p className="text-[15px] text-muted max-w-[40ch] leading-relaxed">
                    Onze eigen monteurs borgen de kwaliteit van elke installatie, van warmtepomp tot meterkast.
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={180}>
              <div className="flex gap-8 py-8 border-b border-hairline">
                <span className="font-display text-base font-bold text-brand tracking-[0.1em]">03</span>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-ink">OPTIMALE SERVICE</h3>
                  <p className="text-[15px] text-muted max-w-[40ch] leading-relaxed">
                    Wij bouwen aan langdurige relaties door middel van hoogwaardige nazorg en technische precisie.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
        
        <div className="lg:col-span-6">
          <Reveal variant="scale" delay={120}>
            <div className="aspect-[4/5] overflow-hidden border border-hairline relative">
              <Image 
                src="/images/projects/PHOTO-2024-12-03-12-54-01.jpg" 
                alt="Vakmanschap" 
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
