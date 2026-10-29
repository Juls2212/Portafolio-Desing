import Image from "next/image";
import { SectionLink } from "@/components/ui/SectionLink";
import { about } from "@/content/about";
import type { AboutPanel, ListPanel } from "@/content/panels";

/** Extended content shared by the spatial screen face and the stacked disclosure cards. */

function PhotoSlot({ panel }: { panel: AboutPanel }) {
  const { photo } = about;
  const d = panel.content.detail;
  return (
    // The aspect ratio is reserved up front, so the photo loading never shifts the layout.
    <div className="relative aspect-[4/5] w-full overflow-hidden border border-border-soft bg-surface-raised">
      {photo ? (
        <Image src={photo.src} alt={photo.alt} fill sizes="240px" className="object-cover" />
      ) : (
        <div
          role="img"
          aria-label={d.photoAriaLabel}
          className="absolute inset-0 grid place-items-center bg-[repeating-linear-gradient(135deg,rgb(230_59_73/0.08)_0_2px,transparent_2px_12px)]"
        >
          <span className="font-mono text-[11px] tracking-[0.14em] text-text-muted">{d.photoLabel}</span>
        </div>
      )}
    </div>
  );
}

export function AboutDetail({ panel, onNavigate }: { panel: AboutPanel; onNavigate?: () => void }) {
  const d = panel.content.detail;
  return (
    <div className="grid gap-6 min-[640px]:grid-cols-[minmax(0,220px)_1fr]">
      <div className="mx-auto w-full max-w-[220px] min-[640px]:max-w-none">
        <PhotoSlot panel={panel} />
      </div>
      <div className="flex min-w-0 flex-col gap-5">
        <p className="max-w-[56ch] text-[15px] leading-relaxed text-text-muted">{d.bio}</p>
        <dl className="m-0 border-t border-divider">
          {d.facts.map((fact) => (
            <div key={fact.label} className="flex items-baseline justify-between gap-4 border-b border-divider py-2.5">
              <dt className="font-mono text-[11px] tracking-[0.14em] text-red-bright">{fact.label}</dt>
              <dd className="m-0 text-right text-sm text-text-muted">{fact.value}</dd>
            </div>
          ))}
        </dl>
        <SectionLink
          to="sobre-mi"
          variant="link"
          focusTarget
          onNavigate={onNavigate}
          className="min-h-11 self-start text-[13px]"
        >
          {d.linkLabel} <span aria-hidden="true">→</span>
        </SectionLink>
      </div>
    </div>
  );
}

export function InterestsDetail({ panel }: { panel: ListPanel }) {
  const { items, detail } = panel.content;
  return (
    <ol className="m-0 grid list-none gap-x-8 p-0 min-[640px]:grid-cols-2">
      {items.map((item, i) => (
        <li key={item} className="flex gap-4 border-b border-divider py-4">
          <span className="pt-1 font-mono text-[11px] text-red-bright">{String(i + 1).padStart(2, "0")}</span>
          <div>
            <p className="text-base font-medium">{item}</p>
            <p className="mt-1.5 text-sm leading-relaxed text-text-muted">{detail.descriptions[i]}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
