import sanitizeHtml from "sanitize-html";

// Sanitizes rich-text task descriptions before they're stored — the editor
// only produces safe markup itself, but this is cheap defense-in-depth
// against anything unexpected making it into the HTML (a raw paste, a
// future editor bug, etc.).
//
// Deliberately not using isomorphic-dompurify/jsdom here: jsdom pulls in
// html-encoding-sniffer, which requires an ESM-only dependency in a
// CommonJS context Vercel's bundler can't resolve at runtime -- it built
// fine locally but 500'd on every /admin request in production.
// sanitize-html (htmlparser2-based, no DOM emulation) has no such issue.
export function sanitizeRichText(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ["p", "strong", "em", "s", "u", "h3", "ul", "ol", "li", "a", "br"],
    allowedAttributes: { a: ["href", "target", "rel"] },
  });
}

// Tiptap's "empty" editor still outputs `<p></p>`, not an empty string —
// this checks whether there's any actual text content worth keeping.
export function isBlankRichText(html: string): boolean {
  return html.replace(/<[^>]*>/g, "").trim().length === 0;
}
