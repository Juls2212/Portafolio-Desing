import { CvAction } from "@/components/ui/CvAction";
import { HoloPanel } from "@/components/ui/HoloPanel";
import { SectionLink } from "@/components/ui/SectionLink";
import { cx } from "@/lib/cx";
import type { AboutPanel, HeroPanel, ListPanel } from "@/content/panels";
import { InlineDetail } from "./screens/InlineDetail";
import { OpenScreenButton } from "./screens/OpenScreenButton";

/**
 * The three intro panels as content. Shared by the spatial scene and the stacked fallback;
 * only one of the two is ever visible. `idSuffix` keeps heading ids unique.
 */

interface PanelProps<T> {
  panel: T;
  idSuffix: string;
  className?: string;
  /** Stacked fallback: render the disclosure region inside the card. */
  inline?: boolean;
}

export function HeroPanelView({ panel, idSuffix, className }: PanelProps<HeroPanel>) {
  const c = panel.content;
  const titleId = `hero-title${idSuffix}`;
  return (
    <HoloPanel
      as="article"
      emphasis="strong"
      code={panel.label}
      badge={panel.badge}
      aria-labelledby={titleId}
      className={cx("px-[clamp(20px,3vw,34px)] pb-[clamp(24px,3vw,34px)]", className)}
    >
      <p className="mb-2.5 font-mono text-xs tracking-[0.16em] text-red-bright">{c.eyebrow}</p>
      <h1
        id={titleId}
        className="font-display text-[clamp(52px,15vw,84px)] font-normal leading-[0.9] tracking-[-0.015em] min-[900px]:text-[92px]"
      >
        {c.firstName}
        <br />
        <em className="text-red">{c.lastName}</em>
      </h1>
      <p className="mt-6 text-sm font-medium uppercase tracking-[0.08em]">{c.role}</p>
      <p className="mt-2.5 max-w-[42ch] text-pretty text-base leading-relaxed text-text-muted min-[900px]:text-[17px]">
        {c.summary}
      </p>
      <div className="mt-7 flex flex-wrap items-center gap-3">
        <CvAction />
        <SectionLink to="proyectos" variant="secondary">
          {c.secondaryCta}
        </SectionLink>
      </div>
    </HoloPanel>
  );
}

export function AboutPanelView({ panel, idSuffix, className, inline }: PanelProps<AboutPanel>) {
  const c = panel.content;
  const titleId = `about-panel-title${idSuffix}`;
  return (
    <HoloPanel
      as="article"
      emphasis="default"
      code={<span id={titleId}>{panel.label}</span>}
      badge={panel.badge}
      aria-labelledby={titleId}
      className={cx("px-[26px] pb-[26px] pt-[22px]", className)}
    >
      <p className="text-pretty font-display text-[26px] leading-[1.2]">{c.quote}</p>
      <p className="mt-3.5 text-sm leading-relaxed text-text-muted">{c.placeholder}</p>
      <OpenScreenButton id="sobre-mi" label={c.openLabel} suffix={idSuffix} className="mt-3" />
      {inline && <InlineDetail id="sobre-mi" suffix={idSuffix} />}
    </HoloPanel>
  );
}

export function InterestsPanelView({ panel, idSuffix, className, inline }: PanelProps<ListPanel>) {
  const titleId = `interests-title${idSuffix}`;
  return (
    <HoloPanel
      as="article"
      emphasis="soft"
      code={<span id={titleId}>{panel.label}</span>}
      badge={panel.badge}
      aria-labelledby={titleId}
      className={cx("px-6 pb-3.5 pt-[22px]", className)}
    >
      <ol className="m-0 -mt-3 list-none p-0">
        {panel.content.items.map((item, i) => (
          <li
            key={item}
            className="flex gap-3.5 border-b border-hairline-faint py-3 text-[15px] last:border-b-0"
          >
            <span className="pt-[3px] font-mono text-[11px] text-red-bright">{String(i + 1).padStart(2, "0")}</span>
            {item}
          </li>
        ))}
      </ol>
      <OpenScreenButton id="intereses" label={panel.content.openLabel} suffix={idSuffix} className="mt-2" />
      {inline && <InlineDetail id="intereses" suffix={idSuffix} />}
    </HoloPanel>
  );
}

