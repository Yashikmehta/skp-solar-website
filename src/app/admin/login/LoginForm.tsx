'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

/**
 * Admin sign-in. The password is posted to `/api/admin/login`, which sets an
 * HttpOnly session cookie — nothing sensitive is kept in component state or
 * anywhere the browser can read back.
 */
export function LoginForm({ next }: { next: string }) {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!password) {
      setError('Please enter the password.');
      return;
    }

    setBusy(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !data.ok) {
        setBusy(false);
        setPassword('');
        setError(data.message ?? 'Incorrect password.');
        return;
      }

      /* Refresh so the middleware sees the new cookie on the next request. */
      router.replace(next);
      router.refresh();
    } catch {
      setBusy(false);
      setError('Could not reach the server. Please try again.');
    }
  }

  return (
    <div className="adm-login">
      <div className="adm-login-card">
        <div className="adm-login-brand">
          <Image src="/assets/skp-logo.png" alt="" width={52} height={52} priority />
          <b>SKP Solar World</b>
          <span>Admin Panel</span>
        </div>

        <form onSubmit={onSubmit} noValidate>
          <label className="adm-label" htmlFor="admPass">
            Password
          </label>
          <input
            className="adm-input"
            id="admPass"
            type="password"
            autoComplete="current-password"
            placeholder="Enter admin password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              setError('');
            }}
            autoFocus
          />

          <button className="adm-submit" type="submit" disabled={busy}>
            {busy ? 'Signing in…' : 'Sign in'}
          </button>

          {error ? (
            <p className="adm-login-err" role="alert">
              {error}
            </p>
          ) : null}
        </form>

        <p className="adm-login-note">
          Authorised access only. This panel is view-only and shows customer
          enquiries submitted through the website.
        </p>
      </div>
    </div>
  );
}
