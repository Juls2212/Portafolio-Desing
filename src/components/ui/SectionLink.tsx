"use client";

import type { ComponentPropsWithoutRef } from "react";
import type { NavId } from "@/content/site";
import { scrollToSection } from "@/lib/scroll-to";
import { buttonClasses, type ButtonVariant } from "./Button";

interface SectionLinkProps extends Omit<ComponentPropsWithoutRef<"a">, "href" | "onClick"> {
  to: NavId;
  variant?: ButtonVariant;
  /** Move focus to the target heading after scrolling. */
  focusTarget?: boolean;
  /** Plain anchor styling (no button chrome), for nav-like links. */
  bare?: boolean;
  onNavigate?: () => void;
}

/** In-page anchor (works without JS) that scrolls via scrollToSection, honoring reduced motion. */
export function SectionLink({
  to,
  variant = "secondary",
  focusTarget = false,
  bare = false,
  onNavigate,
  className,
  ...rest
}: SectionLinkProps) {
  return (
    <a
      href={`#${to}`}
      className={bare ? className : buttonClasses(variant, className)}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
        event.preventDefault();
        onNavigate?.();
        scrollToSection(to, { focus: focusTarget });
      }}
      {...rest}
    />
  );
}
