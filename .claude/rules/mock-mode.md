# Rule: mock mode is on everywhere, including production

`config/apiConfig.ts`:

```ts
export const API_MODE: ApiMode = (process.env.NEXT_PUBLIC_API_MODE as ApiMode) || 'mock';
export const isMockApi = () => API_MODE === 'mock';
```

Note the default: **when the variable is missing, mock wins.**

`NEXT_PUBLIC_API_MODE=mock` is set in `.env`, in `.env.production`, in `.gitlab-ci.yml` (both jobs), and in
the k8s `values.yaml`. Every environment is on mock.

## What it actually switches

Five feature factories pick their service by this flag:

| Factory | File |
|---|---|
| product | `features/product/services/productServiceFactory.ts` |
| menu | `features/menu/services/menuServiceFactory.ts` |
| order | `features/order/services/orderServiceFactory.ts` |
| user | `features/user/services/userServiceFactory.ts` |
| nutrition-check | `features/nutrition-check/services/nutritionCheckServiceFactory.ts` |

Each is `return isMockApi() ? xMockService : xRealService`. Everything **else** in the app calls the real
API directly through `apiClient`, regardless of this flag — so the app is a mix of mocked and live data,
not one or the other.

`components/ui/DebugInfo.tsx` can override the mode per-browser via `localStorage.API_MODE` — which means
your browser may disagree with the build.

## Rules

1. Before debugging "the API returns the wrong data", establish which side you are on: check the Network
   tab for a real request, and check `localStorage.API_MODE`.
2. Do not flip `NEXT_PUBLIC_API_MODE` to `real` as a casual fix. It changes five features at once, on
   whichever environment you rebuilt. Propose it, name what it affects, and let the owner decide.
3. Adding a new feature: do not add a mock/real factory unless there is a reason. Call `apiClient` directly
   like the other 17 features do.

**Open question for the owner** — is mock intended on production? Tracked as `docs/findings.md` #4.

Canonical source: `CLAUDE.md` §3.
