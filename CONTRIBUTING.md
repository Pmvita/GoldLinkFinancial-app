# Contributing

Quick reference for working in this repo. Start with the [README](README.md) for the full picture.

## Repo layout

- `apps/web/` — Vite + React 18 SPA
- `apps/mobile/` — Expo SDK 54 app (Expo Go compatible)
- `packages/core/` — shared TS types + JSON accessors + formatters
- `db/` — JSON mock backend

## One-time setup

```bash
pnpm install   # at the repo root
```

## Daily commands (run from the repo root)

| Command             | Purpose                                                      |
| ------------------- | ------------------------------------------------------------ |
| `pnpm dev`          | Start the web app                                            |
| `pnpm build`        | Build the web app                                            |
| `pnpm lint`         | ESLint v9 (web + core)                                       |
| `pnpm format:check` | Prettier check (CI runs this)                                |
| `pnpm typecheck`    | `tsc --noEmit` everywhere except `apps/web`                  |
| `pnpm test`         | Vitest (currently 19 tests in `@goldlink/core`)              |

To run the mobile app: `cd apps/mobile && pnpm start`, then scan the QR code with Expo Go.

## Before opening a PR

1. `pnpm format:check && pnpm lint && pnpm typecheck && pnpm test`
2. Build the web app once: `pnpm --filter web build`
3. CI runs the same gates (`.github/workflows/ci.yml`) on push and PR.

## Conventions

- TypeScript everywhere. Single quotes, 2-space indent, 100-col wrap, trailing commas (`prettier.config.mjs`).
- Don't add new direct JSON imports in `apps/mobile`. Use `@goldlink/core` accessors instead.
- Don't commit secrets or rename `db/*.json` fields without updating `packages/core/src/types.ts`.
- Mark deferred data backfills with `// TODO: backfill ...` comments and explain the placeholder.

## Known caveats

Prettier currently ignores all of `apps/web/` and `*.md`. Root `pnpm typecheck` excludes `apps/web` due to pre-existing `motion/react` `Variant` errors. See the README's "Current limitations" section for the full list.
