import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, cookieOptions, createSession } from '@/lib/admin-auth';
import {
  changeAdminPassword,
  currentFingerprint,
  verifyAdminSession,
  MIN_PASSWORD_LENGTH,
} from '@/lib/admin-credentials';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Change the admin panel password.
 *
 * Requires a valid session AND the current password — a stolen session alone
 * must not be enough to lock the real admin out of their own panel.
 *
 * On success the caller's session is re-issued against the new password.
 * Every other session is invalidated automatically, because sessions carry a
 * fingerprint of the credential they were minted against.
 */
export async function POST(request: Request) {
  const store = await cookies();

  if (!(await verifyAdminSession(store.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ ok: false, message: 'Not signed in.' }, { status: 401 });
  }

  let body: { currentPassword?: unknown; newPassword?: unknown; confirmPassword?: unknown };
  try {
    body = (await request.json()) as typeof body;
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 });
  }

  const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
  const newPassword = typeof body.newPassword === 'string' ? body.newPassword : '';
  const confirmPassword = typeof body.confirmPassword === 'string' ? body.confirmPassword : '';

  if (!currentPassword || !newPassword || !confirmPassword) {
    return NextResponse.json(
      { ok: false, message: 'Please fill in all three fields.' },
      { status: 422 },
    );
  }
  if (newPassword !== confirmPassword) {
    return NextResponse.json(
      { ok: false, field: 'confirm', message: 'The new passwords do not match.' },
      { status: 422 },
    );
  }
  if (newPassword === currentPassword) {
    return NextResponse.json(
      { ok: false, field: 'new', message: 'The new password must be different.' },
      { status: 422 },
    );
  }

  const result = await changeAdminPassword(currentPassword, newPassword);

  if (!result.ok) {
    const messages: Record<typeof result.reason, { status: number; field?: string; text: string }> =
      {
        'wrong-current': {
          status: 401,
          field: 'current',
          text: 'Current password is incorrect.',
        },
        weak: {
          status: 422,
          field: 'new',
          text: `Use at least ${MIN_PASSWORD_LENGTH} characters.`,
        },
        unconfigured: {
          status: 503,
          text: 'Password storage is not configured. Check SUPABASE_SERVICE_ROLE_KEY.',
        },
        storage: {
          status: 502,
          text: 'Could not save the new password. Has supabase/schema.sql been run?',
        },
      };
    const detail = messages[result.reason];
    return NextResponse.json(
      { ok: false, field: detail.field, message: detail.text },
      { status: detail.status },
    );
  }

  /* Keep this admin signed in under the new credential. */
  const session = await createSession(await currentFingerprint());
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, session.value, cookieOptions(session.maxAge));
  return response;
}
