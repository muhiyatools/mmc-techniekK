export default function SectionBadge({ text }: { text: string }) {
  return (
    <div className="inline-flex items-center gap-[15px] text-ink text-[0.875rem] font-semibold uppercase tracking-[0.3em] mb-6 font-sans">
      <svg className="w-[11px] h-[11px] text-brand" viewBox="0 0 512 512" fill="currentColor" aria-hidden="true">
        <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8z"/>
      </svg>
      {text}
    </div>
  );
}
