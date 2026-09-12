import { differenceInCalendarDays, format } from "date-fns";

export type SubjectStatusTone = "overdue" | "today" | "soon" | "upcoming" | "done" | "none";

// A one-line status for a subject's card on the student hub — "what's the
// single most urgent thing in this subject right now" — so students can
// tell at a glance which subjects need attention without opening each one.
export function subjectStatus(
  tasks: { dueDate: Date | null; completed: boolean }[]
): { text: string; tone: SubjectStatusTone } {
  if (tasks.length === 0) return { text: "Nothing assigned yet", tone: "none" };

  const pending = tasks.filter((t) => !t.completed);
  if (pending.length === 0) return { text: "All caught up", tone: "done" };

  const sorted = [...pending].sort((a, b) => {
    const aDue = a.dueDate ? a.dueDate.getTime() : Infinity;
    const bDue = b.dueDate ? b.dueDate.getTime() : Infinity;
    return aDue - bDue;
  });
  const soonest = sorted[0];

  if (!soonest.dueDate) {
    return { text: pending.length === 1 ? "1 to do" : `${pending.length} to do`, tone: "upcoming" };
  }

  const days = differenceInCalendarDays(soonest.dueDate, new Date());
  if (days < 0) return { text: "Overdue", tone: "overdue" };
  if (days === 0) return { text: "Due today", tone: "today" };
  if (days === 1) return { text: "Due tomorrow", tone: "soon" };
  if (days <= 6) return { text: `Due ${format(soonest.dueDate, "EEEE")}`, tone: "soon" };
  return { text: `${pending.length} upcoming`, tone: "upcoming" };
}

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
