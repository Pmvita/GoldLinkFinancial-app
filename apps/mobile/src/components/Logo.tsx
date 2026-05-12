import { StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { colors, gradients, radius, typography } from "../theme";

interface LogoProps {
  size?: "sm" | "md" | "lg";
}

export function Logo({ size = "md" }: LogoProps) {
  const dimension = size === "sm" ? 32 : size === "lg" ? 56 : 44;
  const monogramSize =
    size === "sm"
      ? typography.size.sm
      : size === "lg"
        ? typography.size.xl
        : typography.size.lg;
  const wordmarkSize =
    size === "sm"
      ? typography.size.md
      : size === "lg"
        ? typography.size.xxl
        : typography.size.xl;

  return (
    <View style={styles.row}>
      <View style={[styles.badge, { width: dimension, height: dimension }]}>
        <LinearGradient
          colors={gradients.goldFill as unknown as readonly [string, string, string]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.inner}>
          <Text style={[styles.monogram, { fontSize: monogramSize }]}>GL</Text>
        </View>
      </View>
      <View style={styles.wordmarkWrap}>
        <Text style={[styles.wordmark, { fontSize: wordmarkSize }]}>
          GoldLink
          <Text style={styles.wordmarkAccent}>Bank</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  badge: {
    borderRadius: radius.md,
    overflow: "hidden",
    padding: 1.5,
  },
  inner: {
    flex: 1,
    backgroundColor: colors.cardElevated,
    borderRadius: radius.sm,
    justifyContent: "center",
    alignItems: "center",
  },
  monogram: {
    color: colors.gold,
    fontWeight: "700",
    letterSpacing: typography.letterSpacing.tight,
  },
  wordmarkWrap: {
    justifyContent: "center",
  },
  wordmark: {
    color: colors.textPrimary,
    fontWeight: "300",
    letterSpacing: typography.letterSpacing.wider,
  },
  wordmarkAccent: {
    color: colors.gold,
    fontWeight: "600",
  },
});
