// Voucher theo hình dạng của s7-data-hub. CỐ Ý KHÔNG dùng lại `Voucher` trong `voucherTypes.ts`: cái đó
// là hình dạng của api.trixgo.com (`_id`, `salesoffAmount`, `salesoffRate`, `sign`), tên trường khác hẳn.
// Ép hai backend vào chung một kiểu thì chỗ nào cũng phải hỏi "đang là voucher của bên nào" — và câu hỏi
// đó sẽ bị quên đúng một lần, ở đúng chỗ tính tiền.
export interface StoreVoucher {
  id: string;
  code: string;
  name: string | null;
  discount_type: number;   // 1 = phần trăm · 2 = số tiền
  discount_value: number;
  max_amount: number;      // trần giảm (0 = không chặn)
  min_order_amount: number;
  valid_to: string | null;
  discount: number;        // mức giảm ĐỒNG NGUYÊN do server tính sẵn cho subtotal đã gửi
}

// Món hàng gửi lên khi đặt. KHÔNG có giá: s7-data-hub tra lại `products.sale_price` phía nó và bỏ qua
// mọi con số tiền do trình duyệt gửi. Khai thêm trường giá ở đây chỉ tạo ảo giác là nó có tác dụng.
export interface StoreOrderItem {
  product_id?: string;
  sign?: string;      // mã sản phẩm — khoá nối thật, vì id hai hệ thống khác nhau
  qty: number;
}

export interface CreateStoreOrderData {
  customer_name: string;
  customer_phone: string;
  ship_address: string;
  items: StoreOrderItem[];
  note?: string;
  voucher_code?: string;
}

// Đơn BÁO chờ duyệt, không phải đơn hàng. `status` 1 = chờ xử lý.
export interface CreateStoreOrderResponse {
  id: string;
  status: number;
}
