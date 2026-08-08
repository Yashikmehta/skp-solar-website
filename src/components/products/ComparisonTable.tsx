import { AmbientOrb } from '@/components/ui/AmbientOrb';
import { Hl, SectionHeading } from '@/components/ui/SectionHeading';
import { comparisonColumns, comparisonRows, type CellValue } from '@/content/products';

/** `.dots` — the 0–5 rating indicator used in the comparison table. */
function Dots({ filled }: { filled: number }) {
  return (
    <span className="dots" role="img" aria-label={`${filled} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => (
        <i className={index < filled ? 'on' : undefined} key={index} />
      ))}
    </span>
  );
}

function Cell({ value }: { value: CellValue }) {
  return typeof value === 'string' ? <>{value}</> : <Dots filled={value.dots} />;
}

/**
 * `.pcmp` — the module comparison table.
 *
 * Wrapped in `.cmp-scroll`, which the approved CSS makes horizontally
 * scrollable on narrow viewports so the page body never scrolls sideways.
 */
export function ComparisonTable() {
  return (
    <section className="pcmp">
      <AmbientOrb
        tone="green"
        parallax={-0.04}
        style={{ width: 340, height: 340, top: 40, left: -90 }}
      />
      <div className="wrap">
        <SectionHeading
          center
          className="reveal"
          kicker="Product Comparison"
          title={
            <>
              Choose the right module <Hl>in one glance</Hl>
            </>
          }
          body="Three proven technologies, honestly compared — so you pick on engineering, not on marketing."
        />

        <div className="cmp-scroll reveal dly1" tabIndex={0} role="region" aria-label="Module comparison">
          <table className="cmp-table">
            <thead>
              <tr>
                <th scope="col">Parameter</th>
                {comparisonColumns.map((column) => (
                  <th scope="col" className={column.highlight ? 'hi' : undefined} key={column.name}>
                    {column.name}
                    {column.flag ? <span className="cmp-flag">{column.flag}</span> : null}
                    <small>{column.note}</small>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.parameter}>
                  <td>{row.parameter}</td>
                  {row.values.map((value, index) => (
                    <td
                      className={comparisonColumns[index]?.highlight ? 'hi' : undefined}
                      key={`${row.parameter}-${index}`}
                    >
                      <Cell value={value} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="cmp-note">
          Ratings are relative across SKP&apos;s module range. Your SKP engineer will recommend the
          right technology after a site survey.
        </p>
      </div>
    </section>
  );
}
