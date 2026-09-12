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
    <li className="flex items-center justify-between gap-3 rounded-lg border border-stone-200 bg-white px-3 py-2.5 dark:border-stone-800 dark:bg-stone-900">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-stone-900 dark:text-white">{title}</p>
        {description && <p className="truncate text-xs text-stone-500 dark:text-stone-400">{description}</p>}
      </div>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-lg bg-accent-50 px-3 py-1.5 text-xs font-medium text-accent-700 hover:bg-accent-100 dark:bg-accent-950/40 dark:text-accent-400 dark:hover:bg-accent-950/70"
        >
          Open
        </a>
      )}
    </li>
  );
}
