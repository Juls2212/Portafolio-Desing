import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/lib/cx";
import { CornerFrame, type Corner } from "./CornerFrame";
import { HudLabel } from "./HudLabel";

type Emphasis = "strong" | "default" | "soft";

const EMPHASIS: Record<Emphasis, string> = {
  strong:
    "border-border-strong bg-[linear-gradient(180deg,rgb(230_59_73/0.12),rgb(230_59_73/0.03)_60%,rgb(17_17_23/0.4))] shadow-glow-panel",
  default:
    "border-border-panel bg-[linear-gradient(180deg,rgb(230_59_73/0.09),rgb(17_17_23/0.35))]",
  soft: "border-border-soft bg-[linear-gradient(180deg,rgb(230_59_73/0.07),rgb(230_59_73/0))]",
};

interface HoloPanelProps extends Omit<ComponentPropsWithoutRef<"section">, "title"> {
  as?: "section" | "article" | "div" | "aside";
  emphasis?: Emphasis;
  /** Header label, e.g. "P/01 — PRESENTACIÓN". */
  code?: ReactNode;
  /** Header badge on the right. */
  badge?: ReactNode;
  corners?: readonly Corner[];
}

/** Flat holographic panel: hairline border, red wash, corner brackets and an optional HUD header. */
export function HoloPanel({
  as = "section",
  emphasis = "default",
  code,
  badge,
  corners,
  className,
  children,
  ...rest
}: HoloPanelProps) {
  return (
    <CornerFrame
      as={as}
      corners={corners}
      className={cx("border p-6", EMPHASIS[emphasis], className)}
      {...rest}
    >
      {(code || badge) && (
        <div className="mb-5 flex items-center justify-between gap-4 border-b border-divider pb-3">
          <HudLabel>{code}</HudLabel>
          {badge && <HudLabel tone="accent">{badge}</HudLabel>}
        </div>
      )}
      {children}
    </CornerFrame>
  );
}
