import type { StoreVoucher } from '../types/storeVoucherTypes';

// SỐ ĐIỆN THOẠI + ƯU ĐÃI khách chọn ở trang GIỎ HÀNG, để trang THANH TOÁN đọc lại.
//
// Vì sao không nhét vào `CartContext`: context đó đang giữ giỏ hàng trong `localStorage` với hạn 1 ngày và
// có ~60 nơi dùng. Thêm trường vào đó là bắt cả luồng mua hàng đang chạy thật gánh rủi ro cho một tính
// năng mới. Đây là dữ liệu của MỘT LẦN mua, nên `sessionStorage` đúng hơn: đóng tab là quên, không có
// chuyện hôm sau quay lại thấy mã ưu đãi cũ đã hết hạn vẫn nằm đó.

const KEY = 'lamin.store-checkout';

export interface StoreCheckoutState {
  phone: string;
  voucher: StoreVoucher | null;
}

const EMPTY: StoreCheckoutState = { phone: '', voucher: null };

export const readStoreCheckout = (): StoreCheckoutState => {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = sessionStorage.getItem(KEY);

    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
};

export const writeStoreCheckout = (state: StoreCheckoutState): void => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Chế độ riêng tư của trình duyệt chặn ghi. Không sao — khách chỉ phải nhập lại mã ở bước thanh toán,
    // đừng làm vỡ cả trang giỏ hàng vì một chỗ lưu tạm.
  }
};

export const clearStoreCheckout = (): void => {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* như trên */
  }
};
