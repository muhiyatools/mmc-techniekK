import HairlineDivider from "./HairlineDivider";

interface ShelfProps {
  children: React.ReactNode;
  aurora?: boolean;
  soft?: boolean;
  className?: string;
  as?: "div" | "section" | "article" | "aside";
  id?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
}

/*
 * Layered Mist surface above Void or Pearl. 1px Hairline border, no shadow.
 * Optional Aurora rule pinned to the top edge for the rare hero/contact moment.
 *
 * Replaces the default "card" pattern. Use sparingly: hero instrument panel,
 * contact form, certification plates. Anywhere else, use the surface ladder
 * (Void → Pearl) with hairline dividers, not a Shelf.
 */
export default function Shelf({
  children,
  aurora = false,
  soft = false,
  className = "",
  as: Tag = "div",
  id,
  ariaLabel,
  ariaLabelledBy,
}: ShelfProps) {
  return (
    <Tag
      id={id}
      aria-label={ariaLabel}
      aria-labelledby={ariaLabelledBy}
      className={`relative ${soft ? "shelf-soft" : "shelf"} ${className}`}
    >
      {aurora && (
        <HairlineDivider
          variant="aurora"
          className="absolute inset-x-0 top-0"
        />
      )}
      {children}
    </Tag>
  );
}
