import type { ComponentPropsWithoutRef } from "react";
import { cx } from "@/lib/cx";

/** Square monospace tag with a hairline red border. */
export function Tag({ className, ...rest }: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cx(
        "inline-block border border-border-soft px-2.5 py-1.5 font-mono text-[11px] tracking-[0.08em] text-text",
        className,
      )}
      {...rest}
    />
  );
}
