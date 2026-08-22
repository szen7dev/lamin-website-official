import { forward, hasStoreToken, notConfigured, storeBase, unreachable } from '@/lib/s7-store';

// MỘT BÀI VIẾT theo đường dẫn — nguồn là s7-data-hub (tính năng #4).
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  if (!hasStoreToken()) return notConfigured();
  const { slug } = await params;

  try {
    return forward(await fetch(storeBase(`/bai-viet/${encodeURIComponent(slug)}`), { cache: 'no-store' }));
  } catch (e) {
    return unreachable(e, 'GET /bai-viet/:slug');
  }
}
