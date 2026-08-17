import type {
  CreateStoreOrderData,
  CreateStoreOrderResponse,
} from '@/features/cart/types/storeVoucherTypes';

// ĐẶT HÀNG qua s7-data-hub — thay cho `createOrder.ts` (POST /api/store/orders/insert-full trên
// api.trixgo.com).
//
// ⚠️ KHÁC BIỆT PHẢI NÓI VỚI KHÁCH: đây tạo ĐƠN CHỜ DUYỆT, không phải đơn hàng đã chốt. Có người thật xem
// rồi mới lên đơn và giao. Màn xác nhận dùng câu chữ "đã nhận yêu cầu đặt hàng", KHÔNG dùng "đặt hàng
// thành công" như luồng cũ — khách tưởng đã mua xong mà hàng không tới là mất khách thật.
//
// KHÔNG gửi giá, tổng tiền, phí ship, tích điểm: s7-data-hub tra giá lại từ `products.sale_price` và bỏ
// qua mọi con số tiền từ trình duyệt (`.claude/rules/money.md` — "never trust a client-sent total").

export async function createStoreOrder(
  data: CreateStoreOrderData,
): Promise<CreateStoreOrderResponse> {
  const r = await fetch('/api/cua-hang/dat-hang', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  const j = await r.json().catch(() => null);
  if (!r.ok) {
    // Giữ nguyên câu chữ của server: nó phân biệt được "mã ưu đãi hết hạn" với "sản phẩm không còn bán",
    // hai việc khách phải xử lý khác nhau.
    throw new Error(j?.error?.message || 'Không gửi được yêu cầu đặt hàng, vui lòng thử lại.');
  }

  return j.data;
}
