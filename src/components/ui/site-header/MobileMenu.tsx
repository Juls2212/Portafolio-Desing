"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/content/site";
import { cx } from "@/lib/cx";
import { useSiteState } from "@/lib/site-state";
import { SectionLink } from "../SectionLink";

const DESKTOP_NAV = "(min-width: 1180px)";

/**
 * Full-screen mobile menu below 1180px. The toggle has aria-expanded/aria-controls; Escape and
 * navigation close it and focus returns to the toggle; Tab is kept inside while it is open.
 */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLElement>(null);
  const active = useSiteState((s) => s.active);

  const close = useCallback(() => {
    setOpen(false);
    button.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const items = [button.current, ...Array.from(menu.current?.querySelectorAll<HTMLElement>("a[href]") ?? [])].filter(
        (el): el is HTMLElement => el !== null,
      );
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const mq = window.matchMedia(DESKTOP_NAV);
    const onChange = () => mq.matches && setOpen(false);
    document.addEventListener("keydown", onKeyDown);
    mq.addEventListener("change", onChange);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      mq.removeEventListener("change", onChange);
    };
  }, [open, close]);

  return (
    <div className="min-[1180px]:hidden">
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls="menu-movil"
        onClick={() => (open ? close() : setOpen(true))}
        className="h-9 border border-border-neutral px-3.5 text-[13px] text-text"
      >
        {open ? "Cerrar" : "Menú"}
      </button>
      <nav
        ref={menu}
        id="menu-movil"
        aria-label="Menú móvil"
        className={cx(
          "fixed inset-x-0 bottom-0 top-16 z-[55] overflow-y-auto overscroll-contain border-t border-divider bg-surface-deep px-6 py-8",
          !open && "hidden",
        )}
      >
        <ul className="m-0 flex list-none flex-col p-0">
          {site.nav.map((item, i) => (
            <li key={item.id} className="border-b border-hairline">
              <SectionLink
                to={item.id}
                bare
                onNavigate={close}
                aria-current={item.id === active ? "true" : undefined}
                className={cx(
                  "flex items-baseline gap-4 py-[18px] font-display text-[40px] leading-none",
                  item.id === active ? "text-text" : "text-text-muted",
                )}
              >
                <span className="font-mono text-[11px] text-red-bright">{String(i).padStart(2, "0")}</span>
                {item.label}
              </SectionLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
