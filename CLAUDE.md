# Lamin Website — Project Context

> This file is the primary context for Claude Code. **Read it before doing any work in this repo.**
> Structure/technical sections are written in **English** so they stay precise and portable; the
> owner-facing standing rules are kept in **Vietnamese** because that is how the owner works.
>
> Every factual claim below was verified against the code on **2026-08-16** (commit `18e7367`).
> Where something is *not* verified, it says so explicitly. Do not upgrade a "chưa kiểm chứng" into a
> fact without running the check yourself.

---

## ⭐ THIS repo is what runs lamin.com.vn — the other one is not

There are **two Lamin website repos** and they are easy to confuse. Production runs from this one.

| Repo | Role | Next | Tailwind | Deployed? |
|------|------|------|----------|-----------|
| `szen7dev/lamin-website-official` **← this repo** | **The live site** | 16.0.10 | **v4**.1.16 | ✅ `lamin.com.vn` |
| `szen7dev/lamin-website-branding` | Older fork; branding/UI work | 16.0.1 | v3.4.17 | ❌ not deployed |

**Proof (re-runnable):** the k8s app manifest pins image tag `main-28233504772-18e7367`; commit `18e7367`
resolves in this repo (`git cat-file -t 18e7367` → `commit`) and **fails** in `lamin-website-branding`.

Consequences you must respect:
- A fix that must reach production goes **here**. Landing it only in `branding` ships nothing.
- The two repos have **diverged** (Tailwind v3 vs v4, different `.env` layout, different OpenAI wiring).
  Never copy a file between them without reading both sides first.
- `lamin-website-branding` carries a `CLAUDE.md` describing **Tailwind v3 + Next 15 + `middleware.ts`**.
  That file is wrong for this repo. This file supersedes it.

Local paths on the owner's machine: `D:\szen7\lamin-website-official` · `D:\szen7\lamin-website-branding` ·
`D:\szen7\trixgo-kubenetes-prod` (GitOps).

---

## ⭐ Xưng hô: "mình – bạn", nói thẳng, bỏ khách sáo

Trả lời bằng **tiếng Việt**, tự xưng **"mình"**, gọi chủ dự án là **"bạn"** — không dùng "em – anh". Bỏ rào
đón, xin lỗi thừa, khen lấy lòng, nói vòng để tránh mất lòng: **sai thì nói sai, hỏng thì nói hỏng, không
biết thì nói không biết**. Nhưng mọi kết luận vẫn phải **kèm bằng chứng** (đoạn mã + số dòng · kết quả chạy
thật · số đo), và vẫn giải thích đủ cho người không đọc mã nguồn.

Chi tiết: [`.claude/rules/tone-vietnamese.md`](.claude/rules/tone-vietnamese.md).

## ⭐ NHẬN VIỆC → PHÂN TÍCH → TÓM TẮT → ĐỀ XUẤT → CHỦ DỰ ÁN GẬT → MỚI LÀM

**Áp dụng cho MỌI việc được giao.** Bắt tay sửa code ngay khi vừa nhận yêu cầu là sai quy trình, kể cả khi
phương án chọn đúng.

1. **PHÂN TÍCH** — đọc mã nguồn / cấu hình / bản build thật. Kiểm chứng được thì kiểm.
2. **TÓM TẮT** — nói lại bằng ngôn ngữ nghiệp vụ, không thuật ngữ: việc này thực chất là gì · hiện trạng ra
   sao · làm xong thì **người dùng thấy gì khác**.
3. **ĐỀ XUẤT** — 2–3 phương án kèm đánh đổi thật, **và nói rõ nên chọn cái nào, vì sao**. Kèm: cái gì bị
   đụng **ngoài phạm vi yêu cầu**.
4. **CHỜ GẬT** rồi mới sửa file đầu tiên.

Ngoại lệ (làm ngay, vẫn phải tóm tắt kết quả): việc một bước không phá được gì · yêu cầu đã chi tiết tới mức
không còn phương án nào để chọn · đang chữa cháy prod · chủ dự án bảo "cứ làm đi" cho **đúng việc đó**.

Việc từ 3 bước trở lên → **hiện checklist tick dần**, một mục = một kết quả kiểm chứng được
([`.claude/rules/task-checklist.md`](.claude/rules/task-checklist.md)).

---

## 1. What this is

**Lamin** — a Vietnamese e-commerce site for health & nutrition products (chiều cao / dinh dưỡng), plus
health tools: height measurement (standard + CDC charts), nutrition-habit check, seller-side customer
height tracking, and a "Quỹ Vietnam Grow" charity-event section.

It is a **frontend only**. There is no backend in this repo — every piece of data comes from an external
REST API over HTTP. See §3.

## 2. Stack & commands

| | |
|---|---|
| Framework | **Next.js 16.0.10**, App Router, `output: 'standalone'` |
| React | 19.2.0 |
| Styling | **Tailwind CSS v4.1.16** via `@tailwindcss/postcss` — config lives in CSS, not in a JS file |
| UI kit | shadcn/ui + Radix primitives (`components/ui/`, 57 files) |
| Data | axios + `@tanstack/react-query` |
| Package manager | **yarn 1.22.22** (`packageManager` field) · Node 22 |

```bash
yarn dev       # next dev --turbopack   → http://localhost:3000, API = api.szen7.com (from .env)
yarn build     # next build (standalone) → API = api.trixgo.com (from .env.production)
yarn start     # serve the production build
yarn lint      # eslint . --ext .ts,.tsx -c .eslintrc.json --fix
yarn analyze   # ANALYZE=true next build && next start
```

⚠️ `next.config.mjs:7` sets `typescript.ignoreBuildErrors: true`. **A green build proves nothing about
types.** There is also **no test suite**. Verification here means running the feature in a browser —
see [`.claude/rules/verify-in-browser.md`](.claude/rules/verify-in-browser.md).

## 3. API integration — the single most important thing to understand

**One axios instance serves the whole app**: `services/api/apiClient.ts`. Roughly 60 modules import it,
directly or re-exported through `services/index.ts`. There is **no** `fetch()` to any other absolute host
(verified by grep). Endpoint families in use: `/api/crm`, `/api/item`, `/api/medias`, `/api/payment`,
`/api/store`.

Base URL comes from `process.env.NEXT_PUBLIC_API_URL` (`apiClient.ts:12`).

### 🔴 `NEXT_PUBLIC_*` is frozen at BUILD time — runtime env cannot change it

This is the trap that has already produced a live mismatch. Next inlines every `NEXT_PUBLIC_*` reference
into the emitted JavaScript as a **string literal**. Setting the variable on the running container does
nothing.

**Measured proof:** grepping the 425 JS files under `.next` for the API host found `api.szen7.com` hard-baked
into **8 chunk files** (that value came from `.env`, the build-time file) while `api.trixgo.com` and
`api.lamin.com.vn` appeared in **0**.

Which file wins depends on the command, per Next's env precedence:

| Command | env file loaded | resulting API host |
|---|---|---|
| `yarn dev` | `.env` (no `.env.local` / `.env.development` in repo) | `https://api.szen7.com` |
| `yarn build` / `yarn start` / Docker image | `.env.production` (beats `.env`) | `https://api.trixgo.com` |

`.env` also carries a commented line `# NEXT_PUBLIC_API_URL=http://localhost:3003` — the local backend port.

**Live consequence:** `apps/prod/trixgo-lamin-webapp/values.yaml` sets `NEXT_PUBLIC_API_URL=https://api.lamin.com.vn`
as a pod env var. It has **no effect**. Production browsers call `api.trixgo.com`. Whether that is intended
is **an open question for the owner** — see [`docs/findings.md`](docs/findings.md) #1.

Full rule: [`.claude/rules/env-build-time.md`](.claude/rules/env-build-time.md) ·
Full analysis: [`docs/config-env.md`](docs/config-env.md).

### Mock mode

`config/apiConfig.ts` reads `NEXT_PUBLIC_API_MODE` (default `'mock'`). `isMockApi()` switches **5 feature
factories** — `product`, `menu`, `order`, `user`, `nutrition-check` — between a mock service and the real
one. The value is `mock` in `.env`, in `.env.production`, in `.gitlab-ci.yml`, and in the k8s values. Treat
"is this intended on production?" as unresolved ([`docs/findings.md`](docs/findings.md) #4).

### Dead code you will trip over

`services/api.ts` is a **second, unused** axios client. It calls `getEnv('API_URL')` — a variable with no
`NEXT_PUBLIC_` prefix that is defined nowhere in the repo, and `getEnv` throws when a key is missing. Nothing
imports it (grep for `from '@/services/api'` → 0 hits), which is the only reason it has never blown up.
**Do not import it. Do not "fix" it by wiring it up.** See
[`.claude/rules/one-api-client.md`](.claude/rules/one-api-client.md).

## 4. Routing — Vietnamese URLs are canonical

`proxy.ts` (288 lines) is the Next 16 replacement for `middleware.ts` — **the file was renamed in Next 16**;
if you look for `middleware.ts` you will not find it.

The scheme: **Vietnamese URLs are what users and SEO see; English paths are the internal route folders.**

- 26 static **redirects** EN → VI (`/height-measurement` → `/do-cao`)
- 26 static **rewrites** VI → EN (`/do-cao` → `/height-measurement`)
- plus dynamic pairs for `article`, `product`, `category`, `article-tags`, `store-locations`,
  `coach-experts`, `search`, `for-seller`, `height-measure-history`
- security headers set on the fall-through response (`X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Permissions-Policy`)
- matcher skips `api`, `_next/static`, `_next/image`, `favicon.ico`

**Adding a Vietnamese route means editing BOTH maps** — one entry alone half-breaks the page. Rule:
[`.claude/rules/vietnamese-urls.md`](.claude/rules/vietnamese-urls.md).

⚠️ **The auth guard in `proxy.ts` is mostly unreachable** (`proxy.ts:260-267`). It tests
`pathname.startsWith('/(protected)')` — a **route-group** name that never appears in a real URL, so that
half is always false — and the `/account` half is reached only by paths that did not already `return` from
an earlier redirect/rewrite branch. Practical protection today comes from `AuthContext` on the client and
`401` handling in the API layer. Documented in [`docs/findings.md`](docs/findings.md) #5.

## 5. Repo layout

| Path | What |
|------|------|
| `app/` | App Router pages. Groups: `(public)`, `(protected)`, `auth/`, `seller/`, `admin/`, `api/ai/laminGPT/` |
| `features/` | **22 feature modules** — the bulk of the app (`product`, `homepage`, `menu`, `article`, `cart`, `checkout`, `seller`, `height-measurement`, `vng-event`, …). Each holds its own components/hooks/api/services/types |
| `components/` | Shared UI: `ui/` (57 shadcn primitives), `layout/`, `auth/`, `chat/`, `modal/`, `seo/`, `icons/` |
| `services/` | `api/apiClient.ts` (the real client) · `auth/` · `item/` · `api.ts` (**dead**) |
| `contexts/` | `AuthContext`, `OrderContext`, `ContactContext`, `TabContext` |
| `hooks/`, `utils/`, `config/`, `types/`, `data/`, `lib/` | Cross-cutting helpers. `utils/ai/openai-service.ts` is **server-side only** |
| `proxy.ts` | Route translation + security headers (was `middleware.ts` pre-Next-16) |
| `docs/` | Living documentation — see §7 |
| `.claude/rules/` | Enforceable project rules, one concern per file |

Path alias: `@/*` → repo root. All imports use it.

`tailwind.config.js.backup` is a **leftover from the v3→v4 migration**. It is not loaded by anything. Do not
edit it expecting a styling change ([`.claude/rules/tailwind-v4.md`](.claude/rules/tailwind-v4.md)).

## 6. Build & deploy chain (GitOps — nothing deploys from a laptop)

```
push to main / staging
  └─ .github/workflows/trigger.yml          (this repo — just a curl)
       └─ szen7dev/trixgo-builds  website.yml → build-docker.yml
            · checks out this repo at the pushed SHA
            · plain `docker build` — NO build-args, NO env injection
            · pushes ghcr.io/szen7dev/lamin-website:<branch>-<run_id>-<sha7>
                 └─ szen7dev/trixgo-kubenetes-prod
                      apps/prod/trixgo-lamin-webapp/{Chart,values}.yaml
                      + .argocd-source-*.yaml  (image tag pinned here)
                           └─ ArgoCD syncs → cluster prod-trixgo-01
```

Because the builder injects nothing, `Dockerfile:24,32` (`COPY . .` then `yarn build`) makes Next read the
**committed** `.env.production`. That is the whole reason §3's mismatch exists.

Runtime: `EXPOSE 3000`, `PORT=3000`, `HOSTNAME=0.0.0.0`, non-root user `nextjs`. Ingress: nginx →
`lamin.com.vn` + `www.lamin.com.vn`, TLS via cert-manager `letsencrypt-prod`. HPA 2–6 pods, 100m–500m CPU,
512Mi–2Gi RAM.

A **second, apparently legacy** pipeline also exists: `.gitlab-ci.yml` writes its own `.env.production`
(with `dntdurzwr12tp.cloudfront.net` instead of the DigitalOcean CDN) and builds via a GitLab template.
Which pipeline is authoritative is **not settled** — the evidence points to GitHub→ghcr→ArgoCD.
See [`docs/deploy.md`](docs/deploy.md).

## 7. Documentation map

| Doc | What it holds |
|-----|---------------|
| [`docs/architecture.md`](docs/architecture.md) | How the app is put together: routing, features, state, API layer |
| [`docs/config-env.md`](docs/config-env.md) | **Every env variable, where it comes from, which ones are dead** + the build-time proof |
| [`docs/deploy.md`](docs/deploy.md) | The full build→ghcr→ArgoCD chain, k8s values, how to verify a release |
| [`docs/findings.md`](docs/findings.md) | **Open issues found by audit, with evidence and severity.** Read before saying "prod is fine" |
| [`docs/progress.md`](docs/progress.md) | Living status: what is done, in progress, next |
| [`docs/history.md`](docs/history.md) | Dated log of what each session changed |
| `docs/DEV_GUIDE.md` | Pre-existing onboarding guide (Vietnamese). Useful, but predates Tailwind v4 + Next 16 — trust this CLAUDE.md where they disagree |
| `docs/STATE_MANAGEMENT_CHOICES.md` | Pre-existing rationale for Context vs React Query vs local state |

## 8. Conventions

- **Imports** use `@/*`, never deep relative chains.
- **ESLint** (`.eslintrc.json`) enforces import ordering with blank lines between groups
  (type → builtin → external → internal), JSX prop sorting (reserved first, callbacks last, alphabetical),
  padding lines before `return` and after variable declarations, and auto-removes unused imports.
  React 19 style — no `import React` needed in JSX files.
- **New feature** → `features/<name>/` with its own `components/`, `hooks/`, `api/`, `types`, exported from
  an `index.ts`; page under the right `app/` group; **both** proxy maps updated if it gets a Vietnamese URL.
- **Never commit a secret.** Several are already committed — that is a defect being tracked, not a
  precedent ([`.claude/rules/secrets.md`](.claude/rules/secrets.md)).
- **Images** must come from a host whitelisted in `next.config.mjs` `images.remotePatterns`, otherwise
  `next/image` throws at runtime. Adding a CDN means adding it there.

## 9. Rules index

Short, citable constraints live in [`.claude/rules/`](.claude/rules/) — one concern per file. The ones that
have already cost real time:

| Rule | Why it exists |
|------|---------------|
| `env-build-time.md` | `NEXT_PUBLIC_*` is baked at build; k8s runtime env silently does nothing |
| `one-api-client.md` | Two axios clients exist; one is dead and throws if imported |
| `vietnamese-urls.md` | A route needs entries in **both** proxy maps |
| `secrets.md` | Live API keys + JWTs are committed in three files |
| `tailwind-v4.md` | v4 config is in CSS; `tailwind.config.js.backup` is inert |
| `verify-in-browser.md` | Builds ignore type errors and there are no tests |
| `deploy-gitops.md` | Image tag is pinned in the GitOps repo; pushing code is not deploying |
| `repo-identity.md` | Prod ships from `official`, not `branding` |
| `mock-mode.md` | 5 feature factories silently serve mock data |
| `propose-before-build.md` · `tone-vietnamese.md` · `task-checklist.md` | Owner's standing working rules |

Full list + one-liners: [`.claude/rules/README.md`](.claude/rules/README.md).
