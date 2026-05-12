# GoldLink Bank — Mobile (`apps/mobile`)

The native iOS / Android companion to the GoldLink Bank web SPA. Built on **Expo SDK 54** and **Expo Router 6**, runnable in **Expo Go** with no native build steps required.

For the bigger picture (monorepo layout, web app, shared package), see the [top-level README](../../README.md).

---

## 🚀 Run it

> All commands assume you've already run `pnpm install` once at the repo root.

```bash
# From the repo root
cd apps/mobile

# Start the Expo dev server (Metro + QR code)
pnpm start

# Optional: target a specific platform after the dev server is up
pnpm ios       # iOS simulator (requires Xcode on macOS)
pnpm android   # Android emulator (requires Android Studio)
pnpm web       # Expo's web target — for quick previews; not the production experience
```

### Expo Go

1. Install the **Expo Go** app on your iPhone or Android device.
2. Run `pnpm start` from `apps/mobile`. Metro will print a QR code in the terminal.
3. Open the QR code with:
   - **iOS:** the device's built-in Camera app
   - **Android:** the Expo Go app's "Scan QR code" entry
4. The app will load over the LAN from your dev machine.

Both your phone and dev machine need to be on the same network. If you can't connect, try `pnpm start --tunnel` (slower, but routes through Expo's tunnel service).

### Lint

```bash
pnpm lint   # runs `expo lint`
```

---

## 🔐 Demo credentials

The login screen advertises these. All three live in `db/users.json` and are validated via `findUserByCredentials` from `@goldlink/core`.

| Tier              | Username / Email             | Password   |
| ----------------- | ---------------------------- | ---------- |
| Ultra High Net Worth | `pmvita`                  | `admin123` |
| Private Banking   | `sarah.johnson@email.com`    | `demo123`  |
| Platinum          | `demo@bank.com`              | `demo123`  |

Passwords are plain-text and intentionally insecure — this is a demo. Sessions are persisted via `expo-secure-store` (Keychain on iOS, encrypted shared preferences on Android), so you'll stay signed in across app restarts until you tap **Sign out** on the More tab.

---

## 🗺️ App structure

```text
apps/mobile/
├── app/                     # Expo Router routes (file-based navigation)
│   ├── _layout.tsx          # Root Stack: splash → login → tabs → detail screens
│   ├── index.tsx            # Splash + session check → routes to /login or /(tabs)/dashboard
│   ├── login.tsx            # Username + password
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Bottom tabs config
│   │   ├── dashboard.tsx    # Balance hero + recent activity
│   │   ├── accounts.tsx     # Per-user account list
│   │   ├── transfers.tsx    # Placeholder
│   │   ├── cards.tsx        # Per-user card tiles
│   │   └── more.tsx         # Profile + sub-routes + sign out
│   ├── accounts/[id].tsx    # Account detail + transaction history
│   └── more/[screen].tsx    # Bill Pay / Mobile Deposit / Budgeting / Settings placeholders
├── src/
│   ├── components/          # Card, Screen, GoldButton, Logo, SectionHeader
│   ├── hooks/useCurrentUser.ts
│   ├── session.ts           # expo-secure-store wrapper
│   └── theme.ts             # carbon + gold tokens (mirrors web)
├── assets/images/           # icon, splash, adaptive icons
├── app.json                 # Expo config (name, slug, plugins, new architecture)
├── metro.config.js
└── tsconfig.json
```

Data is read exclusively through `@goldlink/core` — there are no direct JSON imports here.

---

## 🎨 Styling

The app uses **plain React Native `StyleSheet`** with shared tokens from `src/theme.ts`. **NativeWind was considered and deferred** to keep the Expo Go path simple and avoid an extra build-time dependency. The palette mirrors the web app's carbon + gold theme:

- Backgrounds: `#0a0a0c` / `#121217` / `#1a1a20`
- Gold accents: `#cca858` / `#e6cc80` / `#d4af37`
- Text: `#fafafa` / `#a1a1aa` / `#71717a`

The Inter font family is **referenced by name in `src/theme.ts` but is not bundled or loaded at runtime today** — RN falls back to the platform default. If you want true Inter rendering, wire in `@expo-google-fonts/inter` and `expo-font`.

---

## ⚠️ Limitations

- **Auth is plaintext** and validated against `db/users.json`. No 2FA, no biometric attestation — those exist as UI flows on the web app only.
- **Most screens beyond Dashboard / Accounts / Cards / More are placeholders**: Transfers tab and all of the More sub-routes (Bill Pay, Mobile Deposit, Budgeting, Settings) render a "Coming soon" card.
- **No writes are persisted.** This app only reads from `db/*.json`.
- **React 19 + Expo SDK 54.** The workspace pins `@types/react` to v18 to keep the web app happy. If you add a `typecheck` script here that uses v19-only types, you'll need to revisit the override in `pnpm-workspace.yaml`. Expo's CLI prints `@types/react@18.3.x - expected version: ~19.1.10` on every `expo start` / `expo export` as a result — the warning is **cosmetic**. `@types/react` is a devDependency only, never reaches the bundle, and Expo Go / native builds are unaffected.
- **pnpm + Metro setup.** `apps/mobile/metro.config.js` enables `resolver.unstable_enableSymlinks: true` and intentionally does **not** set `disableHierarchicalLookup`. Both are required for Metro to resolve packages out of pnpm's symlinked `node_modules/.pnpm/` store. `@expo/metro-runtime` is also listed as a direct dependency (per Expo Router's docs) so its specifier is explicit at the app level. If you ever see `Unable to resolve module …` from Metro after a config or dependency change, start the dev server (or export) once with `--clear` — Metro's resolution cache can hold on to stale failures.
- **New Architecture is enabled** (`app.json` → `newArchEnabled: true`) and `experiments.reactCompiler: true`. Both are stable but worth knowing if you hit Expo Go edge cases.

---

## 🔁 Resetting to the starter

A `reset-project` script ships from the original Expo template at `scripts/reset-project.js`. Running `pnpm reset-project` will move the current `app/` into `app-example/` and scaffold a blank `app/` directory. **Don't run it casually** — it'll wipe the GoldLink mobile screens that this app is built around.

---

## 📚 Further reading

- [Expo documentation](https://docs.expo.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [`@goldlink/core` API](../../packages/core/README.md)
- [Top-level README](../../README.md)
