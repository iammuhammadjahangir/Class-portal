import { TaskType } from "@prisma/client";

// Chip styling for the Assignment/Quiz/Task type — functional color
// (identify the kind of thing at a glance), not decoration.
export const TASK_TYPE_META: Record<TaskType, { label: string; chip: string }> = {
  ASSIGNMENT: {
    label: "Assignment",
    chip: "bg-accent-50 text-accent-700 dark:bg-accent-950/50 dark:text-accent-400",
  },
  QUIZ: {
    label: "Quiz",
    chip: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400",
  },
  TASK: {
    label: "Task",
    chip: "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400",
  },
};
