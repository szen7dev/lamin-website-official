# Rule: evidence, not inference

**IMPORTANT.** This repo is full of things that look one way and behave another. Reasoning from names,
memory, or "how Next usually works" produces confident wrong answers here.

The list so far — every one of these reads as working code:

| Looks like | Actually |
|---|---|
| `values.yaml` sets `NEXT_PUBLIC_API_URL=api.lamin.com.vn` | Ignored. The browser calls `api.trixgo.com` |
| `services/api.ts` — a normal axios client | Dead. Nothing imports it; it would throw if you did |
| `tailwind.config.js.backup` — the Tailwind config | Inert. Config is in `styles/globals.css` |
| `proxy.ts` auth guard on `/(protected)` | Never fires — that is a route group, not a URL segment |
| `NEXT_PUBLIC_IMAGE_PREFIX` in three config files | Read by no source file |
| `NEXT_PUBLIC_ENVIRONMENT` → `const environment` | Assigned in `apiClient.ts:11`, never used, never set |
| `.gitlab-ci.yml` | Probably legacy; the live image comes from ghcr |
| `middleware.ts` | Does not exist — Next 16 renamed it `proxy.ts` |

## Rules

1. A claim about behavior carries its evidence: **file + line**, a grep result with its count, or the real
   output of a command you ran. Not "it should" or "typically".
2. When you cannot verify something from here — a secret's value, what the builder checks out, what a pod
   actually has in its environment — **say it is unverified** and name the check that would settle it.
   `docs/findings.md` marks these explicitly; keep that discipline.
3. Prefer the measurement over the theory. "`NEXT_PUBLIC_*` is inlined at build" is a doc claim; "grep found
   `api.szen7.com` in 8 of 425 `.next` chunks" is a fact. Get the fact.
4. Do not upgrade someone else's "probably" into your "definitely" by restating it. Check it or carry the
   qualifier forward.
5. Correcting yourself when evidence lands is normal and cheap. Stating something unverified as settled is
   what costs time.

Related: [`verify-in-browser.md`](verify-in-browser.md) for behavior, this rule for claims.
