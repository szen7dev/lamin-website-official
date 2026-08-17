'use client';

import type { CartItem } from '../types/cartTypes';
import type { Goods } from '@/features/search/types/goodsTypes';

import { useEffect, useRef } from 'react';

import { getStoreCatalog } from '@/features/product/api/storeCatalog';

// DỌN GIỎ HÀNG CŨ khi nguồn danh mục đổi sang s7.
//
// Vì sao cần: giỏ hàng nằm trong `localStorage` của khách với hạn **1 ngày**. Ngay sau khi bật gian hàng
// s7, khách nào còn giỏ cũ đang giữ món mang `id` của backend cũ — id đó không tồn tại bên s7, nên bấm
// đặt hàng chỉ nhận lại "Sản phẩm không còn bán" mà không hiểu vì sao và cũng không biết phải bỏ món nào.
// Tự hết sau 24 giờ, nhưng 24 giờ đó rơi đúng vào lúc vừa chuyển đổi.
//
// Cũng dọn luôn món đã bị gỡ khỏi gian hàng (tắt `on_web`, hết giá) — với khách thì hai trường hợp là
// một: món này giờ không mua được nữa.
//
// ⚠️ XOÁ MỖI LẦN MỘT MÓN, không xoá cả loạt. `CartContext.removeItem` tính danh sách mới từ biến `items`
// bắt được trong closure (`features/cart/contexts/CartContext.tsx:150`), nên gọi nó hai lần trong cùng
// một nhịp thì lần sau GHI ĐÈ lần trước và chỉ đúng một món bị bỏ. Đã vấp thật khi thử tay 2026-08-17:
// hai món hỏng, báo đúng cả hai, mà giỏ chỉ mất một. Nên ở đây xoá một món rồi để `items.length` đổi kéo
// effect chạy lại — lặp tới khi sạch. Sửa `CartContext` cho nhận hàm cập nhật thì gọn hơn, nhưng nó là
// context dùng chung ~60 nơi, không đáng đổi vì một luồng dọn dẹp.
//
// ⚠️ HAI CHỐT AN TOÀN, thiếu một cái là xoá nhầm hàng của khách:
//  1. `null` (chưa cấu hình gian hàng / s7 không với tới được) → KHÔNG đụng vào giỏ. Lúc đó website vẫn
//     chạy bằng backend cũ nên giỏ cũ hoàn toàn hợp lệ.
//  2. Danh mục **RỖNG** → cũng KHÔNG đụng. Rỗng nghĩa là chưa ai bật `on_web`, một vấn đề cấu hình —
//     lấy nó làm căn cứ để xoá thì mọi khách mất sạch giỏ hàng chỉ vì người vận hành chưa khai dữ liệu.
export function useDonGioHangCu(
  items: CartItem[],
  removeItem: (id: string) => void,
  onBoMon: (ten: string) => void,
) {
  // Danh mục tải MỘT lần rồi giữ lại: effect còn chạy lại nhiều lượt để xoá dần, gọi mạng mỗi lượt là vô ích.
  const catalog = useRef<Goods[] | null | undefined>(undefined);   // undefined = chưa tải

  useEffect(() => {
    if (items.length === 0) return;

    let con = true;
    (async () => {
      if (catalog.current === undefined) {
        // Có thể chạy hai lần dưới StrictMode; hai lần cùng kết quả nên vô hại.
        catalog.current = await getStoreCatalog();
      }
      const dm = catalog.current;
      // Chốt 1 + 2.
      if (!con || !dm || dm.length === 0) return;

      const idHopLe = new Set(dm.map((p) => p._id));
      const signHopLe = new Set(dm.map((p) => p.sign).filter(Boolean));
      // Món hợp lệ khi khớp id HOẶC mã sản phẩm — `sign` là lưới an toàn cho giỏ thêm từ trước lúc chuyển.
      const hong = items.find((it) => !idHopLe.has(it.id) && !(it.sign && signHopLe.has(it.sign)));
      if (!hong) return;

      removeItem(hong.id);
      onBoMon(hong.name);
    })();

    return () => { con = false; };
    // Chỉ phụ thuộc số lượng món: mỗi lần xoá một món thì số này giảm, effect chạy lại và xoá món kế tiếp.
    // Đưa cả `items` vào đây là chạy vòng lặp vì nó là mảng mới sau mỗi lần vẽ lại.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length]);
}
