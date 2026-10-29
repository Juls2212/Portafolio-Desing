import { cx } from "@/lib/cx";

interface SectionHeaderProps {
  /** Section number, e.g. "01". */
  index: string;
  /** Section name in the label line, e.g. "SOBRE MÍ". */
  label: string;
  /** Title text before the red italic emphasis. */
  title: string;
  /** Red italic part of the title. */
  emphasis: string;
  /** Text after the emphasis (e.g. a closing "?"). */
  titleEnd?: string;
  /** Id for the heading, to link with aria-labelledby on the section. */
  id?: string;
  as?: "h1" | "h2";
  className?: string;
}

/** Numbered label line (hairline gradient) plus a serif title with red italic emphasis. */
export function SectionHeader({
  index,
  label,
  title,
  emphasis,
  titleEnd,
  id,
  as: Heading = "h2",
  className,
}: SectionHeaderProps) {
  return (
    <header className={cx("mb-[clamp(32px,5vw,56px)]", className)}>
      <div
        aria-hidden="true"
        className="mb-6 flex items-center gap-4 font-mono text-xs uppercase tracking-[0.16em] text-red-bright"
      >
        <span>{index}</span>
        <span className="h-px flex-1 bg-[linear-gradient(90deg,rgb(230_59_73/0.6),rgb(230_59_73/0))]" />
        <span className="text-text-muted">{label}</span>
      </div>
      <Heading
        id={id}
        className="font-display text-[clamp(44px,7vw,96px)] font-normal leading-[0.95] tracking-[-0.01em]"
      >
        {title} <em className="text-red">{emphasis}</em>
        {titleEnd}
      </Heading>
    </header>
  );
}
