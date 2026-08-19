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

// `images`/`description`/`slug`/`doses_per_month` khai optional CHỦ Ý — `Product` bên s7-data-hub chưa có
// các trường này (tài liệu cũ ghi "đã xong" là sai), và `/cua-hang/san-pham` thật chỉ trả
// `{id, name, unit, sale_price}`. Khai bắt buộc từng khiến type "nói dối" runtime, và `.map` không phòng
// thủ trên `images` từng ném lỗi ngay sản phẩm đầu tiên, kéo sập cả trang "Tất cả sản phẩm" về rỗng.
export interface StoreProduct {
  id: string;
  sign: string | null;
  name: string;
  unit: string | null;
  sale_price: number;
  images?: string[];
  description?: string;
  slug?: string;
  doses_per_month?: number;
}

/** Bỏ dấu + hạ chữ thường, để so khớp từ khoá "lamin grow" với "LaminGrow" và "sữa" với "sua". */
const khongDau = (s: string) =>
  s.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();

/** Sinh đường dẫn từ tên khi người vận hành chưa khai `slug`. Bỏ dấu tiếng Việt để URL đọc được. */
export const slugify = (s: string) =>
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
  // `images` KHÔNG có trong response thật của `/cua-hang/san-pham` (Product bên s7 chưa có trường này —
  // tài liệu cũ nói đã xong là SAI). `p.images.map` không phòng thủ từng làm ném TypeError ngay sản phẩm
  // đầu tiên, kéo sập cả danh sách "Tất cả sản phẩm" về rỗng dù API trả đủ hàng.
  images: (p.images || []).map((url, i) => ({ _id: `${p.id}-${i}`, url, path: url })),
  // Ảnh đầu là ảnh đại diện. Không có ảnh thì để trống — chỗ hiển thị đã có sẵn ảnh thay thế.
  thumbnail: p.images?.[0] ? { _id: `${p.id}-0`, path: p.images[0], name: p.name } : undefined,
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
  images: (p.images || []).map((url, i) => ({ _id: `${p.id}-${i}`, path: url, size: 0, alt: p.name })),
  thumbnail: p.images?.[0],
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

/**
 * Danh sách có LỌC — dùng cho trang "Tất cả sản phẩm", ô tìm kiếm, `ProductList` và mục sản phẩm liên
 * quan (cả bốn đi qua cùng một hook `useGetGoodsList`).
 *
 * Lọc ở PHÍA TRÌNH DUYỆT, không gọi lại server: gian hàng trả tối đa 200 mặt hàng trong một lượt và danh
 * mục Lamin nhỏ hơn thế nhiều, nên tải một lần rồi lọc là đủ — mà lại tìm được ngay khi gõ, không phải
 * chờ một vòng mạng cho mỗi ký tự.
 *
 * Trả `null` (→ nơi gọi rơi về nguồn cũ) trong hai trường hợp:
 *  1. Gian hàng chưa cấu hình / s7 không với tới được — như mọi hàm khác ở đây.
 *  2. **Có `categoryID` hoặc `menuSlug`.** s7 KHÔNG có khái niệm danh mục để bày hàng (`parent_id` là cây
 *     danh mục nội bộ của sổ sản phẩm, không phải phân loại cho web). Bỏ qua tham số rồi trả cả danh mục
 *     sẽ khiến trang "Danh mục X" hiện đủ mọi thứ — sai mà trông như đúng, kiểu hỏng khó phát hiện nhất.
 *     Thà để nguyên nguồn cũ cho tới khi s7 có phân loại thật.
 */
export async function getStoreGoodsList(
  params: { keyword?: string; limit?: number; categoryID?: string; menuSlug?: string } = {},
): Promise<{ data: Goods[]; pagination: null } | null> {
  if (params.categoryID || params.menuSlug) return null;
  const rows = await fetchStore();
  if (!rows) return null;

  const kw = khongDau((params.keyword || '').trim());
  // Khớp trên cả TÊN và MÃ: nhân viên tư vấn qua điện thoại thường đọc mã, khách thì gõ tên.
  const hits = kw
    ? rows.filter((p) => khongDau(`${p.name} ${p.sign || ''}`).includes(kw))
    : rows;

  return {
    data: (params.limit ? hits.slice(0, params.limit) : hits).map(toGoods),
    // s7 chưa phân trang danh mục công khai (200 mặt hàng là đủ cho một lượt). `null` chứ không dựng một
    // đối tượng phân trang giả — chỗ hiển thị đã xử lý được `null`, còn số giả thì sinh ra nút "trang sau"
    // bấm vào không có gì.
    pagination: null,
  };
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
