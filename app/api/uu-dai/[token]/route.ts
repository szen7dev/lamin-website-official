import { NextResponse } from 'next/server';

// CẦU NỐI sang s7-data-hub cho trang "quét QR nhận ưu đãi" tại sự kiện đo chiều cao ở trường học.
//
// Vì sao đi vòng qua server thay vì cho trình duyệt gọi thẳng s7-data-hub:
//  1. **CORS** — s7-data-hub không mở CORS cho lamin.com.vn, và mở thì phải mở cho một tên miền công khai.
//  2. **Không lộ backend** — trang này ai cũng mở được; để địa chỉ hệ thống quản trị nội bộ nằm trong mã
//     nguồn phía trình duyệt là mời người ta đi dò.
//  3. **Giữ nguyên luật MỘT API CLIENT của repo** (`.claude/rules/one-api-client.md`): phía trình duyệt
//     vẫn chỉ có `apiClient` trỏ về một nơi; backend thứ hai chỉ tồn tại ở phía server.
//
// ⚠️ `S7_API_URL` KHÔNG có tiền tố `NEXT_PUBLIC_` — cố ý. Biến có tiền tố đó bị nướng cứng vào bundle lúc
// build và lộ ra trình duyệt (`.claude/rules/env-build-time.md`). Biến không tiền tố đọc lúc chạy, phía
// server, đúng thứ ta cần.
//
// ⚠️ Có GIÁ TRỊ MẶC ĐỊNH viết cứng, không phải vì lười cấu hình: `docs/findings.md` #2 ghi nhận CHƯA AI
// KIỂM CHỨNG được `.env.production` có sống sót vào ảnh `standalone` hay không (Dockerfile chỉ copy
// `standalone`, `static`, `public`). Nếu biến rỗng mà không có mặc định thì trang chết im lặng — đúng lúc
// mẹ đang đứng quét mã giữa sân trường, và không ai biết cho tới khi sự kiện kết thúc.
const S7_API_URL = (process.env.S7_API_URL || 'https://app.szen7.com').replace(/\/$/, '');
const base = (token: string) => `${S7_API_URL}/api/v1/public/uu-dai/${encodeURIComponent(token)}`;

// Sự kiện diễn ra trong ngày, số liệu đổi liên tục (hết lượt, hết hạn) → không được đệm.
export const dynamic = 'force-dynamic';

// Chuyển tiếp NGUYÊN VẸN cả body lẫn mã trạng thái của s7-data-hub. Không dịch lại, không gộp lỗi: phía
// client đọc `error.code` để hiện đúng câu (hết lượt · chưa đồng ý · sai số điện thoại), nuốt mất mã là
// mẹ chỉ còn nhìn thấy "có lỗi xảy ra".
async function forward(res: Response) {
  const text = await res.text();
  try {
    return NextResponse.json(JSON.parse(text), { status: res.status });
  } catch {
    // s7-data-hub trả thứ không phải JSON (proxy chen vào, backend sập) — đừng để nó vỡ thành lỗi parse
    // khó hiểu ở client.
    return NextResponse.json(
      { error: { code: 'upstream_error', message: 'Hệ thống đang bận, vui lòng thử lại sau ít phút.' } },
      { status: res.status >= 400 ? res.status : 502 },
    );
  }
}

const unreachable = () =>
  NextResponse.json(
    { error: { code: 'upstream_unreachable', message: 'Không kết nối được hệ thống, vui lòng thử lại.' } },
    { status: 502 },
  );

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  try {
    return forward(await fetch(base(token), { cache: 'no-store' }));
  } catch (e) {
    console.error('[uu-dai] GET upstream failed:', e);

    return unreachable();
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: 'bad_request', message: 'Dữ liệu gửi lên không hợp lệ.' } },
      { status: 400 },
    );
  }
  try {
    return forward(
      await fetch(base(token), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store',
      }),
    );
  } catch (e) {
    console.error('[uu-dai] POST upstream failed:', e);

    return unreachable();
  }
}
