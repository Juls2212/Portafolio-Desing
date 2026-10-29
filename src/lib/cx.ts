/** Joins truthy class names. Keeps the app free of a class-merging dependency. */
export const cx = (...parts: Array<string | false | null | undefined>): string =>
  parts.filter(Boolean).join(" ");
