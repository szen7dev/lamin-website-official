# Configuration & environment variables

Where every value comes from, which ones do nothing, and why the production API host is not what the
Kubernetes manifest says. Verified 2026-08-16 at commit `18e7367`.

## The one thing to understand first

Next.js **inlines every `NEXT_PUBLIC_*` reference as a string literal at build time**. The value is chosen
when the image is built and cannot be changed afterwards by any runtime mechanism — not `docker run -e`,
not a Helm `extraEnvVars`, not a k8s Secret.

**Measured proof.** Grep of the 425 `.js` files under `.next` (a dev build, which loads `.env`):

```
api.szen7.com     → 8 files      ← baked in
api.trixgo.com    → 0 files
api.lamin.com.vn  → 0 files
```

Only variables **without** the prefix (`API_URL`, `OPENAI_API_KEY`, …) are read at runtime, and only by
server-side code.

## Which file supplies the value

Next's precedence, applied to what this repo actually contains (`.env.local` and `.env.development` do not
exist here):

| Command | File loaded | API host |
|---|---|---|
| `yarn dev` | `.env` | `https://api.szen7.com` |
| `yarn build` / `yarn start` | `.env.production` (beats `.env`) | `https://api.trixgo.com` |
| Production image | `.env.production`, baked in by `docker build` | `https://api.trixgo.com` |

`.env` also holds a commented alternative: `# NEXT_PUBLIC_API_URL=http://localhost:3003` — the local
backend port.

## Full variable table

| Variable | `.env` (dev) | `.env.production` | k8s `values.yaml` | Read by |
|---|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | `api.szen7.com` | `api.trixgo.com` | `api.lamin.com.vn` ❌ no effect | `apiClient.ts:12`, `app/layout.tsx:29` (preconnect) |
| `NEXT_PUBLIC_API_MODE` | `mock` | `mock` | `mock` ❌ no effect | `config/apiConfig.ts:4` |
| `NEXT_PUBLIC_API_TIMEOUT` | `30000` | `30000` | `30000` ❌ no effect | `apiClient.ts:14` |
| `NEXT_PUBLIC_CLOUDFRONT_URL` | DO Spaces CDN | DO Spaces CDN | CloudFront ❌ no effect | `apiClient.ts:16`, `app/layout.tsx:30` |
| `NEXT_PUBLIC_DEFAULT_TOKEN` | JWT `Guest-LAMIN` | JWT `Guest-LAMIN` | JWT `Kiểm thử viên-DCOP` ❌ no effect | `apiClient.ts:17` |
| `NEXT_PUBLIC_IMAGE_PREFIX` | set | set | set | **nothing** — dead variable |
| `NEXT_PUBLIC_ENVIRONMENT` | — | — | — | `apiClient.ts:11` assigns it to `const environment`, which is **never used** |
| `NEXT_PUBLIC_OPENAI_API_KEY` | set (live key) | — | — | **nothing** — dead since the server-side migration |
| `OPENAI_API_KEY` | — | set (different key) | **not set** ⚠️ | `utils/ai/openai-service.ts:11` |
| `ASSISTANT_ID` / `VECTOR_STORE_ID` | — | set | **not set** ⚠️ | `utils/ai/openai-service.ts:12-13` |
| `API_URL` (no prefix) | — | — | `api.lamin.com.vn` | only `services/api.ts`, which is **dead code** |
| `ANALYZE` | `false` | `false` | — | `next.config.mjs:121` |

### Reading that table

- **Six variables in `values.yaml` do nothing** because of the prefix. They describe an intent the build
  never received.
- **Three variables are entirely dead**: `NEXT_PUBLIC_IMAGE_PREFIX`, `NEXT_PUBLIC_ENVIRONMENT`,
  `NEXT_PUBLIC_OPENAI_API_KEY`.
- **`API_URL` is the one runtime variable that is set correctly** — and the only file that reads it is the
  dead client.
- ⚠️ `OPENAI_API_KEY` is set in `.env.production` but **not** in `values.yaml`. Whether the running pod has
  it depends on whether Next copies `.env.production` into `.next/standalone` — **not verified**; the
  Dockerfile copies only `standalone`, `static`, and `public`. If it does not survive, `laminGPT` logs
  `CRITICAL: OpenAI API key is not configured` and the chat is broken on production. See
  [`findings.md`](findings.md) #2.

## Mock mode

`config/apiConfig.ts` defaults to `'mock'` when the variable is absent. `isMockApi()` selects mock vs real
service in five feature factories: `product`, `menu`, `order`, `user`, `nutrition-check`. Every other
feature calls the live API regardless. `components/ui/DebugInfo.tsx` can override it per browser via
`localStorage.API_MODE`.

## The CDN split

The committed env files point at **DigitalOcean Spaces**
(`trx-main.sgp1.cdn.digitaloceanspaces.com`); both `.gitlab-ci.yml` and the k8s manifest point at
**CloudFront** (`dntdurzwr12tp.cloudfront.net`). Since the build uses the committed file, production serves
media from DigitalOcean. Both hosts are whitelisted in `next.config.mjs`, so neither errors — the
disagreement is silent.

## Local development

```bash
yarn install          # yarn 1.22.22, Node 22
yarn dev              # → http://localhost:3000, API = api.szen7.com
```

To point dev at something else, create `.env.local` (git-ignored, wins over `.env`) rather than editing
`.env` — that file is committed and shared.

## How to change an API host properly

1. Edit the value in `.env.production` (or introduce build-args — see [`deploy.md`](deploy.md) §"Making
   runtime env actually work").
2. Commit and push → a new image is built and **auto-deployed** ([`deploy.md`](deploy.md)).
3. Verify by grepping the new build, or by opening the site and reading the Network tab.

Editing `values.yaml` is **not** step 1. It will look like a fix and change nothing.
