import type { Media } from "@/lib/content/types";

const base = process.env.NEXT_PUBLIC_SUPABASE_URL;

/** Public URL of a media row (both the `media` bucket and the legacy `product-images` bucket are public). */
export function mediaUrl(media: Pick<Media, "bucket" | "path">): string {
  return `${base}/storage/v1/object/public/${media.bucket}/${media.path.split("/").map(encodeURIComponent).join("/")}`;
}

/**
 * Keeps a photo from appearing twice on one page. Sections claim media as they render,
 * in page order; `pick` returns the first candidate that is still free.
 */
export class MediaClaims {
  private used = new Set<string>();

  claim(media: Media | null | undefined): Media | null {
    if (!media || this.used.has(media.id)) return null;
    this.used.add(media.id);
    return media;
  }

  pick(...candidates: (Media | null | undefined)[]): Media | null {
    for (const m of candidates) {
      const got = this.claim(m);
      if (got) return got;
    }
    return null;
  }

  has(media: Media | null | undefined) {
    return !!media && this.used.has(media.id);
  }
}
