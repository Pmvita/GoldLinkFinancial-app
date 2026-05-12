// Metro configuration with monorepo support for a pnpm workspace.
// See: https://docs.expo.dev/guides/monorepos/
//
// pnpm-specific notes
// -------------------
// 1. `watchFolders` is set to the workspace root so Metro picks up changes
//    in `@goldlink/core` (and any other workspace packages) live.
//
// 2. `nodeModulesPaths` lists the two locations Metro consults for bare
//    specifier resolution. `apps/mobile/node_modules/` holds this app's
//    direct deps; the workspace root's `node_modules/` is needed for
//    Metro to find any deps that happen to be hoisted at the top level
//    (workspace-only devDeps, etc.).
//
// 3. We DO NOT set `resolver.disableHierarchicalLookup: true`. Expo's
//    monorepo guide recommends it for strict layouts (yarn workspaces,
//    classic npm), but pnpm puts every transitive dep inside the
//    resolving package's own nested `node_modules` — e.g. `react-native`'s
//    `invariant` lives at `.pnpm/react-native@.../node_modules/invariant`,
//    and `expo-router`'s `@expo/metro-runtime` lives at
//    `.pnpm/expo-router@.../node_modules/@expo/metro-runtime`. Metro's
//    normal "walk up the tree" lookup is what finds those. Disabling it
//    breaks bundling with `Unable to resolve module @expo/metro-runtime`
//    (and dozens of similar transitive deps).
//
// 4. We set `resolver.unstable_enableSymlinks: true`. Metro 0.83's default
//    behaviour still skips symlinks, but pnpm's entire `node_modules`
//    layout is symlinks into `.pnpm/<hash>/node_modules/<pkg>`. Without
//    this flag Metro treats every workspace dep (`expo`, `expo-router`,
//    `react-native`, `@goldlink/core`, …) as missing.
//
// After changing any of the above, run `expo start --clear` (or pass
// `--clear` to `expo export`) the FIRST time — Metro caches resolutions
// per-file and will otherwise report stale "Unable to resolve" errors.
const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

config.resolver.unstable_enableSymlinks = true;

module.exports = config;
