import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/admin-auth';
import { verifyAdminSession } from '@/lib/admin-credentials';
import { buildLeadCsv, EXPORT_SOURCE, exportFilename, isExportKind } from '@/lib/lead-csv';
import { fetchAllLeads } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * CSV export of stored leads.
 *
 *   /api/admin/export?type=enquiries   · contact form only
 *   /api/admin/export?type=calculator  · solar calculator only
 *   /api/admin/export?type=all         · both, with calculator columns
 *
 * `middleware.ts` only guards `/admin/*`, so this route checks the session
 * itself. It returns 401 rather than redirecting — a download that silently
 * returned an HTML login page would save a broken file.
 */
export async function GET(request: Request) {
  const store = await cookies();

  if (!(await verifyAdminSession(store.get(ADMIN_COOKIE)?.value))) {
    return NextResponse.json({ ok: false, message: 'Not signed in.' }, { status: 401 });
  }

  const kind = new URL(request.url).searchParams.get('type');
  if (!isExportKind(kind)) {
    return NextResponse.json(
      { ok: false, message: 'type must be enquiries, calculator or all.' },
      { status: 400 },
    );
  }

  const { leads, error } = await fetchAllLeads(EXPORT_SOURCE[kind]);

  if (error) {
    // eslint-disable-next-line no-console
    console.error('[admin] export failed', error);
    return NextResponse.json(
      { ok: false, message: 'Could not read leads for export.' },
      { status: 502 },
    );
  }

  const csv = buildLeadCsv(leads, kind);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${exportFilename(kind)}"`,
      /* Never let a browser or proxy hold on to a file of customer data. */
      'Cache-Control': 'no-store, max-age=0',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
}
