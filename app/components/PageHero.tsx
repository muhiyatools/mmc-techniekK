import Image from "next/image";
import Breadcrumb from "./Breadcrumb";

interface PageHeroProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  breadcrumbItems: { label: string; href?: string }[];
}

export default function PageHero({ title, description, image, imageAlt, breadcrumbItems }: PageHeroProps) {
  return (
    <section className="relative pt-[4.75rem] min-h-[280px] flex items-end overflow-hidden" aria-label="Pagina introductie">
      <div className="absolute inset-0">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        {/* Darker overlays for better text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-ink/98 via-ink/82 to-ink/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/55 via-transparent to-transparent" />
      </div>

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-16 pb-14 lg:pb-16 relative w-full">
        {/* Breadcrumb — instant, no FadeIn */}
        <Breadcrumb items={breadcrumbItems} />
        <h1
          className="font-display font-extrabold uppercase leading-[0.88] tracking-tight text-base max-w-[700px] mt-5"
          style={{ fontSize: "clamp(2.75rem, 6vw, 5rem)" }}
        >
          {title}
        </h1>
        <p className="text-[1rem] leading-[1.72] text-base/70 mt-5 max-w-[520px] font-sans">
          {description}
        </p>
      </div>

      {/* Brand accent bar at bottom */}
      <div className="absolute inset-x-0 bottom-0 h-[3px] bg-brand" aria-hidden="true" />
    </section>
  );
}
