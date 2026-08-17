import { forward, hasStoreToken, jsonError, notConfigured, storeBase, unreachable } from '@/lib/s7-store';

// ĐẶT HÀNG — thay cho `POST /api/store/orders/insert-full` bên api.trixgo.com.
//
// ⚠️ KHÁC BIỆT LỚN NHẤT so với luồng cũ, và màn xác nhận PHẢI nói rõ với khách: đơn ở đây **chưa phải đơn
// hàng**. Nó vào hộp chờ duyệt của Sale Admin (`order_intakes`, status 1), có người thật xem rồi mới lên
// đơn và giao. Luồng cũ lên đơn ngay. Khách tưởng đã mua xong mà hàng không tới là mất khách thật.
//
// Body chuyển tiếp NGUYÊN VẸN, KHÔNG thêm giá và KHÔNG thêm tổng tiền: s7-data-hub tra lại giá từ
// `products.sale_price` phía nó và bỏ qua mọi con số tiền do client gửi lên. Tính tiền lần nữa ở tầng này
// chỉ tạo ra một nguồn sự thật thứ hai để hai bên lệch nhau.

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!hasStoreToken()) return notConfigured();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('bad_request', 'Dữ liệu gửi lên không hợp lệ.', 400);
  }
  try {
    return forward(
      await fetch(storeBase('/dat-hang'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store',
      }),
    );
  } catch (e) {
    return unreachable(e, 'POST /dat-hang');
  }
}
