"use client";

import { useState, useTransition } from "react";
import { TaskType } from "@prisma/client";
import { toggleTaskCompletion } from "@/lib/actions";
import { dueDateLabel } from "@/lib/dates";
import { TASK_TYPE_META } from "@/lib/taskTypes";

export default function TaskRow({
  id,
  subjectId,
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
  subjectId?: string;
  subjectName?: string;
  title: string;
  description: string | null;
  type: TaskType;
  dueDate: Date | null;
  fileUrl: string | null;
  linkUrl: string | null;
  initialCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();
  const due = dueDateLabel(dueDate);
  const typeMeta = TASK_TYPE_META[type];

  function handleToggle() {
    const next = !completed;
    setCompleted(next); // optimistic
    startTransition(async () => {
      try {
        await toggleTaskCompletion(id, next, subjectId);
      } catch {
        setCompleted(!next); // revert on failure
      }
    });
  }

  return (
    <div className="flex items-start gap-3 py-4">
      <button
        onClick={handleToggle}
        disabled={isPending}
        aria-label={completed ? "Mark as not completed" : "Mark as completed"}
        className={`mt-1 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition ${
          completed
            ? "border-emerald-600 bg-emerald-600 text-white"
            : "border-stone-300 dark:border-stone-600"
        }`}
      >
        {completed && (
          <svg viewBox="0 0 16 16" fill="none" className="h-2.5 w-2.5">
            <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${typeMeta.chip}`}>{typeMeta.label}</span>
          {subjectName && <span className="text-xs text-stone-400">{subjectName}</span>}
        </div>

        <p
          className={`mt-1 font-medium text-stone-900 dark:text-white ${
            completed ? "text-stone-400 line-through dark:text-stone-600" : ""
          }`}
        >
          {title}
        </p>
        {description && <p className="mt-0.5 text-sm text-stone-500 dark:text-stone-400">{description}</p>}

        <div className="mt-1.5 flex flex-wrap items-center gap-3">
          <span
            className={`text-xs font-medium ${
              due.tone === "overdue"
                ? "text-red-600 dark:text-red-400"
                : due.tone === "soon"
                ? "text-accent-600 dark:text-accent-400"
                : "text-stone-400"
            }`}
          >
            {due.text}
          </span>
          {(fileUrl || linkUrl) && (
            <a
              href={fileUrl ?? linkUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-stone-500 underline decoration-stone-300 underline-offset-2 hover:text-accent-600 dark:text-stone-400 dark:decoration-stone-700 dark:hover:text-accent-400"
            >
              Open
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
