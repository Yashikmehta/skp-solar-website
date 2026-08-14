import { Resend } from 'resend';
import { buildLeadHtml, buildLeadText, subjectFor } from './lead-email';
import type { LeadPayload } from './leads';

/**
 * ============================================================================
 * LEAD NOTIFICATION — RESEND
 * ============================================================================
 * Notifies the sales inbox that a lead arrived. Supabase already holds the
 * permanent record by the time this runs, so a failure here is logged loudly
 * but does not lose the enquiry.
 *
 *   RESEND_API_KEY          · Resend API key
 *   LEAD_NOTIFICATION_EMAIL · recipient — sales@skpsolarworld.com
 *   LEAD_FROM_EMAIL         · verified sender, e.g.
 *                             "SKP Solar World <enquiries@skpsolarworld.com>"
 *
 * `LEAD_FROM_EMAIL` must be on a domain verified in Resend. Until the domain
 * is verified, Resend's shared `onboarding@resend.dev` sender works but can
 * only deliver to the Resend account owner's own address.
 * ============================================================================
 */

const FALLBACK_FROM = 'SKP Solar World <onboarding@resend.dev>';

let resend: Resend | null = null;

function getResend(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!resend) resend = new Resend(key);
  return resend;
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.LEAD_NOTIFICATION_EMAIL);
}

/**
 * Send the notification. Throws on failure; the caller decides whether that
 * is fatal to the request (it is not — see `route.ts`).
 */
export async function sendLeadNotification(
  lead: LeadPayload,
  submittedAt: Date,
): Promise<void> {
  const client = getResend();
  const to = process.env.LEAD_NOTIFICATION_EMAIL;

  if (!client || !to) {
    throw new Error(
      'Email is not configured — set RESEND_API_KEY and LEAD_NOTIFICATION_EMAIL.',
    );
  }

  const { error } = await client.emails.send({
    from: process.env.LEAD_FROM_EMAIL || FALLBACK_FROM,
    to: [to],
    /* So the sales team can reply straight to the customer. */
    replyTo: lead.email,
    subject: subjectFor(lead),
    text: buildLeadText(lead, submittedAt),
    html: buildLeadHtml(lead, submittedAt),
  });

  if (error) {
    throw new Error(`Resend rejected the message: ${error.message}`);
  }
}
