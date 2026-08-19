'use client';

import type { StoreVoucher } from '../types/storeVoucherTypes';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Loader2, Ticket, X } from 'lucide-react';

import { checkStoreVoucherCode, getStoreVouchersByPhone } from '../api/storeVoucher';
import { readStoreCheckout, writeStoreCheckout } from '../utils/storeCheckout';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/utils/format';

// Ô ƯU ĐÃI — SỐ ĐIỆN THOẠI TRƯỚC, rồi mới tới mã (chốt của chủ dự án 2026-08-17).
//
// Thứ tự đó không phải tuỳ hứng: phần lớn ưu đãi của Lamin được CẤP CHO MỘT SỐ ĐIỆN THOẠI cụ thể (mã mẹ
// nhận tại sự kiện đo chiều cao ở trường), nên biết số là hiện được luôn danh sách và khách không phải
// nhớ gì. Ô gõ tay vẫn giữ cho mã công khai in trên tờ rơi / đăng Facebook.
//
// Số điện thoại nhập ở đây cũng được nhớ lại để điền sẵn ở bước thanh toán — hỏi khách cùng một câu hai
// lần là cách chắc chắn để họ bỏ giỏ hàng giữa chừng.

// Đủ dùng ở phía trình duyệt: chặn số cụt và số chứa chữ trước khi tốn một vòng mạng. Kiểm tra thật do
// server làm (`checkPhone` bên s7-data-hub) — đây chỉ là phép lịch sự với người đang gõ.
const looksLikePhone = (p: string) => /^0\d{9}$/.test(p.trim());

interface Props {
  subtotal: number;
  onVoucherChange: (voucher: StoreVoucher | null) => void;
}

export function StoreVoucherBox({ subtotal, onVoucherChange }: Props) {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [mine, setMine] = useState<StoreVoucher[]>([]);
  const [applied, setApplied] = useState<StoreVoucher | null>(null);
  const [loadingMine, setLoadingMine] = useState(false);
  const [checking, setChecking] = useState(false);
  const [err, setErr] = useState('');

  // Ý ĐỊNH của khách — mã nào khách MUỐN dùng — TÁCH RIÊNG khỏi `applied` (mã có đang giảm được tiền
  // ngay bây giờ không). Một mã có `min_order_amount` sẽ hợp lệ rồi lại không hợp lệ khi khách tăng/giảm
  // số lượng quanh ngưỡng đó; nếu chỉ có `applied` thì một lần rớt xuống dưới ngưỡng sẽ XOÁ SẠCH ý định,
  // và khách tăng số lượng lên đủ lại về sau sẽ không có gì tự châm lại — mã coi như mất hẳn dù khách
  // chẳng bấm "Bỏ ưu đãi" bao giờ. Ref vì đây không phải thứ cần vẽ lại giao diện, chỉ để effect dưới đọc.
  const wantedCode = useRef<string | null>(null);

  // Khôi phục lựa chọn cũ khi khách quay lại giỏ hàng từ bước thanh toán — HOẶC khi mang SĐT sang từ
  // trang nhận ưu đãi sự kiện (`/uu-dai/[token]`). Tự tra ngay ở đây thay vì chờ `onBlur`: mẹ vừa gõ SĐT
  // một lần rồi, bắt gõ hoặc chạm lại để "kích hoạt" tra cứu là mất đúng thứ nút "Đặt hàng ngay" hứa hẹn.
  useEffect(() => {
    const saved = readStoreCheckout();
    if (saved.phone) {
      setPhone(saved.phone);
      if (looksLikePhone(saved.phone)) loadMine(saved.phone);
    }
    if (saved.voucher) {
      wantedCode.current = saved.voucher.code;
      setApplied(saved.voucher);
      onVoucherChange(saved.voucher);
    }
    // Chỉ chạy một lần lúc gắn vào cây — thêm deps là nạp lại mỗi lần cha vẽ lại.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = useCallback((p: string, v: StoreVoucher | null) => {
    writeStoreCheckout({ phone: p, voucher: v });
  }, []);

  const loadMine = useCallback(async (p: string) => {
    if (!looksLikePhone(p)) {
      setMine([]);

      return;
    }
    setLoadingMine(true);
    try {
      setMine(await getStoreVouchersByPhone(p, subtotal));
    } finally {
      setLoadingMine(false);
    }
  }, [subtotal]);

  const apply = useCallback((v: StoreVoucher | null) => {
    wantedCode.current = v?.code || null;
    setApplied(v);
    setErr('');
    onVoucherChange(v);
    persist(phone, v);
  }, [onVoucherChange, persist, phone]);

  // `applied.discount` là số CHỤP LẠI tại thời điểm áp mã — đổi số lượng/bỏ chọn sản phẩm sau đó đổi
  // `subtotal` nhưng KHÔNG tự đổi số đã chụp, vì mọi nơi chọn voucher (bấm trong danh sách, gõ mã tay,
  // khôi phục từ sessionStorage) đều chỉ set `applied` một lần rồi thôi. Bug thật đã gặp: mẹ để 1 hộp lúc
  // áp mã 33% (giảm đúng 33% của 1 hộp), sau đó tăng lên 3 hộp — giỏ hàng hiện tổng tiền x3 nhưng số tiền
  // giảm đứng yên ở mức tính cho 1 hộp, nhìn như sai phần trăm. Server luôn tính lại đúng cho một `subtotal`
  // bất kỳ (`discountOf`), nên chỗ sửa là gọi lại đúng API đó mỗi khi `subtotal` đổi, không tính tay ở đây.
  //
  // ĐỌC `wantedCode.current`, KHÔNG đọc `applied.code` — bug thứ hai bắt được ngay khi thử tay: mã có
  // `min_order_amount` (VD "Trạm trường học" cần đơn ≥ 1.050.000đ) rớt qua lại quanh ngưỡng đó khi khách
  // bấm tăng số lượng liên tiếp (350k → 700k → 1.050k). Ở mốc 700k mã bị server từ chối, nếu khi đó xoá
  // luôn `applied` VÀ để effect chỉ chạy tiếp "nếu đang có applied" thì tới mốc 1.050k (đã đủ điều kiện)
  // không còn gì kích hoạt việc thử lại — mã coi như mất vĩnh viễn dù khách chẳng bấm bỏ ưu đãi. Tách hẳn
  // "khách muốn dùng mã nào" ra khỏi "mã có đang giảm được tiền không" thì mỗi lần subtotal đổi đều thử
  // lại đúng mã khách muốn, bất kể lần thử liền trước có qua được hay không.
  useEffect(() => {
    const code = wantedCode.current;
    if (!code) return;
    let alive = true;
    (async () => {
      try {
        const fresh = await checkStoreVoucherCode(code, subtotal);
        if (!alive) return;
        setApplied(fresh);
        setErr('');
        onVoucherChange(fresh);
        persist(phone, fresh);
      } catch (e) {
        // KHÔNG xoá `wantedCode` — khách vẫn muốn mã này, chỉ là chưa đủ điều kiện ở subtotal hiện tại
        // (hoặc mã vừa hết hạn/hết lượt). Đổi subtotal lần sau (thêm hàng, đổi số lượng) sẽ tự thử lại.
        if (!alive) return;
        setApplied(null);
        setErr(e instanceof Error ? e.message : 'Không dùng được ưu đãi với giỏ hàng hiện tại.');
        onVoucherChange(null);
        persist(phone, null);
      }
    })();

    return () => { alive = false; };
    // Cố ý CHỈ phụ thuộc `subtotal` — đọc `wantedCode.current` trực tiếp trong thân effect, không đưa nó
    // vào deps: đây là ref, đổi giá trị không kích hoạt render/effect, và đó chính là điều ta muốn — chỉ
    // subtotal đổi mới cần thử lại, còn phát hiện "khách vừa chọn mã khác" đã có nhánh gọi API riêng trong
    // chính `apply`/`applyTypedCode`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  const applyTypedCode = useCallback(async () => {
    if (!code.trim()) return;
    setChecking(true);
    setErr('');
    try {
      apply(await checkStoreVoucherCode(code.trim(), subtotal));
      setCode('');
    } catch (e) {
      // Câu chữ đến thẳng từ server: nó phân biệt "mã không đúng" với "đơn tối thiểu chưa đạt" — hai việc
      // khách phải xử lý khác nhau, gộp thành "có lỗi" là bắt khách tự đoán.
      setErr(e instanceof Error ? e.message : 'Không kiểm tra được mã.');
    } finally {
      setChecking(false);
    }
  }, [apply, code, subtotal]);

  return (
    <div className="rounded-md border border-dashed border-blue-200 bg-blue-50/40 p-3 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-blue-700">
        <Ticket className="h-4 w-4" />
        <span>Ưu đãi của bạn</span>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-gray-600" htmlFor="voucher-phone">
          Số điện thoại đặt hàng
        </label>
        <Input
          className="bg-white"
          id="voucher-phone"
          inputMode="numeric"
          placeholder="Ví dụ: 0985199295"
          value={phone}
          onBlur={() => loadMine(phone)}
          onChange={(e) => {
            const p = e.target.value.replace(/[^\d]/g, '').slice(0, 10);
            setPhone(p);
            persist(p, applied);
          }}
        />
        {loadingMine && (
          <p className="flex items-center gap-1 text-xs text-gray-500">
            <Loader2 className="h-3 w-3 animate-spin" /> Đang tìm ưu đãi…
          </p>
        )}
      </div>

      {/* Ưu đãi đã được cấp cho số này. Không có thì KHÔNG hiện gì — "bạn chưa có ưu đãi nào" chỉ làm
          khách thấy mình thiệt, mà họ có thể vẫn cầm một mã công khai để gõ vào ô dưới. */}
      {mine.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-600">Ưu đãi dành cho số này:</p>
          {mine.map((v) => (
            <button
              key={v.id}
              className={`flex w-full items-start justify-between gap-2 rounded border bg-white p-2 text-left text-sm ${
                applied?.id === v.id ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200'
              }`}
              type="button"
              onClick={() => apply(applied?.id === v.id ? null : v)}>
              <span>
                <span className="font-medium">{v.name || v.code}</span>
                <span className="block text-xs text-gray-500">Mã: {v.code}</span>
              </span>
              {applied?.id === v.id && <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />}
            </button>
          ))}
        </div>
      )}

      <div className="space-y-1">
        <label className="text-xs text-gray-600" htmlFor="voucher-code">
          Hoặc nhập mã ưu đãi
        </label>
        <div className="flex gap-2">
          <Input
            className="bg-white uppercase"
            id="voucher-code"
            placeholder="Nhập mã"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                applyTypedCode();
              }
            }}
          />
          <Button
            disabled={checking || !code.trim()}
            type="button"
            variant="outline"
            onClick={applyTypedCode}>
            {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Áp dụng'}
          </Button>
        </div>
        {err && <p className="text-xs text-red-600">{err}</p>}
      </div>

      {applied && (
        <div className="flex items-center justify-between rounded bg-white p-2 text-sm">
          <span>
            Đang dùng <span className="font-medium">{applied.code}</span>
            {applied.discount > 0 && (
              <span className="block text-xs text-green-700">
                Giảm {formatPrice(applied.discount)}
              </span>
            )}
          </span>
          <button
            aria-label="Bỏ ưu đãi"
            className="rounded p-1 text-gray-400 hover:text-gray-700"
            type="button"
            onClick={() => apply(null)}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
