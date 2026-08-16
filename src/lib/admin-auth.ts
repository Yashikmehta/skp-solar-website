/**
 * ============================================================================
 * ADMIN AUTHENTICATION
 * ============================================================================
 * A single shared password guards the read-only admin panel. On success the
 * server issues a signed, HttpOnly session cookie; the password itself is
 * never stored in the browser and never reaches client-side JavaScript.
 *
 *   ADMIN_PASSWORD        · bootstrap password, used until one is set in the
 *                           database via Settings → Change Password
 *   ADMIN_SESSION_SECRET  · random string (32+ chars) used to sign sessions
 *
 * The cookie is `<expiry>.<fingerprint>.<hmac>`, signed with HMAC-SHA256. It
 * carries no secret and cannot be forged or extended without the signing key.
 *
 * The fingerprint is a short digest of the credential the session was issued
 * against. Changing the password changes the fingerprint, which is how a
 * password change signs out every existing session — otherwise changing a
 * leaked password would leave the attacker's session alive. Middleware checks
 * only the signature and expiry (it runs on Edge and must not hit the
 * database); pages and API routes additionally check the fingerprint.
 *
 * Web Crypto is used throughout rather than `node:crypto` so this module works
 * unchanged in Edge middleware and in Node route handlers. Database access
 * lives in `admin-credentials.ts` so this file stays Edge-safe.
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

/* -------------------------------------------------------------------------- */
/*  Password hashing                                                          */
/* -------------------------------------------------------------------------- */

/**
 * PBKDF2-SHA256. Chosen over bcrypt/argon2 because Web Crypto provides it
 * natively — no native dependency, and it behaves identically on Edge and Node.
 * 210,000 iterations is the OWASP recommendation for PBKDF2-HMAC-SHA256.
 */
const PBKDF2_ITERATIONS = 210_000;
const SALT_BYTES = 16;
const KEY_BITS = 256;

function toBase64url(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function fromBase64url(value: string): Uint8Array {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations, hash: 'SHA-256' },
    key,
    KEY_BITS,
  );
  return new Uint8Array(bits);
}

/** Hash a password for storage: `pbkdf2$<iterations>$<salt>$<hash>`. */
export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const derived = await pbkdf2(password, salt, PBKDF2_ITERATIONS);
  return `pbkdf2$${PBKDF2_ITERATIONS}$${toBase64url(salt)}$${toBase64url(derived)}`;
}

/** Verify a password against a stored hash. Never throws on malformed input. */
export async function verifyPasswordHash(password: string, stored: string): Promise<boolean> {
  const parts = stored.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;

  const iterations = Number(parts[1]);
  if (!Number.isInteger(iterations) || iterations < 1) return false;

  try {
    const derived = await pbkdf2(password, fromBase64url(parts[2]), iterations);
    return safeEqual(toBase64url(derived), parts[3]);
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/*  Sessions                                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Short digest identifying which credential a session was issued against.
 * Not a secret — it never reveals the password, it only changes when the
 * password does.
 */
export async function credentialFingerprint(credential: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(`skp.cred.${credential}`));
  return toBase64url(new Uint8Array(digest)).slice(0, 16);
}

/** Mint a session token valid for `SESSION_MS`, bound to `fingerprint`. */
export async function createSession(
  fingerprint: string,
): Promise<{ value: string; maxAge: number }> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not set.');

  const expiry = Date.now() + SESSION_MS;
  const signature = await hmac(`admin.${expiry}.${fingerprint}`, secret);

  return {
    value: `${expiry}.${fingerprint}.${signature}`,
    maxAge: Math.floor(SESSION_MS / 1000),
  };
}

interface SessionParts {
  expiry: string;
  fingerprint: string;
  signature: string;
}

function splitToken(token: string): SessionParts | null {
  const parts = token.split('.');
  /* Exactly three segments. Cookies minted before the fingerprint existed have
     two and are rejected, which signs those sessions out once on upgrade. */
  if (parts.length !== 3) return null;
  return { expiry: parts[0], fingerprint: parts[1], signature: parts[2] };
}

/**
 * Signature and expiry only — no database access, safe for Edge middleware.
 * Pass `expectedFingerprint` from Node code to also enforce that the session
 * was issued against the current password.
 */
export async function verifySession(
  token: string | undefined,
  expectedFingerprint?: string,
): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!token || !secret) return false;

  const parts = splitToken(token);
  if (!parts) return false;

  const expiresAt = Number(parts.expiry);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false;

  const expected = await hmac(`admin.${parts.expiry}.${parts.fingerprint}`, secret);
  if (!safeEqual(parts.signature, expected)) return false;

  if (expectedFingerprint !== undefined) {
    return safeEqual(parts.fingerprint, expectedFingerprint);
  }
  return true;
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
