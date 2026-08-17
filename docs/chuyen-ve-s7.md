# Chuyển website Lamin về s7-data-hub

Tài liệu tiến trình. Ai tiếp nhận việc này đọc đây trước, không phải dò lại lịch sử git.

**Chốt của chủ dự án 2026-08-17:** bốn tính năng của lamin.com.vn chuyển dần từ `api.trixgo.com`
về `s7-data-hub`. Đây là hồ sơ ghi *đã làm tới đâu*, *vì sao làm thế*, và *cái gì đang chặn*.

---

## 1. Bốn tính năng và tình trạng

| # | Tính năng | Đang gọi | Bên s7 | Tình trạng |
|---|---|---|---|---|
| 1 | Giỏ hàng · đặt hàng | `/api/store/*` | `OrderIntake`, `PromoVoucher` | ✅ **xong** (BE + FE) |
| 2 | Danh sách sản phẩm | `/api/item/goods`, `/api/menu/*`, `/api/crm/combo` | `Product` | 🟡 **BE xong, FE chưa nối** |
| 3 | Đo cao CDC | `/api/crm/grow_track`, `/api/crm/survey_result` | — | ⬜ **s7 chưa có gì** |
| 4 | Bài viết | `/api/medias/*` | — | ⬜ **s7 chưa có gì** |

⚠️ **Đừng nhầm:** s7 có `src/models/measure.js` nhưng đó là **chỉ số OKR**, không phải số đo chiều cao
của bé. Đã kiểm: không model nào trong s7 lưu chiều cao/cân nặng. Tính năng #3 phải dựng mới.

**Thứ tự đã chốt:** #2 → #3 → #4. Lý do: #2 ngắn nhất (backend đã xong) và **nó gỡ nút thắt cho #1** —
xem mục 4.

---

## 2. Kiến trúc: vì sao có lớp cầu nối

Trình duyệt **không** gọi thẳng s7-data-hub. Mọi lời gọi đi qua route Next của chính website:

```
Trình duyệt → /api/cua-hang/*  (route Next, chạy phía server)  → s7-data-hub /api/v1/public/cua-hang/:token/*
```

Ba lý do, đều bắt buộc:

1. **CORS** — s7-data-hub không mở CORS cho lamin.com.vn, và mở thì phải mở cho một tên miền công khai.
2. **Không lộ backend** — trang này ai cũng mở được; để địa chỉ hệ thống quản trị nội bộ nằm trong mã
   nguồn phía trình duyệt là mời người ta đi dò.
3. **Giữ luật MỘT API CLIENT** (`.claude/rules/one-api-client.md`) — phía trình duyệt vẫn chỉ có
   `apiClient` trỏ về một nơi; backend thứ hai chỉ tồn tại ở phía server.

Đây đúng khuôn mẫu mà `app/api/uu-dai/[token]/route.ts` (trang quét QR nhận ưu đãi) đã chạy thật từ trước.

### Đường dẫn cố ý khác nhau

| Đường dẫn | Đi tới | Ghi chú |
|---|---|---|
| `/api/store/*` | `api.trixgo.com` (qua `apiClient`) | backend **cũ** |
| `/api/cua-hang/*` | s7-data-hub (qua cầu nối) | backend **mới** |

Không đặt trùng tên là có chủ ý: hai cái trỏ hai nơi, trùng tên thì sớm muộn có người đọc lướt rồi sửa
nhầm cái này tưởng cái kia.

### Biến môi trường

| Biến | Ở đâu | Ghi chú |
|---|---|---|
| `S7_API_URL` | `.env.production` + k8s `values.yaml` | có giá trị mặc định cứng trong mã (`https://app.szen7.com`) |
| `S7_STORE_TOKEN` | **chỉ** k8s `extraSecrets` | **không** có mặc định — thiếu thì trả `503 store_unconfigured` |

Cả hai **không** có tiền tố `NEXT_PUBLIC_`, cố ý: biến có tiền tố đó bị nướng cứng vào bundle lúc build và
lộ ra trình duyệt (`.claude/rules/env-build-time.md`). Với `S7_STORE_TOKEN` thì lộ nghĩa là ai cũng đặt
hàng được dưới danh nghĩa tổ chức mình.

Token `S7_STORE_TOKEN` cấp một lần bằng `POST /api/v1/store/token` trên s7 (app `sale_b2c`).
**Cấp lại là đổi cấu hình website**: token cũ chết ngay, phải cập nhật k8s rồi restart pod.

---

## 3. Đã làm — tính năng #1 (giỏ hàng · đặt hàng)

### Bên s7-data-hub

`src/routes/store_public.js` — hai router:

* **có auth** `/api/v1/store/token` — cấp / xem / thu hồi token gian hàng
* **công khai** `/api/v1/public/cua-hang/:token/…` — `san-pham` · `voucher` (GET theo SĐT, POST gõ mã tay)
  · `dat-hang`

Bốn quyết định thiết kế, kèm lý do:

1. **Một token cho cả gian hàng** (`TOKEN_KIND.STORE = 5`, `ref_id` = organization). Khác mã QR sự kiện
   vốn mỗi trường một token — ở đây token không mang thông tin quy nguồn, nó chỉ trả lời "đơn này thuộc
   tổ chức nào". Khách web không đăng nhập nên không còn cách nào khác.
2. **Không nhận giá / tổng tiền từ client.** Client gửi sản phẩm + số lượng, hết. Giá luôn tra lại từ
   `products.sale_price` phía server (`.claude/rules/money.md`). Nhận tổng tiền của trình duyệt nghĩa là
   ai sửa vài dòng JavaScript cũng mua được hàng giá 1đ. **Có test khoá lại.**
3. **Đơn vào hộp CHỜ DUYỆT**, không phải đơn hàng: `order_intakes` với `source = 2`, `status = 1`.
   `reporter_*` để trống → không ai hưởng hoa hồng cho đơn khách tự đặt.
4. **Voucher chỉ là Ý ĐỊNH**, không trừ tiền và **không** đánh dấu grant đã dùng — đơn có thể bị từ chối,
   đánh dấu sớm là làm mất voucher của khách. Giảm giá thật do `calc.syncOrderPromo` tính lúc lên đơn.
   Nhưng mã **hỏng** thì từ chối cả đơn, không lặng lẽ bỏ qua: khách đã nhìn thấy số tiền được giảm.

**24/24 test** trong `test/store-public.test.js`.

### Bên website

| Tệp | Vai trò |
|---|---|
| `lib/s7-store.ts` | `storeBase` · `forward` · `unreachable` · `notConfigured` dùng chung |
| `app/api/cua-hang/{san-pham,voucher,dat-hang}/route.ts` | cầu nối |
| `features/cart/api/storeVoucher.ts` | lấy voucher theo SĐT · kiểm mã gõ tay |
| `features/cart/components/StoreVoucherBox.tsx` | ô SĐT → danh sách ưu đãi + ô gõ mã |
| `features/cart/utils/storeCheckout.ts` | nhớ SĐT + ưu đãi giữa giỏ hàng ↔ thanh toán (`sessionStorage`) |
| `features/checkout/api/createStoreOrder.ts` | đặt hàng |

**Luồng voucher** (chốt của chủ dự án): khách nhập **SĐT trước** → hiện luôn ưu đãi đã cấp cho số đó (mã
nhận tại sự kiện đo chiều cao) → **cộng thêm** ô gõ mã tay cho mã công khai in trên tờ rơi.
Thứ tự đó không tuỳ hứng: phần lớn ưu đãi của Lamin được cấp cho một SĐT cụ thể, biết số là hiện được
luôn và khách không phải nhớ gì.

Thay cho nút mở `PromotionModal` **vốn đã bị comment out từ trước** — modal đó lấy voucher theo
`user.contacts[0]._id` nên chỉ chạy khi khách **đăng nhập**, mà phần lớn khách mua lẻ thì không.

**Hai thứ đã bỏ, có lý do:**

* Nhánh gọi cổng thanh toán — chuyển khoản đã bị tắt trong `paymentMethods.ts` từ trước, chỉ còn COD.
  Đơn chờ duyệt cũng không hợp với trả tiền trước khi chốt giá.
* Không mất dữ liệu khách đã gõ: email, khu vực, hình thức thanh toán, người nhận khác, ý định dùng
  điểm — gộp vào `note` vì đơn báo không có cột riêng cho chúng.

---

## 4. 🔴 Nút thắt hiện tại — đọc kỹ trước khi làm tiếp

**Luồng đặt hàng CHƯA chạy được với dữ liệu thật.** Không phải lỗi code.

Website gửi `product_id` là id của **trixgo**; id đó không tồn tại trong s7. Nên s7 trả
*"Sản phẩm không còn bán"* cho mọi đơn.

Đã thử ba đường thoát, cả ba đều tắc:

| Đường | Kết quả |
|---|---|
| Ghép theo `sign` (mã sản phẩm) | ❌ API trixgo **không trả** `sign` — đo 2026-08-17: **0/8** bản ghi |
| Tìm trường khoá khác | ❌ quét cả **56 trường** của `/api/item/goods`: không có `code`/`sku`/`barcode`/`ref` |
| Ghép theo tên | ❌ sản phẩm thật tên `"Sản phẩm khác (LaminGorw + LaminKid I)"` — **sai chính tả** `LaminGorw` |

`ProductDetail` trong repo *khai* `sign: string` — nhưng dữ liệu thật không trả về. **Type nói một đằng,
API làm một nẻo.** Đừng tin type ở đây.

**Cách giải đã chốt: chuyển hẳn danh mục sang s7** (tính năng #2). Khi đó id hai bên là một, hết chuyện
ánh xạ. Đó là lý do #2 phải làm trước #3 và #4.

Hạ tầng cho đường `sign` vẫn được giữ (`dat-hang` nhận `product_id` **hoặc** `sign`) — nó thành đường
chính xác nhất khi danh mục về chung một nguồn.

---

## 5. Đã làm — nền cho tính năng #2 (danh sách sản phẩm)

`Product` bên s7 nay mang được nội dung bán hàng:

| Trường | Quyết định |
|---|---|
| `on_web` | **mặc định false** — sổ sản phẩm có cả nguyên liệu, hàng nội bộ, hàng mẫu. Mặc định true là ngày bật tính năng cả kho đổ lên trang chủ |
| `images: [String]` | **danh sách URL**, không phải tệp tải lên — ảnh Lamin vốn đã trên CDN; dựng thêm đường tải + đường phục vụ ảnh công khai là hai bề mặt phải bảo trì cho việc đã có lời giải |
| `description` | cho phép HTML → **nơi hiển thị phải làm sạch trước khi render** |
| `slug` | rỗng thì web tự sinh từ tên; khai tay để giữ đường dẫn cũ khỏi gãy liên kết và mất thứ hạng tìm kiếm |

`GET /san-pham` và `POST /dat-hang` lọc **y hệt ba điều kiện**: có giá · không phải nhóm cha (`is_group`)
· `on_web`. Lỏng hơn ở đường đặt hàng là cách hàng nội bộ bị bán ra — có test khoá lại.

Chỗ khai: **s7-hub-webapp → Danh mục → Sản phẩm → khối "Bán trên website"**
(`src/components/ProductWebFields.tsx`).

### Còn lại của #2

* Nối UI website vào `/api/cua-hang/san-pham`
* Ánh xạ `{id,sign,name,unit,sale_price,images,description,slug}` của s7 sang kiểu của web
  (`price`, `originalPrice`, `category`, `slug`, `image`) — **hai bên không trùng tên trường nào**
* Trang chi tiết theo `slug`; danh mục/phân loại thì s7 chưa có khái niệm tương đương `category` của web

---

## 6. Cách chạy thử tại máy

```bash
# 1. s7-data-hub  (BE :3001 — dùng `npm run dev`, KHÔNG dùng `npm start`)
cd D:/szen7/s7-data-hub && npm run dev

# 2. cấp token gian hàng: POST /api/v1/store/token  (app sale_b2c)

# 3. website — .env.local (đã nằm trong .gitignore)
#    S7_API_URL=http://localhost:3001
#    S7_STORE_TOKEN=<token vừa cấp>
cd D:/szen7/lamin-website-official && npm run dev
```

Kiểm nhanh, không cần mở trình duyệt:

```bash
curl localhost:3000/api/cua-hang/san-pham
curl -X POST -H 'Content-Type: application/json' \
     -d '{"code":"GIAM10","subtotal":1000000}' localhost:3000/api/cua-hang/voucher
```

Chưa cấu hình token thì cả ba route trả `503 store_unconfigured` — hỏng to và rõ, không hỏng âm thầm.

---

## 7. Hai cái bẫy đã vấp, đừng vấp lại

**`checkPhone` coi số RỖNG là hợp lệ** (`{ ok: true, phone: null }`). Đúng cho danh bạ nói chung (khách
chỉ có Facebook), **sai chết người** ở đầu API công khai: `phone: null` lọt xuống truy vấn sẽ khớp trúng
mọi danh bạ **không có** số điện thoại và trả voucher của người lạ cho bất kỳ ai bỏ trống ô đó. Phải chặn
rỗng riêng trước khi hỏi `checkPhone`. Có test khoá.

**ESLint của repo website đang hỏng** — thiếu package `@eslint/compat`, `npx eslint` không chạy được.
Và typecheck: repo có sẵn ~70 lỗi type từ trước (`User.id`, `OrderProduct._id`, `CartItemsProps`…).
Khi kiểm, **so số lỗi trước/sau** thay đổi của mình, đừng kỳ vọng bảng sạch.

---

## 8. Việc treo (không thuộc phạm vi code)

* `S7_STORE_TOKEN` **chưa cấp** cho org Dược phẩm Lamin trên prod, và chưa thêm vào k8s `values.yaml`
* Chưa sản phẩm nào bật `on_web` → danh mục sẽ **rỗng** cho tới khi có người khai
* `OPENAI_API_KEY` **chưa xoay** — khoá cũ vẫn nằm trong lịch sử git (đã gỡ khỏi mã nguồn, chuyển sang
  k8s `extraSecrets`)
* Repo k8s `trixgo-kubenetes-prod` còn một thay đổi chưa push (thêm `OPENAI_API_KEY`/`ASSISTANT_ID`/
  `VECTOR_STORE_ID`/`S7_API_URL` vào `values.yaml`) — sửa luôn `findings.md #2`: pod nhiều khả năng
  **chưa bao giờ** nhận được các biến OpenAI, chat AI hỏng im lặng
* GitHub Actions của repo website từng bị chặn vì **billing** — build prod dispatch sang
  `szen7dev/trixgo-builds` (repo public, Actions miễn phí) nên có thể kích hoạt tay khi cần
