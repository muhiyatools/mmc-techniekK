import Hero from "./sections/Hero";
import TrustBand from "./components/TrustBand";
import Services from "./sections/Services";
import WhyChooseUs from "./sections/WhyChooseUs";
import ProcessSteps from "./sections/ProcessSteps";
import Projects from "./sections/Projects";
import Testimonials from "./sections/Testimonials";
import Partners from "./sections/Partners";

/*
 * Home — section rhythm:
 *   Hero (word-lift, trust signals)
 *   TrustBand (logo marquee)
 *   Services (editorial ledger)
 *   WhyChooseUs (sculptural 16+, asymmetric)
 *   ProcessSteps (4-step horizontal timeline)
 *   Projects (asymmetric gallery preview)
 *   Testimonials (split layout)
 *   Partners (logo ledger)
 *   Footer (Brand-deep)
 */
export default function Home() {
  return (
    <>
      <Hero />
      <TrustBand />
      <Services />
      <WhyChooseUs />
      <ProcessSteps />
      <Projects />
      <Testimonials />
      <Partners />
    </>
  );
}
