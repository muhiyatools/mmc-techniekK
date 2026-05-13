"use client";
import { useLanguage } from "@/lib/i18n/LanguageContext";

export default function TrustBar() {
  const { t } = useLanguage();
  const labels = t.components.trustBar;
  const items = [
    {
      label: labels[0],
      icon: (
        <svg className="w-4 h-4 text-brand shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      ),
    },
    {
      label: labels[1],
      icon: (
        <svg className="w-4 h-4 text-brand shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 2C8.134 2 5 5.134 5 9v1H3v2h18v-2h-2V9c0-3.866-3.134-7-7-7zm0 0v3m-6 6h12M4 18h16" />
        </svg>
      ),
    },
    {
      label: labels[2],
      icon: (
        <svg className="w-4 h-4 text-brand shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: labels[3],
      icon: (
        <svg className="w-4 h-4 text-brand shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
        </svg>
      ),
    },
    {
      label: labels[4],
      icon: (
        <svg className="w-4 h-4 text-brand shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="hidden lg:block h-[48px] bg-ink/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-full flex items-center justify-center gap-10">
        {items.map((item) => (
          <div key={item.label} className="relative flex items-center gap-2.5 group cursor-default transition-transform duration-300 hover:-translate-y-px">
            <div className="p-1.5 rounded-lg bg-white/5 group-hover:bg-brand/10 transition-colors">
              {item.icon}
            </div>
            <span className="text-[10px] font-bold text-white/70 tracking-widest uppercase">
              {item.label}
            </span>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand rounded-full opacity-0 scale-0 group-hover:opacity-100 group-hover:scale-100 transition-all duration-300" />
          </div>
        ))}
      </div>
    </div>
  );
}
