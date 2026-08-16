# Rule: one API client

Every HTTP call in this app goes through **one** axios instance:

```
services/api/apiClient.ts        ← the real client
services/index.ts                ← re-exports it as `apiClient`
```

~60 modules import it one of those two ways. There is **no** `fetch()` to any other absolute host
(verified by grep across all `.ts`/`.tsx` outside `node_modules` and `.next`).

What it does: `baseURL` from `NEXT_PUBLIC_API_URL`, 30s timeout, `Authorization: Bearer` from either a
token set via `setToken()` or `NEXT_PUBLIC_DEFAULT_TOKEN`, plus media-URL helpers built on
`NEXT_PUBLIC_CLOUDFRONT_URL`.

## The dead client

`services/api.ts` is a **second axios client that nothing imports**:

```ts
const API_URL = getEnv('API_URL');   // services/api.ts:6
```

Two problems: `API_URL` has no `NEXT_PUBLIC_` prefix so it is undefined in browser code, and it is defined
nowhere in this repo — and `config/env.ts` makes `getEnv` **throw** on a missing key. The only reason this
has never crashed the app is that `grep "from '@/services/api'"` returns **0 hits**.

Curiously, `API_URL` *is* set in the k8s manifest (`https://api.lamin.com.vn`) — so someone once wired the
two together in their head. They are not connected.

## Rules

1. Import `apiClient` from `@/services` or `@/services/api/apiClient`. Never from `@/services/api`.
2. Do not create a second axios instance for a feature. Add a method or an endpoint module instead.
3. Do not "fix" `services/api.ts` by giving it a working env var — that quietly creates a second client
   with different interceptors (it redirects to `/login`, the real one does not). Delete it, or leave it.
4. Feature API calls live in `features/<name>/api/*.ts` and use the shared client.

Canonical source: `CLAUDE.md` §3.
