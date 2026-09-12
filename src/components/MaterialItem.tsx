export default function MaterialItem({
  title,
  description,
  fileUrl,
  linkUrl,
}: {
  title: string;
  description: string | null;
  fileUrl: string | null;
  linkUrl: string | null;
}) {
  const href = fileUrl ?? linkUrl ?? undefined;
  return (
    <li className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2.5 dark:border-slate-800 dark:bg-slate-900">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{title}</p>
        {description && <p className="truncate text-xs text-slate-500 dark:text-slate-400">{description}</p>}
      </div>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          Open
        </a>
      )}
    </li>
  );
}
