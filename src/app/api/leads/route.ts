import { NextResponse } from 'next/server';
import { hasErrors, validateLead, type LeadPayload } from '@/lib/leads';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

async function saveLeadToSupabase(lead: LeadPayload): Promise<void> {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  const { error } = await supabase.from('leads').insert({
    name: lead.name,
    company: lead.company ?? null,
    mobile: lead.mobile,
    email: lead.email,
    city: lead.city,
    sector: lead.sector,
    message: lead.message ?? null,
    source: lead.source,
    estimate: lead.estimate ?? null,
  });

  if (error) {
    throw new Error(`Supabase insert failed: ${error.message}`);
  }
}

async function forwardLeadToWebhook(lead: LeadPayload): Promise<void> {
  const endpoint = process.env.LEAD_WEBHOOK_URL;
  if (!endpoint) return;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(process.env.LEAD_WEBHOOK_TOKEN
        ? { Authorization: `Bearer ${process.env.LEAD_WEBHOOK_TOKEN}` }
        : {}),
    },
    body: JSON.stringify({ ...lead, receivedAt: new Date().toISOString() }),
  });

  if (!response.ok) {
    throw new Error(`Lead webhook responded ${response.status}`);
  }
}

async function deliverLead(lead: LeadPayload): Promise<void> {
  const hasSupabase = Boolean(
    process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
  const hasWebhook = Boolean(process.env.LEAD_WEBHOOK_URL);

  if (!hasSupabase && !hasWebhook) {
    // eslint-disable-next-line no-console
    console.info('[leads] no delivery configured — lead logged only', {
      source: lead.source,
      city: lead.city,
      sector: lead.sector,
    });
    return;
  }

  if (hasSupabase) await saveLeadToSupabase(lead);
  if (hasWebhook) await forwardLeadToWebhook(lead);
}

export async function POST(request: Request) {
  let body: Partial<LeadPayload>;

  try {
    body = (await request.json()) as Partial<LeadPayload>;
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request body.' }, { status: 400 });
  }

  const errors = validateLead(body);
  if (hasErrors(errors)) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const lead: LeadPayload = {
    name: body.name!.trim(),
    company: body.company?.trim() || undefined,
    mobile: body.mobile!.trim(),
    email: body.email!.trim(),
    city: body.city!.trim(),
    sector: body.sector!,
    message: body.message?.trim() || undefined,
    source: body.source === 'Calculator Page' ? 'Calculator Page' : 'Contact Page',
    estimate: body.estimate,
  };

  try {
    await deliverLead(lead);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[leads] delivery failed', error);
    return NextResponse.json(
      { ok: false, message: 'We could not send your enquiry. Please call or WhatsApp us.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
