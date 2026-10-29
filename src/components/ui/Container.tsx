import type { ComponentPropsWithoutRef, ElementType } from "react";
import { cx } from "@/lib/cx";

type ContainerProps<T extends ElementType> = {
  as?: T;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

/** Centered content column with the prototype's fluid side padding (max 1240px). */
export function Container<T extends ElementType = "div">({ as, className, ...rest }: ContainerProps<T>) {
  const Tag: ElementType = as ?? "div";
  return (
    <Tag className={cx("mx-auto w-full max-w-[1240px] px-[clamp(20px,5vw,64px)]", className)} {...rest} />
  );
}
