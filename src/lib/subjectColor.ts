// Assigns each subject a consistent accent color by its position (the
// `order` field), so up to 6 subjects each get a guaranteed-distinct color
// — a quick visual anchor without needing to read the subject name every
// time. Only wraps around (repeats a color) past 6 subjects. Palette
// deliberately avoids colors already used for meaning elsewhere: emerald
// (done), red (overdue), amber (due soon), and the terracotta `accent`
// (primary actions).
const PALETTE = [
  { dot: "bg-teal-500", text: "text-teal-700 dark:text-teal-400", chip: "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400", border: "border-l-teal-400 dark:border-l-teal-700" },
  { dot: "bg-indigo-500", text: "text-indigo-700 dark:text-indigo-400", chip: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400", border: "border-l-indigo-400 dark:border-l-indigo-700" },
  { dot: "bg-rose-500", text: "text-rose-700 dark:text-rose-400", chip: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400", border: "border-l-rose-400 dark:border-l-rose-700" },
  { dot: "bg-sky-500", text: "text-sky-700 dark:text-sky-400", chip: "bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400", border: "border-l-sky-400 dark:border-l-sky-700" },
  { dot: "bg-violet-500", text: "text-violet-700 dark:text-violet-400", chip: "bg-violet-50 text-violet-700 dark:bg-violet-950/50 dark:text-violet-400", border: "border-l-violet-400 dark:border-l-violet-700" },
  { dot: "bg-fuchsia-500", text: "text-fuchsia-700 dark:text-fuchsia-400", chip: "bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950/50 dark:text-fuchsia-400", border: "border-l-fuchsia-400 dark:border-l-fuchsia-700" },
] as const;

export type SubjectColor = (typeof PALETTE)[number];

export function subjectColor(order: number): SubjectColor {
  const i = ((order % PALETTE.length) + PALETTE.length) % PALETTE.length;
  return PALETTE[i];
}
