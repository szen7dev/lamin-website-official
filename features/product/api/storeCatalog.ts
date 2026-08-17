import type { Goods } from '@/features/search/types/goodsTypes';
import type { Product as ProductDetail } from '@/features/product/types/productTypes';

// DANH MỤC SẢN PHẨM lấy từ s7-data-hub, đổi sang đúng hình dạng `Goods` mà toàn bộ giao diện đang dùng.
//
// Vì sao ánh xạ thay vì đổi kiểu khắp nơi: `Goods` xuất hiện ở hàng chục màn (trang chủ, danh sách, chi
// tiết, tìm kiếm, sản phẩm liên quan). Đổi kiểu là sửa từng màn một và mỗi chỗ sửa là một chỗ có thể sai;
// đổi NGUỒN mà giữ nguyên hình dạng thì giao diện không cần biết dữ liệu đến từ đâu.
//
// Hai bên KHÔNG trùng tên trường nào: s7 dùng `sale_price`/`images: string[]`, web dùng
// `sellingUnitprice`/`images: FileInfo[]` + `thumbnail`. Toàn bộ chỗ dịch nằm ở đây, đúng một chỗ.

export interface StoreProduct {
  id: string;
  sign: string | null;
  name: string;
  unit: string | null;
  sale_price: number;
  images: string[];
  description: string;
  slug: string;
  doses_per_month: number;
}

/** Sinh đường dẫn từ tên khi người vận hành chưa khai `slug`. Bỏ dấu tiếng Việt để URL đọc được. */
const slugify = (s: string) =>
  s.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const toGoods = (p: StoreProduct): Goods => ({
  _id: p.id,
  name: p.name,
  // Slug do người vận hành khai LUÔN THẮNG: đường dẫn cũ đã được chia sẻ và đã có thứ hạng tìm kiếm,
  // tự sinh đè lên là gãy hết.
  slug: p.slug || slugify(p.name),
  sign: p.sign || undefined,
  unit: p.unit || undefined,
  description: p.description || undefined,
  sellingUnitprice: p.sale_price,
  // s7 CHƯA có khái niệm "giá niêm yết trước giảm" — chỉ có một giá bán. Để bằng giá bán chứ không để 0:
  // giao diện tính `originalPrice - price` ra số tiền tiết kiệm, để 0 là hiện "tiết kiệm -500.000đ".
  listedUnitprice: p.sale_price,
  images: p.images.map((url, i) => ({ _id: `${p.id}-${i}`, url, path: url })),
  // Ảnh đầu là ảnh đại diện. Không có ảnh thì để trống — chỗ hiển thị đã có sẵn ảnh thay thế.
  thumbnail: p.images[0] ? { _id: `${p.id}-0`, path: p.images[0], name: p.name } : undefined,
  status: 1,
});

/**
 * Đổi sang `Product` — hình dạng mà TRANG CHI TIẾT dùng (khác `Goods` của danh sách: nhiều trường bắt
 * buộc hơn, `images` là `ProductImage[]` chứ không phải `FileInfo[]`).
 *
 * Nhiều trường của `Product` s7 **không có** (thương hiệu, xuất xứ, nhà sản xuất, số đăng ký, quy cách…).
 * Bỏ trống chứ KHÔNG bịa: trang chi tiết đã ẩn phần nào thiếu dữ liệu, còn điền bừa "Đang cập nhật" vào
 * hồ sơ một sản phẩm dược là chuyện khác hẳn.
 */
export const toProduct = (p: StoreProduct): ProductDetail => ({
  sign: p.sign || '',
  _id: p.id,
  id: p.id,
  slug: p.slug || slugify(p.name),
  name: p.name,
  description: p.description || '',
  images: p.images.map((url, i) => ({ _id: `${p.id}-${i}`, path: url, size: 0, alt: p.name })),
  thumbnail: p.images[0],
  // s7 chưa có khái niệm danh mục cho gian hàng web (`parent_id` là cây danh mục nội bộ của sổ sản phẩm,
  // không phải phân loại để bày hàng). Để rỗng — chỗ hiển thị tự bỏ qua.
  category: { _id: '', name: '', slug: '' },
  sellingUnitprice: p.sale_price,
  listedUnitprice: p.sale_price,
  unitprice: p.sale_price,
  unitPrice: p.sale_price,
  unit: p.unit || undefined,
});

/** Một sản phẩm theo đường dẫn. `null` = chưa cấu hình gian hàng / không tìm thấy. */
export async function getStoreProductBySlug(slug: string): Promise<ProductDetail | null> {
  const rows = await fetchStore();
  if (!rows) return null;
  const want = decodeURIComponent(slug);
  const hit = rows.find((p) => (p.slug || slugify(p.name)) === want);

  return hit ? toProduct(hit) : null;
}

/**
 * Danh mục từ gian hàng s7.
 *
 * Trả `null` — KHÁC với mảng rỗng — khi gian hàng **chưa được cấu hình** (`503 store_unconfigured`, tức
 * chưa cấp `S7_STORE_TOKEN`). Đó là tín hiệu để nơi gọi quay về nguồn cũ (api.trixgo.com), và nó chính là
 * công tắc bật/tắt của cả đợt chuyển đổi: cấu hình token = dùng s7, chưa cấu hình = giữ nguyên như cũ.
 *
 * Mảng RỖNG thì trả mảng rỗng thật, không quay về nguồn cũ: rỗng nghĩa là chưa ai bật `on_web` cho sản
 * phẩm nào — một vấn đề dữ liệu cần nhìn thấy, không phải thứ nên che đi bằng cách lặng lẽ hiện hàng cũ.
 */
export async function getStoreCatalog(): Promise<Goods[] | null> {
  const rows = await fetchStore();

  return rows ? rows.map(toGoods) : null;
}

/** Lấy danh mục thô. Gom một chỗ vì cả danh sách lẫn trang chi tiết đều gọi. */
async function fetchStore(): Promise<StoreProduct[] | null> {
  try {
    const r = await fetch('/api/cua-hang/san-pham', { cache: 'no-store' });
    if (r.status === 503) return null;      // chưa cấu hình → nơi gọi tự lo
    if (!r.ok) return null;                 // s7 hỏng → đừng để trang sản phẩm chết theo
    const j = await r.json();

    return Array.isArray(j?.data) ? (j.data as StoreProduct[]) : null;
  } catch {
    return null;
  }
}
