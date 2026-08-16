# Findings — open issues

Audit of 2026-08-16 at commit `18e7367` (the commit running production). Each item carries its evidence and
says plainly what is **verified** versus **not yet checked**. Nothing here has been fixed.

Severity: 🔴 affects production behavior · 🟠 security / correctness risk · 🟡 maintenance drag.

---

## 🔴 1. Production calls a different API host than the manifest claims

**Verified.** `apps/prod/trixgo-lamin-webapp/values.yaml` declares:

```yaml
- name: NEXT_PUBLIC_API_URL
  value: "https://api.lamin.com.vn"
```

But `NEXT_PUBLIC_*` is inlined at build time and the builder injects nothing, so the image carries whatever
`.env.production` said — `https://api.trixgo.com`.

Evidence: grep of 425 `.js` files in a local `.next` build found the build-time host baked into 8 chunks and
neither of the other two hosts anywhere. `build-docker.yml` passes no build-args; `Dockerfile:24,32` is
`COPY . .` then `yarn build`.

**Open question for the owner:** which host is correct? If `api.lamin.com.vn` is intended, production has
been talking to the wrong backend and the fix is a rebuild, not a manifest edit.

Confirm in one minute: open lamin.com.vn → DevTools → Network → look at the request host.

---

## 🔴 2. `OPENAI_API_KEY` may be absent at runtime — chat could be dead on production

**Partly verified.** `utils/ai/openai-service.ts:11` reads the server-side `process.env.OPENAI_API_KEY`.
The key is present in `.env.production` (verified) but **`values.yaml` does not set it** (verified).

Whether the pod has it depends on whether Next copies `.env.production` into `.next/standalone` — the
Dockerfile copies only `standalone`, `static`, and `public`. **Not verified from here.**

If it is missing, `openai-service.ts:25` logs `CRITICAL: OpenAI API key is not configured` and the
`laminGPT` floating chat fails for every visitor, silently from the user's side.

Check: `kubectl exec` into a pod and `printenv OPENAI_API_KEY`, or read the pod logs for that CRITICAL line.
Same applies to `ASSISTANT_ID` and `VECTOR_STORE_ID`.

---

## 🟠 3. Live credentials committed in three files

**Verified.**

| File | Credential |
|---|---|
| `.env` | `NEXT_PUBLIC_OPENAI_API_KEY` = `sk-proj-XBFT…` · `NEXT_PUBLIC_DEFAULT_TOKEN` (JWT, `Guest-LAMIN`) |
| `.env.production` | `OPENAI_API_KEY` = `sk-proj-h7JP…` (a different key) · `NEXT_PUBLIC_DEFAULT_TOKEN` (JWT) |
| `.gitlab-ci.yml` | `sk-proj-h7JP…` again, written into both the staging and prod job |

Additionally `values.yaml` in the GitOps repo stores the `NEXT_PUBLIC_DEFAULT_TOKEN` JWT in plaintext under
`extraSecrets` — and because of the prefix, that token ships to every browser anyway.

`NEXT_PUBLIC_OPENAI_API_KEY` in `.env` is now unused (the service moved server-side) but the key text is
still live.

**Removing these from the files does not un-leak them** — they remain in git history and in every built
image. Rotation is the owner's decision.

Note: the sibling repo `lamin-website-branding` still carries the `sk-proj-XBFT…` key **and calls OpenAI
from the browser**, so that key should be considered fully public.

---

## 🟠 4. Mock mode is on in production

**Verified.** `NEXT_PUBLIC_API_MODE=mock` in `.env`, `.env.production`, both `.gitlab-ci.yml` jobs, and
`values.yaml`. `config/apiConfig.ts:4` also **defaults to `mock`** when unset.

`isMockApi()` switches five feature factories to mock services: `product`, `menu`, `order`, `user`,
`nutrition-check`. Everything else calls the live API, so the site is a mix.

**Open question:** is this intended? If those five are meant to serve real data, flipping the flag changes
five features at once and needs testing before it ships.

---

## 🟠 5. The middleware auth guard is effectively unreachable

**Verified by reading `proxy.ts:260-267`:**

```ts
const isProtectedRoute = request.nextUrl.pathname.startsWith('/(protected)');
const isAccountRoute   = request.nextUrl.pathname.startsWith('/account');
```

`(protected)` is a **route group** — it never appears in a request URL, so the first condition is always
false. The second only helps for `/account/*` paths that did not already `return` from one of the
redirect/rewrite branches above it, and the mapped account routes all do return early.

Practical effect: unauthenticated users are not bounced at the edge. Protection comes from `AuthContext`
client-side and `401` handling in `apiClient`, so data is not exposed — but the UX is a flash of a protected
page rather than a clean redirect, and any future page that *assumes* edge protection would be wrong.

---

## 🟡 6. Two build pipelines, unclear which is authoritative

**Partly verified.** `.github/workflows/trigger.yml` → `trixgo-builds` → ghcr is confirmed as the source of
the deployed image (tag format and SHA match). `.gitlab-ci.yml` also exists, targets a
`trixgo-vn/devops/gitlab-ci-template`, and writes a **different** CDN host into `.env.production`.

Nothing observed shows the GitLab pipeline running, but its presence means two places claim to define the
production environment. Someone editing the GitLab file to change production would see no effect.

Decide: delete it, or document it as the real path.

---

## 🟡 7. Three dead configuration variables

**Verified by grep across all source outside `node_modules`/`.next`:**

- `NEXT_PUBLIC_IMAGE_PREFIX` — set in `.env`, `.env.production`, `.gitlab-ci.yml`, `values.yaml`; read by
  **no source file**.
- `NEXT_PUBLIC_ENVIRONMENT` — `apiClient.ts:11` assigns it to `const environment`, which is never used, and
  it is not set anywhere.
- `NEXT_PUBLIC_OPENAI_API_KEY` — obsolete since the server-side migration.

---

## 🟡 8. `services/api.ts` is dead code that would throw

**Verified.** It calls `getEnv('API_URL')` (`services/api.ts:6`); `API_URL` has no `NEXT_PUBLIC_` prefix so
it is undefined in browser code, is not defined anywhere in the repo, and `config/env.ts` makes `getEnv`
**throw** on a missing key. `grep "from '@/services/api'"` returns 0 hits — that is the only reason it has
never crashed.

Ironically `API_URL` *is* set in `values.yaml`, suggesting someone believed the two were connected.

---

## 🟡 9. Sitemap advertises URLs that redirect

**Verified.** `app/sitemap.ts` emits English paths under `https://lamin.com.vn` — `/about`,
`/all-products`, `/height-measurement`, `/coach-experts`, … Every one of those is in the redirect map in
`proxy.ts` and bounces to its Vietnamese equivalent. The canonical URLs are the Vietnamese ones, so the
sitemap is pointing search engines at the wrong side of a redirect.

---

## 🟡 10. `tailwind.config.js.backup` is an inert trap

**Verified.** The repo is on Tailwind v4 with config in `styles/globals.css` `@theme`. The root
`tailwind.config.js.backup` is loaded by nothing — editing it changes nothing and reports no error. Delete
it in a dedicated commit, or leave it clearly labelled.

---

## 🟠 12. `yarn lint` is completely broken — two independent failures

**Verified 2026-08-16** by running it.

```
$ yarn lint
TypeError [ERR_IMPORT_ATTRIBUTE_MISSING]: Module ".eslintrc.json" needs an import attribute of "type: json"
```

1. `package.json` runs `eslint . --ext .ts,.tsx -c .eslintrc.json --fix`. ESLint 9 is flat-config only: it
   tries to `import()` the path given to `-c` as a module, and a `.json` file needs an import attribute.
   `--ext` is also gone in ESLint 9.
2. Falling back to the flat config does not work either — `eslint.config.mjs` imports **`@eslint/compat`,
   which is not in `devDependencies`**:
   ```
   Error [ERR_MODULE_NOT_FOUND]: Cannot find package '@eslint/compat'
   ```

So the repo has **no working linter at all**, on top of no tests and a build that ignores type errors
(#11). Every `.eslintrc.json` rule documented in `CLAUDE.md` §8 — import ordering, JSX prop sorting,
unused-import removal — is currently unenforced.

Consequence for anyone working here: **new code cannot be linted.** Say so rather than implying it passed.

Fix is small — add `@eslint/compat` and point the script at the flat config — but it changes shared tooling
for everyone, so it needs the owner's go-ahead rather than a drive-by edit.

---

## 🟡 11. No tests, and type errors do not fail the build

**Verified.** `next.config.mjs:7` sets `typescript.ignoreBuildErrors: true`; there is no test script, no
test runner, and no test files. A green build carries no correctness signal — every change needs manual
browser verification.

Measured 2026-08-16: `npx tsc --noEmit` reports **74 pre-existing type errors** across the repo. None of
them fail the build, and nobody sees them unless they run `tsc` by hand.
