"use client";

import { useState, useTransition } from "react";
import { toggleTaskCompletion } from "@/lib/actions";
import { dueDateLabel } from "@/lib/dates";
import { subjectColor } from "@/lib/subjectColor";

const TYPE_LABEL: Record<string, string> = {
  ASSIGNMENT: "Assignment",
  QUIZ: "Quiz",
  TASK: "Task",
};

export default function TaskCard({
  id,
  subjectOrder,
  subjectName,
  title,
  description,
  type,
  dueDate,
  fileUrl,
  linkUrl,
  initialCompleted,
}: {
  id: string;
  subjectOrder: number;
  subjectName: string;
  title: string;
  description: string | null;
  type: string;
  dueDate: Date | null;
  fileUrl: string | null;
  linkUrl: string | null;
  initialCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();
  const due = dueDateLabel(dueDate);
  const color = subjectColor(subjectOrder);

  function handleToggle() {
    const next = !completed;
    setCompleted(next); // optimistic
    startTransition(async () => {
      try {
        await toggleTaskCompletion(id, next);
      } catch {
        setCompleted(!next); // revert on failure
      }
    });
  }

  return (
    <li
      className={`rounded-xl border border-l-4 p-4 transition ${color.border} ${
        completed
          ? "border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-900/40"
          : "border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-900"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={handleToggle}
          disabled={isPending}
          aria-label={completed ? "Mark as not completed" : "Mark as completed"}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
            completed
              ? "border-emerald-500 bg-emerald-500 text-white"
              : "border-stone-300 dark:border-stone-600"
          }`}
        >
          {completed && (
            <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3">
              <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className={`rounded-full px-2 py-0.5 font-medium ${color.chip}`}>{subjectName}</span>
            <span className="font-medium text-stone-400">{TYPE_LABEL[type] ?? type}</span>
          </div>

          <p
            className={`mt-1 truncate font-medium text-stone-900 dark:text-white ${
              completed ? "line-through opacity-60" : ""
            }`}
          >
            {title}
          </p>

          {description && (
            <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">{description}</p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span
              className={`text-xs font-medium ${
                due.tone === "overdue"
                  ? "text-red-600 dark:text-red-400"
                  : due.tone === "soon"
                  ? "text-accent-600 dark:text-accent-400"
                  : "text-stone-500 dark:text-stone-400"
              }`}
            >
              {due.text}
            </span>
            {(fileUrl || linkUrl) && (
              <a
                href={fileUrl ?? linkUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-accent-600 hover:underline dark:text-accent-400"
              >
                Open →
              </a>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
