import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";

interface HudLabelProps extends ComponentPropsWithoutRef<"span"> {
  /** `accent` is red-bright; `muted` is the default dusty tone. */
  tone?: "muted" | "accent";
}

/** Small uppercase monospace label used for HUD text, panel headers and metadata. */
export function HudLabel({ tone = "muted", className, ...rest }: HudLabelProps) {
  return (
    <span
      className={cx(
        "font-mono text-[11px] uppercase tracking-[0.14em]",
        tone === "accent" ? "text-red-bright" : "text-text-muted",
        className,
      )}
      {...rest}
    />
  );
}
