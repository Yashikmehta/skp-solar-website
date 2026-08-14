import { NextResponse } from 'next/server';
import { sendLeadNotification } from '@/lib/notify';
import { saveLead } from '@/lib/supabase';
import { hasErrors, sanitizeEstimate, validateLead, type LeadPayload } from '@/lib/leads';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Lead intake endpoint — used by both the Contact enquiry form and the Solar
 * Calculator report form.
 *
 * Order of operations matters:
 *   1. validate server-side (never trust the browser)
 *   2. WRITE TO SUPABASE — the permanent record. If this fails the request
 *      fails, so the visitor is never shown a success state for a lead that
 *      was not stored.
 *   3. EMAIL sales@skpsolarworld.com — notification only. The lead is already
 *      safe in the database by this point, so a mail outage is logged loudly
 *      but does not fail the request and does not push the customer into
 *      re-submitting (which would duplicate the stored row).
 */
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
    estimate: sanitizeEstimate(body.estimate),
  };

  const submittedAt = new Date();

  /* 1 · Permanent record. A failure here is fatal to the request. */
  try {
    await saveLead(lead);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[leads] could not save lead to Supabase', error);
    return NextResponse.json(
      {
        ok: false,
        message: 'We could not submit your enquiry. Please call or WhatsApp us.',
      },
      { status: 502 },
    );
  }

  /* 2 · Notification. Non-fatal — the lead is already stored. */
  try {
    await sendLeadNotification(lead, submittedAt);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(
      '[leads] lead SAVED but notification email FAILED — recover it from the Supabase `leads` table',
      error,
    );
  }

  return NextResponse.json({ ok: true });
}
