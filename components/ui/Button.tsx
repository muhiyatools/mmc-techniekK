import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

type Variant = "primary" | "secondary" | "on-dark" | "white";
type Size = "md" | "sm";

type Common = {
  variant?: Variant;
  size?: Size;
  /** Icon in the knob. Pass `false` for a plain pill without a knob. */
  icon?: IconName | false;
  children: ReactNode;
  className?: string;
};

function classes({ variant = "primary", size = "md", icon = "arrow", className = "" }: Common) {
  return ["btn", `btn-${variant}`, size === "sm" && "btn-sm", icon === false && "btn-plain", className].filter(Boolean).join(" ");
}

function Content({ icon = "arrow", size = "md", children }: Pick<Common, "icon" | "size" | "children">) {
  return (
    <>
      <span>{children}</span>
      {icon !== false && (
        <span className="knob">
          <Icon name={icon} size={size === "sm" ? 16 : 18} />
        </span>
      )}
    </>
  );
}

/** Pill button with the "plug" knob, rendered as a link. */
export function ButtonLink({ href, variant, size, icon, children, className, ...rest }: Common & Omit<ComponentProps<typeof Link>, "children" | "className">) {
  const external = typeof href === "string" && /^(https?:|tel:|mailto:)/.test(href);
  const cls = classes({ variant, size, icon, className, children });
  if (external) {
    return (
      <a href={href as string} className={cls} {...(rest as ComponentProps<"a">)}>
        <Content icon={icon} size={size}>{children}</Content>
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      <Content icon={icon} size={size}>{children}</Content>
    </Link>
  );
}

/** Pill button with the "plug" knob, rendered as a <button>. */
export function Button({ variant, size, icon, children, className, type = "button", ...rest }: Common & Omit<ComponentProps<"button">, "children" | "className">) {
  return (
    <button type={type} className={classes({ variant, size, icon, className, children })} {...rest}>
      <Content icon={icon} size={size}>{children}</Content>
    </button>
  );
}
