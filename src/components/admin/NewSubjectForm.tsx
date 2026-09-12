"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createSubject } from "@/lib/actions";

export default function NewSubjectForm() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [guideName, setGuideName] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-accent-600 hover:text-accent-700 dark:text-accent-400 dark:hover:text-accent-300"
      >
        + Add subject
      </button>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    await createSubject({ name, guideName });
    setSaving(false);
    setName("");
    setGuideName("");
    setOpen(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded-xl border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
      <input
        autoFocus
        placeholder="Subject name (e.g. Advanced Algorithms)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-100 dark:focus:ring-accent-950/50 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
      />
      <input
        placeholder="Guide / instructor (optional)"
        value={guideName}
        onChange={(e) => setGuideName(e.target.value)}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-100 dark:focus:ring-accent-950/50 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
      />
      <div className="flex gap-2">
        <button
          disabled={saving}
          className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 disabled:opacity-50 dark:bg-accent-500 dark:hover:bg-accent-600"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-stone-500">
          Cancel
        </button>
      </div>
    </form>
  );
}
