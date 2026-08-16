# Rule: pushing to `main` deploys to production

**IMPORTANT.** There is no manual gate between `git push origin main` and `lamin.com.vn`. The chain is
fully automatic:

```
push to main (or staging)
 └─ .github/workflows/trigger.yml        — curls the shared builder
     └─ szen7dev/trixgo-builds · website.yml → build-docker.yml
         · checks out this repo at the pushed SHA
         · plain `docker build` — NO build-args, NO env injection
         · pushes ghcr.io/szen7dev/lamin-website:main-<run_id>-<sha7>
             └─ ArgoCD Image Updater (prod-trixgo-01-helm-apps)
                 · watches ghcr.io/szen7dev/lamin-website
                 · allowTags: ^main-[0-9]+-[0-9a-zA-Z]+$   ← the tag above matches
                 · writes the new tag back into trixgo-kubenetes-prod
                     └─ ArgoCD syncs → new pods serve lamin.com.vn
```

Verified in `trixgo-kubenetes-prod` → `clusters/prod-trixgo-01-apps/templates/imageupdater.yaml`,
`applicationRefs[namePattern: prod-trixgo-01-trixgo-lamin-webapp]`.

## Rules

1. **Treat a push to `main` as a production deploy**, even for a docs-only change — it still rebuilds and
   rolls new pods. Tell the owner before pushing; do not push on your own initiative.
2. Because the builder injects nothing, the image bakes the **committed** `.env.production`
   ([`env-build-time.md`](env-build-time.md)). Changing an environment value means a new commit + new image.
3. Verify a release by the **SHA in the running tag**, not by "the push succeeded":
   ```bash
   git -C trixgo-kubenetes-prod pull
   cat apps/prod/trixgo-lamin-webapp/.argocd-source-*.yaml   # tag ends in the deployed sha7
   ```
4. `staging` also triggers a build, but no ImageUpdater rule matches a `staging-*` tag — so a staging push
   produces an image that nothing deploys. Do not expect a staging environment to appear.

## Known fragility

The updater uses `updateStrategy: "alphabetical"` over tags shaped `main-<run_id>-<sha7>`. That works only
while every GitHub `run_id` has the same number of digits. When run ids gain a digit, string-alphabetical
ordering stops matching chronological ordering and the updater can prefer an **older** image. Worth
replacing with a `newest-build` strategy before that happens.

## The other pipeline

`.gitlab-ci.yml` also exists and writes its own `.env.production` (pointing at
`dntdurzwr12tp.cloudfront.net` rather than the DigitalOcean CDN in the committed file). Nothing observed
suggests it is the live path — the deployed image lives on **ghcr** and the tag format matches the GitHub
workflow. Treat GitLab as **legacy until proven otherwise**, and do not edit it expecting production to
change. Unresolved: `docs/findings.md` #6.

Canonical source: `CLAUDE.md` §6 · full detail: `docs/deploy.md`.
