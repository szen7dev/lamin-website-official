# Rule: Tailwind v4 — config lives in CSS

This repo runs **Tailwind CSS v4.1.16** through `@tailwindcss/postcss`. In v4 the design tokens live in the
stylesheet, not in a JavaScript config.

```css
/* styles/globals.css — 380 lines */
@import "tailwindcss";

@theme {
  --container-2xl: 1240px;
  --color-primary: #0052A4;
  --color-primary-5: #E6EFF7;
  ...
}
```

```js
// postcss.config.js
module.exports = { plugins: { '@tailwindcss/postcss': {}, autoprefixer: {} } }
```

## The trap

`tailwind.config.js.backup` sits in the repo root. It is a **leftover from the v3→v4 migration** and is
loaded by nothing — the `.backup` extension makes it invisible to every tool. Editing it produces no
styling change and no error, which is the worst combination.

The sibling repo `lamin-website-branding` is still on **Tailwind v3** with a real `tailwind.config.js`.
Snippets do not transfer between the two.

## Rules

1. Add or change a design token in `@theme` inside `styles/globals.css` — colors, spacing, container
   widths, breakpoints.
2. Do not create a `tailwind.config.js`, and do not rename the `.backup` back. If you want the v3 config
   gone, delete it in a dedicated commit so the intent is legible.
3. Most Tailwind answers you find online are v3. Check for v4 syntax (`@theme`, `@utility`, `@plugin`,
   CSS-first config) before pasting.
4. `clsx` + `tailwind-merge` handle conditional classes — keep using them rather than string concatenation.

Canonical source: `CLAUDE.md` §2, §5.
