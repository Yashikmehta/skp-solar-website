import Image from 'next/image';
import Link from 'next/link';
import { LogoutButton } from './LogoutButton';

/** Top bar shared by every admin page — brand, settings link, sign out. */
export function AdminBar() {
  return (
    <div className="adm-bar">
      <div className="adm-bar-inner">
        <Link className="adm-brand" href="/admin">
          <Image src="/assets/skp-logo.png" alt="" width={32} height={32} />
          <span className="adm-brand-txt">
            <b>SKP Solar World</b>
            <span>Admin Panel</span>
          </span>
        </Link>
        <div className="adm-bar-actions">
          <Link className="adm-barlink" href="/admin/settings">
            Settings
          </Link>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
