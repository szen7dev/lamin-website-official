import { forward, hasStoreToken, notConfigured, storeBase, unreachable } from '@/lib/s7-store';

// DANH MỤC SẢN PHẨM — nguồn là s7-data-hub, không còn là api.trixgo.com (chốt của chủ dự án 2026-08-17).
//
// Đường dẫn `/api/cua-hang/...` cố ý KHÁC `/api/store/...` mà `apiClient` đang gọi: hai cái trỏ về hai
// backend khác nhau (`/api/store/…` đi ra `NEXT_PUBLIC_API_URL` = api.trixgo.com), và trùng tên thì có
// ngày ai đó đọc lướt rồi sửa nhầm cái này tưởng cái kia.

// Giá và tồn kho đổi theo giờ; đệm ở tầng này là khách nhìn thấy giá cũ.
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!hasStoreToken()) return notConfigured();
  try {
    return forward(await fetch(storeBase('/san-pham'), { cache: 'no-store' }));
  } catch (e) {
    return unreachable(e, 'GET /san-pham');
  }
}
