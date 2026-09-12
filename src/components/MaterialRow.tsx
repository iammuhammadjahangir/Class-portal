export default function MaterialRow({
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
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="truncate text-sm text-stone-700 dark:text-stone-300">{title}</p>
        {description && <p className="truncate text-xs text-stone-400">{description}</p>}
      </div>
      {href && (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs font-medium text-stone-500 underline decoration-stone-300 underline-offset-2 hover:text-accent-600 dark:text-stone-400 dark:decoration-stone-700 dark:hover:text-accent-400"
        >
          Open
        </a>
      )}
    </div>
  );
}
