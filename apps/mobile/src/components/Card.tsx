import type { ReactNode } from "react";
import { StyleSheet, View, type ViewStyle } from "react-native";

import { colors, radius, shadows, spacing } from "../theme";

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  elevated?: boolean;
}

export function Card({ children, style, elevated }: CardProps) {
  return (
    <View style={[styles.card, elevated && styles.elevated, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  elevated: {
    backgroundColor: colors.cardElevated,
    ...shadows.card,
  },
});
