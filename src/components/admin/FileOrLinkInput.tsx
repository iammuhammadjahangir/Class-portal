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
      // The upload SDK discards the real server error on failure and always
      // throws a generic one -- check whether storage is even configured
      // first, so a misconfigured deployment shows the actual reason.
      const status = await fetch("/api/upload").then((r) => r.json());
      if (!status.configured) {
        setError(
          "File uploads aren't set up yet on this deployment: no Blob storage is connected. Ask whoever deployed this to attach one in Vercel (Project → Storage → Create Database → Blob), or paste a link instead for now."
        );
        setUploading(false);
        return;
      }

      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      setFileName(file.name);
      onChange({ fileUrl: blob.url, linkUrl: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try a smaller file or check your connection.");
    }
    setUploading(false);
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="flex-1 cursor-pointer rounded-lg border border-dashed border-stone-300 px-3 py-2 text-center text-xs font-medium text-stone-500 hover:border-stone-400 dark:border-stone-700 dark:text-stone-400">
          {uploading ? "Uploading…" : fileName || fileUrl ? "File attached · replace" : "Upload a file"}
          <input type="file" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <div className="flex items-center gap-2 text-xs text-stone-400">
        <span className="h-px flex-1 bg-stone-200 dark:bg-stone-700" /> or paste a link{" "}
        <span className="h-px flex-1 bg-stone-200 dark:bg-stone-700" />
      </div>
      <input
        type="url"
        placeholder="https://drive.google.com/..."
        value={linkUrl}
        onChange={(e) => onChange({ fileUrl: "", linkUrl: e.target.value })}
        className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus:border-accent-500 focus:ring-4 focus:ring-accent-100 dark:focus:ring-accent-950/50 dark:border-stone-700 dark:bg-stone-800 dark:text-white"
      />
    </div>
  );
}
