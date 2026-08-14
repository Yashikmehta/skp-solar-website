import type { CalculatorEstimate, LeadPayload } from './leads';

/**
 * ============================================================================
 * LEAD NOTIFICATION EMAIL
 * ============================================================================
 * Builds the enquiry notification sent to the sales inbox. Two variants, both
 * from the same template:
 *   · Contact form      → "New Enquiry — SKP Solar World"
 *   · Solar Calculator  → "New Solar Calculator Enquiry — SKP Solar World"
 *
 * The calculator variant carries the visitor's inputs, the recommended system
 * size and every headline figure the on-screen report showed them, so sales
 * sees exactly the numbers the customer saw.
 * ============================================================================
 */

export const SUBJECTS: Record<LeadPayload['source'], string> = {
  'Contact Page': 'New Enquiry — SKP Solar World',
  'Calculator Page': 'New Solar Calculator Enquiry — SKP Solar World',
};

/** Human label for the "Lead Type" row. */
const LEAD_TYPE: Record<LeadPayload['source'], string> = {
  'Contact Page': 'Contact / Enquiry Form',
  'Calculator Page': 'Solar Calculator',
};

/**
 * Escape user-supplied text before it goes into the HTML body. Lead fields are
 * attacker-controlled free text, so this is what stops a submitted name from
 * injecting markup into the sales team's inbox.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/** ₹ with Indian digit grouping, e.g. ₹24,957. */
function inr(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

/** ₹ with a lakh/crore reading alongside, for the large 25-year figures. */
function inrLong(value: number): string {
  const rounded = Math.round(value);
  if (rounded >= 1e7) return `${inr(rounded)} (₹${(rounded / 1e7).toFixed(2)} Cr)`;
  if (rounded >= 1e5) return `${inr(rounded)} (₹${(rounded / 1e5).toFixed(2)} L)`;
  return inr(rounded);
}

/** Submission timestamp in IST, the business's own timezone. */
export function formatIst(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(date);
}

interface Row {
  label: string;
  value: string;
}

function customerRows(lead: LeadPayload): Row[] {
  const rows: Row[] = [
    { label: 'Lead Type', value: LEAD_TYPE[lead.source] },
    { label: 'Name', value: lead.name },
    { label: 'Mobile', value: lead.mobile },
    { label: 'Email', value: lead.email },
  ];

  if (lead.company) rows.push({ label: 'Company', value: lead.company });
  rows.push({ label: 'Sector', value: lead.sector });

  /* The calculator form does not collect a city; it sends "—". */
  if (lead.city && lead.city !== '—') rows.push({ label: 'City', value: lead.city });
  if (lead.estimate) {
    rows.push({ label: 'Monthly Electricity Bill', value: inr(lead.estimate.monthlyBill) });
  }
  if (lead.message) rows.push({ label: 'Message', value: lead.message });

  return rows;
}

function estimateRows(estimate: CalculatorEstimate): Row[] {
  return [
    { label: 'Required System Size', value: `${estimate.systemKw} kW` },
    {
      label: 'Estimated Monthly Generation',
      value: `${Math.round(estimate.monthlyGeneration).toLocaleString('en-IN')} units`,
    },
    { label: 'Estimated Monthly Savings', value: inr(estimate.monthlySavings) },
    { label: 'Estimated Annual Savings', value: inrLong(estimate.annualSavings) },
    { label: 'Payback Period', value: `${estimate.paybackYears.toFixed(1)} years` },
    { label: 'Estimated System Cost', value: inrLong(estimate.systemCost) },
    { label: '25-Year Estimated Savings', value: inrLong(estimate.savings25) },
    { label: 'Bill Offset', value: `${Math.round(estimate.billOffset * 100)}%` },
    { label: 'CO₂ Avoided (25 yrs)', value: `${estimate.co2Tonnes.toFixed(1)} tonnes` },
    {
      label: 'Equivalent Trees Planted',
      value: estimate.trees.toLocaleString('en-IN'),
    },
  ];
}

function footerRows(lead: LeadPayload, submittedAt: Date): Row[] {
  return [
    {
      label: 'Source / Page',
      value:
        lead.source === 'Calculator Page'
          ? 'Solar Calculator (/solar-calculator)'
          : 'Contact Page (/contact)',
    },
    { label: 'Date & Time', value: `${formatIst(submittedAt)} IST` },
  ];
}

/* -------------------------------------------------------------------------- */
/*  Plain text                                                                */
/* -------------------------------------------------------------------------- */

function textBlock(rows: Row[]): string {
  return rows.map((row) => `${row.label}: ${row.value}`).join('\n');
}

export function buildLeadText(lead: LeadPayload, submittedAt: Date): string {
  const parts = [
    'SKP SOLAR WORLD',
    'NEW CUSTOMER ENQUIRY',
    '',
    textBlock(customerRows(lead)),
  ];

  if (lead.estimate) {
    parts.push('', 'SOLAR CALCULATOR DETAILS', textBlock(estimateRows(lead.estimate)));
  }

  parts.push('', textBlock(footerRows(lead, submittedAt)));

  return parts.join('\n');
}

/* -------------------------------------------------------------------------- */
/*  HTML                                                                      */
/* -------------------------------------------------------------------------- */

const GOLD = '#c8892a';
const INK = '#12223a';

function htmlRows(rows: Row[]): string {
  return rows
    .map(
      (row) => `
      <tr>
        <td style="padding:9px 16px 9px 0;color:#5b6b80;font-size:13px;white-space:nowrap;vertical-align:top;border-bottom:1px solid #eef1f5;">${escapeHtml(
          row.label,
        )}</td>
        <td style="padding:9px 0;color:${INK};font-size:14px;font-weight:600;vertical-align:top;border-bottom:1px solid #eef1f5;">${escapeHtml(
          row.value,
        )}</td>
      </tr>`,
    )
    .join('');
}

function sectionHeading(text: string): string {
  return `<tr><td colspan="2" style="padding:26px 0 8px;color:${GOLD};font-size:12px;font-weight:700;letter-spacing:.10em;text-transform:uppercase;">${escapeHtml(
    text,
  )}</td></tr>`;
}

export function buildLeadHtml(lead: LeadPayload, submittedAt: Date): string {
  const calculator = lead.estimate
    ? sectionHeading('Solar Calculator Details') + htmlRows(estimateRows(lead.estimate))
    : '';

  return `<!doctype html>
<html>
<body style="margin:0;padding:24px;background:#f4f6f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table role="presentation" cellpadding="0" cellspacing="0" style="max-width:620px;margin:0 auto;width:100%;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 2px 10px rgba(18,34,58,.07);">
    <tr>
      <td style="background:${INK};padding:26px 32px;">
        <div style="color:${GOLD};font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;">SKP Solar World</div>
        <div style="color:#ffffff;font-size:21px;font-weight:700;margin-top:5px;">New Customer Enquiry</div>
      </td>
    </tr>
    <tr>
      <td style="padding:12px 32px 30px;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%">
          ${sectionHeading('Customer Details')}
          ${htmlRows(customerRows(lead))}
          ${calculator}
          ${sectionHeading('Submission')}
          ${htmlRows(footerRows(lead, submittedAt))}
        </table>
        <p style="margin:26px 0 0;color:#7c8899;font-size:12px;line-height:1.5;">
          Reply directly to this email to reach the customer &mdash; the reply-to
          address is set to ${escapeHtml(lead.email)}.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function subjectFor(lead: LeadPayload): string {
  return SUBJECTS[lead.source];
}
