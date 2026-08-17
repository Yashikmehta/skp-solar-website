import { Fragment, type ReactNode } from 'react';

/**
 * Renders the `**bold**` markers that survive in the blog source data.
 *
 * Several posts open with `**Quick answer:**`. The markers are literal in
 * `blog-posts.ts` — the handoff shipped them that way and the design rendered
 * them as visible asterisks. They are clearly intended as emphasis, so rather
 * than printing `**Quick answer:**` on a live page we render the phrase bold,
 * which is what the copy meant.
 *
 * Deliberately not a Markdown parser: it handles paired `**` and nothing else,
 * so no other punctuation in the copy can be reinterpreted.
 */
export function RichText({ text }: { text: string }): ReactNode {
  if (!text.includes('**')) return text;

  /* Split on paired markers; odd indices are the emphasised runs. */
  const parts = text.split(/\*\*(.+?)\*\*/g);

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <b key={index}>{part}</b>
    ) : (
      <Fragment key={index}>{part}</Fragment>
    ),
  );
}
