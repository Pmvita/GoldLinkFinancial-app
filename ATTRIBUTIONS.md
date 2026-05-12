# Attributions

GoldLink Bank is built on top of several open-source projects. License files for each are linked below.

## UI components & icons

- [shadcn/ui](https://ui.shadcn.com/) — used under the [MIT license](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md). The web app's UI primitives in `apps/web/src/app/components/ui/` are derived from shadcn/ui.
- [Radix UI](https://www.radix-ui.com/) — underlying primitives for the shadcn components, under the [MIT license](https://github.com/radix-ui/primitives/blob/main/LICENSE).
- [Lucide](https://lucide.dev) (`lucide-react`) — icon set used throughout `apps/web`, under the [ISC license](https://github.com/lucide-icons/lucide/blob/main/LICENSE).
- [Material UI](https://mui.com/) (`@mui/material`, `@mui/icons-material`) — auxiliary primitives and icons used in `apps/web`, under the [MIT license](https://github.com/mui/material-ui/blob/master/LICENSE).
- [Feather icons](https://feathericons.com) via `@expo/vector-icons` — icon set used throughout `apps/mobile`, under the [MIT license](https://github.com/feathericons/feather/blob/main/LICENSE).

## Frameworks & libraries

- [Expo](https://expo.dev) (SDK 54) and [Expo Router](https://docs.expo.dev/router/introduction/) — used to build `apps/mobile`, under the [MIT license](https://github.com/expo/expo/blob/main/LICENSE).
- [React Native](https://reactnative.dev) — the runtime for `apps/mobile`, under the [MIT license](https://github.com/facebook/react-native/blob/main/LICENSE).
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) and [React Native Gesture Handler](https://docs.swmansion.com/react-native-gesture-handler/) — under the MIT license.
- [Motion](https://motion.dev/) (`motion/react`) — animation library used in `apps/web`, under the [MIT license](https://github.com/motiondivision/motion/blob/main/LICENSE.md).
- [Recharts](https://recharts.org) — charting library used in `apps/web`, under the [MIT license](https://github.com/recharts/recharts/blob/master/LICENSE).

## Imagery

- Photos from [Unsplash](https://unsplash.com), used under the [Unsplash license](https://unsplash.com/license).

## Notes

- **NativeWind** was evaluated for `apps/mobile` but is not currently used. If it is adopted later (it ships under the MIT license), this file should be updated.
- The Inter font family is referenced by name in `apps/mobile/src/theme.ts` but is **not bundled or loaded at runtime** today — RN falls back to the platform default. If Inter is later bundled (via `@expo-google-fonts/inter` or otherwise), credit it here under its [OFL license](https://github.com/rsms/inter/blob/master/LICENSE.txt).
