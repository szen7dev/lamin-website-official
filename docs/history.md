# History

Dated log of what each session changed. Newest first. Append a line whenever you change behavior, config,
or documentation — this is what keeps the project continuable without AI.

Format: `## YYYY-MM-DD HH:MM — <what>` then what changed, and what was verified (or explicitly not).

---

## 2026-08-22 — Bài viết (tính năng #4) lên s7 + phát hiện và vá backdoor chuỗi cung ứng

Chi tiết đầy đủ: `docs/chuyen-ve-s7.md` §10-11 (đọc trước khi làm tiếp).

**Bài viết:** `storeArticles.ts` + cầu nối `/api/cua-hang/bai-viet[/:slug]` + đổi nguồn
`getArticleList`/`getArticleDetail`/`getHealthNews`/`article/[slug]/page.tsx` sang s7-data-hub, tự rơi về
`api.trixgo.com` khi chưa cấu hình. Kèm sửa `apiClient.buildMediaUrl` (ảnh URL tuyệt đối từ s7 bị ghép đôi
gốc CDN). Đã build tay + deploy: `trixgo-lamin-webapp` chạy `main-32561080441-c7db50f`. Kho bài cũ thật có
**31 bài** (không phải 3 như đếm lần đầu) — đã nhập đủ vào DB dev local, **CHƯA nhập vào production**
(script + dữ liệu đã có sẵn ở `s7-data-hub/scripts/import-lamin-posts.js`, xem runbook ở §10).

**Sự cố an ninh:** phát hiện `package.json` mang dependency tự trỏ về chính nó (`"elela": "file:"`) +
`postcss.config.js` bị chèn backdoor tải-mã-từ-xa-rồi-chạy, đưa vào bởi commit `20f98d0` (19/08). Đã vá ở
commit `c7db50f`. **Khoá SSH/k8s/GitHub trên máy bị ảnh hưởng chưa đổi; 7 nhánh cũ vẫn nhiễm** — §11 ghi
đủ chi tiết + danh sách.

---

## 2026-08-16 — Trang nhận ưu đãi qua mã QR tại sự kiện (`/uu-dai/[token]`)

Branch `feat/qr-uu-dai`. Phần khách của một tính năng trải ba repo — backend + màn quản trị đã xong ở
nhánh `wt/qr-uu-dai` bên `s7-data-hub` và `s7-hub-webapp`.

**Bối cảnh:** công ty đi đo chiều cao cho trẻ tại trường học, trong trường **không được bán hàng**. Mẹ quét
mã QR dán ở bàn đo → điền số điện thoại + tên → nhận mã voucher "Mua 2 tặng 1"; đội sale gọi lại sau.

**Đã thêm:**

- `app/uu-dai/[token]/page.tsx` + `client.tsx` — trang khách, mobile-first, `robots: noindex`.
- `app/api/uu-dai/[token]/route.ts` — cầu nối server-side sang s7-data-hub (GET + POST).
- `S7_API_URL` trong `.env` và `.env.production`.

**Ba quyết định thiết kế:**

1. **Đặt NGOÀI route group `(public)`** — `(public)` bọc `PublicLayout` (header + mega menu + giỏ hàng +
   footer). Người dùng là phụ huynh đang xếp hàng giữa sân trường, mở bằng 4G, chỉ có một việc cần làm.
2. **KHÔNG khai trong `proxy.ts`** — `/uu-dai/...` vốn đã là tiếng Việt, không có gì để dịch. Luật hai
   chiều ở `.claude/rules/vietnamese-urls.md` áp cho trang có thư mục tên tiếng Anh. Rơi xuống nhánh mặc
   định của proxy nên vẫn nhận đủ header bảo mật.
3. **Đi vòng qua route server thay vì gọi thẳng s7-data-hub từ trình duyệt** — tránh CORS, không lộ địa chỉ
   hệ thống quản trị, và giữ nguyên luật "một API client" ở phía client. `S7_API_URL` cố ý KHÔNG có tiền tố
   `NEXT_PUBLIC_`, kèm giá trị mặc định viết cứng vì finding #2 (chưa rõ `.env.production` có sống sót vào
   ảnh standalone không) — biến rỗng mà không có mặc định thì trang chết im lặng đúng lúc đang dùng thật.

**Đã kiểm chứng:**

- `yarn build` xanh (48s); `/uu-dai/[token]` và `/api/uu-dai/[token]` đều lên đúng dạng ƒ (dynamic).
- `grep "app.szen7.com" .next/static` → **0 file**: địa chỉ backend KHÔNG lọt vào bundle client, đúng như
  thiết kế server-only nhắm tới.
- `npx tsc --noEmit` → **0 lỗi trong file mới** (74 lỗi còn lại là có sẵn của repo, xem finding #11).

**KHÔNG kiểm chứng được — nói thẳng:**

- **Chưa chạy thử trên trình duyệt thật.** Cần một token sự kiện thật do s7-data-hub cấp, mà backend đang
  nằm ở nhánh chưa merge.
- **Không lint được.** `yarn lint` hỏng hoàn toàn (finding #12 mới) — cả script lẫn flat config đều lỗi,
  nên không có công cụ nào soi code mới.

**Phát hiện mới:** finding #12 (`yarn lint` hỏng), và số đo cụ thể cho #11 (74 lỗi type có sẵn).

---

## 2026-08-16 — Project context set up (CLAUDE.md + rules + docs)

**Changed** — documentation only, no application code touched:

- `CLAUDE.md` — primary project context: repo identity, stack, API layer, routing, layout, deploy chain,
  conventions, rules index.
- `.claude/README.md`, `.claude/rules/` — 13 rule files: `env-build-time`, `repo-identity`,
  `one-api-client`, `vietnamese-urls`, `secrets`, `tailwind-v4`, `verify-in-browser`, `deploy-gitops`,
  `mock-mode`, `no-invented-facts`, `tone-vietnamese`, `propose-before-build`, `task-checklist`.
- `docs/architecture.md`, `docs/config-env.md`, `docs/deploy.md`, `docs/findings.md`, `docs/progress.md`,
  `docs/history.md` — new. Existing `DEV_GUIDE.md` and `STATE_MANAGEMENT_CHOICES.md` left untouched.

**Audit findings** (all recorded in `docs/findings.md`, none fixed):

- 🔴 Production calls `api.trixgo.com` while `values.yaml` declares `api.lamin.com.vn` — `NEXT_PUBLIC_*` is
  baked at build time and the builder passes no build-args.
- 🔴 `OPENAI_API_KEY` set in `.env.production` but not in `values.yaml`; unverified whether the pod has it.
- 🟠 Live OpenAI keys and JWTs committed in `.env`, `.env.production`, `.gitlab-ci.yml`.
- 🟠 `NEXT_PUBLIC_API_MODE=mock` in every environment including production; 5 feature factories affected.
- 🟠 `proxy.ts` auth guard tests `/(protected)`, a route group that never appears in a URL — unreachable.
- 🟡 Two build pipelines (GitHub→ghcr live, GitLab likely legacy); 3 dead env vars; dead `services/api.ts`;
  sitemap lists redirecting English URLs; inert `tailwind.config.js.backup`; no tests + build ignores types.

**Verified how:**

- Repo identity — `git cat-file -t 18e7367` resolves here, fails in `lamin-website-branding`; the SHA
  matches the image tag pinned in the GitOps repo.
- Build-time inlining — grep of 425 `.js` files under `.next`: `api.szen7.com` in 8 files,
  `api.trixgo.com` and `api.lamin.com.vn` in 0.
- Deploy chain — read `trigger.yml`, and `website.yml` + `build-docker.yml` from `szen7dev/trixgo-builds`
  (shallow-cloned to a temp dir to read them); confirmed no build-args.
- Auto-deploy — `clusters/prod-trixgo-01-apps/templates/imageupdater.yaml` in `trixgo-kubenetes-prod`
  contains an `applicationRef` for `prod-trixgo-01-trixgo-lamin-webapp` matching
  `^main-[0-9]+-[0-9a-zA-Z]+$`.
- Dead code / dead vars — grep across all `.ts`/`.tsx` outside `node_modules` and `.next`.

**Not verified:** whether `.env.production` survives into `.next/standalone` inside the running image
(decides finding #2); which repo `secrets.WEBSITE_CHECKOUT_REPOSITORY` points at (inferred from the SHA);
whether `.gitlab-ci.yml` ever runs.

---

## Before 2026-08-16 (reconstructed from git, not from a log)

No history file existed before this date. From `git log` and the state of the tree, the notable platform
work already landed:

- Next.js 15 → **16.0.10**, which renamed `middleware.ts` → `proxy.ts`
- Tailwind **v3 → v4** (`@tailwindcss/postcss`, `@theme` in `styles/globals.css`,
  `tailwind.config.js` retired to `.backup`)
- OpenAI moved from a browser-side `NEXT_PUBLIC_OPENAI_API_KEY` to a server-side `OPENAI_API_KEY`

Commit messages in this period are mostly `fix`, so they do not carry detail. Treat this section as
inference, not record.
