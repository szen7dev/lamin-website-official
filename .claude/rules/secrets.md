# Rule: secrets

**IMPORTANT.** Never commit a credential. This repo currently violates that in three files — treat those
as a defect being tracked, not as precedent.

## The `NEXT_PUBLIC_` trap

Anything prefixed `NEXT_PUBLIC_` is **inlined into the JavaScript sent to every browser**. A key with that
prefix is public by construction — no amount of Kubernetes `secretKeyRef` around it changes that. Wrapping
a `NEXT_PUBLIC_` value in a k8s Secret (as `values.yaml` does for the default token) protects it in the
cluster and publishes it on the website.

## What is currently committed

| File | What |
|---|---|
| `.env` | `NEXT_PUBLIC_OPENAI_API_KEY` (`sk-proj-XBFT…`) · `NEXT_PUBLIC_DEFAULT_TOKEN` (JWT, `Guest-LAMIN`) |
| `.env.production` | `OPENAI_API_KEY` (`sk-proj-h7JP…`, a **different** key) · `NEXT_PUBLIC_DEFAULT_TOKEN` (JWT) |
| `.gitlab-ci.yml` | the same `sk-proj-h7JP…` key written into both the staging and prod job |

The `NEXT_PUBLIC_OPENAI_API_KEY` in `.env` is now **unused** — `utils/ai/openai-service.ts:11` reads the
server-side `OPENAI_API_KEY`. It is dead text with a live key in it.

## Rules

1. Do not add a new secret to any committed file. Server-side values belong in the k8s Secret / CI secret;
   the build only needs the non-secret `NEXT_PUBLIC_*` values.
2. Do not introduce a `NEXT_PUBLIC_` variable holding anything you would mind a stranger reading.
3. **Rotation is the owner's decision, not a silent fix.** Removing a key from a file does not un-leak it —
   it stays in git history and in every built image. Report it and let the owner revoke.
4. Any code that talks to a third-party API with a key must live under `app/api/*` or another server-only
   module, never in a client component.

Tracked with severity in `docs/findings.md` #3.
