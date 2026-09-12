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
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 rounded-xl border border-stone-200 bg-white p-4 sm:flex-row dark:border-stone-800 dark:bg-stone-900">
      <input
        placeholder="Full name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-100 dark:focus:ring-accent-950/50 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
      />
      <input
        placeholder="Roll number"
        value={rollNumber}
        onChange={(e) => setRollNumber(e.target.value)}
        className="rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-100 dark:focus:ring-accent-950/50 sm:w-40 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
      />
      <button
        disabled={saving}
        className="rounded-lg bg-accent-600 px-4 py-2 text-sm font-medium text-white hover:bg-accent-700 disabled:opacity-50 dark:bg-accent-500 dark:hover:bg-accent-600"
      >
        {saving ? "Adding…" : "Add student"}
      </button>
      {error && <p className="text-xs text-red-600 sm:self-center">{error}</p>}
    </form>
  );
}
