import { forward, hasStoreToken, jsonError, notConfigured, storeBase, unreachable } from '@/lib/s7-store';

// VOUCHER — hai đường, cố ý tách đôi vì chúng trả lời hai câu hỏi khác nhau:
//
//   GET  ?phone=&subtotal=   "số điện thoại này đã được cấp ưu đãi nào chưa?"  → khách khỏi phải nhớ mã
//   POST { code, subtotal }  "mã tôi đang cầm có dùng được không?"             → mã in trên tờ rơi/Facebook
//
// Luồng trên màn hình theo chốt của chủ dự án: khách nhập số điện thoại TRƯỚC, rồi mới hiện ô gõ mã tay
// cùng danh sách ưu đãi sẵn có của số đó.

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  if (!hasStoreToken()) return notConfigured();
  const { searchParams } = new URL(request.url);
  // Chỉ chuyển tiếp đúng hai tham số mình biết. Bê nguyên query của client sang backend là mở đường cho
  // người ta thêm tham số lạ để dò dữ liệu.
  const qs = new URLSearchParams({
    phone: searchParams.get('phone') || '',
    subtotal: searchParams.get('subtotal') || '0',
  });
  try {
    return forward(await fetch(storeBase(`/voucher?${qs}`), { cache: 'no-store' }));
  } catch (e) {
    return unreachable(e, 'GET /voucher');
  }
}

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
      await fetch(storeBase('/voucher'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store',
      }),
    );
  } catch (e) {
    return unreachable(e, 'POST /voucher');
  }
}
