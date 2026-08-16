import Link from 'next/link';
import { ChangePasswordForm } from './ChangePasswordForm';
import { AdminBar } from '../AdminBar';
import {
  isPasswordStoredInDatabase,
  requireAdmin,
  MIN_PASSWORD_LENGTH,
} from '@/lib/admin-credentials';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/** `/admin/settings` — currently just the password change. */
export default async function AdminSettingsPage() {
  await requireAdmin();
  const stored = await isPasswordStoredInDatabase();

  return (
    <div className="adm-body">
      <AdminBar />

      <div className="adm-wrap">
        <nav className="adm-crumb">
          <Link href="/admin">← Back to enquiries</Link>
        </nav>

        <h1 className="adm-title">Settings</h1>
        <p className="adm-sub">
          {stored
            ? 'Your password is stored securely in the database. Change it any time — no redeploy needed.'
            : 'You are signing in with the password from the hosting environment variable. Change it below to store one securely in the database instead.'}
        </p>

        <ChangePasswordForm minLength={MIN_PASSWORD_LENGTH} />
      </div>
    </div>
  );
}
