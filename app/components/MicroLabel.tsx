import InstrumentDot from "./InstrumentDot";

type Variant = "muted" | "brand" | "inverse";

interface MicroLabelProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: "label" | "micro";
  withDot?: boolean;
  className?: string;
  id?: string;
}

const VARIANT: Record<Variant, string> = {
  muted:   "text-muted",
  brand:   "text-brand",
  inverse: "text-base/55",
};

const SIZE = {
  label: "text-[0.6875rem] tracking-[0.18em]",
  micro: "text-[0.625rem] tracking-[0.24em]",
};

/*
 * Tracked uppercase overline. Sits above a heading or starts a metadata row.
 * Never a pill, never filled. Optional brand InstrumentDot leads the row.
 */
export default function MicroLabel({
  children,
  variant = "muted",
  size = "label",
  withDot = false,
  className = "",
  id,
}: MicroLabelProps) {
  return (
    <p
      id={id}
      className={`inline-flex items-center gap-2 font-sans font-bold uppercase ${SIZE[size]} ${VARIANT[variant]} ${className}`}
    >
      {withDot && <InstrumentDot variant={variant === "inverse" ? "inverse" : "default"} />}
      <span>{children}</span>
    </p>
  );
}
