import Image from "next/image";
import type { Media } from "@/lib/content/types";
import { t, type Locale } from "@/lib/i18n/config";
import { mediaUrl } from "@/lib/media";

type Props = {
  media: Media;
  lang: Locale;
  /** `sizes` attribute; required so the browser picks the right width. */
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Fill the positioned parent (default) or render at intrinsic ratio. */
  fill?: boolean;
  /** Decorative: empty alt (the caption already says what it is). */
  decorative?: boolean;
  quality?: 70 | 80;
  /** `contain` for product shots on white (no placeholder colour). */
  fit?: "cover" | "contain";
};

/** A photo from the media library: optimised, with its dominant colour as placeholder. */
export function Photo({ media, lang, sizes, priority, className = "", fill = true, decorative, quality = 70, fit = "cover" }: Props) {
  const alt = decorative ? "" : t(media.alt, lang);
  const style =
    fit === "contain"
      ? { objectFit: "contain" as const }
      : { objectFit: "cover" as const, objectPosition: `${media.focal_x}% ${media.focal_y}%`, backgroundColor: media.dominant_color };
  if (fill) {
    return <Image src={mediaUrl(media)} alt={alt} fill sizes={sizes} priority={priority} quality={quality} className={className} style={style} />;
  }
  return (
    <Image
      src={mediaUrl(media)}
      alt={alt}
      width={media.width}
      height={media.height}
      sizes={sizes}
      priority={priority}
      quality={quality}
      className={className}
      style={{ ...style, height: "auto" }}
    />
  );
}
