import type { Settings } from "@/lib/content/types";

/** Used until site_settings.social.instagram_url is filled in from the admin. */
export const DEFAULT_INSTAGRAM_URL = "https://www.instagram.com/mmctechniek/";

export type InstagramProfile = {
  /** Canonical profile URL. */
  url: string;
  /** Bare account name, without the @. */
  handle: string;
  /** The profile, in Instagram's own profile-embed frame. */
  embed: string;
};

/** Normalises whatever is stored in settings into a profile, handle and embed URL. */
export function instagramProfile(settings: Pick<Settings, "social">): InstagramProfile {
  const raw = settings.social.instagram_url?.trim() || DEFAULT_INSTAGRAM_URL;
  const handle = raw.replace(/[?#].*$/, "").replace(/\/+$/, "").split("/").pop()?.replace(/^@/, "") || "mmctechniek";
  return { url: `https://www.instagram.com/${handle}/`, handle, embed: `https://www.instagram.com/${handle}/embed/` };
}
