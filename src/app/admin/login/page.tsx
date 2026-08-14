import { LoginForm } from './LoginForm';

export const dynamic = 'force-dynamic';

/**
 * `/admin/login` — the only admin route the middleware lets through
 * unauthenticated.
 */
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  /* Only accept a same-site path, so `?next=` cannot bounce a signed-in
     admin off to another domain. */
  const destination = next && next.startsWith('/') && !next.startsWith('//') ? next : '/admin';

  return <LoginForm next={destination} />;
}
