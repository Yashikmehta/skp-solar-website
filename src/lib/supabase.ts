import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { CalculatorEstimate, LeadPayload } from './leads';

/**
 * ============================================================================
 * SUPABASE — THE PERMANENT LEAD RECORD
 * ============================================================================
 * Every enquiry (Contact form and Solar Calculator alike) is written to the
 * `leads` table before the notification email goes out. Supabase is the system
 * of record; email is only the notification. If this write fails, the API
 * refuses the submission so the visitor is never shown a false success.
 *
 * Credentials come from the environment and are never committed:
 *   SUPABASE_URL        · project URL
 *   SUPABASE_ANON_KEY   · anon/publishable key
 *
 * The table lives in `supabase/schema.sql`. Because we use the anon key, the
 * insert relies on the row-level-security policy in that file.
 * ============================================================================
 */

/** The row shape written to `public.leads` — snake_case to match Postgres. */
export interface LeadRow {
  name: string;
  company: string | null;
  mobile: string;
  email: string;
  city: string;
  sector: string;
  message: string | null;
  source: LeadPayload['source'];
  /** Full calculator context, or null for Contact-page leads. */
  estimate: LeadPayload['estimate'] | null;
}

/**
 * Normalise `SUPABASE_URL` to the bare project origin.
 *
 * The dashboard shows the REST endpoint (`…supabase.co/rest/v1/`) right next
 * to the project URL, and pasting that instead is an easy mistake — the client
 * appends `/rest/v1` itself, so the un-trimmed value produces requests to
 * `/rest/v1/rest/v1/...` and a puzzling 404. Trim it rather than fail.
 */
function projectUrl(raw: string): string {
  return raw.trim().replace(/\/+$/, '').replace(/\/rest\/v1$/, '');
}

let client: SupabaseClient | null = null;

/**
 * Lazily built singleton. Returns null when the environment is not configured,
 * so callers can produce a clear "not configured" error rather than crashing
 * the route at import time.
 */
function getClient(): SupabaseClient | null {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  client = createClient(projectUrl(url), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}

/**
 * Persist a lead. Throws on any failure — the caller turns that into a 5xx so
 * the form shows its error state instead of its success state.
 */
export async function saveLead(lead: LeadPayload): Promise<void> {
  const supabase = getClient();

  if (!supabase) {
    throw new Error(
      'Supabase is not configured — set SUPABASE_URL and SUPABASE_ANON_KEY.',
    );
  }

  const row: LeadRow = {
    name: lead.name,
    company: lead.company ?? null,
    mobile: lead.mobile,
    email: lead.email,
    city: lead.city,
    sector: lead.sector,
    message: lead.message ?? null,
    source: lead.source,
    estimate: lead.estimate ?? null,
  };

  const { error } = await supabase.from('leads').insert(row);

  if (error) {
    throw new Error(`Supabase insert failed: ${error.message}`);
  }
}

/* ==========================================================================
   READING LEADS — ADMIN PANEL ONLY
   ==========================================================================
   The anon key above can INSERT but not SELECT (see the RLS policy in
   `supabase/schema.sql`), so a leaked anon key cannot be used to harvest
   customer data. Reading therefore needs the service-role key, which bypasses
   RLS and must never be exposed to the browser.

     SUPABASE_SERVICE_ROLE_KEY · server-side only, never NEXT_PUBLIC_

   Everything below runs exclusively in server components behind the admin
   session check in `middleware.ts`.
   ========================================================================== */

/** A stored lead as read back from the database. */
export interface StoredLead {
  id: number;
  created_at: string;
  name: string;
  company: string | null;
  mobile: string;
  email: string;
  city: string;
  sector: string;
  message: string | null;
  source: LeadPayload['source'];
  estimate: CalculatorEstimate | null;
}

let adminClient: SupabaseClient | null = null;

function getAdminClient(): SupabaseClient | null {
  if (adminClient) return adminClient;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  adminClient = createClient(projectUrl(url), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}

export function isAdminReadConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export interface LeadQueryResult {
  leads: StoredLead[];
  error: string | null;
}

/**
 * Fetch stored leads, newest first. Never throws — the admin page renders an
 * explanatory message instead of a crash when the database is unreachable or
 * not yet configured.
 */
export async function fetchLeads(
  source?: LeadPayload['source'],
  limit = 500,
): Promise<LeadQueryResult> {
  const supabase = getAdminClient();

  if (!supabase) {
    return {
      leads: [],
      error: 'Supabase is not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
    };
  }

  let query = supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (source) query = query.eq('source', source);

  const { data, error } = await query;

  if (error) return { leads: [], error: error.message };
  return { leads: (data ?? []) as StoredLead[], error: null };
}
