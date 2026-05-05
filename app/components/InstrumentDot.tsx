type Variant = "default" | "inverse";

/*
 * The 4–6px brand mark. Used in nav (active/hover) and as an inline
 * lead in section overlines. Soft outer ring sells "instrument indicator."
 */
export default function InstrumentDot({
  variant = "default",
  size = 6,
  className = "",
  pulse = false,
}: {
  variant?: Variant;
  size?: 4 | 6 | 8;
  className?: string;
  pulse?: boolean;
}) {
  const px = `${size}px`;
  return (
    <span
      aria-hidden="true"
      className={`relative inline-block shrink-0 rounded-full ${
        variant === "inverse" ? "bg-base" : "bg-brand"
      } ${className}`}
      style={{
        width: px,
        height: px,
        boxShadow:
          variant === "inverse"
            ? "0 0 0 3px color-mix(in oklch, var(--color-base) 22%, transparent)"
            : "0 0 0 3px color-mix(in oklch, var(--color-brand) 18%, transparent)",
      }}
    >
      {pulse && (
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{
            background: variant === "inverse" ? "var(--color-base)" : "var(--color-brand)",
            animation: "hero-fade 1.4s cubic-bezier(0.22,1,0.36,1) infinite alternate",
          }}
        />
      )}
    </span>
  );
}
