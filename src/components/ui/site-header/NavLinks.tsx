"use client";

import { site } from "@/content/site";
import { cx } from "@/lib/cx";
import { useSiteState } from "@/lib/site-state";
import { SectionLink } from "../SectionLink";

/** Desktop section navigation with scrollspy `aria-current`. Re-renders only when the active section changes. */
export function NavLinks() {
  const active = useSiteState((s) => s.active);
  return (
    <ul className="m-0 flex list-none gap-0.5 p-0">
      {site.nav.map((item) => {
        const current = item.id === active;
        return (
          <li key={item.id}>
            <SectionLink
              to={item.id}
              bare
              aria-current={current ? "true" : undefined}
              className={cx(
                "block border-b px-3 py-2 text-[13px] tracking-[0.01em] transition-[color,border-color] duration-200 hover:text-text",
                current ? "border-red text-text" : "border-transparent text-text-muted",
              )}
            >
              {item.label}
            </SectionLink>
          </li>
        );
      })}
    </ul>
  );
}
