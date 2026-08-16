import { formatIst } from './lead-email';
import type { StoredLead } from './supabase';

/**
 * ============================================================================
 * LEAD CSV EXPORT
 * ============================================================================
 * Builds the spreadsheet the admin downloads. Opens cleanly in Excel, Numbers
 * and Google Sheets.
 * ============================================================================
 */

export type ExportKind = 'enquiries' | 'calculator' | 'all';

export function isExportKind(value: string | null): value is ExportKind {
  return value === 'enquiries' || value === 'calculator' || value === 'all';
}

/** Which `source` each export covers; `all` covers both. */
export const EXPORT_SOURCE = {
  enquiries: 'Contact Page',
  calculator: 'Calculator Page',
  all: undefined,
} as const;

/** Columns every export carries. */
const CORE_COLUMNS = [
  'ID',
  'Submitted (IST)',
  'Lead Type',
  'Name',
  'Company',
  'Mobile',
  'Email',
  'City',
  'Sector',
  'Message',
] as const;

/** Extra columns for exports that include calculator submissions. */
const CALCULATOR_COLUMNS = [
  'Monthly Electricity Bill (INR)',
  'Required System Size (kW)',
  'Monthly Generation (units)',
  'Estimated Monthly Savings (INR)',
  'Estimated Annual Savings (INR)',
  'Estimated System Cost (INR)',
  '25-Year Estimated Savings (INR)',
  'Payback Period (years)',
  'Bill Offset (%)',
  'CO2 Avoided 25yrs (tonnes)',
  'Equivalent Trees',
] as const;

/**
 * Does this value need neutralising against CSV/formula injection?
 *
 * Excel and Sheets execute a cell beginning `= @ | + -` as a formula, and
 * `name`/`message` are whatever the visitor typed — so this is a real path
 * from a website form into someone's spreadsheet.
 *
 * `=`, `@`, `|`, tab and CR are always unsafe. `+` and `-` are treated as
 * unsafe only when what follows isn't simply a number or phone: `+91 98765
 * 43210` must stay readable, while `+cmd|'/c calc'!A1` must not execute.
 */
function needsGuard(text: string): boolean {
  if (/^[=@|\t\r]/.test(text)) return true;
  if (/^[+-]/.test(text)) return !/^[+-][\d\s()\-.]*$/.test(text);
  return false;
}

/**
 * Escape one CSV field.
 *
 * RFC 4180: wrap in quotes and double any inner quote, so commas, quotes and
 * newlines inside a customer's message cannot break the row.
 */
function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';

  let text = String(value);
  if (needsGuard(text)) text = `'${text}`;

  return `"${text.replace(/"/g, '""')}"`;
}

/** Round to at most `places` decimals, returning a plain number for the sheet. */
function num(value: number | undefined, places = 2): number | '' {
  if (value === undefined || !Number.isFinite(value)) return '';
  return Number(value.toFixed(places));
}

function coreCells(lead: StoredLead): (string | number | null)[] {
  return [
    lead.id,
    formatIst(new Date(lead.created_at)),
    lead.source === 'Calculator Page' ? 'Solar Calculator' : 'Contact / Enquiry Form',
    lead.name,
    lead.company ?? '',
    /* Leading + on a phone number is a formula character; escapeCsv handles it. */
    lead.mobile,
    lead.email,
    /* The calculator form stores "—" because it collects no city. */
    lead.city === '—' ? '' : lead.city,
    lead.sector,
    lead.message ?? '',
  ];
}

function calculatorCells(lead: StoredLead): (string | number | '')[] {
  const e = lead.estimate;
  if (!e) return new Array(CALCULATOR_COLUMNS.length).fill('');

  return [
    num(e.monthlyBill, 0),
    num(e.systemKw, 2),
    num(e.monthlyGeneration, 0),
    num(e.monthlySavings, 0),
    num(e.annualSavings, 0),
    num(e.systemCost, 0),
    num(e.savings25, 0),
    num(e.paybackYears, 1),
    num(e.billOffset * 100, 1),
    num(e.co2Tonnes, 1),
    num(e.trees, 0),
  ];
}

/**
 * Build the CSV document.
 *
 * `enquiries` omits the calculator columns entirely — contact-form leads have
 * no figures, and eleven empty columns would just be noise in the sheet.
 */
export function buildLeadCsv(leads: StoredLead[], kind: ExportKind): string {
  const withCalculator = kind !== 'enquiries';

  const header = withCalculator
    ? [...CORE_COLUMNS, ...CALCULATOR_COLUMNS]
    : [...CORE_COLUMNS];

  const rows = leads.map((lead) => {
    const cells = withCalculator
      ? [...coreCells(lead), ...calculatorCells(lead)]
      : coreCells(lead);
    return cells.map(escapeCsv).join(',');
  });

  /* CRLF line endings per RFC 4180 — Excel on Windows needs them. */
  const body = [header.map(escapeCsv).join(','), ...rows].join('\r\n');

  /* UTF-8 BOM. Without it Excel reads the file as Latin-1 and mangles the ₹
     symbol, em dashes and any non-ASCII name. */
  return `﻿${body}\r\n`;
}

/** e.g. `skp-solar-calculator-submissions-2026-08-16.csv` */
export function exportFilename(kind: ExportKind, now = new Date()): string {
  const date = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Kolkata',
  }).format(now);

  const label =
    kind === 'enquiries'
      ? 'enquiries'
      : kind === 'calculator'
        ? 'calculator-submissions'
        : 'all-leads';

  return `skp-solar-${label}-${date}.csv`;
}
