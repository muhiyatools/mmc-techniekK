import Hero from "./sections/Hero";
import Services from "./sections/Services";
import ProcessSteps from "./sections/ProcessSteps";
import Projects from "./sections/Projects";
import Testimonials from "./sections/Testimonials";
import Partners from "./sections/Partners";

/*
 * Home — section rhythm follows the approved shape brief:
 *   Hero (with metric row trust signals)
 *   ↓
 *   Services (typographic ledger, on Void)
 *   ↓
 *   Process (4 steps, on Void)
 *   ↓
 *   Projects (asymmetric editorial grid, on Pearl)
 *   ↓
 *   Testimonials (split layout, on Void)
 *   ↓
 *   Partners (logo ledger, on Pearl)
 *   ↓
 *   Footer (Brand-deep, footer CTA)
 *
 * Surface alternation Void / Pearl prevents flatness without resorting
 * to dark sections.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <ProcessSteps />
      <Projects />
      <Testimonials />
      <Partners />
    </>
  );
}
