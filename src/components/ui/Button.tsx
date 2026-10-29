import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/lib/cx";

export type ButtonVariant = "primary" | "secondary" | "link";

const BASE = "inline-flex items-center gap-2.5 text-sm transition-[color,background-color,border-color] duration-200";

const VARIANTS: Record<ButtonVariant, string> = {
  // Filled red; dark ink for contrast on the red fill.
  primary:
    "h-[46px] border border-red bg-red px-5 font-semibold tracking-[0.02em] text-surface-deep hover:bg-red-bright hover:text-surface-deep",
  // Outlined, neutral border that turns red on hover.
  secondary:
    "h-[46px] border border-border-neutral px-5 font-medium text-text hover:border-red hover:text-text",
  // Underlined text link.
  link: "border-b border-red pb-1 font-medium text-text hover:text-red-bright",
};

export const buttonClasses = (variant: ButtonVariant = "primary", className?: string): string =>
  cx(BASE, VARIANTS[variant], className);

interface ButtonProps extends ComponentPropsWithoutRef<"button"> {
  variant?: ButtonVariant;
}

export function Button({ variant = "primary", className, type = "button", ...rest }: ButtonProps) {
  return <button type={type} className={buttonClasses(variant, className)} {...rest} />;
}

interface LinkButtonProps extends Omit<ComponentPropsWithoutRef<"a">, "href"> {
  href: string;
  variant?: ButtonVariant;
  children?: ReactNode;
}

/** Anchor styled as a button. Internal routes use next/link; hash, mailto and http(s) use a plain anchor. */
export function LinkButton({ href, variant = "primary", className, children, ...rest }: LinkButtonProps) {
  const classes = buttonClasses(variant, className);
  const isInternalRoute = href.startsWith("/") && !href.startsWith("//");
  if (isInternalRoute) {
    return (
      <Link href={href} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  const isExternal = /^https?:\/\//.test(href);
  return (
    <a
      href={href}
      className={classes}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
