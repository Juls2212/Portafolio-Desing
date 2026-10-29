import type { ComponentPropsWithoutRef, ElementType, ReactNode } from "react";
import { cx } from "@/lib/cx";

export type Corner = "tl" | "tr" | "bl" | "br";

const CORNER_CLASSES: Record<Corner, string> = {
  tl: "left-[-2px] top-[-2px] border-l-2 border-t-2",
  tr: "right-[-2px] top-[-2px] border-r-2 border-t-2",
  bl: "bottom-[-2px] left-[-2px] border-b-2 border-l-2",
  br: "bottom-[-2px] right-[-2px] border-b-2 border-r-2",
};

type CornerFrameProps<T extends ElementType> = {
  as?: T;
  /** Which corners get a bracket. Default: all four. */
  corners?: readonly Corner[];
  /** Bracket arm length in px. Default 16. */
  size?: number;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

/** Positioned wrapper that draws 2px red corner brackets (decorative, aria-hidden). */
export function CornerFrame<T extends ElementType = "div">({
  as,
  corners = ["tl", "tr", "bl", "br"],
  size = 16,
  className,
  children,
  ...rest
}: CornerFrameProps<T>) {
  const Tag: ElementType = as ?? "div";
  return (
    <Tag className={cx("relative", className)} {...rest}>
      {corners.map((corner) => (
        <span
          key={corner}
          aria-hidden="true"
          style={{ width: size, height: size }}
          className={cx("pointer-events-none absolute border-red", CORNER_CLASSES[corner])}
        />
      ))}
      {children}
    </Tag>
  );
}
