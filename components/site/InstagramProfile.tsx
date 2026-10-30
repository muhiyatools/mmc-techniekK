import { Icon } from "@/components/ui/Icon";
import type { Settings } from "@/lib/content/types";
import { type Locale } from "@/lib/i18n/config";
import { getDict } from "@/lib/i18n/ui";
import { instagramProfile } from "@/lib/instagram";

/**
 * The MMC Instagram profile, embedded as it is.
 *
 * The frame does the work: our own editorial line on the left, Instagram's own
 * profile embed on the right. Nothing is mirrored or faked, so the section can
 * never drift out of date with the account.
 */
export function InstagramProfile({
  lang,
  settings,
  title,
  lead,
  id = "instagram",
  tone = "white",
}: {
  lang: Locale;
  settings: Pick<Settings, "social">;
  title?: string;
  lead?: string;
  id?: string;
  tone?: "white" | "paper";
}) {
  const d = getDict(lang);
  const profile = instagramProfile(settings);

  return (
    <section id={id} className={`section-y ${tone === "paper" ? "bg-paper" : ""}`} aria-labelledby={`${id}-title`}>
      <div className="wrap grid items-start gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        <div className="flex flex-col gap-5 lg:sticky lg:top-[calc(var(--header-h)+40px)]" data-reveal>
          <span className="t-mono text-graphite">{d.instagram.label}</span>
          <h2 id={`${id}-title`} className="t-h2">
            {title ?? d.instagram.title}
          </h2>
          <p className="t-lead max-w-[42ch]">{lead ?? d.instagram.lead}</p>
          <a href={profile.url} target="_blank" rel="noopener noreferrer" className="link-arrow self-start">
            @{profile.handle}
            <Icon name="arrowUpRight" />
          </a>
        </div>

        <figure className="flex flex-col gap-3" data-reveal>
          <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper">
            {/* Placeholder under the embed: visible while Instagram loads or if it never does. */}
            <div aria-hidden="true" className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-graphite">
              <Icon name="image" size={26} className="opacity-40" />
              <span className="t-mono">@{profile.handle}</span>
            </div>
            <iframe
              src={profile.embed}
              title={d.instagram.frame}
              loading="lazy"
              allow="encrypted-media; clipboard-write"
              referrerPolicy="strict-origin-when-cross-origin"
              className="relative block h-[520px] w-full sm:h-[620px]"
            />
          </div>
          <figcaption className="flex justify-end">
            <a href={profile.url} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1.5 text-sm">
              {d.instagram.profile}
              <Icon name="external" size={14} />
            </a>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
