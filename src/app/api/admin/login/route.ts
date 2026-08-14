import { NextResponse } from 'next/server';
import {
  ADMIN_COOKIE,
  checkPassword,
  cookieOptions,
  createSession,
  isAdminConfigured,
} from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Admin sign-in. On success sets the signed HttpOnly session cookie.
 *
 * Failures are deliberately slow and vague: the same message and the same
 * delay regardless of what was wrong, so the endpoint cannot be used to probe
 * whether a password is close.
 */

/** Per-IP attempt tracking. Best-effort — resets when the instance recycles. */
const attempts = new Map<string, { count: number; first: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 8;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);

  if (!record || now - record.first > WINDOW_MS) {
    attempts.set(ip, { count: 1, first: now });
    return false;
  }

  record.count += 1;
  return record.count > MAX_ATTEMPTS;
}

const FAILURE = 'Incorrect password.';

async function slowFailure(message = FAILURE, status = 401) {
  await new Promise((resolve) => setTimeout(resolve, 600));
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        message:
          'Admin access is not configured. Set ADMIN_PASSWORD and ADMIN_SESSION_SECRET.',
      },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

  if (rateLimited(ip)) {
    return slowFailure('Too many attempts. Please wait 10 minutes and try again.', 429);
  }

  let password = '';
  try {
    const body = (await request.json()) as { password?: unknown };
    if (typeof body.password === 'string') password = body.password;
  } catch {
    return slowFailure();
  }

  if (!password || !checkPassword(password)) return slowFailure();

  const session = await createSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, session.value, cookieOptions(session.maxAge));

  /* Clean slate for this IP after a successful sign-in. */
  attempts.delete(ip);
  return response;
}
