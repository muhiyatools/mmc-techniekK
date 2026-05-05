import InstrumentDot from "./InstrumentDot";

/*
 * Lightweight overline badge. Kept as a thin compatibility wrapper so
 * older imports keep working — new code should prefer composing an
 * `InstrumentDot + uppercase label` directly.
 */
export default function SectionBadge({ text }: { text: string }) {
  return (
    <p className="inline-flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.22em] text-muted font-sans mb-4">
      <InstrumentDot size={4} />
      {text}
    </p>
  );
}
