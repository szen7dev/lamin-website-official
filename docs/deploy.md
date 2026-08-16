# Deploy

How a commit becomes `lamin.com.vn`. Verified 2026-08-16.

## ⚠️ Pushing to `main` deploys to production

There is **no manual gate**. A push to `main` rebuilds the image and ArgoCD Image Updater rolls it onto the
production cluster automatically — including for a docs-only commit.

```
git push origin main
 │
 ├─ .github/workflows/trigger.yml            (this repo)
 │     builds IMAGE_TAG = <branch>-<run_id>-<sha7>
 │     curl POST → szen7dev/trixgo-builds /actions/workflows/website.yml/dispatches
 │
 ├─ szen7dev/trixgo-builds
 │     website.yml → build-docker.yml
 │       · actions/checkout of ${{ secrets.WEBSITE_CHECKOUT_REPOSITORY }} at the pushed SHA
 │       · docker/build-push-action, context '.', NO build-args
 │       · push → ghcr.io/szen7dev/lamin-website:main-<run_id>-<sha7>
 │
 ├─ ArgoCD Image Updater  (trixgo-kubenetes-prod)
 │     clusters/prod-trixgo-01-apps/templates/imageupdater.yaml
 │       applicationRef: prod-trixgo-01-trixgo-lamin-webapp
 │       image:  ghcr.io/szen7dev/lamin-website
 │       allowTags: regexp:^main-[0-9]+-[0-9a-zA-Z]+$      ← our tag matches
 │       updateStrategy: alphabetical
 │       writeBack: git → branch prod-trixgo-01
 │
 └─ ArgoCD sync → new pods serve lamin.com.vn
```

## Why the image ignores `values.yaml` env

`build-docker.yml` passes **no build-args and injects no env file**. `Dockerfile:24` is `COPY . .` and
`Dockerfile:32` runs `yarn run build`. So Next reads the **committed** `.env.production` and bakes those
values into the bundle. Everything `NEXT_PUBLIC_*` in the Helm values is decorative. Full explanation:
[`config-env.md`](config-env.md).

## Kubernetes

Repo `szen7dev/trixgo-kubenetes-prod`, branch `prod-trixgo-01`, path
`apps/prod/trixgo-lamin-webapp/`:

| | |
|---|---|
| Chart | `webapp` 0.1.x from `https://nentangso.github.io/charts` |
| Image | `ghcr.io/szen7dev/lamin-website` (tag pinned in `.argocd-source-*.yaml`) |
| Ingress | nginx → `lamin.com.vn`, extra host `www.lamin.com.vn`, TLS via cert-manager `letsencrypt-prod` |
| Container port | 3000 |
| Autoscaling | HPA 2–6 replicas, target CPU 80% |
| Resources | requests 100m / 512Mi · limits 500m / 2Gi |
| Env | `TZ=Asia/Ho_Chi_Minh`, `NODE_ENV=production`, `API_URL`, plus six ineffective `NEXT_PUBLIC_*` vars |
| Secret | `NEXT_PUBLIC_DEFAULT_TOKEN` via `secretKeyRef`, value stored in plaintext in `values.yaml` |

Container runtime: non-root user `nextjs` (uid 1001), `HOSTNAME=0.0.0.0`, `CMD ["node","server.js"]` from
the Next standalone output.

## Verifying a release

Do not trust "the push succeeded". Check the SHA that is actually running:

```bash
git -C D:/szen7/trixgo-kubenetes-prod pull
cat apps/prod/trixgo-lamin-webapp/.argocd-source-prod-trixgo-01-trixgo-lamin-webapp.yaml
# webapp.image.tag: main-<run_id>-<sha7>   ← sha7 must be your commit
```

Then open the site and confirm behavior in the browser — the build ignores type errors and there are no
tests ([`../.claude/rules/verify-in-browser.md`](../.claude/rules/verify-in-browser.md)).

## Known fragilities

1. **`updateStrategy: alphabetical`** over `main-<run_id>-<sha7>` tags only tracks chronology while every
   GitHub run id has the same digit count. When run ids gain a digit, the updater can pick an **older**
   image. A `newest-build` strategy would be safer.
2. **`staging` builds but never deploys.** `trigger.yml` fires on `staging` too, producing a
   `staging-*` tag — which no ImageUpdater rule matches. There is no staging environment on this cluster.
3. **A second pipeline exists.** `.gitlab-ci.yml` writes its own `.env.production` (CloudFront CDN instead
   of DigitalOcean) and builds via `trixgo-vn/devops/gitlab-ci-template`. Nothing observed indicates it is
   live — the deployed image is on ghcr with the GitHub tag format. Treat it as legacy until confirmed;
   editing it will not change production. Tracked as [`findings.md`](findings.md) #6.

## Making runtime env actually work (proposal, not yet done)

Three options, in rough order of effort:

1. **Fix the committed values.** Make `.env.production` say what production should say. Cheapest, keeps the
   architecture, still requires a rebuild per environment change.
2. **Build-args.** Add `ARG`/`ENV` for each `NEXT_PUBLIC_*` in the builder stage of the `Dockerfile` and
   pass them from `build-docker.yml`; then delete those keys from `values.yaml`. Honest about the fact that
   they are build-time. Requires editing the **shared** `trixgo-builds` repo, which serves other projects.
3. **True runtime config.** Drop the `NEXT_PUBLIC_` prefix, read config in a server component and pass it
   down through a provider, lazily constructing `apiClient`. One image runs every environment, `values.yaml`
   behaves as expected, and the default token stops shipping to browsers. Most work, best end state.

No option is chosen yet — this is the owner's call.
