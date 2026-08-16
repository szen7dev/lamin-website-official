# Rule: a green build proves nothing — verify in the browser

**IMPORTANT.** Two facts about this repo make "it compiles" meaningless as evidence:

1. `next.config.mjs:7` — `typescript: { ignoreBuildErrors: true }`. Type errors do **not** fail the build.
   They surface as runtime crashes on the page that has them.
2. **There is no test suite.** No `test` script, no test runner in `devDependencies`, no test files.

So `yarn build` succeeding tells you the bundler resolved the imports. That is all.

## What "done" means here

For anything that changes behavior:

1. `yarn dev` and open the actual page.
2. Exercise the actual flow — click it, submit the form, add to cart.
3. Watch the **Network tab**: which host was called, what status came back. This repo has an API base URL
   that differs between dev and prod ([`env-build-time.md`](env-build-time.md)) and a mock-mode switch
   ([`mock-mode.md`](mock-mode.md)) — both change what you see without changing the code.
4. Check the **Console**: `apiClient.ts:19-23` warns loudly when `NEXT_PUBLIC_API_URL` or
   `NEXT_PUBLIC_CLOUDFRONT_URL` is missing.

`yarn lint` is worth running (it auto-fixes import order and strips unused imports) but it is a style gate,
not a correctness gate.

## Rules

1. Never report a feature complete on the strength of a successful build.
2. If you could not verify something — no browser available, needs prod data, needs a login you don't have
   — **say so explicitly** in the summary. Silence reads as "verified".
3. When a change touches routing, verify **both** the Vietnamese and English URL
   ([`vietnamese-urls.md`](vietnamese-urls.md)).
4. When a change touches a `NEXT_PUBLIC_*` value, remember dev and prod resolve it differently — verifying
   in dev does not verify prod.

Canonical source: `CLAUDE.md` §2.
