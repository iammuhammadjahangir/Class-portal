"use client";

import { useState } from "react";
import { upload } from "@vercel/blob/client";

export default function FileOrLinkInput({
  fileUrl,
  linkUrl,
  onChange,
}: {
  fileUrl: string;
  linkUrl: string;
  onChange: (v: { fileUrl: string; linkUrl: string }) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      setFileName(file.name);
      onChange({ fileUrl: blob.url, linkUrl: "" });
    } catch {
      setError("Upload failed. Try a smaller file or check your connection.");
    }
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="flex-1 cursor-pointer rounded-lg border border-dashed border-slate-300 px-3 py-2 text-center text-xs font-medium text-slate-500 hover:border-slate-400 dark:border-slate-700 dark:text-slate-400">
          {uploading ? "Uploading…" : fileName || fileUrl ? "File attached · replace" : "Upload a file"}
          <input type="file" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" /> or paste a link{" "}
        <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
      </div>
      <input
        type="url"
        placeholder="https://drive.google.com/..."
        value={linkUrl}
        onChange={(e) => onChange({ fileUrl: "", linkUrl: e.target.value })}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
      />
    </div>
  );
}
