import { differenceInCalendarDays, format } from "date-fns";

export function dueDateLabel(dueDate: Date | null): { text: string; tone: "overdue" | "soon" | "normal" | "none" } {
  if (!dueDate) return { text: "No due date", tone: "none" };

  const days = differenceInCalendarDays(dueDate, new Date());
  const formatted = format(dueDate, "EEE, d MMM");

  if (days < 0) {
    return { text: `Overdue · was due ${formatted}`, tone: "overdue" };
  }
  if (days === 0) {
    return { text: `Due today, ${formatted}`, tone: "soon" };
  }
  if (days === 1) {
    return { text: `Due tomorrow, ${formatted}`, tone: "soon" };
  }
  if (days <= 3) {
    return { text: `Due in ${days} days · ${formatted}`, tone: "soon" };
  }
  return { text: `Due ${formatted}`, tone: "normal" };
}
