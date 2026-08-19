'use client';

import { useCallback, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { writeStoreCheckout } from '@/features/cart/utils/storeCheckout';

// Giao diện MỘT VIỆC: mẹ điền số điện thoại + tên, nhận mã ưu đãi. Thiết kế cho điện thoại cầm một tay,
// mạng 4G ở sân trường, và cho người đang xếp hàng nên mỗi giây chờ đều thật.

type OfferInfo = {
  campaign_name: string;
  branch_name: string | null;
  offer_name: string | null;
  offer_note: string | null;
  valid_to: string | null;
  closed_reason: string | null;
};

type Claimed = {
  voucher_code: string;
  offer_name: string | null;
  valid_to: string | null;
  customer_name: string;
  already_had: boolean;
};

type ApiErr = { code?: string; message?: string };

const dm = (iso?: string | null) => {
  if (!iso) return null;
  const d = new Date(iso);

  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};

// Khung ngoài dùng lại cho mọi trạng thái — giữ nền và bề ngang nhất quán, không để trang nhảy khi đổi
// từ đang tải sang form sang kết quả.
function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-dvh bg-gradient-to-b from-primary-5 to-white px-4 py-8">
      <div className="mx-auto w-full max-w-md">{children}</div>
    </main>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-lg shadow-primary-10/40">{children}</div>
  );
}

export function UuDaiClient() {
  const params = useParams<{ token: string }>();
  const token = params?.token;
  const router = useRouter();

  const [info, setInfo] = useState<OfferInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [claimed, setClaimed] = useState<Claimed | null>(null);

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) return;
    let alive = true;
    (async () => {
      try {
        const r = await fetch(`/api/uu-dai/${token}`, { cache: 'no-store' });
        const j = await r.json();
        if (!alive) return;
        if (!r.ok) { setNotFound(true); return; }
        setInfo(j.data);
      } catch {
        if (alive) setNotFound(true);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, [token]);

  const submit = useCallback(async () => {
    // Chặn ngay trên máy để mẹ thấy lỗi cạnh đúng ô đang thiếu, không phải chờ một vòng mạng 4G mới biết
    // quên tick ô đồng ý. Backend vẫn kiểm độc lập — trang này không phải đường duy nhất vào.
    if (!phone.trim()) { setErr('Vui lòng nhập số điện thoại.'); return; }
    if (!name.trim()) { setErr('Vui lòng nhập tên của mẹ.'); return; }
    if (!consent) { setErr('Vui lòng tích vào ô đồng ý để nhận ưu đãi.'); return; }

    setSubmitting(true); setErr('');
    try {
      const r = await fetch(`/api/uu-dai/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), name: name.trim(), consent: true }),
      });
      const j = await r.json();
      if (!r.ok) {
        const e: ApiErr = j?.error || {};
        setErr(e.message || 'Không nhận được ưu đãi, vui lòng thử lại.');

        return;
      }
      setClaimed(j.data);
    } catch {
      setErr('Mất kết nối. Kiểm tra sóng rồi thử lại giúp mình nhé.');
    } finally {
      setSubmitting(false);
    }
  }, [phone, name, consent, token]);

  // Mang SĐT mẹ vừa gõ sang giỏ hàng — `StoreVoucherBox` đọc lại từ đây và tự hiện đúng voucher vừa nhận,
  // mẹ không phải nhớ hay gõ lại mã. KHÔNG mang theo `voucher` (để null): mã ưu đãi "mua 2 tặng 1" ở đây
  // không giảm giá được (xem event_voucher.js) — để trống thì `StoreVoucherBox` tự tra qua SĐT và hiện
  // đúng mã kiểu giảm % / giảm tiền nếu mẹ có, không hiện nhầm mã "mua 2 tặng 1" vào ô chỉ hiểu được số tiền.
  const goOrder = () => {
    if (!claimed) return;
    // Cùng cách chuẩn hoá với chính ô SĐT trong `StoreVoucherBox` (chỉ giữ chữ số) — mẹ có thể đã gõ
    // "090 123 4567" có khoảng trắng, để nguyên thì `looksLikePhone` bên giỏ hàng không khớp và không tự
    // tra được ưu đãi.
    writeStoreCheckout({ phone: phone.replace(/[^\d]/g, '').slice(0, 10), voucher: null });
    router.push('/san-pham');
  };

  const copyCode = async () => {
    if (!claimed) return;
    try {
      await navigator.clipboard.writeText(claimed.voucher_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Không copy được thì thôi — mã đang hiện to trên màn hình, mẹ chụp màn hình là xong.
    }
  };

  if (loading) {
    return (
      <Shell>
        <Card>
          <div className="flex flex-col items-center gap-3 py-10 text-gray-500">
            <div className="size-8 animate-spin rounded-full border-4 border-primary-20 border-t-primary" />
            <p className="text-sm">Đang tải…</p>
          </div>
        </Card>
      </Shell>
    );
  }

  // Mã sai, đã thu hồi, hoặc chiến dịch bị gỡ ưu đãi. Không phân biệt các trường hợp này với nhau — nói rõ
  // hơn cũng không giúp được mẹ, mà lại cho người dò mã biết mã nào từng có thật.
  if (notFound || !info) {
    return (
      <Shell>
        <Card>
          <div className="py-8 text-center">
            <div className="text-5xl">🔒</div>
            <h1 className="mt-4 text-lg font-bold text-gray-900">Mã ưu đãi không còn hiệu lực</h1>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">
              Mã này đã hết hạn hoặc đã được thu hồi. Mẹ vui lòng hỏi lại nhân viên Lamin tại sự kiện nhé.
            </p>
          </div>
        </Card>
      </Shell>
    );
  }

  // ĐÃ NHẬN — màn hình mẹ sẽ chụp lại. Mã to nhất trang, giãn chữ để đọc và đọc lại cho nhân viên qua
  // điện thoại không bị nhầm 0 với O.
  if (claimed) {
    return (
      <Shell>
        <Card>
          <div className="text-center">
            <div className="text-5xl">🎉</div>
            <h1 className="mt-3 text-lg font-bold text-gray-900">
              {claimed.already_had ? 'Mẹ đã nhận ưu đãi này rồi' : 'Nhận ưu đãi thành công!'}
            </h1>
            <p className="mt-1 text-sm text-gray-600">{claimed.customer_name}</p>

            <div className="mt-5 rounded-xl border-2 border-dashed border-primary-30 bg-primary-5 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-primary-60">Mã ưu đãi của mẹ</p>
              <p className="mt-1 font-mono text-3xl font-extrabold tracking-[0.15em] text-primary break-all">
                {claimed.voucher_code}
              </p>
              {claimed.offer_name && (
                <p className="mt-2 text-sm font-semibold text-gray-800">{claimed.offer_name}</p>
              )}
              {claimed.valid_to && (
                <p className="mt-1 text-xs text-gray-500">Hạn dùng: {dm(claimed.valid_to)}</p>
              )}
            </div>

            {/* CTA chính: mẹ đặt luôn thay vì chờ nhân viên gọi lại. SĐT mang sang giỏ hàng để
                `StoreVoucherBox` tự hiện đúng ưu đãi này — mẹ không phải nhớ hay gõ lại mã. */}
            <button
              className="mt-4 w-full rounded-xl bg-primary py-4 text-base font-bold text-white shadow-md shadow-primary-20 active:bg-primary-60"
              type="button"
              onClick={goOrder}>
              Đặt hàng giao tận nhà ngay
            </button>

            <button
              className="mt-3 w-full rounded-xl border border-primary-30 py-3 text-sm font-semibold text-primary active:bg-primary-5"
              type="button"
              onClick={copyCode}>
              {copied ? 'Đã sao chép mã' : 'Sao chép mã'}
            </button>

            <p className="mt-4 text-sm leading-relaxed text-gray-600">
              Mẹ chụp lại màn hình này để dùng sau cũng được. Nhân viên Lamin sẽ liên hệ để hướng dẫn mẹ
              dùng ưu đãi.
            </p>
          </div>
        </Card>
      </Shell>
    );
  }

  const closed = info.closed_reason;

  return (
    <Shell>
      <div className="mb-5 text-center">
        <h1 className="text-xl font-extrabold text-primary">
          {info.offer_name || 'Ưu đãi dành cho mẹ'}
        </h1>
        <p className="mt-1 text-sm text-gray-600">{info.campaign_name}</p>
        {info.branch_name && <p className="text-xs text-gray-500">{info.branch_name}</p>}
      </div>

      <Card>
        {closed ? (
          // Nói TRƯỚC khi mẹ điền. Để mẹ gõ xong số điện thoại rồi mới báo hết lượt là cách chắc chắn nhất
          // để mẹ bực và nhân viên phải đứng ra giải thích.
          <div className="py-6 text-center">
            <div className="text-4xl">😔</div>
            <h2 className="mt-3 font-bold text-gray-900">Rất tiếc</h2>
            <p className="mt-2 text-sm leading-relaxed text-gray-600">{closed}</p>
            <p className="mt-3 text-sm text-gray-600">Mẹ hỏi nhân viên Lamin tại sự kiện để được hỗ trợ nhé.</p>
          </div>
        ) : (
          <>
            {info.offer_note && (
              <p className="mb-4 rounded-lg bg-primary-5 p-3 text-sm leading-relaxed text-gray-700">
                {info.offer_note}
              </p>
            )}

            <label className="block text-sm font-semibold text-gray-800" htmlFor="phone">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            {/* inputMode/autoComplete để điện thoại bật thẳng bàn phím số và gợi ý số của chính máy —
                bớt được vài giây và vài lỗi gõ, thứ đáng giá khi mẹ đang đứng xếp hàng. */}
            <input
              autoComplete="tel"
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary-20"
              id="phone"
              inputMode="numeric"
              placeholder="09xx xxx xxx"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <label className="mt-4 block text-sm font-semibold text-gray-800" htmlFor="name">
              Tên của mẹ <span className="text-red-500">*</span>
            </label>
            <input
              autoComplete="name"
              className="mt-1 w-full rounded-xl border border-gray-300 px-4 py-3 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary-20"
              id="name"
              placeholder="Nguyễn Thị An"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            {/* NGHỊ ĐỊNH 13/2023 — ô này bắt buộc, và câu chữ phải nói rõ dùng để làm gì. Không mặc định
                tích sẵn: đồng ý phải là một hành động của mẹ, không phải thứ mẹ quên bỏ tích. */}
            <label className="mt-5 flex cursor-pointer items-start gap-3">
              <input
                checked={consent}
                className="mt-0.5 size-5 shrink-0 accent-primary"
                type="checkbox"
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span className="text-sm leading-relaxed text-gray-600">
                Mẹ đồng ý để Lamin lưu số điện thoại và tên nhằm liên hệ tư vấn và gửi ưu đãi. Mẹ có thể yêu
                cầu ngừng liên hệ bất cứ lúc nào.
              </span>
            </label>

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
              {submitting ? 'Đang gửi…' : 'Nhận ưu đãi'}
            </button>

            {info.valid_to && (
              <p className="mt-3 text-center text-xs text-gray-500">
                Ưu đãi có hạn đến {dm(info.valid_to)}
              </p>
            )}
          </>
        )}
      </Card>

      <p className="mt-6 text-center text-xs text-gray-400">Lamin — Dựng tầm vóc Việt</p>
    </Shell>
  );
}
