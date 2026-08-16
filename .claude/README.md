# `.claude/` — project guardrails

How Claude Code is organized for this repo.

| Folder | Purpose | Enforced by |
|--------|---------|-------------|
| `rules/` | Short, citable statements of "how we build here" — one concern per file. The long-form rationale lives in `CLAUDE.md` and `docs/`; these are the crisp versions you can point at in a review. | Claude reads them every session. |

**Rules document intent; they do not auto-enforce.** "Automatically do X whenever Y happens" is a **hook**
in `.claude/settings.json`, not something Claude remembers. If a rule here keeps getting violated, promote
it to a hook (the `/update-config` skill edits `settings.json` safely) — or to a lint rule / CI check, which
survives even without Claude.

Nothing in this folder affects the production build. It is context and process only.

See `CLAUDE.md` §5 for the full repo layout and §9 for the rules index.
