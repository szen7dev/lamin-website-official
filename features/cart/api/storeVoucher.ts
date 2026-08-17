import type { StoreVoucher } from '../types/storeVoucherTypes';

// VOUCHER từ s7-data-hub, qua cầu nối `/api/cua-hang/voucher`.
//
// Dùng `fetch` tương đối chứ KHÔNG dùng `apiClient`: `apiClient` có `baseURL` trỏ ra api.trixgo.com
// (`.claude/rules/one-api-client.md`), gọi nó ở đây là gọi nhầm backend. Đường dẫn tương đối `/api/...`
// đi tới chính route Next của mình, không phải "một host tuyệt đối thứ hai" mà luật kia cấm — giống hệt
// cách trang nhận ưu đãi tại sự kiện đang làm.

const readError = async (r: Response) => {
  const j = await r.json().catch(() => null);

  return j?.error?.message || 'Không kiểm tra được mã ưu đãi, vui lòng thử lại.';
};

/** Ưu đãi ĐÃ ĐƯỢC CẤP cho số điện thoại này (mã nhận tại sự kiện chẳng hạn) — khách khỏi phải nhớ mã. */
export async function getStoreVouchersByPhone(
  phone: string,
  subtotal: number,
): Promise<StoreVoucher[]> {
  const qs = new URLSearchParams({ phone, subtotal: String(Math.round(subtotal)) });
  const r = await fetch(`/api/cua-hang/voucher?${qs}`, { cache: 'no-store' });
  // Số lạ trả mảng rỗng chứ không phải lỗi — đừng biến "chưa có ưu đãi nào" thành một thông báo đỏ.
  if (!r.ok) return [];
  const j = await r.json();

  return Array.isArray(j?.data) ? j.data : [];
}

/** Khách GÕ MÃ bằng tay. Ném lỗi kèm CÂU CHỮ CỦA SERVER để hiện thẳng cạnh ô nhập. */
export async function checkStoreVoucherCode(
  code: string,
  subtotal: number,
): Promise<StoreVoucher> {
  const r = await fetch('/api/cua-hang/voucher', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, subtotal: Math.round(subtotal) }),
  });
  if (!r.ok) throw new Error(await readError(r));
  const j = await r.json();

  return j.data;
}
