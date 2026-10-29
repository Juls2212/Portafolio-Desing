import type { TechnologyId } from "./technologies.ts";

export type ArrowDirection = "left" | "right" | "up" | "down";

export type KeyboardCell =
  | { kind: "tech"; id: TechnologyId }
  | { kind: "blank"; tone?: string }
  | { kind: "arrow"; dir: ArrowDirection };

export const KEYBOARD_COLUMNS = 5;
export const KEYBOARD_ROWS = 6;

// Neutral graphite tones for non-technology keys.
const GRAPHITE = ["#2A2A30", "#232329", "#303038"] as const;

const tech = (id: TechnologyId): KeyboardCell => ({ kind: "tech", id });
const blank = (tone = 0): KeyboardCell => ({ kind: "blank", tone: GRAPHITE[tone % GRAPHITE.length] });
const arrow = (dir: ArrowDirection): KeyboardCell => ({ kind: "arrow", dir });

/**
 * Row-major 5 x 6 grid. Edit this table to rearrange keys; components only
 * read it. Every technology must appear exactly once (checked in tests).
 */
export const keyboardRows: readonly (readonly KeyboardCell[])[] = [
  [blank(0), blank(1), tech("react"), tech("typescript"), blank(2)],
  [tech("javascript"), tech("nextjs"), blank(1), tech("python"), tech("java")],
  [blank(2), tech("postgresql"), tech("docker"), blank(0), tech("tailwindcss")],
  [tech("unity"), blank(1), tech("godot"), tech("git"), blank(2)],
  [blank(0), blank(2), blank(1), arrow("up"), blank(0)],
  [blank(1), arrow("left"), arrow("down"), arrow("right"), blank(2)],
];

export const keyboardCells: readonly KeyboardCell[] = keyboardRows.flat();
