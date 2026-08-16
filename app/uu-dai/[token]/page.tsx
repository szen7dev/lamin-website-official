import type { Metadata } from 'next';

import { UuDaiClient } from './client';

// TRANG NHẬN ƯU ĐÃI TẠI SỰ KIỆN — mẹ quét mã QR dán ở bàn đo chiều cao trong trường học.
//
// ĐẶT NGOÀI route group `(public)` là CỐ Ý: `(public)` bọc `PublicLayout` (header + mega menu + giỏ hàng
// + footer). Người dùng ở đây là một phụ huynh đang xếp hàng giữa sân trường, mở bằng 4G, chỉ có đúng một
// việc cần làm. Cả bộ khung thương mại điện tử ở đây chỉ làm trang nặng thêm và cho mẹ chỗ để bấm lạc.
//
// Cũng KHÔNG cần khai trong `proxy.ts`: đường dẫn `/uu-dai/...` vốn đã là tiếng Việt nên không có gì để
// dịch. Luật hai chiều trong `.claude/rules/vietnamese-urls.md` áp cho các trang có thư mục tên tiếng Anh;
// trang này lấy thẳng tên tiếng Việt làm thư mục. Không khai gì thì proxy để rơi xuống nhánh mặc định —
// vẫn gắn đủ các header bảo mật.

export const metadata: Metadata = {
  title: 'Nhận ưu đãi | Lamin',
  description: 'Nhập thông tin để nhận ưu đãi dành riêng cho phụ huynh tham gia sự kiện đo chiều cao.',
  // KHÔNG cho lập chỉ mục: mỗi đường dẫn gắn một mã sự kiện riêng, lọt lên Google là mã phát tán ngoài
  // tầm kiểm soát và ai cũng nhận được voucher mà không hề dự sự kiện nào.
  robots: { index: false, follow: false },
};

export default function UuDaiPage() {
  return <UuDaiClient />;
}
