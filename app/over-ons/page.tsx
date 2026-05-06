import Image from "next/image";
import Link from "next/link";
import { whyChooseUs, companyStats, contactInfo, certifications } from "@/lib/data";
import Reveal from "../components/Reveal";

const team = [
  { name: "Mark van der Meer", role: "Eigenaar & Hoofd Installateur", initials: "MvM" },
  { name: "Sander Jansen", role: "Projectleider", initials: "SJ" },
  { name: "Mike de Ruiter", role: "Eerste Monteur", initials: "MdR" },
];

const milestones = [
  { year: "2008", text: "MMC Techniek opgericht vanuit Oudewater" },
  { year: "2012", text: "Eerste 500 projecten voltooid" },
  { year: "2016", text: "Uitbreiding naar zonnepanelen en warmtepompen" },
  { year: "2020", text: "16 monteurs in vaste dienst" },
  { year: "2024", text: "2500+ projecten, NEN-3140 en VCA gecertificeerd" },
];

const clientLogos = [
  { name: "Aldi", src: "/images/partners/aldi.png" },
  { name: "AFAS Software", src: "/images/partners/afas.png" },
  { name: "Pets Place", src: "/images/partners/pets-place.png" },
  { name: "Homij", src: "/images/partners/homij.png" },
  { name: "SSH", src: "/images/partners/ssh.png" },
];

export const metadata = {
  title: "Over ons | MMC Techniek B.V.",
  description:
    "Leer MMC Techniek B.V. kennen. Sinds 2008 uw specialist in warmtepompen, zonnepanelen, airco en verduurzaming uit Oudewater.",
};

export default function AboutPage() {
  return (
    <>
      {/* Hero with real project image */}
      <section className="relative pt-[90px] lg:pt-[120px] pb-20 lg:pb-28 overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/images/projects/PHOTO-2024-12-03-12-54-01.jpg"
            alt="MMC Techniek project"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/90 via-ink/70 to-ink/40" />
        </div>

        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl">
            <Reveal>
              <span className="inline-flex items-center gap-2.5 text-[0.75rem] font-bold uppercase tracking-[0.18em] text-brand mb-6">
                <span className="w-2 h-2 rounded-full bg-brand" />
                Over ons
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="text-[2.75rem] sm:text-[3.5rem] lg:text-[4.5rem] font-bold leading-[1.02] tracking-tight text-white mb-8">
                Vakmanschap uit
                <br />
                <span className="text-brand">Oudewater</span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="text-xl text-white/70 leading-relaxed max-w-2xl">
                Sinds 2008 installeren wij warmtepompen, zonnepanelen, airco en complete energiesystemen.
                Met een vast team van eigen vakmensen, geen onderaannemers, en een commitment dat niet ophoudt na oplevering.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Stats — Committed layout with surface contrast */}
      <section className="bg-concrete border-y border-hairline">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {companyStats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 100}>
                <div className="relative pl-5 before:absolute before:left-0 before:top-1 before:w-1 before:h-8 before:bg-aurora-1">
                  <div className="text-4xl lg:text-5xl font-bold text-brand tabular mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm font-semibold text-muted uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Story / Timeline */}
      <section className="py-28 lg:py-36 bg-base">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <span className="inline-flex items-center gap-2.5 text-[0.75rem] font-bold uppercase tracking-[0.18em] text-muted mb-5">
                  <span className="w-2 h-2 rounded-full bg-brand" />
                  Ons verhaal
                </span>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink mb-6">
                  Van 1 man
                  <br />
                  <span className="text-brand">naar 16 monteurs</span>
                </h2>
              </Reveal>
              <Reveal delay={200}>
                <p className="text-lg text-muted leading-relaxed mb-8">
                  Wat begon als een eenmanszaak in Oudewater groeide uit tot een team van 16 vakmensen.
                  Nog steeds staan dezelfde waarden centraal: vakmanschap, betrouwbaarheid, en service na oplevering.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-7">
              <div className="relative pl-8 lg:pl-12 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-gradient-to-b before:from-aurora-1 before:via-brand before:to-aurora-2">
                {milestones.map((m, i) => (
                  <Reveal key={m.year} delay={i * 80}>
                    <div className="relative mb-10 last:mb-0">
                      {/* Timeline dot */}
                      <div className="absolute -left-[calc(2rem+1px)] lg:-left-[calc(3rem+1px)] w-4 h-4 rounded-full bg-brand border-4 border-base -translate-x-1/2" />
                      <div className="flex items-baseline gap-4 mb-1">
                        <span className="text-2xl font-bold text-brand tabular">{m.year}</span>
                        <div className="flex-1 h-px bg-hairline" />
                      </div>
                      <p className="text-base text-copy leading-relaxed">{m.text}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team — with photo placeholders */}
      <section className="py-28 lg:py-36 bg-surface border-y border-hairline">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-16 lg:mb-20">
            <Reveal>
              <span className="inline-flex items-center gap-2.5 text-[0.75rem] font-bold uppercase tracking-[0.18em] text-muted mb-5">
                <span className="w-2 h-2 rounded-full bg-brand" />
                Ons team
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
                Eigen mensen,
                <br />
                <span className="text-brand">eigen kwaliteit</span>
              </h2>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {team.map((person, i) => (
              <Reveal key={person.name} delay={i * 100}>
                <div className="bg-base border border-hairline overflow-hidden rounded-xl">
                  {/* Photo placeholder — user can replace with real photo */}
                  <div className="aspect-[4/3] bg-gradient-to-br from-brand/10 via-concrete to-aurora-1/10 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-brand/15 flex items-center justify-center">
                      <span className="text-2xl font-bold text-brand">{person.initials}</span>
                    </div>
                  </div>
                  <div className="p-5 text-center">
                    <h3 className="text-lg font-bold text-ink mb-1">{person.name}</h3>
                    <p className="text-sm text-muted">{person.role}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={300}>
            <p className="text-center text-sm text-muted mt-10 max-w-lg mx-auto">
              Foto's van ons team volgen binnenkort. Alle monteurs zijn NEN-3140 en VCA gecertificeerd.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Clients / Partners */}
      <section className="py-28 lg:py-36 bg-base">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-16 lg:mb-20">
            <Reveal>
              <span className="inline-flex items-center gap-2.5 text-[0.75rem] font-bold uppercase tracking-[0.18em] text-muted mb-5">
                <span className="w-2 h-2 rounded-full bg-brand" />
                Onze klanten
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
                Zowel particulier
                <br />
                <span className="text-brand">als zakelijk</span>
              </h2>
            </Reveal>
          </div>

          {/* Partner logos grid */}
          <Reveal delay={200}>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-6 max-w-4xl mx-auto">
              {clientLogos.map((logo, i) => (
                <div
                  key={logo.name}
                  className="flex items-center justify-center p-4 bg-surface border border-hairline rounded-xl h-20"
                >
                  <Image
                    src={logo.src}
                    alt={logo.name}
                    width={120}
                    height={48}
                    className="max-h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity"
                  />
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={300}>
            <p className="text-center text-sm text-muted mt-10">
              Plus 2500+ tevreden particuliere klanten in de regio Utrecht en omgeving.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Why Choose Us — editorial layout */}
      <section className="py-28 lg:py-36 bg-surface border-y border-hairline">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="max-w-2xl mb-16 lg:mb-20">
            <Reveal>
              <span className="inline-flex items-center gap-2.5 text-[0.75rem] font-bold uppercase tracking-[0.18em] text-muted mb-5">
                <span className="w-2 h-2 rounded-full bg-brand" />
                Waarom MMC
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
                Het verschil zit in
                <br />
                <span className="text-brand">de details</span>
              </h2>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 lg:gap-10">
            {whyChooseUs.map((item, i) => (
              <Reveal key={item.title} delay={i * 100}>
                <div className="bg-base border border-hairline p-8 lg:p-10 rounded-xl relative overflow-hidden">
                  {/* Aurora top stripe */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-aurora-1 via-brand/40 to-aurora-2" />
                  <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center mb-6">
                    <span className="text-2xl font-bold text-brand">{i + 1}</span>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-semibold text-ink mb-3">
                    {item.title}
                  </h3>
                  <p className="text-base text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-28 lg:py-36 bg-base">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-16 lg:mb-20">
            <Reveal>
              <span className="inline-flex items-center gap-2.5 text-[0.75rem] font-bold uppercase tracking-[0.18em] text-muted mb-5">
                <span className="w-2 h-2 rounded-full bg-brand" />
                Gecertificeerd
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h2 className="text-[2.5rem] sm:text-[3rem] lg:text-[3.5rem] font-bold leading-[1.05] tracking-tight text-ink">
                Erkend <span className="text-brand">vakmanschap</span>
              </h2>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto">
            {certifications.map((cert, i) => (
              <Reveal key={cert.name} delay={i * 100}>
                <div className="flex items-center gap-6 p-6 lg:p-8 bg-surface border border-hairline rounded-xl">
                  <div className="shrink-0 w-20 h-20 rounded-xl bg-base border border-hairline flex items-center justify-center p-3">
                    <Image
                      src={cert.src}
                      alt={cert.name}
                      width={60}
                      height={60}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-ink mb-1">{cert.name}</h3>
                    <p className="text-base text-muted">{cert.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 lg:py-36 bg-brand relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--color-brand-deep)/40,_transparent_60%)]" />
        <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10 text-center">
          <Reveal>
            <h2 className="text-[2.25rem] sm:text-[3rem] font-bold leading-[1.05] tracking-tight text-white mb-6">
              Klaar om uw woning te
              <br />
              <span className="text-ink">verduurzamen</span>?
            </h2>
          </Reveal>
          <Reveal delay={100}>
            <p className="text-lg text-white/70 leading-relaxed max-w-xl mx-auto mb-10">
              Neem contact op voor een vrijblijvend gesprek. We komen graag bij u langs.
            </p>
          </Reveal>
          <Reveal delay={200}>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact/"
                className="px-9 py-4 bg-white text-brand text-base font-semibold rounded-full hover:bg-hairline transition-all duration-200 shadow-lg shadow-ink/10"
              >
                Offerte aanvragen
              </Link>
              <a
                href={`tel:${contactInfo.phone}`}
                className="px-9 py-4 border-2 border-white/60 text-white text-base font-semibold rounded-full hover:border-white hover:bg-white/10 transition-all duration-200"
              >
                Bel {contactInfo.phoneDisplay}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
