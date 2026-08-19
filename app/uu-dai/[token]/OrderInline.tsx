'use client';

import type { StoreProduct } from '@/features/product/api/storeCatalog';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { createStoreOrder } from '@/features/checkout/api/createStoreOrder';
import { getStoreProducts } from '@/features/product/api/storeCatalog';
import { formatPrice } from '@/utils/format';

// ĐẶT HÀNG NGAY TẠI TRANG NHẬN ƯU ĐÃI — mẹ vừa nhận mã xong, bấm một nút là đặt được luôn.
//
// Bối cảnh (không suy ra được từ code): mẹ đang đứng ở sân trường, bế con, mạng 4G. Luồng cũ đá mẹ sang
// trang danh sách sản phẩm rồi mới tới giỏ hàng → thanh toán: 6 màn, ~12 ô nhập, trong đó tên và số điện
// thoại là HỎI LẠI đúng thứ mẹ vừa gõ xong. Ở đây rút còn một màn: chọn hàng, gõ địa chỉ, gửi.
//
// Ba quyết định thiết kế, kèm lý do:
//
// 1. **KHÔNG DÙNG GIỎ HÀNG (`CartContext`).** Đây là một lần mua dứt điểm ngay tại sự kiện, không phải
//    phiên mua sắm kéo dài. Đẩy vào giỏ nghĩa là món hàng còn nằm đó sang hôm sau, và mẹ mở lại website
//    thấy giỏ có hàng mình không nhớ đã bỏ vào. Trạng thái ở đây sống và chết cùng màn hình này.
//
// 2. **MỘT Ô ĐỊA CHỈ TỰ DO**, không tỉnh/huyện/xã như trang thanh toán (chủ dự án chốt 2026-08-20).
//    `POST /dat-hang` chỉ cần một chuỗi `ship_address`, còn bộ ba ô chọn của `CheckoutForm` phải gọi
//    `api.trixgo.com` để nạp danh sách khu vực — thêm một backend nữa phải sống sót trên sóng 4G sân
//    trường, đổi lấy dữ liệu mà Sale Admin dù sao cũng gọi điện xác nhận lại.
//
// 3. **GẮN MÃ ƯU ĐÃI VỪA NHẬN VÀO ĐƠN** (`voucher_code`). Khác hẳn ô ưu đãi ở giỏ hàng: ô đó chỉ hiểu mã
//    giảm % / giảm tiền nên mã "mua 2 tặng 1" của sự kiện bị bỏ lại (xem `client.tsx`, đường đi sang
//    `/san-pham` cố ý truyền `voucher: null`). Còn `dat-hang` chỉ GHI LẠI Ý ĐỊNH + kiểm mã còn hạn, không
//    tính tiền giảm (`s7-data-hub/src/routes/store_public.js`) — nên mã sự kiện gắn vào được, và Sale
//    Admin mở hộp chờ duyệt là thấy ngay "mẹ này có mã X". Đây mới là thứ đáng giá nhất của cả màn này.
//
// ⚠️ Kết quả KHÔNG phải đơn hàng đã chốt mà là ĐƠN BÁO chờ duyệt (`order_intakes`, status 1): có người
// thật xem rồi mới lên đơn và giao. Câu chữ xác nhận phải là "đã nhận yêu cầu đặt hàng" — mẹ tưởng mua
// xong mà hàng không tới là mất khách thật.

interface Props {
  /** SĐT mẹ vừa gõ ở bước nhận mã — điền sẵn, không hỏi lại. */
  phone: string;
  /** Tên mẹ vừa gõ (hoặc tên đã có trong danh bạ, do server trả về). */
  name: string;
  /** Mã ưu đãi vừa nhận, gắn kèm đơn để Sale Admin đối chiếu lúc duyệt. */
  voucherCode: string;
  /** Quay lại màn khoe mã. */
  onBack: () => void;
}

type Qty = Record<string, number>;

const MAX_QTY = 99;

export function OrderInline({ phone, name, voucherCode, onBack }: Props) {
  const [products, setProducts] = useState<StoreProduct[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState<Qty>({});
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [placed, setPlaced] = useState<{ id: string } | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      // `null` = gian hàng chưa cấu hình `S7_STORE_TOKEN` HOẶC s7 không với tới được. Không phân biệt hai
      // trường hợp với mẹ: cả hai đều là "lúc này chưa đặt được", còn người vận hành đọc log của cầu nối.
      const rows = await getStoreProducts();
      if (!alive) return;
      setProducts(rows);
      setLoading(false);
    })();

    return () => { alive = false; };
  }, []);

  const bump = useCallback((id: string, delta: number) => {
    setQty((prev) => {
      const next = Math.max(0, Math.min(MAX_QTY, (prev[id] || 0) + delta));
      const copy = { ...prev };
      if (next === 0) delete copy[id];
      else copy[id] = next;

      return copy;
    });
  }, []);

  const chosen = useMemo(
    () => (products || []).filter((p) => (qty[p.id] || 0) > 0),
    [products, qty],
  );

  // Tạm tính chỉ để mẹ ƯỚC LƯỢNG. Số chốt do s7-data-hub tra lại từ `products.sale_price` lúc duyệt đơn,
  // và ưu đãi "mua 2 tặng 1" không trừ tiền ở đây — nên đừng gọi nó là "tổng tiền phải trả".
  const subtotal = useMemo(
    () => chosen.reduce((s, p) => s + p.sale_price * (qty[p.id] || 0), 0),
    [chosen, qty],
  );

  const submit = useCallback(async () => {
    // Chặn ngay trên máy để mẹ thấy lỗi cạnh đúng chỗ đang thiếu, không phải chờ một vòng mạng 4G. Server
    // vẫn kiểm độc lập — trang này không phải đường duy nhất vào.
    if (!chosen.length) { setErr('Mẹ chọn giúp mình ít nhất một sản phẩm nhé.'); return; }
    if (address.trim().length < 5) { setErr('Mẹ nhập địa chỉ nhận hàng giúp mình nhé.'); return; }

    setSubmitting(true); setErr('');
    try {
      const intake = await createStoreOrder({
        customer_name: name,
        customer_phone: phone,
        ship_address: address.trim(),
        items: chosen.map((p) => ({
          // Gửi CẢ HAI như trang thanh toán đang làm: `product_id` chính xác tuyệt đối (danh mục này lấy
          // thẳng từ s7 nên id trùng), `sign` là đường lùi nếu sau này danh mục đổi nguồn.
          product_id: p.id,
          sign: p.sign || undefined,
          qty: qty[p.id],
        })),
        note: note.trim() ? `Đặt tại trang ưu đãi sự kiện · ${note.trim()}` : 'Đặt tại trang ưu đãi sự kiện',
        // Mã sự kiện. Server kiểm lại và TỪ CHỐI cả đơn nếu mã hỏng — mẹ vừa nhìn thấy mã trên màn hình
        // nên lặng lẽ bỏ qua là tranh cãi lúc giao hàng.
        voucher_code: voucherCode || undefined,
      });
      setPlaced({ id: intake.id });
    } catch (e) {
      // Giữ nguyên câu chữ của server: nó phân biệt "mã ưu đãi hết hạn" với "sản phẩm không còn bán", hai
      // việc mẹ phải xử lý khác nhau.
      setErr(e instanceof Error ? e.message : 'Không gửi được yêu cầu đặt hàng, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  }, [chosen, address, note, name, phone, qty, voucherCode]);

  // ĐÃ GỬI — câu chữ cố ý KHÔNG phải "đặt hàng thành công". Đơn còn phải qua người duyệt.
  if (placed) {
    return (
      <div className="text-center">
        <div className="text-5xl">📦</div>
        <h1 className="mt-3 text-lg font-bold text-gray-900">Lamin đã nhận yêu cầu đặt hàng</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Nhân viên Lamin sẽ gọi vào số <b>{phone}</b> để xác nhận đơn, ưu đãi và địa chỉ giao hàng.
        </p>

        <div className="mt-5 rounded-xl border border-primary-20 bg-primary-5 p-4 text-left">
          <p className="text-xs uppercase tracking-wide text-primary-60">Mã yêu cầu</p>
          <p className="mt-1 font-mono text-sm font-bold break-all text-primary">{placed.id}</p>
          <p className="mt-3 text-sm text-gray-700">
            <b>Ưu đãi kèm theo:</b> {voucherCode}
          </p>
          <p className="mt-1 text-sm text-gray-700">
            <b>Giao tới:</b> {address.trim()}
          </p>
        </div>

        <button
          className="mt-5 w-full rounded-xl border border-primary-30 py-3 text-sm font-semibold text-primary active:bg-primary-5"
          type="button"
          onClick={onBack}>
          Xem lại mã ưu đãi của mẹ
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-gray-500">
        <div className="size-8 animate-spin rounded-full border-4 border-primary-20 border-t-primary" />
        <p className="text-sm">Đang tải sản phẩm…</p>
      </div>
    );
  }

  // Không có hàng để bán: gian hàng chưa cấu hình, s7 hỏng, hoặc chưa ai bật `on_web` cho sản phẩm nào.
  // Với mẹ thì cả ba giống nhau — và vẫn còn đường nhân viên gọi lại, nên đừng để màn này thành ngõ cụt.
  if (!products || !products.length) {
    return (
      <div className="py-6 text-center">
        <div className="text-4xl">🛒</div>
        <h2 className="mt-3 font-bold text-gray-900">Chưa đặt hàng online được</h2>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Mẹ giữ lại mã ưu đãi nhé, nhân viên Lamin sẽ liên hệ để hướng dẫn mẹ đặt hàng.
        </p>
        <button
          className="mt-5 w-full rounded-xl border border-primary-30 py-3 text-sm font-semibold text-primary active:bg-primary-5"
          type="button"
          onClick={onBack}>
          Quay lại mã ưu đãi
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-gray-900">Đặt hàng giao tận nhà</h2>
          <p className="mt-0.5 text-xs text-gray-500">Ưu đãi <b className="text-primary">{voucherCode}</b> đã được gắn sẵn vào đơn</p>
        </div>
        <button
          className="shrink-0 text-sm font-semibold text-primary underline-offset-2 active:underline"
          type="button"
          onClick={onBack}>
          Quay lại
        </button>
      </div>

      {/* Tên + SĐT mẹ vừa gõ ở bước trên. Hiện lại để mẹ yên tâm là đúng số của mình, KHÔNG bắt gõ lại —
          hỏi cùng một câu hai lần là cách chắc chắn để mẹ bỏ dở giữa chừng. */}
      <div className="mt-4 rounded-xl bg-primary-5 p-3 text-sm text-gray-700">
        <b>{name}</b> · {phone}
      </div>

      <p className="mt-5 text-sm font-semibold text-gray-800">Mẹ chọn sản phẩm</p>
      <ul className="mt-2 divide-y divide-gray-100">
        {products.map((p) => {
          const n = qty[p.id] || 0;

          return (
            <li key={p.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{p.name}</p>
                <p className="mt-0.5 text-sm text-primary">
                  {formatPrice(p.sale_price)}
                  {p.unit ? <span className="text-gray-400"> / {p.unit}</span> : null}
                </p>
              </div>

              {/* Nút to, cách nhau — bấm bằng ngón cái khi đang bế con. */}
              <div className="flex shrink-0 items-center gap-2">
                <button
                  aria-label={`Bớt ${p.name}`}
                  className="size-9 rounded-lg border border-gray-300 text-lg font-bold text-gray-600 disabled:opacity-30"
                  disabled={n === 0}
                  type="button"
                  onClick={() => bump(p.id, -1)}>
                  −
                </button>
                <span className="w-6 text-center text-base font-bold tabular-nums text-gray-900">{n}</span>
                <button
                  aria-label={`Thêm ${p.name}`}
                  className="size-9 rounded-lg bg-primary text-lg font-bold text-white active:bg-primary-60"
                  type="button"
                  onClick={() => bump(p.id, 1)}>
                  +
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <label className="mt-5 block text-sm font-semibold text-gray-800" htmlFor="ship-address">
        Địa chỉ nhận hàng <span className="text-red-500">*</span>
      </label>
      <textarea
        autoComplete="street-address"
        className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary-20"
        id="ship-address"
        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
        rows={3}
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      <label className="mt-4 block text-sm font-semibold text-gray-800" htmlFor="order-note">
        Ghi chú <span className="font-normal text-gray-400">(không bắt buộc)</span>
      </label>
      <input
        className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary-20"
        id="order-note"
        placeholder="Giờ nhận hàng, người nhận hộ…"
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      {/* Tạm tính, KHÔNG gọi là tổng tiền: chưa gồm phí giao và chưa trừ ưu đãi — cả hai do Sale Admin chốt
          lúc duyệt đơn. Gọi sai tên ở đây là hứa một con số mà lúc giao hàng không giữ được. */}
      {chosen.length > 0 && (
        <div className="mt-5 flex items-baseline justify-between rounded-xl bg-gray-50 px-4 py-3">
          <span className="text-sm text-gray-600">Tạm tính {chosen.length} sản phẩm</span>
          <span className="text-lg font-extrabold text-primary">{formatPrice(subtotal)}</span>
        </div>
      )}

      {err && (
        <p aria-live="polite" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {err}
        </p>
      )}

      <button
        className="mt-5 w-full rounded-xl bg-primary py-4 text-base font-bold text-white shadow-md shadow-primary-20 active:bg-primary-60 disabled:opacity-60"
        disabled={submitting}
        type="button"
        onClick={submit}>
        {submitting ? 'Đang gửi…' : 'Gửi yêu cầu đặt hàng'}
      </button>

      <p className="mt-3 text-center text-xs leading-relaxed text-gray-500">
        Lamin sẽ gọi lại xác nhận đơn và chốt ưu đãi trước khi giao. Mẹ chưa phải thanh toán gì ở bước này.
      </p>
    </div>
  );
}
