# Rule: this repo is the one that ships

**IMPORTANT.** Two Lamin website repos exist and they are easy to mix up.

| Repo | Next | Tailwind | Runs lamin.com.vn? |
|------|------|----------|--------------------|
| `szen7dev/lamin-website-official` **← here** | 16.0.10 | **v4**.1.16 | ✅ yes |
| `szen7dev/lamin-website-branding` | 16.0.1 | v3.4.17 | ❌ no |

## Evidence

The production app manifest (`trixgo-kubenetes-prod` →
`apps/prod/trixgo-lamin-webapp/.argocd-source-prod-trixgo-01-trixgo-lamin-webapp.yaml`) pins:

```
ghcr.io/szen7dev/lamin-website : main-28233504772-18e7367
```

The tag format is `<branch>-<run_id>-<sha7>`. Commit `18e7367`:

```bash
git -C lamin-website-official cat-file -t 18e7367   # → commit
git -C lamin-website-branding cat-file -t 18e7367   # → fatal: Not a valid object name
```

## Rules

1. A change that must reach production lands **here**. Landing it only in `branding` ships nothing, and
   nothing will warn you.
2. The repos have **diverged** — different Tailwind majors, different env-file layout, different OpenAI
   wiring (`branding` still uses `NEXT_PUBLIC_OPENAI_API_KEY` client-side; this repo moved it server-side).
   Never copy a file across without reading both versions.
3. `branding` carries its own `CLAUDE.md` claiming **Next 15, Tailwind v3, `middleware.ts`**. Those are
   wrong for this repo. This repo's `CLAUDE.md` wins here.
4. Both repos share the same `.github/workflows/trigger.yml`, so both can dispatch the shared builder.
   Which repo the builder checks out is decided by the `WEBSITE_CHECKOUT_REPOSITORY` secret in
   `szen7dev/trixgo-builds` — **not visible from either repo**. Confirm by SHA, not by assumption.

Canonical source: `CLAUDE.md` §"THIS repo is what runs lamin.com.vn".
