// CẦU NỐI sang s7-data-hub cho GIAN HÀNG (danh mục · voucher · đặt hàng).
//
// Cùng lý do với `app/api/uu-dai/[token]/route.ts` — CORS, không lộ địa chỉ backend nội bộ, và giữ luật
// MỘT API CLIENT (`.claude/rules/one-api-client.md`): phía trình duyệt vẫn chỉ có `apiClient` trỏ về một
// nơi, backend thứ hai chỉ tồn tại ở phía server. Gom vào đây thay vì chép lại trong từng route vì lần
// này có tới bốn đầu API, và `forward` chép bốn lần là bốn cơ hội để chúng lệch nhau.
//
// ⚠️ HAI biến, CẢ HAI đều KHÔNG có tiền tố NEXT_PUBLIC_ — cố ý. Biến có tiền tố đó bị nướng cứng vào
// bundle lúc build và lộ ra trình duyệt (`.claude/rules/env-build-time.md`). Với `S7_STORE_TOKEN` thì lộ
// nghĩa là ai cũng đặt hàng được dưới danh nghĩa tổ chức mình, nên đây là điều kiện bắt buộc chứ không
// phải cho gọn.

const S7_API_URL = (process.env.S7_API_URL || 'https://app.szen7.com').replace(/\/$/, '');

// ⚠️ KHÔNG có giá trị mặc định — khác hẳn `S7_API_URL`. Địa chỉ backend đoán sai thì chỉ là gọi nhầm chỗ,
// còn token thì không có giá trị nào "đoán đúng" được: viết cứng một token vào mã nguồn là đưa chìa khoá
// gian hàng lên GitHub. Thiếu biến thì để trang hỏng to và rõ, hơn là hỏng âm thầm.
const STORE_TOKEN = process.env.S7_STORE_TOKEN || '';

export const storeBase = (path: string) =>
  `${S7_API_URL}/api/v1/public/cua-hang/${encodeURIComponent(STORE_TOKEN)}${path}`;

export const hasStoreToken = () => Boolean(STORE_TOKEN);

// Gian hàng chưa được cấu hình. Nói thẳng ở log cho người vận hành, còn với khách thì vẫn là một câu
// bình thường — họ không cần biết chuyện cấu hình của chúng ta.
export const notConfigured = () => {
  console.error('[cua-hang] Thiếu S7_STORE_TOKEN — gian hàng không hoạt động.');

  return jsonError('store_unconfigured', 'Cửa hàng đang tạm nghỉ, mời bạn quay lại sau ít phút.', 503);
};

export const jsonError = (code: string, message: string, status: number) =>
  Response.json({ error: { code, message } }, { status });

// Chuyển tiếp NGUYÊN VẸN cả body lẫn mã trạng thái của s7-data-hub. Không dịch lại, không gộp lỗi: phía
// client đọc `error.code` để hiện đúng câu (mã sai · chưa đủ đơn tối thiểu · hết hàng), nuốt mất mã là
// khách chỉ còn nhìn thấy "có lỗi xảy ra".
export async function forward(res: Response) {
  const text = await res.text();
  try {
    return Response.json(JSON.parse(text), { status: res.status });
  } catch {
    // s7-data-hub trả thứ không phải JSON (proxy chen vào, backend sập) — đừng để nó vỡ thành lỗi parse
    // khó hiểu ở client.
    return jsonError(
      'upstream_error',
      'Hệ thống đang bận, vui lòng thử lại sau ít phút.',
      res.status >= 400 ? res.status : 502,
    );
  }
}

// Danh mục gian hàng, gọi TỪ PHÍA SERVER (generateMetadata, sitemap…).
//
// Vì sao không dùng lại `getStoreCatalog` bên `features/product/api/storeCatalog.ts`: hàm đó `fetch` một
// đường dẫn TƯƠNG ĐỐI (`/api/cua-hang/san-pham`) — hợp lệ trong trình duyệt, nhưng ở phía server thì không
// có gốc để nối, `fetch` sẽ ném lỗi. Ở đây gọi thẳng s7, bỏ qua luôn lớp cầu nối: cầu nối tồn tại để phục
// vụ TRÌNH DUYỆT (CORS, giấu địa chỉ backend), còn mã chạy trên server thì vốn đã ở phía trong.
//
// `null` = chưa cấu hình token / s7 không với tới được → nơi gọi giữ nguồn cũ.
export async function fetchStoreProductsOnServer(): Promise<
  Array<{ id: string; sign: string | null; name: string; sale_price: number; images: string[]; description: string; slug: string }> | null
> {
  if (!hasStoreToken()) return null;
  try {
    const res = await fetch(storeBase('/san-pham'), { cache: 'no-store' });
    if (!res.ok) return null;
    const j = await res.json();

    return Array.isArray(j?.data) ? j.data : null;
  } catch (e) {
    console.error('[cua-hang] đọc danh mục phía server thất bại:', e);

    return null;
  }
}

// Bài viết — gọi TỪ PHÍA SERVER (generateMetadata của `article/[slug]/page.tsx`). Cùng lý do và cùng
// giới hạn với `fetchStoreProductsOnServer`: KHÔNG import file này từ mã chạy ở trình duyệt (client
// component / hook `'use client'`) — nó đọc `S7_STORE_TOKEN`, biến không tiền tố `NEXT_PUBLIC_`, chỉ có
// giá trị thật ở tiến trình server.
//
// `null` = chưa cấu hình token / s7 không với tới được / không tìm thấy → nơi gọi rơi về nguồn cũ.
export async function fetchStorePostsOnServer(
  params: { limit?: number; after?: string } = {},
): Promise<Array<{ id: string; title: string; slug: string; summary: string; cover_image: string | null; category: string | null; author: string | null; published_at: string | null }> | null> {
  if (!hasStoreToken()) return null;
  try {
    const qs = new URLSearchParams();
    if (params.limit) qs.set('limit', String(params.limit));
    if (params.after) qs.set('after', params.after);
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    const res = await fetch(storeBase(`/bai-viet${suffix}`), { cache: 'no-store' });
    if (!res.ok) return null;
    const j = await res.json();

    return Array.isArray(j?.data) ? j.data : null;
  } catch (e) {
    console.error('[cua-hang] đọc danh sách bài viết phía server thất bại:', e);

    return null;
  }
}

export async function fetchStorePostDetailOnServer(slug: string): Promise<{
  id: string; title: string; slug: string; summary: string; cover_image: string | null;
  images: string[]; content: string; category: string | null; author: string | null;
  published_at: string | null; seo_title: string; seo_description: string;
} | null> {
  if (!hasStoreToken()) return null;
  try {
    const res = await fetch(storeBase(`/bai-viet/${encodeURIComponent(slug)}`), { cache: 'no-store' });
    if (!res.ok) return null;
    const j = await res.json();

    return j?.data || null;
  } catch (e) {
    console.error('[cua-hang] đọc chi tiết bài viết phía server thất bại:', e);

    return null;
  }
}

export const unreachable = (e: unknown, what: string) => {
  console.error(`[cua-hang] ${what} upstream failed:`, e);

  return jsonError('upstream_unreachable', 'Không kết nối được hệ thống, vui lòng thử lại.', 502);
};
