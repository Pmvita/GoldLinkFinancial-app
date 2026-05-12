import { StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Card } from "@/src/components/Card";
import { Screen } from "@/src/components/Screen";
import { colors, radius, spacing, typography } from "@/src/theme";

export default function TransfersScreen() {
  return (
    <Screen>
      <View style={styles.wrap}>
        <Card elevated>
          <View style={styles.iconWrap}>
            <Feather name="repeat" size={22} color={colors.gold} />
          </View>
          <Text style={styles.title}>Transfers</Text>
          <Text style={styles.body}>
            Move funds between your accounts, send wires, or pay another GoldLink
            member.
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Coming soon</Text>
          </View>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, justifyContent: "center", paddingVertical: spacing.xxl },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: "rgba(204,168,88,0.10)",
    borderColor: "rgba(204,168,88,0.25)",
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  title: {
    color: colors.textPrimary,
    fontSize: typography.size.xl,
    fontWeight: "500",
    marginBottom: 6,
  },
  body: {
    color: colors.textSecondary,
    fontSize: typography.size.sm,
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.pill,
    backgroundColor: "rgba(204,168,88,0.10)",
    borderColor: "rgba(204,168,88,0.3)",
    borderWidth: 1,
  },
  badgeText: {
    color: colors.goldLight,
    fontSize: typography.size.xs,
    letterSpacing: typography.letterSpacing.wider,
    textTransform: "uppercase",
  },
});
