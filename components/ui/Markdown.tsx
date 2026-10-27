import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Tiny markdown renderer for admin-written text: paragraphs, ## / ### headings,
 * "- " lists, **bold** and [links](url). No HTML passthrough, so nothing can be injected.
 */
export function Markdown({ text, className = "prose-mmc" }: { text: string; className?: string }) {
  const blocks = text.replace(/\r\n/g, "\n").trim().split(/\n{2,}/);
  return (
    <div className={className}>
      {blocks.map((block, i) => {
        if (block.startsWith("### ")) return <h3 key={i}>{inline(block.slice(4))}</h3>;
        if (block.startsWith("## ")) return <h2 key={i}>{inline(block.slice(3))}</h2>;
        const lines = block.split("\n");
        if (lines.every((l) => /^[-*] /.test(l))) {
          return (
            <ul key={i}>
              {lines.map((l, j) => (
                <li key={j}>{inline(l.slice(2))}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i}>
            {lines.map((l, j) => (
              <span key={j}>
                {j > 0 && <br />}
                {inline(l)}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}

function inline(text: string): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={m.index}>{m[1]}</strong>);
    else {
      const url = m[3];
      const safe = /^(https?:|mailto:|tel:|\/)/.test(url);
      if (!safe) out.push(m[2]);
      else if (url.startsWith("/")) out.push(<Link key={m.index} href={url}>{m[2]}</Link>);
      else out.push(<a key={m.index} href={url} target={url.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{m[2]}</a>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

/** First paragraph of a markdown text, as plain text (for descriptions). */
export function firstParagraph(text: string) {
  return text.trim().split(/\n{2,}/)[0]?.replace(/\*\*|__/g, "") ?? "";
}
