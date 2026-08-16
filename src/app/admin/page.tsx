import Link from 'next/link';
import { AdminBar } from './AdminBar';
import { formatIst } from '@/lib/lead-email';
import type { CalculatorEstimate } from '@/lib/leads';
import { requireAdmin } from '@/lib/admin-credentials';
import { fetchLeads, type StoredLead } from '@/lib/supabase';

/* Leads must never be cached — the panel always reflects the database. */
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Tab = 'enquiries' | 'calculator';

/* -------------------------------------------------------------------------- */
/*  Formatting                                                                */
/* -------------------------------------------------------------------------- */

function inr(value: number): string {
  return `₹${Math.round(value).toLocaleString('en-IN')}`;
}

function inrLong(value: number): string {
  const rounded = Math.round(value);
  if (rounded >= 1e7) return `${inr(rounded)} (₹${(rounded / 1e7).toFixed(2)} Cr)`;
  if (rounded >= 1e5) return `${inr(rounded)} (₹${(rounded / 1e5).toFixed(2)} L)`;
  return inr(rounded);
}

function Cell({
  label,
  children,
  wide,
}: {
  label: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={`adm-cell${wide ? ' wide' : ''}`}>
      <div className="adm-k">{label}</div>
      <div className="adm-v">{children}</div>
    </div>
  );
}

/** The calculator inputs and every figure the customer was shown. */
function CalculatorBlock({ estimate }: { estimate: CalculatorEstimate }) {
  return (
    <div className="adm-calc">
      <div className="adm-calc-head">Solar Calculator Details</div>
      <div className="adm-grid">
        <Cell label="Monthly Electricity Bill">{inr(estimate.monthlyBill)}</Cell>
        <Cell label="Required System Size">{estimate.systemKw} kW</Cell>
        <Cell label="Monthly Generation">
          {Math.round(estimate.monthlyGeneration).toLocaleString('en-IN')} units
        </Cell>
        <Cell label="Estimated Monthly Savings">{inr(estimate.monthlySavings)}</Cell>
        <Cell label="Estimated Annual Savings">{inrLong(estimate.annualSavings)}</Cell>
        <Cell label="Payback Period">{estimate.paybackYears.toFixed(1)} years</Cell>
        <Cell label="Estimated System Cost">{inrLong(estimate.systemCost)}</Cell>
        <Cell label="25-Year Estimated Savings">{inrLong(estimate.savings25)}</Cell>
        <Cell label="Bill Offset">{Math.round(estimate.billOffset * 100)}%</Cell>
        <Cell label="CO₂ Avoided (25 yrs)">{estimate.co2Tonnes.toFixed(1)} tonnes</Cell>
        <Cell label="Equivalent Trees">{estimate.trees.toLocaleString('en-IN')}</Cell>
      </div>
    </div>
  );
}

function LeadCard({ lead }: { lead: StoredLead }) {
  const calculator = lead.source === 'Calculator Page';

  return (
    <article className="adm-card">
      <header className="adm-card-head">
        <div>
          <span className="adm-card-name">{lead.name}</span>{' '}
          <span className={`adm-chip ${calculator ? 'calc' : 'contact'}`}>
            {calculator ? 'Calculator' : 'Enquiry'}
          </span>
        </div>
        <time className="adm-card-when" dateTime={lead.created_at}>
          {formatIst(new Date(lead.created_at))} IST
        </time>
      </header>

      <div className="adm-grid">
        <Cell label="Mobile">
          <a href={`tel:${lead.mobile.replace(/\s/g, '')}`}>{lead.mobile}</a>
        </Cell>
        <Cell label="Email">
          <a href={`mailto:${lead.email}`}>{lead.email}</a>
        </Cell>
        {lead.company ? <Cell label="Company">{lead.company}</Cell> : null}
        <Cell label="Sector">{lead.sector}</Cell>
        {/* The calculator form does not collect a city; it stores "—". */}
        {lead.city && lead.city !== '—' ? <Cell label="City">{lead.city}</Cell> : null}
        {lead.message ? (
          <Cell label="Message" wide>
            {lead.message}
          </Cell>
        ) : null}
      </div>

      {lead.estimate ? <CalculatorBlock estimate={lead.estimate} /> : null}
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                      */
/* -------------------------------------------------------------------------- */

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  /* Middleware checks the signature; this also checks the session was issued
     against the password currently in force. */
  await requireAdmin();

  const { tab } = await searchParams;
  const active: Tab = tab === 'calculator' ? 'calculator' : 'enquiries';

  /* One query, split in memory — cheaper than two round trips and keeps both
     tab counts accurate no matter which tab is showing. */
  const { leads, error } = await fetchLeads();

  const enquiries = leads.filter((lead) => lead.source === 'Contact Page');
  const calculator = leads.filter((lead) => lead.source === 'Calculator Page');
  const shown = active === 'calculator' ? calculator : enquiries;

  return (
    <div className="adm-body">
      <AdminBar />

      <div className="adm-wrap">
        <h1 className="adm-title">Customer Enquiries</h1>
        <p className="adm-sub">
          View-only record of everything submitted through the website. Newest first,
          times shown in IST.
        </p>

        {error ? (
          <div className="adm-error" role="alert" style={{ marginTop: 20 }}>
            <b>Could not load leads</b>
            {error}
          </div>
        ) : null}

        <nav className="adm-tabs">
          <Link
            className={`adm-tab${active === 'enquiries' ? ' active' : ''}`}
            href="/admin"
            scroll={false}
          >
            All Enquiries <span className="adm-count">{enquiries.length}</span>
          </Link>
          <Link
            className={`adm-tab${active === 'calculator' ? ' active' : ''}`}
            href="/admin?tab=calculator"
            scroll={false}
          >
            Solar Calculator <span className="adm-count">{calculator.length}</span>
          </Link>
        </nav>

        {/* Plain links, not fetch() — the browser handles the download and the
            Content-Disposition header names the file. */}
        <section className="adm-export">
          <div className="adm-export-head">
            <b>Export to CSV</b>
            <span>Opens in Excel, Numbers or Google Sheets. Includes every record.</span>
          </div>
          <div className="adm-export-btns">
            <a className="adm-export-btn" href="/api/admin/export?type=enquiries" download>
              Enquiries <i>{enquiries.length}</i>
            </a>
            <a className="adm-export-btn" href="/api/admin/export?type=calculator" download>
              Calculator <i>{calculator.length}</i>
            </a>
            <a className="adm-export-btn primary" href="/api/admin/export?type=all" download>
              All leads <i>{leads.length}</i>
            </a>
          </div>
        </section>

        {shown.length === 0 ? (
          <div className="adm-empty">
            {error
              ? 'Nothing to show while the database is unavailable.'
              : active === 'calculator'
                ? 'No solar calculator submissions yet.'
                : 'No contact enquiries yet.'}
          </div>
        ) : (
          <div className="adm-list">
            {shown.map((lead) => (
              <LeadCard lead={lead} key={lead.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
