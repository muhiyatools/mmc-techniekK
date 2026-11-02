"use client";

import { useEffect } from "react";
import { Icon } from "@/components/ui/Icon";

/** Shown inside the panel when a page or save throws, instead of the bare Next.js screen. */
export default function PanelError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="grid min-h-[60vh] place-items-center p-6">
      <div className="w-full max-w-[460px] rounded-2xl border border-line bg-white p-6 text-center shadow-[0_1px_2px_rgba(15,27,38,0.06)]">
        <span className="mx-auto grid size-11 place-items-center rounded-full bg-[color-mix(in_srgb,var(--color-error-line)_12%,white)] text-error">
          <Icon name="alert" size={20} />
        </span>
        <h1 className="mt-3 text-[19px] font-bold text-ink">Dit scherm kon niet laden</h1>
        <p className="mt-1 text-[14px] leading-relaxed text-slate">
          Er ging iets mis aan de serverkant. Wat u net deed is niet opgeslagen. Probeer het opnieuw; blijft het misgaan, herlaad dan de pagina.
        </p>
        <div className="mt-4 flex justify-center gap-2">
          <button type="button" onClick={reset} className="h-10 rounded-lg bg-blue px-4 font-semibold text-white hover:bg-blue-deep">
            Opnieuw proberen
          </button>
          <button type="button" onClick={() => window.location.reload()} className="h-10 rounded-lg px-4 font-semibold shadow-[inset_0_0_0_1.5px_var(--color-line-strong)] hover:bg-paper">
            Herladen
          </button>
        </div>
        {error.digest && <p className="t-mono mt-3 text-[10px] uppercase text-graphite">Foutcode {error.digest}</p>}
      </div>
    </div>
  );
}
