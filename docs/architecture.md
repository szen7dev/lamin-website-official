# Architecture

How the Lamin website is put together. Verified against commit `18e7367` on 2026-08-16.

For onboarding prose in Vietnamese, `DEV_GUIDE.md` still reads well — but it predates the Next 16 and
Tailwind v4 migrations, so trust this file and `../CLAUDE.md` where they disagree.

## Shape

A **frontend-only** Next.js 16 App Router application. No database, no backend in this repo. All data
arrives over HTTP from an external REST API (see [`config-env.md`](config-env.md)).

506 TypeScript files outside `node_modules`, split roughly:

| Area | Files | Notes |
|---|---:|---|
| `features/` | 303 | 22 modules — where most of the app lives |
| `components/` | 85 | 57 of them shadcn/ui primitives |
| `app/` | 78 | routes, layouts, one API route |
| everything else | ~40 | `services/`, `contexts/`, `hooks/`, `config/`, `utils/`, `types/` |

## Layer by layer

### `app/` — routes only

Route groups keep URL structure separate from layout structure:

| Group | Contains |
|---|---|
| `(public)` | homepage, articles, products, categories, height measurement (standard + CDC), nutrition check, store locations, coach experts, cooperate, testing results, branding story, `vng-event`, `lot/[lotID]/goods/[goodsID]/item/[itemID]` traceability, `[slug]` catch-all |
| `(protected)` | cart, checkout (+ confirmation, success), orders, account (info, orders, location, height history, customer height, for-seller) |
| `auth` | login, register — each with a `/seller` variant |
| `seller` | seller-side store management + customer height tracking |
| `admin` | admin pages |
| `api/ai/laminGPT` | the **only** server route — the OpenAI assistant endpoint |

Pages stay thin: a `page.tsx` composes feature components and does data fetching; heavier interactive
screens split into a sibling `client.tsx`.

### `features/` — the real application

22 self-contained modules. Each holds some mix of `components/`, `hooks/`, `api/`, `services/`, `types`,
`mocks/`, exported through an `index.ts`.

```
product 40   homepage 36   article 21   menu 21   cart 20   checkout 19
seller 18    height-measurement 16   vng-event 16   user 13   search 12
nutrition-check 10   auth 10   coach-experts 9   doctype 9   contact 6
order 6      documents 5   location 5   trusted-shop 4   address 3
activate-product 3
```

Adding a feature means adding a folder here, not growing `app/`.

### `services/` — the HTTP boundary

`services/api/apiClient.ts` is the single axios instance the whole app uses — base URL, 30s timeout, bearer
token, error normalisation, plus media-URL helpers (`getFileUrl`, `getUserImageUrl`,
`getContactImageUrl`) built on the CDN base.

Its `request()` also unwraps a consistent envelope: `{ status, data, pagination, information }`, where
`pagination` is pulled from `limit / nextCursor / totalRecord / totalPage`.

`services/api.ts` is a **second, dead** client — see [`../.claude/rules/one-api-client.md`](../.claude/rules/one-api-client.md).

Endpoint families in use: `/api/crm`, `/api/item`, `/api/medias`, `/api/payment`, `/api/store`.

### State

Three tiers, deliberately (the reasoning is in `STATE_MANAGEMENT_CHOICES.md`):

| Kind | Tool |
|---|---|
| Global app state | React Context — `AuthContext`, `OrderContext`, `ContactContext`, `TabContext`, wired together in `components/providers/` |
| Server/remote state | `@tanstack/react-query` |
| Local UI state | `useState` / `useReducer` |

Auth is token-in-cookie (`auth-token`, via `cookies-next`); `apiClient` attaches it as a bearer, falling
back to `NEXT_PUBLIC_DEFAULT_TOKEN` for anonymous reads.

### `proxy.ts` — routing translation

The Next 16 successor to `middleware.ts`. 288 lines handling: 26 EN→VI redirects, 26 VI→EN rewrites, nine
dynamic route pairs, an auth branch (**mostly unreachable** — see [`findings.md`](findings.md) #5), and the
security headers on the fall-through response. Runs on everything except `api`, `_next/static`,
`_next/image`, `favicon.ico`.

### Styling

Tailwind **v4** via `@tailwindcss/postcss`. Design tokens live in `@theme` inside `styles/globals.css`
(380 lines) — brand primary `#0052A4` with a 5→90 scale, container max `1240px`. The root
`tailwind.config.js.backup` is an inert migration leftover.

### AI assistant

`utils/ai/openai-service.ts` runs **server-side only** (`process.env.OPENAI_API_KEY`, no `NEXT_PUBLIC_`
prefix, no `dangerouslyAllowBrowser`). It drives an OpenAI Assistant with a vector store for file search,
exposed to the client through `app/api/ai/laminGPT/route.ts` and surfaced by
`components/chat/FloatingChat.tsx`.

Note the sibling repo `lamin-website-branding` still calls OpenAI **from the browser** with a
`NEXT_PUBLIC_` key. This repo does not; don't reintroduce that pattern.

## Build configuration

`next.config.mjs`:

- `output: 'standalone'` — for the Docker runtime stage
- `typescript.ignoreBuildErrors: true` — **type errors do not fail the build**
- `productionBrowserSourceMaps: false`
- `experimental`: `webpackBuildWorker`, `parallelServerBuildTraces`, `parallelServerCompiles`
- `images`: AVIF + WebP, explicit `deviceSizes`/`imageSizes`, and ~22 whitelisted `remotePatterns` hosts.
  The two that matter are the DigitalOcean Spaces CDN and CloudFront; the rest are placeholder/avatar
  services. **An image host not on this list throws at runtime.**

## What is missing

- **No tests** — no runner, no test files, no `test` script.
- **No README.md** at the repo root.
- **No error boundary / `error.tsx`** convention applied consistently across route groups.

See [`findings.md`](findings.md) for defects, [`config-env.md`](config-env.md) for configuration, and
[`deploy.md`](deploy.md) for how this reaches production.
