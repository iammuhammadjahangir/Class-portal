import DOMPurify from "isomorphic-dompurify";

// Sanitizes rich-text task descriptions before they're stored — the editor
// only produces safe markup itself, but this is cheap defense-in-depth
// against anything unexpected making it into the HTML (a raw paste, a
// future editor bug, etc.).
export function sanitizeRichText(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ["p", "strong", "em", "s", "u", "h3", "ul", "ol", "li", "a", "br"],
    ALLOWED_ATTR: ["href", "target", "rel"],
  });
}

// Tiptap's "empty" editor still outputs `<p></p>`, not an empty string —
// this checks whether there's any actual text content worth keeping.
export function isBlankRichText(html: string): boolean {
  return html.replace(/<[^>]*>/g, "").trim().length === 0;
}
