"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({
  action,
  confirmText = "Delete this? This can't be undone.",
}: {
  action: () => Promise<void>;
  confirmText?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs">
        <span className="text-slate-500">{confirmText}</span>
        <button
          disabled={isPending}
          onClick={() =>
            startTransition(async () => {
              await action();
              router.refresh();
            })
          }
          className="font-medium text-red-600 hover:underline"
        >
          Yes, delete
        </button>
        <button onClick={() => setConfirming(false)} className="text-slate-400 hover:underline">
          Cancel
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs font-medium text-slate-400 hover:text-red-600"
    >
      Delete
    </button>
  );
}
