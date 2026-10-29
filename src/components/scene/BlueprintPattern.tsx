import { memo } from "react";
import { createRng } from "@/lib/seeded";

interface BlueprintPatternProps {
  seed: number;
  width: number;
  height: number;
  /** Plan fragments per 1,000,000 px2. Default 38. */
  density?: number;
  /** Stroke/fill alpha range, 0.12-0.20 on the wall. */
  alpha?: readonly [number, number];
  className?: string;
}

interface Geometry {
  lines: string;
  nodes: string;
  ticks: string;
  bars: string;
}

const cache = new Map<string, Geometry>();
const GRID = 48;

/** Builds the path data once per parameter set (module cache), never per frame or per render. */
function generate({ seed, width, height, density = 38 }: BlueprintPatternProps): Geometry {
  const key = `${seed}:${width}:${height}:${density}`;
  const hit = cache.get(key);
  if (hit) return hit;

  const rng = createRng(seed);
  const cols = Math.floor(width / GRID);
  const rows = Math.floor(height / GRID);
  const count = Math.round((width * height * density) / 1_000_000);
  let lines = "";
  let nodes = "";
  let ticks = "";
  let bars = "";

  for (let i = 0; i < count; i++) {
    const cx = Math.floor(rng() * cols);
    const cy = Math.floor(rng() * rows);
    const w = (2 + Math.floor(rng() * 6)) * GRID;
    const h = (2 + Math.floor(rng() * 4)) * GRID;
    const x = cx * GRID;
    const y = cy * GRID;
    // Plan fragment: an outline with an interior partition and a door gap.
    lines += `M${x} ${y}h${w}v${h}h${-w}z`;
    const split = x + (1 + Math.floor(rng() * ((w / GRID) - 1))) * GRID;
    lines += `M${split} ${y}v${h * 0.6}`;
    if (rng() > 0.5) lines += `M${x} ${y + h * 0.35}h${w * 0.3}`;
    // Nodes at corners.
    for (const [nx, ny] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) {
      nodes += `M${nx - 2.5} ${ny - 2.5}h5v5h-5z`;
    }
    // Dimension line with ticks above the fragment.
    if (rng() > 0.4) {
      const dy = y - 14;
      lines += `M${x} ${dy}h${w}`;
      for (let tx = x; tx <= x + w; tx += 12) ticks += `M${tx} ${dy - 3}v6`;
    }
    // Micro-annotation: abstract bars (not text).
    const bx = x + 8;
    const by = y + h + 10;
    for (let k = 0; k < 2 + Math.floor(rng() * 2); k++) {
      const barWidth = 18 + Math.floor(rng() * 56);
      bars += `M${bx} ${by + k * 7}h${barWidth}v3h${-barWidth}z`;
    }
  }

  const geometry = { lines, nodes, ticks, bars };
  cache.set(key, geometry);
  return geometry;
}

/** Deterministic SVG blueprint: plan fragments, node dots, tick marks and micro-annotation bars. */
export const BlueprintPattern = memo(function BlueprintPattern(props: BlueprintPatternProps) {
  const { width, height, alpha = [0.12, 0.2], className } = props;
  const { lines, nodes, ticks, bars } = generate(props);
  const [low, high] = alpha;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={className}
      width="100%"
      height="100%"
    >
      <g fill="none" stroke="var(--color-red)" strokeWidth="1" vectorEffect="non-scaling-stroke">
        <path d={lines} strokeOpacity={high} vectorEffect="non-scaling-stroke" />
        <path d={ticks} strokeOpacity={low} vectorEffect="non-scaling-stroke" />
      </g>
      <path d={nodes} fill="var(--color-red)" fillOpacity={high} />
      <path d={bars} fill="var(--color-red)" fillOpacity={low} />
    </svg>
  );
});
