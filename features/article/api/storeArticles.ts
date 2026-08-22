import { Article } from '../types/articleTypes';

// BÀI VIẾT lấy từ s7-data-hub (tính năng #4, xem `docs/chuyen-ve-s7.md`), đổi sang đúng hình dạng
// `Article` mà toàn bộ giao diện đang dùng — cùng nguyên tắc đã áp dụng cho sản phẩm (tính năng #2):
// đổi NGUỒN, giữ HÌNH DẠNG, để hàng chục nơi hiển thị không cần biết dữ liệu đến từ đâu.
//
// s7 CHƯA có: thẻ (tags), số lượt xem/bình luận/react, danh mục kiểu cây (menuSlug/categoryID). Những màn
// dùng các thứ đó (`getArticleTagList`, `getArticleProperty`, `useGetHeroBlogLink`) CỐ Ý giữ nguyên nguồn
// cũ — chưa đổi, không phải quên đổi (chốt cùng đợt với chủ dự án, phạm vi lần này chỉ danh sách + chi
// tiết bài viết đọc thẳng).

export interface StorePost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  cover_image: string | null;
  category: string | null;
  author: string | null;
  published_at: string | null;
  // Chỉ có ở đầu chi tiết (`GET .../bai-viet/:slug`), KHÔNG có ở đầu danh sách.
  content?: string;
  images?: string[];
  seo_title?: string;
  seo_description?: string;
}

export const toArticle = (p: StorePost): Article => ({
  _id: p.id,
  type: 2,
  // s7 chưa có thẻ — mảng rỗng làm UI thẻ tự ẩn (`ArticleDetailContent`: `tags.length > 0` mới hiện khối).
  tags: [],
  // Public API của s7 CHỈ trả bài đã xuất bản — tới được đây nghĩa là status/state luôn ở dạng hiển thị.
  status: 1,
  state: 1,
  // s7 chưa đếm lượt xem/bình luận/react — để 0 thay vì bịa số.
  amountReaction: 0,
  amountComment: 0,
  amountView: 0,
  company: '',
  author: p.author || '',
  title: p.title,
  content: p.content || '',
  slug: p.slug,
  // s7 chỉ snapshot TÊN danh mục (`category_name`), không có id/slug riêng cho danh mục hiển thị web.
  category: { _id: '', name: p.category || '', slug: '' },
  // `cover_image` bên s7 ĐÃ LÀ địa chỉ đầy đủ (URL), không phải khoá lưu trữ nội bộ — `apiClient.getFileUrl`
  // nay nhận diện được URL tuyệt đối và trả nguyên văn, không ghép thêm gốc CDN (xem `apiClient.ts`).
  thumbnail: { _id: '', path: p.cover_image || '', name: p.title },
  summary: p.summary || '',
  description: p.summary || '',
  modifyAt: p.published_at || '',
  createAt: p.published_at || '',
  __v: 0,
  // `userUpdate.fullname` là trường DUY NHẤT màn chi tiết hiện tên tác giả (`ArticleDetailContent.tsx`) —
  // đặt tên thật vào đây thay vì để rơi về "Lamin" mặc định.
  userUpdate: { _id: '', image: '', fullname: p.author || 'Lamin', position: '', note: '' },
});

/**
 * Danh sách bài viết — gọi TỪ TRÌNH DUYỆT, qua cầu nối `/api/cua-hang/bai-viet` (không import
 * `lib/s7-store.ts` ở đây: file đó đọc biến môi trường KHÔNG tiền tố `NEXT_PUBLIC_`, chỉ an toàn ở phía
 * server — xem `.claude/rules/env-build-time.md`).
 *
 * `null` = gian hàng chưa cấu hình (`503`) hoặc s7 không với tới được → nơi gọi tự rơi về nguồn cũ
 * (api.trixgo.com), đúng công tắc bật/tắt đã dùng cho sản phẩm.
 */
export async function fetchStorePostsBrowser(
  params: { limit?: number; after?: string } = {},
): Promise<StorePost[] | null> {
  try {
    const qs = new URLSearchParams();
    if (params.limit) qs.set('limit', String(params.limit));
    if (params.after) qs.set('after', params.after);
    const suffix = qs.toString() ? `?${qs.toString()}` : '';
    const res = await fetch(`/api/cua-hang/bai-viet${suffix}`, { cache: 'no-store' });
    if (res.status === 503 || !res.ok) return null;
    const j = await res.json();

    return Array.isArray(j?.data) ? (j.data as StorePost[]) : null;
  } catch {
    return null;
  }
}

/** Một bài viết theo slug — gọi TỪ TRÌNH DUYỆT, qua cầu nối. `null` = như trên, hoặc không tìm thấy bài. */
export async function fetchStorePostDetailBrowser(slug: string): Promise<StorePost | null> {
  try {
    const res = await fetch(`/api/cua-hang/bai-viet/${encodeURIComponent(slug)}`, { cache: 'no-store' });
    if (res.status === 503 || !res.ok) return null;
    const j = await res.json();

    return (j?.data as StorePost) || null;
  } catch {
    return null;
  }
}
