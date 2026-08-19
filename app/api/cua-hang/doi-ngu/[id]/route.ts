import { forward, hasStoreToken, notConfigured, storeBase, unreachable } from '@/lib/s7-store';

// Hồ sơ công khai MỘT người trong đội ngũ chuyên môn — xem app/api/cua-hang/doi-ngu/route.ts.

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!hasStoreToken()) return notConfigured();
  const { id } = await params;
  try {
    return forward(await fetch(storeBase(`/doi-ngu/${encodeURIComponent(id)}`), { cache: 'no-store' }));
  } catch (e) {
    return unreachable(e, 'GET /doi-ngu/:id');
  }
}
