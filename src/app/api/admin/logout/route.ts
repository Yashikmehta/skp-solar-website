import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, cookieOptions } from '@/lib/admin-auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Sign out — expires the session cookie immediately. */
export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, '', cookieOptions(0));
  return response;
}
