# Rule: `NEXT_PUBLIC_*` is frozen at build time

**IMPORTANT.** Next.js replaces every `process.env.NEXT_PUBLIC_*` reference with a **string literal** when
it compiles. Setting the same variable on the running container, in a Helm `extraEnvVars`, or in a
`docker run -e` has **no effect** — the value was decided when the image was built.

## Evidence

Grep of the 425 `.js` files under `.next` (a local dev build, which loads `.env`):

```
api.szen7.com     → 8 files      ← the value from .env, hard-baked into chunks
api.trixgo.com    → 0 files
api.lamin.com.vn  → 0 files
```

## What this has already broken

`trixgo-kubenetes-prod` → `apps/prod/trixgo-lamin-webapp/values.yaml` sets:

```yaml
- name: NEXT_PUBLIC_API_URL
  value: "https://api.lamin.com.vn"
```

The production bundle was built from the committed `.env.production`, so browsers actually call
**`api.trixgo.com`**. The manifest and reality disagree, and nothing errors. Tracked in `docs/findings.md` #1.

## Which file supplies the value

| Command | Next loads | Result |
|---|---|---|
| `yarn dev` | `.env` | `https://api.szen7.com` |
| `yarn build` / `yarn start` / the Docker image | `.env.production` (beats `.env`) | `https://api.trixgo.com` |

The builder (`szen7dev/trixgo-builds` → `build-docker.yml`) runs a plain `docker build` with **no
build-args and no env injection**, and `Dockerfile:24` is `COPY . .` — so the committed `.env.production`
is what gets baked.

## Rules

1. To change an API host, CDN, or any `NEXT_PUBLIC_*` value in an environment, you must **produce a new
   image**. Editing `values.yaml` is not a fix — it is a comment that looks like a fix.
2. Never add a `NEXT_PUBLIC_*` variable to k8s `extraEnvVars` and call the task done.
3. Only **non-prefixed** variables (`API_URL`, `OPENAI_API_KEY`, …) are readable at runtime, and only in
   server-side code. If you need real runtime configuration, that is the mechanism — but it requires a code
   change, not just an env change.
4. A secret with a `NEXT_PUBLIC_` prefix is **not a secret** — it ships to every browser. See
   [`secrets.md`](secrets.md).

## How to re-verify

```bash
# after any build, confirm which host actually got baked in
grep -rl "api\." .next --include=*.js | head
```

Canonical source: `CLAUDE.md` §3 · full analysis: `docs/config-env.md`.
