import { forward, hasStoreToken, notConfigured, storeBase, unreachable } from '@/lib/s7-store';

// DANH SÁCH BÀI VIẾT — nguồn là s7-data-hub, không còn là api.trixgo.com (tính năng #4, chốt cùng đợt
// với sản phẩm — `docs/chuyen-ve-s7.md`).
//
// Đường dẫn `/api/cua-hang/bai-viet` cố ý KHÁC mọi route trixgo cũ: hai cái trỏ hai backend khác nhau.

// Bài mới đăng phải lên ngay, không đợi cache hết hạn.
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!hasStoreToken()) return notConfigured();
  const { searchParams } = new URL(request.url);
  const qs = searchParams.toString();

  try {
    return forward(await fetch(storeBase(`/bai-viet${qs ? `?${qs}` : ''}`), { cache: 'no-store' }));
  } catch (e) {
    return unreachable(e, 'GET /bai-viet');
  }
}
