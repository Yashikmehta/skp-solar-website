'use client';

import { useState } from 'react';

const EMPTY = { currentPassword: '', newPassword: '', confirmPassword: '' };

/**
 * Settings → Change Password.
 *
 * Passwords are posted once and never held anywhere but component state, which
 * is cleared on success.
 */
export function ChangePasswordForm({ minLength }: { minLength: number }) {
  const [values, setValues] = useState(EMPTY);
  const [error, setError] = useState('');
  const [field, setField] = useState<string | undefined>();
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);

  const set = (key: keyof typeof EMPTY) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues((current) => ({ ...current, [key]: event.target.value }));
    setError('');
    setField(undefined);
    setDone(false);
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!values.currentPassword || !values.newPassword || !values.confirmPassword) {
      setError('Please fill in all three fields.');
      return;
    }
    if (values.newPassword !== values.confirmPassword) {
      setError('The new passwords do not match.');
      setField('confirm');
      return;
    }
    if (values.newPassword.length < minLength) {
      setError(`Use at least ${minLength} characters.`);
      setField('new');
      return;
    }

    setBusy(true);
    setError('');

    try {
      const response = await fetch('/api/admin/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        field?: string;
      };

      setBusy(false);

      if (!response.ok || !data.ok) {
        setError(data.message ?? 'Could not change the password.');
        setField(data.field);
        return;
      }

      setValues(EMPTY);
      setDone(true);
    } catch {
      setBusy(false);
      setError('Could not reach the server. Please try again.');
    }
  }

  const invalid = (name: string) => (field === name ? ' adm-input-bad' : '');

  return (
    <form className="adm-panel" onSubmit={onSubmit} noValidate>
      <h2 className="adm-panel-title">Change Password</h2>
      <p className="adm-panel-note">
        Updates the password for this admin panel. You stay signed in; anyone else
        signed in elsewhere is signed out immediately.
      </p>

      <label className="adm-label" htmlFor="curPw">
        Current Password
      </label>
      <input
        className={`adm-input${invalid('current')}`}
        id="curPw"
        type="password"
        autoComplete="current-password"
        value={values.currentPassword}
        onChange={set('currentPassword')}
      />

      <label className="adm-label" htmlFor="newPw">
        New Password
      </label>
      <input
        className={`adm-input${invalid('new')}`}
        id="newPw"
        type="password"
        autoComplete="new-password"
        placeholder={`At least ${minLength} characters`}
        value={values.newPassword}
        onChange={set('newPassword')}
      />

      <label className="adm-label" htmlFor="confPw">
        Confirm New Password
      </label>
      <input
        className={`adm-input${invalid('confirm')}`}
        id="confPw"
        type="password"
        autoComplete="new-password"
        value={values.confirmPassword}
        onChange={set('confirmPassword')}
      />

      <button className="adm-submit" type="submit" disabled={busy}>
        {busy ? 'Saving…' : 'Change Password'}
      </button>

      {error ? (
        <p className="adm-msg-bad" role="alert">
          {error}
        </p>
      ) : null}

      {done ? (
        <p className="adm-msg-good" role="status">
          Password changed. Save the new one in your password manager — it replaces
          the value in your hosting environment variables.
        </p>
      ) : null}
    </form>
  );
}
