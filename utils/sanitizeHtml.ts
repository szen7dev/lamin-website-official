// Làm sạch HTML admin gõ trong Danh mục → Sản phẩm (description/features/ingredients/instructions/
// sideEffects/warnings/storage — xem s7-data-hub models/product.js) TRƯỚC khi đưa vào
// `dangerouslySetInnerHTML`. Trang sản phẩm là công khai, không đăng nhập: một tài khoản nhân viên bị
// chiếm là chèn được `<script>` chạy trên trình duyệt của MỌI khách ghé web nếu không lọc.
//
// Không dùng DOMPurify: kho này chạy `yarn` và không có sẵn cách cài thêm gói an toàn trong môi trường
// hiện tại (không cập nhật được `yarn.lock`). Đổi lại là một bộ lọc THEO DANH SÁCH CHO PHÉP tự viết — hẹp
// hơn DOMPurify nhưng đủ cho nội dung marketing sản phẩm (đoạn văn, danh sách, chữ đậm/nghiêng, liên kết),
// và không có thứ gì lọt qua ngoài danh sách khai rõ dưới đây.
//
// CHỈ CHẠY TRONG TRÌNH DUYỆT (`DOMParser`) — mọi nơi gọi hàm này đều là component `'use client'`.

const ALLOWED_TAGS = new Set([
  'P', 'BR', 'STRONG', 'B', 'EM', 'I', 'U', 'UL', 'OL', 'LI', 'SPAN', 'DIV',
  'H1', 'H2', 'H3', 'H4', 'BLOCKQUOTE', 'A',
]);

const safeHref = (href: string | null): string | null => {
  if (!href) return null;
  try {
    // Gốc bất kỳ — chỉ để `URL` phân giải được đường dẫn tương đối; không dùng gốc này để so khớp domain.
    const u = new URL(href, 'https://lamin.com.vn');

    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : null;
  } catch {
    return null;
  }
};

/** Lọc một node và toàn bộ con của nó ngay tại chỗ — xoá thẻ/thuộc tính không nằm trong danh sách cho phép. */
function scrub(node: Element) {
  // Duyệt lùi vì `removeChild`/thay thế node làm lệch chỉ số nếu duyệt xuôi.
  for (let i = node.childNodes.length - 1; i >= 0; i--) {
    const child = node.childNodes[i];

    if (child.nodeType === Node.TEXT_NODE) continue; // chữ thường luôn an toàn, giữ nguyên

    if (child.nodeType !== Node.ELEMENT_NODE) {
      // Comment, CDATA… — không có lý do hợp lệ nào để giữ trong nội dung marketing.
      node.removeChild(child);
      continue;
    }

    const el = child as Element;
    if (!ALLOWED_TAGS.has(el.tagName)) {
      // Thẻ lạ (script/style/iframe/img/svg…): giữ lại CHỮ bên trong (khách gõ "<x>quan trọng</x>" vẫn
      // muốn thấy chữ "quan trọng"), chỉ bỏ vỏ thẻ — không xoá cả khối, tránh mất nội dung oan.
      const text = document.createTextNode(el.textContent || '');
      node.replaceChild(text, el);
      continue;
    }

    // Thẻ hợp lệ — bỏ MỌI thuộc tính trừ `href` đã kiểm của `<a>`. Đây là chỗ chặn `onclick`, `style`
    // (background: url(javascript:...) từng là đường XSS thật), `class` (không cần cho nội dung này).
    for (const attr of Array.from(el.attributes)) el.removeAttribute(attr.name);
    if (el.tagName === 'A') {
      const href = safeHref((child as HTMLAnchorElement).getAttribute('href'));
      if (href) {
        el.setAttribute('href', href);
        el.setAttribute('rel', 'noopener noreferrer');
        el.setAttribute('target', '_blank');
      } else {
        // href rỗng/không hợp lệ (`javascript:`, `data:`…) — bỏ thẻ, giữ chữ, giống thẻ lạ ở trên.
        const text = document.createTextNode(el.textContent || '');
        node.replaceChild(text, el);
        continue;
      }
    }

    scrub(el); // đệ quy vào bên trong SAU KHI đã chốt thẻ này hợp lệ
  }
}

/** Chuỗi HTML admin gõ → chuỗi HTML an toàn để đưa vào `dangerouslySetInnerHTML`. Rỗng/undefined → ''. */
export function sanitizeHtml(html?: string | null): string {
  if (!html) return '';
  if (typeof window === 'undefined') return ''; // phòng thủ — hàm này chỉ dùng phía trình duyệt

  const doc = new DOMParser().parseFromString(html, 'text/html');
  scrub(doc.body);

  return doc.body.innerHTML;
}
