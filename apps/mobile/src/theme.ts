// Carbon + Gold palette mirrored from apps/web/src/styles/theme.css (dark variant).
export const colors = {
  // Carbon (background tones)
  background: "#0a0a0c",
  card: "#121217",
  cardElevated: "#1a1a20",
  surface: "#1e1e24",
  muted: "#27272a",
  border: "#27272a",
  divider: "#1e1e24",

  // Ink (text tones)
  foreground: "#fafafa",
  textPrimary: "#fafafa",
  textSecondary: "#a1a1aa",
  textMuted: "#71717a",
  textFaint: "#52525b",

  // Gold (primary accent)
  goldLight: "#e6cc80",
  gold: "#cca858",
  goldDark: "#997a3d",
  goldHover: "#b5954a",

  // Status
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",

  // Transparent helpers
  black: "#000000",
  white: "#ffffff",
} as const;

export type ColorToken = keyof typeof colors;

export const radius = {
  xs: 4,
  sm: 6,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const typography = {
  fontFamily: {
    sans: "Inter_400Regular",
    sansMedium: "Inter_500Medium",
    sansSemiBold: "Inter_600SemiBold",
    sansBold: "Inter_700Bold",
    sansLight: "Inter_300Light",
  },
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    display: 34,
  },
  // Letter spacing roughly matching the web's tracking-wider headings
  letterSpacing: {
    tight: -0.4,
    normal: 0,
    wide: 0.8,
    wider: 1.6,
  },
} as const;

export const shadows = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 4,
  },
  goldGlow: {
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 18,
    elevation: 6,
  },
} as const;

export const gradients = {
  goldFill: [colors.goldLight, colors.gold, colors.goldDark] as const,
  carbon: [colors.cardElevated, colors.card] as const,
  splash: ["#1a1a20", "#0a0a0c"] as const,
};

export const theme = {
  colors,
  radius,
  spacing,
  typography,
  shadows,
  gradients,
} as const;

export type Theme = typeof theme;
