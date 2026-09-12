import { MaterialTag } from "@prisma/client";

// Metadata for the content-type chips on course material — lets students
// filter a subject's uploads down to just "Slides" or "Reading", etc.
// Colors are muted/functional (chip UI), not decorative page furniture.
export const MATERIAL_TAG_META: Record<MaterialTag, { label: string; active: string; inactive: string }> = {
  SLIDES: {
    label: "Slides",
    active: "bg-sky-600 text-white dark:bg-sky-500",
    inactive: "border border-sky-200 text-sky-700 hover:bg-sky-50 dark:border-sky-900 dark:text-sky-400 dark:hover:bg-sky-950/40",
  },
  READING: {
    label: "Reading",
    active: "bg-teal-600 text-white dark:bg-teal-500",
    inactive: "border border-teal-200 text-teal-700 hover:bg-teal-50 dark:border-teal-900 dark:text-teal-400 dark:hover:bg-teal-950/40",
  },
  COURSEWORK: {
    label: "Coursework",
    active: "bg-amber-600 text-white dark:bg-amber-500",
    inactive: "border border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-900 dark:text-amber-400 dark:hover:bg-amber-950/40",
  },
  OTHER: {
    label: "Other",
    active: "bg-stone-600 text-white dark:bg-stone-500",
    inactive: "border border-stone-200 text-stone-600 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-400 dark:hover:bg-stone-800",
  },
};

export const MATERIAL_TAG_OPTIONS = Object.keys(MATERIAL_TAG_META) as MaterialTag[];
