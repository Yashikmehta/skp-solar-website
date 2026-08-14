import { NextResponse, type NextRequest } from 'next/server';
import { ADMIN_COOKIE, verifySession } from '@/lib/admin-auth';

/**
 * Gate for `/admin`.
 *
 * Runs before any admin page renders, so an unauthenticated request never
 * reaches the code that queries leads. `/admin/login` is deliberately public.
 */
export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname === '/admin/login') return NextResponse.next();

  const authorised = await verifySession(request.cookies.get(ADMIN_COOKIE)?.value);
  if (authorised) return NextResponse.next();

  const login = new URL('/admin/login', request.url);
  /* Remember where they were headed so login can send them back. */
  if (pathname !== '/admin') login.searchParams.set('next', `${pathname}${search}`);

  const response = NextResponse.redirect(login);
  /* Clear an expired or tampered cookie rather than leaving it to be retried. */
  response.cookies.delete(ADMIN_COOKIE);
  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
