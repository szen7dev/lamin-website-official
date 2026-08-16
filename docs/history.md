# History

Dated log of what each session changed. Newest first. Append a line whenever you change behavior, config,
or documentation — this is what keeps the project continuable without AI.

Format: `## YYYY-MM-DD HH:MM — <what>` then what changed, and what was verified (or explicitly not).

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
