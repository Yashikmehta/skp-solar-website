import type { BlogBlock } from '@/lib/blog';
import { RichText } from './RichText';

/**
 * The article body. Blocks come verbatim from `src/content/blog-posts.ts` —
 * one branch per block type, exactly the set the approved design renders:
 * h2 (also builds the TOC), h3, p (optional bold lead-in), ul, table, sources.
 */
export function ArticleBody({
  intro,
  quickAnswer,
  blocks,
}: {
  intro: string;
  quickAnswer: string;
  blocks: BlogBlock[];
}) {
  return (
    <>
      {intro ? <p className="prose-intro">
          <RichText text={intro} />
        </p> : null}

      {quickAnswer ? (
        <div className="prose-quick">
          <span className="lab">
            <i />
            Quick answer
          </span>
          <p>{quickAnswer}</p>
        </div>
      ) : null}

      {blocks.map((block, index) => {
        switch (block.t) {
          case 'h2':
            return (
              <h2 key={block.id} id={block.id} data-toc-heading={block.text}>
                {block.text}
              </h2>
            );
          case 'h3':
            return <h3 key={`h3-${index}`}>{block.text}</h3>;
          case 'p':
            return (
              <p key={`p-${index}`}>
                {block.lead ? <b>{block.lead} </b> : null}
                {block.text}
              </p>
            );
          case 'ul':
            return (
              <ul className="prose-ul" key={`ul-${index}`}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <span className="tick">
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M20 6L9 17l-5-5" />
                      </svg>
                    </span>
                    <span>
                      {item.lead ? <b>{item.lead} </b> : null}
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
            );
          case 'table':
            return (
              <div className="prose-table" key={`table-${index}`}>
                <table>
                  <tbody>
                    {block.rows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex}>{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'sources':
            return (
              <ul className="prose-sources" key={`sources-${index}`}>
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <i />
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            );
          default:
            return null;
        }
      })}
    </>
  );
}
