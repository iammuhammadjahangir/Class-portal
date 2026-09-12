"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

// A small formatted-text box for assignment/quiz/task instructions — paste
// in from Word/Docs/WhatsApp and bold, lists, and links carry over, instead
// of the one-line plain-text field this used to be. Not used for course
// material, which stays plain (a title + optional short note is enough there).
export default function RichTextEditor({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [3] } }),
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm prose-stone dark:prose-invert max-w-none min-h-[90px] rounded-b-lg px-3 py-2 text-sm outline-none focus:ring-0",
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const isEmpty = editor.isEmpty;

  function ToolbarButton({
    onClick,
    active,
    label,
    children,
  }: {
    onClick: () => void;
    active?: boolean;
    label: string;
    children: React.ReactNode;
  }) {
    return (
      <button
        type="button"
        aria-label={label}
        onClick={onClick}
        className={`rounded px-2 py-1 text-xs font-medium transition ${
          active
            ? "bg-stone-900 text-white dark:bg-white dark:text-stone-900"
            : "text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800"
        }`}
      >
        {children}
      </button>
    );
  }

  return (
    <div className="rounded-lg border border-stone-300 focus-within:border-accent-500 focus-within:ring-4 focus-within:ring-accent-100 dark:border-stone-700 dark:bg-stone-800 dark:focus-within:ring-accent-950/50">
      <div className="flex flex-wrap items-center gap-0.5 border-b border-stone-200 px-1.5 py-1 dark:border-stone-700">
        <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          label="Heading"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          • List
        </ToolbarButton>
        <ToolbarButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1. List
        </ToolbarButton>
        <ToolbarButton
          label="Link"
          active={editor.isActive("link")}
          onClick={() => {
            const url = window.prompt("Link URL");
            if (url) editor.chain().focus().setLink({ href: url }).run();
            else if (url === "") editor.chain().focus().unsetLink().run();
          }}
        >
          Link
        </ToolbarButton>
      </div>
      <div className="relative">
        {isEmpty && placeholder && (
          <p className="pointer-events-none absolute left-3 top-2 text-sm text-stone-400">{placeholder}</p>
        )}
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
