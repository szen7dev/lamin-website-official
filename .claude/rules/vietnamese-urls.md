# Rule: Vietnamese URLs are canonical

Users and search engines see **Vietnamese** URLs. The `app/` folders are named in **English**. `proxy.ts`
translates between them.

> `proxy.ts` is the Next 16 rename of `middleware.ts`. If you go looking for `middleware.ts`, it is not
> missing — it does not exist any more.

## The two maps

```ts
const redirects = new Map([...])   // 26 entries, EN → VI   → NextResponse.redirect
const rewrites  = new Map([...])   // 26 entries, VI → EN   → NextResponse.rewrite
```

- **redirect** EN→VI: someone hits `/height-measurement`, the browser is sent to `/do-cao`. This is what
  keeps the Vietnamese URL canonical for SEO.
- **rewrite** VI→EN: `/do-cao` is served by `app/(public)/height-measurement/` without changing the address
  bar.

Dynamic pairs exist too (handled by `startsWith` branches, not the maps): `article`, `product`, `category`,
`article-tags`, `store-locations`, `coach-experts`, `search`, `account/for-seller`,
`account/height-measure-history`.

## Rules

1. **A new Vietnamese route needs an entry in BOTH maps.** Only the rewrite → the English URL stays
   reachable and gets indexed as a duplicate. Only the redirect → the Vietnamese URL 404s. Both failures
   look fine in local dev if you only ever type one of the two URLs.
2. Use the Vietnamese URL in all user-facing content — links, sitemap, share buttons, emails.
3. `app/sitemap.ts` currently emits **English** paths under `https://lamin.com.vn` (`/about`,
   `/all-products`, `/height-measurement`, …). Those all redirect, so the sitemap advertises URLs that
   bounce. Fix it when you touch the sitemap; do not add more English entries.
4. The matcher excludes `api`, `_next/static`, `_next/image`, `favicon.ico`. Anything else goes through
   `proxy.ts` on every request — keep the work there cheap.
5. `proxy.ts` also sets the security headers (`X-Content-Type-Options`, `X-Frame-Options`,
   `Referrer-Policy`, `Permissions-Policy`) on the fall-through response. An early `return` from a
   redirect/rewrite branch **skips them** — that is by design for redirects, but remember it if you add a
   new early return on a page response.

## Known defect — don't rely on the auth guard here

`proxy.ts:260-267` reads:

```ts
const isProtectedRoute = request.nextUrl.pathname.startsWith('/(protected)');
const isAccountRoute   = request.nextUrl.pathname.startsWith('/account');
```

`(protected)` is a **route group** — it never appears in a request URL, so that condition is always false.
And most `/account/*` paths `return` from a redirect branch above before ever reaching this code. Real
protection today comes from `AuthContext` client-side plus `401` handling in the API layer. See
`docs/findings.md` #5 before you add a page that assumes the middleware is guarding it.

Canonical source: `CLAUDE.md` §4.
