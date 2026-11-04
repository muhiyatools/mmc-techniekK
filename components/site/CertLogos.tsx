import Image from "next/image";
import { certificationsFor } from "@/lib/certifications";

/** The certification logos in a row, from the shared module. `height` is the logo height in px. */
export function CertLogos({ names, height = 40, className = "", tile = false }: { names: readonly string[]; height?: number; className?: string; tile?: boolean }) {
  const { known, unknown } = certificationsFor(names);
  return (
    <div className={`flex flex-wrap items-center ${tile ? "gap-2.5" : "gap-4"} ${className}`}>
      {known.map((c) => {
        // A wide wordmark needs less height than a round seal to look the same size.
        const h = c.width / c.height > 2 ? Math.round(height * 0.65) : height;
        const img = <Image src={c.logo} alt={c.name} width={Math.round((c.width / c.height) * h * 2)} height={h * 2} style={{ height: h, width: "auto" }} />;
        return tile ? (
          <span key={c.name} className="grid h-16 place-items-center rounded-xl bg-white px-3.5">
            {img}
          </span>
        ) : (
          <span key={c.name} className="flex">
            {img}
          </span>
        );
      })}
      {unknown.map((n) => (
        <span key={n} className="t-mono rounded-md bg-paper px-2.5 py-1.5 text-slate">
          {n}
        </span>
      ))}
    </div>
  );
}
