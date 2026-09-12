"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTask } from "@/lib/actions";
import FileOrLinkInput from "./FileOrLinkInput";
import RichTextEditor from "./RichTextEditor";

export default function NewTaskForm({ subjectId }: { subjectId: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"ASSIGNMENT" | "QUIZ" | "TASK">("ASSIGNMENT");
  const [dueDate, setDueDate] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
      >
        + Add assignment / quiz / task
      </button>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    await createTask({ subjectId, title, description, type, dueDate, fileUrl, linkUrl });
    setSaving(false);
    setTitle("");
    setDescription("");
    setDueDate("");
    setFileUrl("");
    setLinkUrl("");
    setOpen(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-900 dark:bg-amber-950/20">
      <input
        autoFocus
        placeholder="Title (e.g. Assignment 1)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-100 dark:focus:ring-accent-950/50 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
      />
      <div className="flex gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as typeof type)}
          className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-100 dark:focus:ring-accent-950/50 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
        >
          <option value="ASSIGNMENT">Assignment</option>
          <option value="QUIZ">Quiz</option>
          <option value="TASK">Task</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-100 dark:focus:ring-accent-950/50 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
        />
      </div>
      <RichTextEditor value={description} onChange={setDescription} placeholder="Instructions (optional) — paste from Word/Docs, formatting carries over" />
      <FileOrLinkInput fileUrl={fileUrl} linkUrl={linkUrl} onChange={(v) => { setFileUrl(v.fileUrl); setLinkUrl(v.linkUrl); }} />
      <div className="flex gap-2 pt-1">
        <button disabled={saving} className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 disabled:opacity-50 dark:bg-accent-500 dark:hover:bg-accent-600">
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-stone-500">
          Cancel
        </button>
      </div>
    </form>
  );
}
