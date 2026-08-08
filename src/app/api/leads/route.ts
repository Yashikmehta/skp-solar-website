import { NextResponse } from 'next/server';
import { hasErrors, validateLead, type LeadPayload } from '@/lib/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Lead intake endpoint.
 *
 * This replaces the `localStorage['skp_enquiries']` design stub called out in
 * HANDOFF.md §5. It validates server-side and then hands the lead to whatever
 * `deliverLead` is wired to.
 *
 * ▸ TO GO LIVE: implement `deliverLead` below — email via Resend/SendGrid, a
 *   CRM webhook, or a Sanity document. Until then it logs the lead and returns
 *   success so the approved success state still renders end to end.
 */
async function deliverLead(lead: LeadPayload): Promise<void> {
  const endpoint = process.env.LEAD_WEBHOOK_URL;

  if (!endpoint) {
    // eslint-disable-next-line no-console
    console.info('[leads] no LEAD_WEBHOOK_URL configured — lead not delivered', {
      source: lead.source,
      city: lead.city,
      sector: lead.sector,
    });
    return;
  }

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
