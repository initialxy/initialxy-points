# AGENTS.md

## Project

initialxy-points is a full-stack Nuxt app that lets parents track points their kids earn through tasks and redeem points for rewards. See `docs/PRD.md` (product requirements) and `docs/api.md` (API reference) for context.

## Stack

- Nuxt 4 (Vue 3, full-stack mode), TypeScript, Tailwind CSS 4
- Nuxt UI v4, Pinia, @vueuse
- SQLite via `sqlite3` (access through `server/database/`)
- zod for API input validation; nuxt-auth-utils for session auth
- Tests: vitest (unit + API e2e) and Playwright (browser e2e via @nuxt/test-utils)

## Structure

- `app/` — frontend: components, pages, layouts, middleware, utils
- `server/` — Nitro API routes in `server/api/`; session guard in `server/middleware/auth.ts`; DB access in `server/database/`; validation helpers in `server/utils/`
- `shared/` — types (`shared/types/index.ts`) and utils shared by app and server; auto-imported
- `stores/` — Pinia stores (wired up via `pinia.storesDirs` in `nuxt.config.ts`)
- `test/e2e/` — vitest API-level tests; `test/playwright/` — browser e2e tests
- `docs/` — PRD and API documentation

## Commands

```bash
npm run dev         # dev server (http://localhost:3000)
npm run admin       # admin console: create/initialize the SQLite DB and manage users
npm run test        # full suite: vitest, then Playwright
npm run e2e         # vitest only
npm run playwright  # Playwright only (loads .env.test via dotenv-cli)
npm run tsc         # type check (tsc --noEmit)
npm run format      # prettier
npm run build       # production build
```

- `npm run test` / `npm run playwright` load `.env.test` (e.g. the test DB path). `NUXT_APP_SECRET` for tests is set programmatically in `vitest.config.ts` and the Playwright nuxt fixture in `playwright.config.ts`.
- CI (GitHub Actions) runs on Node 22 (npm 10). Keep `package-lock.json` in sync in a way npm 10 accepts — an npm 12-generated lock can break `npm ci` in CI (optional-peer placement differences). If in doubt, regenerate the lock in a `node:22` container and verify `npm ci` locally.

## Commit hooks

A `husky` pre-commit hook (`.husky/pre-commit`) runs on every commit: lint-staged (`prettier --write` + `eslint --fix` on staged files), then `npm run tsc`, `npm run lint`, `npm run e2e` (vitest), and `npm run playwright`. The hook blocks the commit on any failure. Skip it in a pinch with `HUSKY=0 git commit ...` (avoid — CI re-runs the checks).

## Conventions

- **Explicit booleans only.** Never rely on truthiness/falsiness: `if (value !== 0)` for numbers, `x == null` / `x != null` for null/undefined checks.
- **No `any`.** Plain `catch (error)` with type narrowing; explicit generics on `$fetch`/`useFetch` (e.g. `useFetch<UserResponse>(...)`).
- **Prefer Tailwind classes and Nuxt UI components** over hand-rolled markup. Common Nuxt UI v4 components used or available: `UApp`, `UButton`, `UForm`/`UFormField`, `UInput`, `USelect`, `UCheckbox`, `UCard`, `UBadge`, `UModal`, `UIcon`, `UTimeline`, `UContainer`, `USlideover`, `UTabs`, `UToggleGroup` (v4 replacement for the old `UButtonGroup`), toasts via `useToast()` + `UToaster`. Full list: https://ui.nuxt.com/docs/components
- **Auto-imports.** Vue/Nuxt APIs, `app/utils`, `shared/*`, and Pinia stores are auto-imported — do not add explicit imports. Shared types (`User`, `Task`, `Reward`, `Log`, `*Response`) come from `shared/types/index.ts`.
- Two-way bindings: use `defineModel` (don't duplicate in `defineProps`).

## Data fetching

- Initial page data: `await useLazyFetch<ResponseType>('/api/...')` (the established pattern in this app).
- User-triggered actions: `$fetch<ResponseType>` in try/catch; surface errors with `getApiErrorMessage(error)` from `app/utils`.
- After a mutation that affects visible data: `await refreshNuxtData()`.

## Auth & environment

- Session-based auth (nuxt-auth-utils). `server/middleware/auth.ts` requires a session for all `/api/*` except `/api/auth/login`.
- `NUXT_APP_SECRET` — encrypts session cookies (Nuxt auto-generates one in dev; set it in production).
- `DB_PATH` — path to the SQLite database file.
