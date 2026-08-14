/**
 * ============================================================================
 * ADMIN AUTHENTICATION
 * ============================================================================
 * A single shared password guards the read-only admin panel. On success the
 * server issues a signed, HttpOnly session cookie; the password itself is
 * never stored in the browser and never reaches client-side JavaScript.
 *
 *   ADMIN_PASSWORD        · the login password
 *   ADMIN_SESSION_SECRET  · random string (32+ chars) used to sign sessions
 *
 * The cookie is `<expiry>.<hmac>`, signed with HMAC-SHA256. It carries no
 * secret and cannot be forged or extended without the signing key. Changing
 * ADMIN_SESSION_SECRET immediately invalidates every existing session.
 *
 * Web Crypto is used throughout rather than `node:crypto` so this module works
 * unchanged in Edge middleware and in Node route handlers.
 * ============================================================================
 */

export const ADMIN_COOKIE = 'skp_admin_session';

/** Sessions last one working day, then require signing in again. */
const SESSION_MS = 8 * 60 * 60 * 1000;

const encoder = new TextEncoder();

function base64url(bytes: ArrayBuffer): string {
  const binary = String.fromCharCode(...new Uint8Array(bytes));
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmac(message: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  return base64url(await crypto.subtle.sign('HMAC', key, encoder.encode(message)));
}

/**
 * Constant-time string comparison. A plain `===` leaks how many characters
 * matched through its timing, which is exactly the signal an attacker needs to
 * guess a password or forge a signature one byte at a time.
 */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.ADMIN_SESSION_SECRET);
}

/** Verify a submitted password against `ADMIN_PASSWORD`. */
export function checkPassword(submitted: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(submitted, expected);
}

/** Mint a session token valid for `SESSION_MS`. */
export async function createSession(): Promise<{ value: string; maxAge: number }> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set.');

  const expiry = Date.now() + SESSION_MS;
  const signature = await hmac(`admin.${expiry}`, secret);

  return { value: `${expiry}.${signature}`, maxAge: Math.floor(SESSION_MS / 1000) };
}

/** Validate a session cookie: correct signature and not expired. */
export async function verifySession(token: string | undefined): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!token || !secret) return false;

  const separator = token.lastIndexOf('.');
  if (separator < 1) return false;

  const expiry = token.slice(0, separator);
  const signature = token.slice(separator + 1);

  const expiresAt = Number(expiry);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  return safeEqual(signature, await hmac(`admin.${expiry}`, secret));
}

/** Cookie attributes shared by the login and logout routes. */
export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    /* Secure is dropped in development so the cookie works over plain http
       on localhost; in production it is always set. */
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge,
  };
}
