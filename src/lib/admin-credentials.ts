import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ADMIN_COOKIE,
  credentialFingerprint,
  hashPassword,
  verifyPasswordHash,
  verifySession,
} from './admin-auth';
import { getAdminDb } from './supabase';

/**
 * ============================================================================
 * ADMIN CREDENTIAL STORE
 * ============================================================================
 * Where the admin password actually lives, and the bridge between the pure
 * crypto in `admin-auth.ts` and Supabase.
 *
 * Two sources, in order:
 *   1. `public.admin_settings.password_hash` — set via Settings → Change
 *      Password. Takes precedence once it exists.
 *   2. `ADMIN_PASSWORD` — the bootstrap value, used until (1) is set. This is
 *      what makes the feature safe to deploy: nothing changes until the admin
 *      chooses a new password.
 *
 * Node runtime only — it talks to the database. Never import this from
 * middleware.
 * ============================================================================
 */

const TABLE = 'admin_settings';
const ROW_ID = 1;

/** The stored hash, or null when none has been set yet. */
async function readStoredHash(): Promise<string | null> {
  const db = getAdminDb();
  if (!db) return null;

  const { data, error } = await db
    .from(TABLE)
    .select('password_hash')
    .eq('id', ROW_ID)
    .maybeSingle();

  if (error) {
    /* A missing table is expected until the migration is run — fall back to
       the environment variable rather than locking the admin out. */
    // eslint-disable-next-line no-console
    console.warn('[admin] could not read admin_settings, using ADMIN_PASSWORD', error.message);
    return null;
  }

  return data?.password_hash ?? null;
}

/**
 * Check a submitted password against whichever credential is currently
 * authoritative.
 */
export async function checkAdminPassword(submitted: string): Promise<boolean> {
  if (!submitted) return false;

  const stored = await readStoredHash();
  if (stored) return verifyPasswordHash(submitted, stored);

  const bootstrap = process.env.ADMIN_PASSWORD;
  if (!bootstrap) return false;

  /* Constant-time comparison via the same fingerprint helper, so the bootstrap
     path does not leak match length through timing either. */
  const [a, b] = await Promise.all([
    credentialFingerprint(submitted),
    credentialFingerprint(bootstrap),
  ]);
  return a === b;
}

/**
 * Fingerprint of the credential in force right now. Sessions are bound to it,
 * so it changes the moment the password changes.
 */
export async function currentFingerprint(): Promise<string> {
  const stored = await readStoredHash();
  return credentialFingerprint(stored ?? process.env.ADMIN_PASSWORD ?? '');
}

/**
 * Full session check for Node contexts: signature, expiry, and that the
 * session was issued against the current password.
 */
export async function verifyAdminSession(token: string | undefined): Promise<boolean> {
  return verifySession(token, await currentFingerprint());
}

/**
 * Guard for admin pages. Redirects to the login screen unless the session is
 * valid AND was issued against the current password.
 *
 * `middleware.ts` runs on Edge and cannot reach the database, so it only
 * verifies the signature and expiry. Without this call a session minted before
 * a password change would keep working on the pages themselves — which would
 * defeat the point of changing a leaked password.
 */
export async function requireAdmin(): Promise<void> {
  const store = await cookies();
  if (!(await verifyAdminSession(store.get(ADMIN_COOKIE)?.value))) {
    redirect('/admin/login');
  }
}

export type PasswordChangeResult =
  | { ok: true }
  | { ok: false; reason: 'unconfigured' | 'wrong-current' | 'weak' | 'storage' };

/** Minimum length for a new password. */
export const MIN_PASSWORD_LENGTH = 10;

/**
 * Replace the admin password. Verifies the current one first, then writes the
 * new hash — the plaintext is never stored anywhere.
 */
export async function changeAdminPassword(
  currentPassword: string,
  newPassword: string,
): Promise<PasswordChangeResult> {
  const db = getAdminDb();
  if (!db) return { ok: false, reason: 'unconfigured' };

  if (!(await checkAdminPassword(currentPassword))) {
    return { ok: false, reason: 'wrong-current' };
  }
  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    return { ok: false, reason: 'weak' };
  }

  const password_hash = await hashPassword(newPassword);

  /* Upsert the single row, so this works whether or not a password has been
     set before. */
  const { error } = await db
    .from(TABLE)
    .upsert({ id: ROW_ID, password_hash, updated_at: new Date().toISOString() });

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[admin] could not save new password', error.message);
    return { ok: false, reason: 'storage' };
  }

  return { ok: true };
}

/** True once a password has been set in the database (i.e. not the env one). */
export async function isPasswordStoredInDatabase(): Promise<boolean> {
  return (await readStoredHash()) !== null;
}
