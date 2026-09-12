"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createMaterial } from "@/lib/actions";
import FileOrLinkInput from "./FileOrLinkInput";

export default function NewMaterialForm({ subjectId }: { subjectId: string }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-lg border border-dashed border-slate-300 py-2.5 text-sm font-medium text-slate-500 hover:border-slate-400 dark:border-slate-700 dark:text-slate-400"
      >
        + Add course content / slides
      </button>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    await createMaterial({ subjectId, title, description, fileUrl, linkUrl });
    setSaving(false);
    setTitle("");
    setDescription("");
    setFileUrl("");
    setLinkUrl("");
    setOpen(false);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <input
        autoFocus
        placeholder="Title (e.g. Week 1 slides)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />
      <input
        placeholder="Short note (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />
      <FileOrLinkInput fileUrl={fileUrl} linkUrl={linkUrl} onChange={(v) => { setFileUrl(v.fileUrl); setLinkUrl(v.linkUrl); }} />
      <div className="flex gap-2 pt-1">
        <button disabled={saving} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-slate-900">
          {saving ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-slate-500">
          Cancel
        </button>
      </div>
    </form>
  );
}
