// Renders a task's formatted instructions. Content is sanitized server-side
// on save (see lib/actions.ts), so this is safe to render as-is; old plain-text
// descriptions (from before the rich editor) render fine too — plain text has
// no tags to misinterpret.
export default function RichTextContent({ html, className = "" }: { html: string; className?: string }) {
  return (
    <div
      className={`prose prose-sm prose-stone dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-headings:my-1.5 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
