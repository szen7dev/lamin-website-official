# Chuyển website Lamin về s7-data-hub

Tài liệu tiến trình. Ai tiếp nhận việc này đọc đây trước, không phải dò lại lịch sử git.

**Chốt của chủ dự án 2026-08-17:** bốn tính năng của lamin.com.vn chuyển dần từ `api.trixgo.com`
về `s7-data-hub`. Đây là hồ sơ ghi *đã làm tới đâu*, *vì sao làm thế*, và *cái gì đang chặn*.

---

## 1. Bốn tính năng và tình trạng

| # | Tính năng | Đang gọi | Bên s7 | Tình trạng |
|---|---|---|---|---|
| # | Tính năng | Đang gọi | Bên s7 | Tình trạng |
|---|---|---|---|---|
| 1 | Giỏ hàng · đặt hàng | `/api/store/*` | `OrderIntake`, `PromoVoucher` | ✅ **xong** (BE + FE) |
| 2 | Danh sách sản phẩm | `/api/item/goods` | `Product` | ✅ **xong** (BE + FE), đã vào `main` |
| 3 | Đo cao CDC | `/api/crm/grow_track`, `/api/crm/survey_result` | — | ⬜ **s7 chưa có gì** |
| 4 | Bài viết | `/api/medias/*` | — | ⬜ **s7 chưa có gì** |

**Combo** (`/api/crm/combo`, best-seller) và **menu** (`/api/menu/*`): chủ dự án chốt 2026-08-17 **không
dùng nữa**, giữ nguyên nguồn cũ, không chuyển và không dựng bên s7.

⚠️ **Đừng nhầm:** s7 có `src/models/measure.js` nhưng đó là **chỉ số OKR**, không phải số đo chiều cao
của bé. Đã kiểm: không model nào trong s7 lưu chiều cao/cân nặng. Tính năng #3 phải dựng mới.

**Thứ tự đã chốt:** #2 → #3 → #4. #2 đã xong; nó cũng **gỡ nút thắt cho #1** — xem mục 4.

### Bảy điểm đọc sản phẩm — tất cả đã chuyển

| Màn | Nguồn |
|---|---|
| Trang chủ — mục Sản phẩm (`useGetProducts`) | ✅ s7 |
| Chi tiết theo slug (`useGetGoodsInfoBySlug`) | ✅ s7 |
| Tất cả sản phẩm · tìm kiếm · `ProductList` · sản phẩm liên quan | ✅ s7 — **cùng một hook** `useGetGoodsList` |
| Thẻ SEO trang sản phẩm (`generateMetadata`) | ✅ s7 |

`features/product/services/productService.ts` vẫn trỏ về trixgo nhưng **không nơi nào import** — code
chết, để nguyên.

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

## 4. ✅ Nút thắt khoá nối sản phẩm — ĐÃ GỠ, giữ lại vì sao

> **Trạng thái:** đã giải bằng tính năng #2 (danh mục về chung một nguồn → id hai bên là một).
> Giữ mục này để người sau hiểu vì sao kiến trúc lại như hiện nay, và **đừng thử lại ba đường đã tắc**.

Trước khi chuyển danh mục, **luồng đặt hàng không chạy được với dữ liệu thật** — không phải lỗi code.

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

**Cách giải đã chốt và đã làm: chuyển hẳn danh mục sang s7** (tính năng #2). Id hai bên là một, hết
chuyện ánh xạ. Đó là lý do #2 phải làm trước #3 và #4.

Hạ tầng cho đường `sign` vẫn được giữ (`dat-hang` nhận `product_id` **hoặc** `sign`) — giờ `product_id`
là đường chính, `sign` là lưới an toàn cho giỏ hàng cũ còn nằm trong `localStorage` của khách (hạn 1
ngày) với id của backend cũ.

⚠️ **Hệ quả còn lại:** khách nào đang có giỏ hàng cũ sẽ thấy *"Sản phẩm không còn bán"* khi đặt, vì món
trong giỏ mang id trixgo. Tự hết sau 24 giờ kể từ khi bật. Nếu muốn êm hơn thì phải xoá giỏ hàng phía
khách lúc phát hiện món không hợp lệ — **chưa làm**.

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

### Phía website — cách nối

Toàn bộ chỗ dịch nằm ở **`features/product/api/storeCatalog.ts`**, đúng một chỗ. Nguyên tắc: **đổi NGUỒN,
giữ nguyên HÌNH DẠNG**. `Goods` và `Product` xuất hiện ở hàng chục màn — đổi kiểu là sửa từng màn một và
mỗi chỗ sửa là một chỗ có thể sai; giữ hình dạng thì giao diện không cần biết dữ liệu đến từ đâu.

Hai bên **không trùng tên trường nào**: s7 dùng `sale_price` / `images: string[]`, web dùng
`sellingUnitprice` / `images: FileInfo[]` + `thumbnail`.

Ba điều dễ làm sai, đã xử lý:

* **`listedUnitprice` = `sale_price`**, không phải 0. Giao diện lấy hiệu hai số ra "tiết kiệm được"; để 0
  là hiện số âm.
* **Lọc theo `categoryID`/`menuSlug` thì GIỮ NGUỒN CŨ.** s7 không có khái niệm danh mục để bày hàng
  (`parent_id` là cây danh mục nội bộ của sổ sản phẩm). Bỏ qua tham số rồi trả cả danh mục sẽ khiến trang
  "Danh mục X" hiện đủ mọi thứ — sai mà trông như đúng.
* **Thẻ SEO phải dùng hàm riêng.** `generateMetadata` chạy phía **server**, mà hàm client `fetch` đường
  dẫn tương đối — phía server không có gốc để nối, `fetch` sẽ ném lỗi. Dùng `fetchStoreProductsOnServer()`
  trong `lib/s7-store.ts`, gọi thẳng s7 (bỏ qua cầu nối — cầu nối tồn tại để phục vụ trình duyệt, mã chạy
  trên server thì vốn đã ở phía trong).

Lọc từ khoá làm ở **phía trình duyệt**: gian hàng trả tối đa 200 mặt hàng một lượt và danh mục Lamin nhỏ
hơn nhiều, nên tải một lần rồi lọc là đủ — mà lại tìm được ngay khi gõ. Khớp trên cả **tên và mã**: nhân
viên tư vấn qua điện thoại đọc mã, khách thì gõ tên.

---

## 5b. 🚦 THỨ TỰ BẬT TRÊN PROD — làm sai thứ tự là trang sản phẩm trống

Công tắc bật/tắt của cả đợt chuyển đổi **chính là việc có cấu hình `S7_STORE_TOKEN` hay không**. Ba trạng
thái:

| Trạng thái | Prod hiển thị |
|---|---|
| Chưa cấp `S7_STORE_TOKEN` | y như cũ — lấy từ `api.trixgo.com`. Không rủi ro |
| Cấp token **nhưng chưa bật `on_web`** | ⚠️ **danh sách RỖNG** — cố ý KHÔNG lùi về nguồn cũ |
| Cấp token **và** đã bật `on_web` | ✅ sản phẩm từ s7 |

Trạng thái giữa là chủ ý: danh mục rỗng nghĩa là chưa ai khai dữ liệu — một vấn đề cần **nhìn thấy**,
không nên che bằng cách lặng lẽ hiện hàng cũ. Nhưng nó cũng có nghĩa **phải khai trước khi bật**.

**Thứ tự đúng:**

1. **Bật `on_web`** + khai ảnh/mô tả cho sản phẩm Lamin thật — hub-webapp → Danh mục → Sản phẩm → khối
   "Bán trên website"
2. **Cấp token**: `POST /api/v1/store/token` trên s7 (app `sale_b2c`)
3. Thêm `S7_STORE_TOKEN` vào **k8s** `values.yaml` → `extraSecrets`, rồi push repo `trixgo-kubenetes-prod`
4. Build + deploy website

Đảo bước 1 và 2 thì có một khoảng trang sản phẩm trống.

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

## 7. Bốn cái bẫy đã vấp, đừng vấp lại

**🔴 Gỡ biến môi trường khỏi source làm VỠ BẢN BUILD.** Vấp 2026-08-17, suýt đưa lên prod.
`utils/ai/openai-service.ts` tạo `new OpenAI({ apiKey })` ở **tầng module** — hàm này **ném lỗi** khi khoá
rỗng. Next nạp module đó khi thu thập dữ liệu trang cho `/api/ai/laminGPT` **trong lúc build**, nên từ khi
`OPENAI_API_KEY` chuyển sang k8s (máy build không còn khoá) cả bản build đổ vỡ:

```
Error: Failed to collect page data for /api/ai/laminGPT
```

`main` đã ở trạng thái không build được suốt mấy commit mà **không ai biết**, vì GitHub Actions đang bị
chặn nên không ai build lại. Đã sửa bằng khởi tạo trễ (`openaiOf()`).

**Bài học chung:** biến môi trường chỉ có lúc chạy thì **mọi thứ dùng nó phải khởi tạo trễ**. Và **luôn
chạy `npm run build` trước khi đẩy lên `main`** — typecheck sạch không chứng minh được build chạy, vì lỗi
này xảy ra lúc *thực thi* module chứ không phải lúc kiểm kiểu.

**`checkPhone` coi số RỖNG là hợp lệ** (`{ ok: true, phone: null }`). Đúng cho danh bạ nói chung (khách
chỉ có Facebook), **sai chết người** ở đầu API công khai: `phone: null` lọt xuống truy vấn sẽ khớp trúng
mọi danh bạ **không có** số điện thoại và trả voucher của người lạ cho bất kỳ ai bỏ trống ô đó. Phải chặn
rỗng riêng trước khi hỏi `checkPhone`. Có test khoá.

**ESLint của repo website đang hỏng** — thiếu package `@eslint/compat`, `npx eslint` không chạy được.
Và typecheck: repo có sẵn ~70 lỗi type từ trước (`User.id`, `OrderProduct._id`, `CartItemsProps`…).
Khi kiểm, **so số lỗi trước/sau** thay đổi của mình, đừng kỳ vọng bảng sạch.

**Xoá worktree có thể xoá luôn `node_modules` gốc.** 2026-08-17 `s7-data-hub/node_modules` được tìm thấy
**rỗng hoàn toàn**; hai worktree của repo dùng **junction** trỏ vào đó, và xoá junction bằng `rm -rf` sẽ
xoá xuyên qua tới thư mục đích. Triệu chứng: BE `:3001` chết, và full test suite báo 193/231 fail với
`ERR_MODULE_NOT_FOUND` — **lỗi môi trường, không phải lỗi code**. Chữa: `npm ci` (3 giây từ cache).

---

## 8. Việc treo (không thuộc phạm vi code)

* `S7_STORE_TOKEN` **chưa cấp** cho org Dược phẩm Lamin trên prod, và chưa thêm vào k8s `values.yaml`
* Chưa sản phẩm nào bật `on_web` → danh mục sẽ **rỗng** cho tới khi có người khai
* `OPENAI_API_KEY` **chưa xoay** — khoá cũ vẫn nằm trong lịch sử git (đã gỡ khỏi mã nguồn, chuyển sang
  k8s `extraSecrets`)
* Repo k8s `trixgo-kubenetes-prod` còn một thay đổi chưa push (thêm `OPENAI_API_KEY`/`ASSISTANT_ID`/
  `VECTOR_STORE_ID`/`S7_API_URL` vào `values.yaml`) — sửa luôn `findings.md #2`: pod nhiều khả năng
  **chưa bao giờ** nhận được các biến OpenAI, chat AI hỏng im lặng
* GitHub Actions của repo website từng bị chặn vì **billing**, và tới 2026-08-17 thì `gh run list` trả
  **404** — có vẻ Actions đã tắt hẳn. Nghĩa là **push lên `main` không tự build/deploy nữa**. Build prod
  vẫn kích hoạt tay được vì nó dispatch sang `szen7dev/trixgo-builds` (repo **public**, Actions miễn phí):

  ```bash
  gh workflow run website.yml --repo szen7dev/trixgo-builds \
     -f REF=<sha đầy đủ> -f IMAGE_TAG=main-<run_id>-<sha7>
  ```

  Rồi cập nhật `webapp.image.tag` trong `trixgo-kubenetes-prod` →
  `apps/prod/trixgo-lamin-webapp/.argocd-source-*.yaml` để ArgoCD sync.

---

## 9. Nhật ký các mốc

| Ngày | Việc |
|---|---|
| 2026-08-17 | Tính năng #1 (giỏ hàng · voucher · đặt hàng) xong BE + FE |
| 2026-08-17 | `Product` bên s7 mang nội dung bán hàng; ô khai trong hub-webapp |
| 2026-08-17 | Tính năng #2 (danh sách sản phẩm) xong cả 7 điểm đọc, **đã merge vào `main`** |
| 2026-08-17 | Sửa bản build vỡ do `OPENAI_API_KEY` — xem bẫy đầu mục 7 |

**Nhánh liên quan** (đã push): `feat/store-product-sign` (s7-data-hub) · `feat/product-web-fields`
(s7-hub-webapp) · `feat/cua-hang-s7` (website, **đã merge `main`**).
