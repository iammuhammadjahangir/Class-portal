"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addStudent } from "@/lib/actions";

export default function AddStudentForm() {
  const [name, setName] = useState("");
  const [rollNumber, setRollNumber] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!name.trim() || !rollNumber.trim()) return;
    setSaving(true);
    try {
      await addStudent({ name, rollNumber });
      setName("");
      setRollNumber("");
      router.refresh();
    } catch (err) {
      setError((err as Error).message || "Could not add student.");
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row dark:border-slate-800 dark:bg-slate-900">
      <input
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />
      <input
        placeholder="Roll number"
        value={rollNumber}
        onChange={(e) => setRollNumber(e.target.value)}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 sm:w-40 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />
      <button
        disabled={saving}
        className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-slate-900"
      >
        {saving ? "Adding…" : "Add student"}
      </button>
      {error && <p className="text-xs text-red-600 sm:self-center">{error}</p>}
    </form>
  );
}
