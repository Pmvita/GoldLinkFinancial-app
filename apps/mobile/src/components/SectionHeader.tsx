import { StyleSheet, Text, View } from "react-native";

import { colors, typography } from "../theme";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function SectionHeader({ title, subtitle }: SectionHeaderProps) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.size.lg,
    fontWeight: "500",
    letterSpacing: typography.letterSpacing.normal,
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    marginTop: 2,
  },
});
