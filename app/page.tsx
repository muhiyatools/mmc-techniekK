import Hero from "./sections/Hero";
import Services from "./sections/Services";
import Projects from "./sections/Projects";
import WhyUs from "./sections/WhyUs";
import Process from "./sections/Process";
import Testimonials from "./sections/Testimonials";
import Partners from "./sections/Partners";
import Certifications from "./sections/Certifications";
import Contact from "./sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Projects />
      <WhyUs />
      <Process />
      <Testimonials />
      <Partners />
      <Certifications />
      <Contact />
    </>
  );
}
