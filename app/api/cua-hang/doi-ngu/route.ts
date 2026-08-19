import { forward, hasStoreToken, notConfigured, storeBase, unreachable } from '@/lib/s7-store';

// ĐỘI NGŨ CHUYÊN MÔN — nguồn là s7-data-hub (`contacts` vai Cộng tác viên/Chuyên gia), không còn là
// api.trixgo.com. Cùng cầu nối `/api/cua-hang/*` với danh mục sản phẩm — dùng chung `S7_STORE_TOKEN`, xem
// `lib/s7-store.ts`.

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!hasStoreToken()) return notConfigured();
  try {
    return forward(await fetch(storeBase('/doi-ngu'), { cache: 'no-store' }));
  } catch (e) {
    return unreachable(e, 'GET /doi-ngu');
  }
}
