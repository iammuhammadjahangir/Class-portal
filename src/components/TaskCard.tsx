"use client";

import { useState, useTransition } from "react";
import { toggleTaskCompletion } from "@/lib/actions";
import { dueDateLabel } from "@/lib/dates";

const TYPE_LABEL: Record<string, string> = {
  ASSIGNMENT: "Assignment",
  QUIZ: "Quiz",
  TASK: "Task",
};

export default function TaskCard({
  id,
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
      className={`rounded-xl border p-4 transition ${
        completed
          ? "border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-900/40"
          : "border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900"
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
              : "border-slate-300 dark:border-slate-600"
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
            <span className="rounded-full bg-slate-900 px-2 py-0.5 font-medium text-white dark:bg-white dark:text-slate-900">
              {TYPE_LABEL[type] ?? type}
            </span>
            <span className="text-slate-400">{subjectName}</span>
          </div>

          <p
            className={`mt-1 truncate font-medium text-slate-900 dark:text-white ${
              completed ? "line-through opacity-60" : ""
            }`}
          >
            {title}
          </p>

          {description && (
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{description}</p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-3">
            <span
              className={`text-xs font-medium ${
                due.tone === "overdue"
                  ? "text-red-600 dark:text-red-400"
                  : due.tone === "soon"
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-slate-500 dark:text-slate-400"
              }`}
            >
              {due.text}
            </span>
            {(fileUrl || linkUrl) && (
              <a
                href={fileUrl ?? linkUrl!}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-blue-600 hover:underline dark:text-blue-400"
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
