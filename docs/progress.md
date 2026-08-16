# Progress — living status

What exists, what is open, what is next. Update this file whenever behavior or scope changes, and append a
dated line to [`history.md`](history.md).

Last updated: **2026-08-16**.

## Where the project stands

The site is **live in production** at `lamin.com.vn`, serving from commit `18e7367`
(image `ghcr.io/szen7dev/lamin-website:main-28233504772-18e7367`). 22 feature modules, 506 source files.
Recent platform work already landed: **Next 15 → 16** (which renamed `middleware.ts` → `proxy.ts`),
**Tailwind v3 → v4**, and moving the **OpenAI key server-side**.

## Done

- [x] Next.js 16.0.10 + React 19.2.0 App Router, standalone output
- [x] Tailwind v4 migration — tokens in `styles/globals.css` `@theme`
- [x] Bilingual routing — 26 redirect + 26 rewrite pairs + 9 dynamic pairs in `proxy.ts`
- [x] Single API client (`services/api/apiClient.ts`) used by ~60 modules
- [x] OpenAI assistant moved server-side (`app/api/ai/laminGPT` + `utils/ai/openai-service.ts`)
- [x] GitOps deploy — GitHub → `trixgo-builds` → ghcr → ArgoCD Image Updater → cluster `prod-trixgo-01`
- [x] Project context for Claude Code — `CLAUDE.md`, `.claude/rules/`, this `docs/` set (2026-08-16)

## Open — needs an owner decision

Nothing below has been changed. Each is detailed with evidence in [`findings.md`](findings.md).

- [ ] **#1 🔴 API host mismatch.** Production browsers call `api.trixgo.com`; the k8s manifest says
      `api.lamin.com.vn`. Which is correct? The fix path differs completely depending on the answer.
- [ ] **#2 🔴 `OPENAI_API_KEY` at runtime.** Set in `.env.production`, absent from `values.yaml`. Unverified
      whether the pod has it — if not, the floating chat is dead on production. Needs a `kubectl` check.
- [ ] **#3 🟠 Committed credentials.** Two OpenAI keys + two JWTs across `.env`, `.env.production`,
      `.gitlab-ci.yml`, plus a plaintext JWT in the GitOps repo. Rotation is the owner's call.
- [ ] **#4 🟠 Mock mode on production.** Five feature factories serve mock data. Intended or not?
- [ ] **#6 🟡 Two build pipelines.** Decide whether `.gitlab-ci.yml` is legacy (delete) or real (document).

## Next — safe to do without a decision

- [ ] **#5** Fix the unreachable auth guard in `proxy.ts:260-267` (`/(protected)` is a route group, never a
      URL segment).
- [ ] **#9** Point `app/sitemap.ts` at the canonical Vietnamese URLs instead of the English ones that
      redirect.
- [ ] **#7 / #8 / #10** Remove dead weight: `NEXT_PUBLIC_IMAGE_PREFIX`, `NEXT_PUBLIC_ENVIRONMENT`,
      `NEXT_PUBLIC_OPENAI_API_KEY`, `services/api.ts`, `tailwind.config.js.backup`. Each in its own commit
      so the intent is legible.
- [ ] **#11** Add a minimal test setup — even a smoke test that renders the homepage would beat the current
      zero, given the build ignores type errors.
- [ ] Add a root `README.md` (the repo has none).
- [ ] Replace ImageUpdater `updateStrategy: alphabetical` with `newest-build` before GitHub run ids gain a
      digit ([`deploy.md`](deploy.md) §Known fragilities).

## Not started

- [ ] Choosing a runtime-config strategy — the three options are laid out in [`deploy.md`](deploy.md)
      §"Making runtime env actually work". Needed before this app can run one image across environments.
- [ ] Reconciling with `lamin-website-branding` — the fork has diverged (Tailwind v3, Next 16.0.1,
      client-side OpenAI). Decide whether it merges back or is retired.
