import { site } from "@/content/site";
import { LevelIndicator } from "./site-header/LevelIndicator";
import { MobileMenu } from "./site-header/MobileMenu";
import { NavLinks } from "./site-header/NavLinks";
import { ProgressBar } from "./site-header/ProgressBar";
import { SkipIntroButton } from "./site-header/SkipIntroButton";

/**
 * Fixed 64px header. This file is a server component (logo and landmarks); only the interactive
 * parts are client islands (the blur lives on a pseudo-element: backdrop-filter on the header itself would
 * make it the containing block of the mobile menu's fixed overlay): nav scrollspy, level indicator, skip-intro, progress bar, mobile menu.
 */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 isolate z-[60] flex h-16 items-center justify-between gap-5 border-b border-hairline px-[clamp(16px,3vw,40px)] before:absolute before:inset-0 before:-z-10 before:bg-surface-deep/75 before:backdrop-blur-md before:content-['']">
      <a
        href="#inicio"
        aria-label={`${site.name}, ir al inicio`}
        className="flex items-center gap-3 text-text hover:text-text"
      >
        <span className="grid size-[34px] place-items-center border border-red font-mono text-xs text-red-bright">
          {site.monogram}
        </span>
        <span className="whitespace-nowrap text-sm font-medium tracking-[0.01em]">{site.name}</span>
      </a>

      <nav aria-label="Principal" className="hidden min-[1180px]:block">
        <NavLinks />
      </nav>

      <div className="flex items-center gap-3.5">
        <LevelIndicator />
        <SkipIntroButton />
        <MobileMenu />
      </div>

      <ProgressBar />
    </header>
  );
}
